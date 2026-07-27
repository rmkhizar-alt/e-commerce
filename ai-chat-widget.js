(function () {
  // ---- Guard: never let this widget render twice --------------------------
  // If this script is accidentally included more than once on a page (e.g.
  // once from a cached copy, once from the live version, or copy-pasted into
  // two templates), or if init() somehow fires twice, this stops a second
  // bubble/panel from ever being created. This is the actual fix for the
  // "2 AI chat bots showing up" issue — only one instance can ever exist.
  if (window.__SC_AI_CHAT_WIDGET_LOADED__) return;
  window.__SC_AI_CHAT_WIDGET_LOADED__ = true;

  // ---- Config ------------------------------------------------------------
  // Backend runs separately from the frontend (see server.js — no static
  // file serving there beyond /images), so this must be the FULL backend
  // URL, not a relative path. Update the port if your server uses a
  // different one (PORT in your backend .env, default 4000).
  const API_URL = 'http://localhost:4000/api/ai-chat';
  const STORAGE_KEY = 'sc_ai_chat_history';

  // ---- State ---------------------------------------------------------------
  let history = []; // [{role:'user'|'model', text}]
  let sending = false;

  // ---- DOM refs (filled on init) -------------------------------------------
  let panelEl, bodyEl, inputEl, sendBtn, launcherEl, dotEl;

  function el(html) {
    const t = document.createElement('template');
    t.innerHTML = html.trim();
    return t.content.firstElementChild;
  }

  function scrollToBottom() {
    bodyEl.scrollTop = bodyEl.scrollHeight;
  }

  function addBotMessage(text) {
    const msg = el(`<div class="sc-msg sc-msg-bot"></div>`);
    msg.textContent = text;
    bodyEl.appendChild(msg);
    scrollToBottom();
  }

  function addErrorMessage(text) {
    const msg = el(`<div class="sc-msg sc-msg-error"></div>`);
    msg.textContent = text;
    bodyEl.appendChild(msg);
    scrollToBottom();
  }

  function addUserMessage(text) {
    const msg = el(`<div class="sc-msg sc-msg-user"></div>`);
    msg.textContent = text;
    bodyEl.appendChild(msg);
    scrollToBottom();
  }

  function addProducts(products) {
    if (!products || !products.length) return;
    const wrap = el(`<div class="sc-chat-products"></div>`);
    products.forEach((p) => {
      const card = el(`
        <div class="sc-chat-pcard" role="button" tabindex="0">
          <div class="sc-chat-pcard-icon">${p.icon || '\u{1F4E6}'}</div>
          <p>${escapeHtml(p.name)}</p>
          <span>$${Number(p.price).toFixed(2)}</span>
        </div>
      `);
      card.addEventListener('click', () => {
        if (p.id && window.location) {
          window.location.href = `/product.html?id=${encodeURIComponent(p.id)}`;
        }
      });
      wrap.appendChild(card);
    });
    bodyEl.appendChild(wrap);
    scrollToBottom();
  }

  function showTyping() {
    const t = el(`
      <div class="sc-msg-typing" id="sc-typing-indicator">
        <span></span><span></span><span></span>
      </div>
    `);
    bodyEl.appendChild(t);
    scrollToBottom();
  }

  function hideTyping() {
    const t = document.getElementById('sc-typing-indicator');
    if (t) t.remove();
  }

  function escapeHtml(str) {
    const d = document.createElement('div');
    d.textContent = str;
    return d.innerHTML;
  }

  function persistHistory() {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(-20)));
    } catch (e) { /* storage unavailable, ignore */ }
  }

  function loadHistory() {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (raw) history = JSON.parse(raw);
    } catch (e) { history = []; }
  }

  // ---- Networking -----------------------------------------------------------
  async function sendMessage(text) {
    if (sending) return;
    sending = true;
    sendBtn.disabled = true;

    addUserMessage(text);
    history.push({ role: 'user', text });
    persistHistory();
    showTyping();

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text, history })
      });
      const data = await res.json();
      hideTyping();

      if (!res.ok) {
        addErrorMessage(data.error || 'Something went wrong. Please try again.');
        return;
      }

      addBotMessage(data.reply);
      history.push({ role: 'model', text: data.reply });
      persistHistory();

      if (data.products && data.products.length) {
        addProducts(data.products);
      }
    } catch (err) {
      hideTyping();
      addErrorMessage('Could not reach the assistant. Check your connection and try again.');
    } finally {
      sending = false;
      sendBtn.disabled = false;
    }
  }

  // ---- UI wiring --------------------------------------------------------------
  function openPanel() {
    panelEl.classList.add('open');
    dotEl.classList.remove('show');
    inputEl.focus();
  }

  function closePanel() {
    panelEl.classList.remove('open');
  }

  function togglePanel() {
    panelEl.classList.contains('open') ? closePanel() : openPanel();
  }

  function handleSend() {
    const text = inputEl.value.trim();
    if (!text) return;
    inputEl.value = '';
    sendMessage(text);
  }

  function buildDOM() {
    // Defensive cleanup: if any stale widget nodes from a previous
    // injection are still sitting in the DOM (e.g. left over from hot
    // reload, bfcache restore, or a duplicate <script> tag), remove them
    // before creating the real, single instance.
    document.querySelectorAll('#sc-ai-chat-launcher, #sc-ai-chat-panel').forEach((n) => n.remove());

    launcherEl = el(`
      <button id="sc-ai-chat-launcher" aria-label="Open shopping assistant">
        <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 2 12 12M12 12 21 7M12 12 3 7"/></svg>
        <span class="sc-chat-dot show"></span>
      </button>
    `);

    panelEl = el(`
      <div id="sc-ai-chat-panel">
        <div class="sc-chat-head">
          <div class="sc-chat-avatar">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2 21 7v10l-9 5-9-5V7z"/><path d="M12 2 12 12M12 12 21 7M12 12 3 7"/></svg>
          </div>
          <div class="sc-chat-headtext">
            <b>Smart Choice <em>AI</em></b>
            <small>Online now</small>
          </div>
          <div class="sc-chat-close" role="button" aria-label="Close chat">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
          </div>
        </div>
        <div class="sc-chat-body"></div>
        <div class="sc-chat-inputrow">
          <input type="text" placeholder="Ask about any product..." maxlength="1000" />
          <button class="sc-chat-send" aria-label="Send message">
            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 19V5M5 12l7-7 7 7"/></svg>
          </button>
        </div>
      </div>
    `);

    document.body.appendChild(panelEl);
    document.body.appendChild(launcherEl);

    bodyEl = panelEl.querySelector('.sc-chat-body');
    inputEl = panelEl.querySelector('input');
    sendBtn = panelEl.querySelector('.sc-chat-send');
    dotEl = launcherEl.querySelector('.sc-chat-dot');

    launcherEl.addEventListener('click', togglePanel);
    panelEl.querySelector('.sc-chat-close').addEventListener('click', closePanel);
    sendBtn.addEventListener('click', handleSend);
    inputEl.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleSend();
    });
  }

  function replayHistory() {
    if (!history.length) {
      addBotMessage("Hi! I'm the Smart Choice 3D assistant. Ask me to recommend a product, compare options, or help you find something in your budget.");
      return;
    }
    history.forEach((turn) => {
      if (turn.role === 'user') addUserMessage(turn.text);
      else addBotMessage(turn.text);
    });
  }

  function init() {
    loadHistory();
    buildDOM();
    replayHistory();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
