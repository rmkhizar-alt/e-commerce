const Product = require('../models/Product');
const { isDbReady } = require('../config/db');

// Groq: OpenAI-compatible chat completions API. Free tier, and much faster
// than Gemini's response times. Get a free key at https://console.groq.com
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `You are "Smart Choice 3D AI", the friendly shopping assistant built into the Smart Choice 3D
website — an e-commerce store where every product has an interactive 3D model you can rotate and inspect.

YOUR JOB has three parts:
1. GUIDE shoppers around the site: explain how to browse categories, view a product's 3D model, add items
   to the cart, save items to the wishlist (heart icon), check out (guest checkout is allowed, no account
   required), track orders in "My Account", or contact support via the Contact page.
2. HELP THEM BUY: recommend specific real products for their budget/need, compare options when asked, and
   clearly tell them the next step (e.g. "Add it to your cart" or "Open its page to see the 3D model and
   pick a color").
3. EXPLAIN BENEFITS: for any product you mention, use its real description to tell the shopper WHY it's a
   good fit for them in plain language (durability, comfort, what it's best for, standout features) —
   don't just repeat the spec sheet.

Rules:
- ONLY recommend products from the "AVAILABLE PRODUCTS" list below, using their real name, price, and
  description. Never invent products, prices, specs, or benefits that aren't implied by the data given.
- If nothing in the list fits, say so honestly and suggest they browse the relevant category page or use
  site search instead of making something up.
- Keep replies conversational and concise (3-5 sentences), like a knowledgeable in-store assistant.
- When you recommend a product, mention it by its exact name so the shopper (and the site) can recognize it.
- Prices are in USD. Stay focused on this store — don't discuss unrelated topics.

STRICT SCOPE RULE (very important):
- You must ONLY answer questions related to Smart Choice 3D: its products, categories, prices, 3D models,
  cart, wishlist, checkout, orders, account, shipping, returns, or general shopping help on this site.
- If the shopper asks anything NOT related to this store (general knowledge, coding help, personal advice,
  news, other companies/websites, math homework, jokes, etc.), do NOT answer that question at all — not
  even partially, and do not add any extra commentary. Instead reply with EXACTLY this token and nothing
  else: OFF_TOPIC`;

// Fixed, short message shown to the shopper whenever the model flags a question
// as off-topic (see STRICT SCOPE RULE above). Kept out of the model's hands so
// the wording the user sees is always exactly this, regardless of what the
// model outputs alongside the OFF_TOPIC token.
const OFF_TOPIC_MESSAGE = 'Sorry, I can only help with questions about Smart Choice 3D and our products. 😊';

// Finds products relevant to the shopper's message using MongoDB's text index,
// with a category-keyword fallback, so the AI always has real, current data
// (name, price, category, rating) instead of guessing.
//
// If the DB is offline, this skips straight to an empty list instead of
// attempting (and waiting on) queries that are guaranteed to fail — the
// chat below still works fine without specific product data.
async function findRelevantProducts(message) {
  if (!isDbReady()) {
    console.warn('[ai-chat] DB offline — skipping product lookup, chat will continue without product data.');
    return [];
  }

  let items = [];
  try {
    items = await Product.find({ $text: { $search: message } }, { score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } })
      .limit(8);
  } catch (e) {
    console.warn('[ai-chat] Text search failed, trying fallback sample:', e.message);
    items = [];
  }

  if (!items.length) {
    // No text match - fall back to a small diverse sample so the bot can still
    // make general conversation ("what do you sell?") without being empty-handed.
    try {
      items = await Product.aggregate([{ $sample: { size: 8 } }]);
    } catch (e) {
      // Expected when MongoDB is unreachable - not a crash. The chat still
      // replies normally below, just without specific product recommendations.
      console.warn('[ai-chat] No product data available (DB unreachable) - continuing without it:', e.message);
      items = [];
    }
  }
  return items;
}

function formatProductsForPrompt(products) {
  if (!products || !products.length) {
    return '(No product data available right now — apologize briefly and suggest the shopper browse categories or use site search instead.)';
  }
  return products
    .map((p) => {
      var desc = (p.desc || '').slice(0, 200);
      return `- [${p.id}] ${p.name} — ${p.brand || ''} | ${p.cat}${p.sub ? ' / ' + p.sub : ''} | $${p.price} | ${p.rating || 0}★ (${p.reviews || 0} reviews)\n  Description: ${desc}`;
    })
    .join('\n');
}

// POST /api/ai-chat  { message, history: [{role: 'user'|'model', text}] }
async function chat(req, res, next) {
  try {
    const { message, history } = req.body;

    if (typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({ error: 'Message is required.' });
    }
    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message is too long (max 1000 characters).' });
    }
    if (!process.env.GROQ_API_KEY) {
      console.error('[ai-chat] GROQ_API_KEY is missing from the environment.');
      return res.status(503).json({
        error: 'The AI assistant is not configured yet. Add GROQ_API_KEY to the backend .env file.'
      });
    }

    const products = await findRelevantProducts(message.trim());
    const productBlock = formatProductsForPrompt(products);

    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    if (Array.isArray(history)) {
      history.slice(-10).forEach((turn) => {
        if (turn && turn.text && (turn.role === 'user' || turn.role === 'model')) {
          messages.push({ role: turn.role === 'model' ? 'assistant' : 'user', content: turn.text });
        }
      });
    }
    messages.push({
      role: 'user',
      content: `AVAILABLE PRODUCTS (only recommend from this list):\n${productBlock}\n\nShopper says: ${message.trim()}`
    });

    let groqRes;
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 20000); // 20s safety timeout
      groqRes = await fetch(GROQ_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
        },
        body: JSON.stringify({
          model: GROQ_MODEL,
          messages,
          temperature: 0.7,
          max_tokens: 700
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);
    } catch (fetchErr) {
      if (fetchErr.name === 'AbortError') {
        console.error('[ai-chat] Groq request timed out.');
        return res.status(504).json({ error: 'The AI assistant took too long to respond. Please try again.' });
      }
      console.error('[ai-chat] Could not reach Groq:', fetchErr.message);
      return res.status(502).json({ error: 'Could not reach the AI provider. Please try again shortly.' });
    }

    const data = await groqRes.json();
    if (!groqRes.ok) {
      console.error('[ai-chat] Groq error:', groqRes.status, data);
      if (groqRes.status === 401) {
        return res.status(503).json({ error: 'The AI assistant is misconfigured (invalid GROQ_API_KEY).' });
      }
      if (groqRes.status === 429) {
        return res.status(429).json({ error: 'The AI assistant is getting too many requests right now. Please try again in a moment.' });
      }
      return res.status(502).json({ error: 'The AI assistant is temporarily unavailable. Please try again.' });
    }

    const reply = data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content;

    if (!reply) {
      return res.status(502).json({ error: 'The AI assistant did not return a response. Please try again.' });
    }

    // Model was instructed to return exactly this token for off-topic questions
    // (see STRICT SCOPE RULE in SYSTEM_PROMPT). Swap it for our own fixed,
    // short message so the shopper always sees consistent wording, no matter
    // what the model actually generated around/instead of the token.
    if (reply.trim().toUpperCase().includes('OFF_TOPIC')) {
      return res.json({ reply: OFF_TOPIC_MESSAGE, products: [] });
    }

    // Only surface products whose exact name the model actually mentioned,
    // so the "suggested products" cards in the UI always match what was said.
    const mentioned = products.filter((p) => reply.includes(p.name));

    res.json({ reply, products: mentioned.map((p) => ({ id: p.id, name: p.name, price: p.price, cat: p.cat, icon: p.icon })) });
  } catch (err) {
    next(err);
  }
}

module.exports = { chat };
