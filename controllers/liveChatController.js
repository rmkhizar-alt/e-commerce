// controllers/liveChatController.js
const LiveChat = require('../models/LiveChat');

// Using the smaller/faster "instant" model instead of 70b-versatile — for a
// live chat widget, response speed matters more than the extra depth of the
// bigger model, and this cuts reply time noticeably.
const GROQ_MODEL = 'llama-3.1-8b-instant';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

// This persona answers as "the support team", not as a product-recommendation
// bot (that's what aiChatController.js already does for /api/ai-chat). It's
// meant to feel like a real quick live-chat reply, not a scripted assistant.
const SYSTEM_PROMPT = `You are replying on the live chat widget of Smart Choice 3D, an online store selling
everyday retail products (watches, bags, shoes, etc.) with interactive 3D previews. You are answering as part
of the store's support team, not as a separate "AI assistant" persona.

How to talk:
- Warm, quick, and conversational — like a real person typing a live chat reply, not a formal email.
- Use "we"/"our team" naturally. Keep replies short: 2-4 sentences, not a wall of text.
- Help with: order status questions, shipping/delivery timing, returns & exchanges, sizing/fit questions,
  payment methods (Card, Cash on Delivery, JazzCash, Easypaisa), and general product questions.
- If the visitor needs something you genuinely can't resolve in chat (e.g. looking up their specific order,
  processing a refund), tell them to email the support address or check their order status page, and let them
  know their message has been noted for the team to follow up.
- Never invent order details, tracking numbers, prices, or policies you don't actually have data for.
- If a visitor directly and sincerely asks whether they're talking to a bot/AI, answer honestly — don't claim
  to be a specific named human. Otherwise, just chat naturally as part of the team without bringing it up.`;

// POST /api/live-chat   Body: { sessionId, message, visitorName?, visitorEmail? }
async function chat(req, res, next) {
  try {
    const { sessionId, message, visitorName, visitorEmail } = req.body;

    if (!sessionId || typeof sessionId !== 'string') {
      return res.status(400).json({ error: 'sessionId is required.' });
    }
    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long (max 1000 characters).' });
    }
    if (!process.env.GROQ_API_KEY) {
      console.error('[live-chat] GROQ_API_KEY is missing from the environment.');
      return res.status(503).json({
        error: 'Live chat is not configured yet. Add GROQ_API_KEY to the backend .env file.'
      });
    }

    // Try to load/create the persisted session, but never let a DB outage
    // block the chat itself - fall back to an in-memory-only session (no
    // history, no saving) so the visitor still gets a normal AI reply.
    let session;
    let dbAvailable = true;
    try {
      session = await LiveChat.findOne({ sessionId });
      if (!session) {
        session = await LiveChat.create({
          sessionId,
          visitorName: visitorName || '',
          visitorEmail: visitorEmail || '',
          messages: []
        });
      }
    } catch (dbErr) {
      dbAvailable = false;
      console.warn('[live-chat] DB unavailable - replying without saving history:', dbErr.message);
      session = { messages: [] };
    }

    session.messages.push({ role: 'visitor', text: message.trim() });

    // Build the prompt history from what's actually saved so far (capped,
    // same pattern as aiChatController.js, so the request stays small/fast).
    const promptMessages = [{ role: 'system', content: SYSTEM_PROMPT }];
    session.messages.slice(-16).forEach((m) => {
      promptMessages.push({ role: m.role === 'team' ? 'assistant' : 'user', content: m.text });
    });

    let groqRes;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000);
      groqRes = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages: promptMessages,
          temperature: 0.6,
          max_tokens: 300
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        console.error('[live-chat] Groq request timed out.');
        return res.status(504).json({ error: 'Support is taking a bit long to respond. Please try again.' });
      }
      console.error('[live-chat] Could not reach Groq:', fetchErr.message);
      return res.status(502).json({ error: 'Could not reach live chat right now. Please try again shortly.' });
    }

    const data = await groqRes.json();
    if (!groqRes.ok) {
      console.error('[live-chat] Groq error:', groqRes.status, data);
      if (groqRes.status === 401) {
        return res.status(503).json({ error: 'Live chat is misconfigured (invalid GROQ_API_KEY).' });
      }
      if (groqRes.status === 429) {
        return res.status(429).json({ error: 'Live chat is getting a lot of messages right now. Please try again in a moment.' });
      }
      return res.status(502).json({ error: 'Live chat is temporarily unavailable. Please try again.' });
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;
    if (!reply) {
      return res.status(502).json({ error: 'No response received. Please try again.' });
    }

    session.messages.push({ role: 'team', text: reply });

    if (dbAvailable) {
      try {
        await session.save();
      } catch (saveErr) {
        console.warn('[live-chat] Could not save reply (DB unavailable):', saveErr.message);
      }
    }

    res.json({ reply, sessionId });
  } catch (err) {
    next(err);
  }
}

// GET /api/live-chat/:sessionId  — lets the widget reload past messages on page refresh
async function getHistory(req, res, next) {
  try {
    let session = null;
    try {
      session = await LiveChat.findOne({ sessionId: req.params.sessionId });
    } catch (dbErr) {
      console.warn('[live-chat] Could not load history (DB unavailable):', dbErr.message);
      session = null;
    }
    res.json({ messages: session ? session.messages : [] });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat, getHistory };
