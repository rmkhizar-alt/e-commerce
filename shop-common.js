// shop-common.js
// Shared helpers used across Smart Choice 3D pages: nav/auth state, cart,
// wishlist, formatting, and the Sketchfab embed helper.

// ---------- storage helpers ----------
function scGet(key, fallback) {
  try { var v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
  catch (e) { return fallback; }
}
function scSet(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

// ---------- formatting ----------
function money(n) { return 'Rs ' + Number(n || 0).toLocaleString('en-PK', { maximumFractionDigits: 0 }); }

function starString(rating) {
  var full = Math.round(Number(rating) || 0);
  var s = '';
  for (var i = 0; i < 5; i++) s += (i < full ? '★' : '☆');
  return s;
}

// ---------- 3D embed ----------
function embedSrc(uid) {
  var params = [
    'autostart=1',
    'autospin=0.3',
    'ui_theme=dark',
    'ui_controls=0',
    'ui_infos=0',
    'ui_watermark=0',
    'ui_watermark_link=0',
    'ui_help=0',
    'ui_settings=0',
    'ui_vr=0',
    'ui_ar=0',
    'ui_fullscreen=0',
    'ui_annotations=0',
    'ui_general_controls=0',
    'ui_stop=0',
    'ui_inspector=0',
    'ui_hint=0',
    'ui_loading=0',
    'dnt=1',
    'preload=1',
    'transparent=1'
  ].join('&');
  return 'https://sketchfab.com/models/' + uid + '/embed?' + params;
}

// ---------- product lookup ----------
function getProductById(id) {
  if (typeof PRODUCTS === 'undefined') return null;
  return PRODUCTS.find(function (p) { return String(p.id) === String(id); }) || null;
}

function getRelated(product, n) {
  if (typeof PRODUCTS === 'undefined' || !product) return [];
  n = n || 4;
  var sameCat = PRODUCTS.filter(function (p) { return p.cat === product.cat && p.id !== product.id; });
  if (sameCat.length < n) {
    var others = PRODUCTS.filter(function (p) { return p.cat !== product.cat; });
    sameCat = sameCat.concat(others.filter(function (p) { return sameCat.indexOf(p) === -1; }));
  }
  return sameCat.slice(0, n);
}

// ---------- product illustrations (hand-drawn SVG, no external images = instant load) ----------
var SC_ICON_STROKE = '#4a4768';
var SC_ICON_FILL_LIGHT = 'rgba(20,18,40,.06)';
var SC_ICON_DOT_FILL = '#4a4768';
var SC_ICONS = {
  watch: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="24" y="4" width="16" height="12" rx="3" fill="'+SC_ICON_FILL_LIGHT+'"/><rect x="24" y="48" width="16" height="12" rx="3" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="32" cy="32" r="16" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="32" cy="32" r="16"/><path d="M32 24v8l6 4"/><circle cx="47" cy="32" r="1.8" fill="'+SC_ICON_DOT_FILL+'" stroke="none"/></svg>',
  handbag: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M24 24V18a8 8 0 0 1 16 0v6"/><rect x="14" y="24" width="36" height="28" rx="4" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M14 34h36"/></svg>',
  dress: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M26 8h12l3 10-6 4v2l10 28H19l10-28v-2l-6-4z" fill="'+SC_ICON_FILL_LIGHT+'"/></svg>',
  sunglasses: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="19" cy="32" r="11" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="45" cy="32" r="11" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M30 30h4M8 28l3-6M56 28l-3-6"/></svg>',
  tennis: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="30" cy="20" rx="14" ry="17" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M30 37v20"/><path d="M22 12v16M30 8v25M38 12v16M18 20h24M18 27h24"/></svg>',
  basketball: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="32" cy="32" r="22" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M32 10v44M10 32h44M16 16c8 8 8 24 0 32M48 16c-8 8-8 24 0 32"/></svg>',
  backpack: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="16" y="20" width="32" height="34" rx="8" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M24 20v-4a8 8 0 0 1 16 0v4"/><rect x="26" y="30" width="12" height="10" rx="2"/><path d="M20 26v20M44 26v20"/></svg>',
  teddybear: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="14" r="6" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="46" cy="14" r="6" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="32" cy="28" r="16" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="26" cy="26" r="1.6" fill="'+SC_ICON_DOT_FILL+'" stroke="none"/><circle cx="38" cy="26" r="1.6" fill="'+SC_ICON_DOT_FILL+'" stroke="none"/><path d="M28 33q4 3 8 0"/><ellipse cx="32" cy="50" rx="16" ry="12" fill="'+SC_ICON_FILL_LIGHT+'"/></svg>',
  cube: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M32 6 55 19v26L32 58 9 45V19z" fill="'+SC_ICON_FILL_LIGHT+'"/><path d="M32 6v52M9 19l23 13 23-13M9 45l23-13 23 13"/></svg>',
  car: '<svg viewBox="0 0 64 64" width="60" height="60" fill="none" stroke="'+SC_ICON_STROKE+'" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 40h4l4-10a4 4 0 0 1 4-3h24a4 4 0 0 1 4 3l4 10h4" fill="'+SC_ICON_FILL_LIGHT+'"/><rect x="10" y="34" width="44" height="10" rx="3" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="20" cy="46" r="5" fill="'+SC_ICON_FILL_LIGHT+'"/><circle cx="44" cy="46" r="5" fill="'+SC_ICON_FILL_LIGHT+'"/></svg>'
};

// ---------- product card thumbnail (white background + custom SVG illustration, no external images = instant load) ----------
function productThumbHTML(p) {
  var media = p.img
    ? '<img src="' + p.img + '" alt="' + (p.name || '') + '" loading="lazy" style="width:100%;height:100%;object-fit:cover;display:block">'
    : (SC_ICONS[p.icon] || SC_ICONS.watch);
  return '<div class="sc-pcard-media" style="background:#f7f7fb;display:flex;align-items:center;justify-content:center;position:relative;border-bottom:1px solid rgba(20,18,40,.06);overflow:hidden;height:220px;min-height:220px">' +
    '<div class="sc-pcard-3dtag" style="background:#fff;border:1px solid rgba(20,18,40,.12);color:#4a4768"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L21 7V17L12 22L3 17V7L12 2Z"/></svg>3D</div>' +
    media +
    '</div>';
}

// ---------- cart ----------
function getCart() { return scGet('sc_cart', []); }
function setCart(cart) { scSet('sc_cart', cart); updateCartBadge(); }

function addProductToCart(product, qty, opts) {
  qty = qty || 1;
  var cart = getCart();
  var optKey = JSON.stringify(opts || {});
  var existing = cart.find(function (c) { return c.id === product.id && JSON.stringify(c.opts || {}) === optKey; });
  if (existing) existing.qty += qty;
  else cart.push({ id: product.id, qty: qty, opts: opts || {} });
  setCart(cart);
  showToast(product.name + ' added to cart');

  // Also push this item to the server cart when logged in. Without this,
  // cart.html's "server is source of truth once logged in" fetch would
  // overwrite the local cart with an empty server cart, making items you
  // just added seem to vanish.
  var token = localStorage.getItem('sc_token');
  if (token) {
    var API_BASE = (window.SC_API_BASE || 'http://localhost:4000/api');
    fetch(API_BASE + '/cart/items', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ productId: product.id, qty: qty, opts: opts || {} }),
      keepalive: true
    }).catch(function () {});
  }
}

function cartCount() {
  return getCart().reduce(function (sum, c) { return sum + (c.qty || 1); }, 0);
}

function updateCartBadge() {
  var count = cartCount();
  var badge = document.getElementById('cartBadge');
  var ddCount = document.getElementById('ddCartCount');
  if (badge) {
    badge.textContent = count;
    count > 0 ? badge.classList.add('show') : badge.classList.remove('show');
  }
  if (ddCount) ddCount.textContent = count;
}

// ---------- wishlist ----------
function getWishlist() { return scGet('sc_wishlist', []); }
function setWishlist(list) { scSet('sc_wishlist', list); }

function isWishlisted(id) { return getWishlist().indexOf(String(id)) !== -1; }

function toggleWishlist(id) {
  id = String(id);
  var list = getWishlist();
  var idx = list.indexOf(id);
  var adding = idx === -1;
  if (adding) { list.push(id); showToast('Added to wishlist'); }
  else { list.splice(idx, 1); showToast('Removed from wishlist'); }
  setWishlist(list);

  var token = localStorage.getItem('sc_token');
  if (token) {
    var API_BASE = (window.SC_API_BASE || 'http://localhost:4000/api');
    fetch(API_BASE + '/wishlist/' + encodeURIComponent(id), {
      method: adding ? 'POST' : 'DELETE',
      headers: { 'Authorization': 'Bearer ' + token }
    }).catch(function () {});
  }
  return adding;
}

// Pulls the server wishlist down and makes it the local source of truth.
// Call this after login, or on page load for pages that show the wishlist.
function syncWishlistFromServer(cb) {
  var token = localStorage.getItem('sc_token');
  if (!token) { if (cb) cb(getWishlist()); return; }
  var API_BASE = (window.SC_API_BASE || 'http://localhost:4000/api');
  fetch(API_BASE + '/wishlist', { headers: { 'Authorization': 'Bearer ' + token } })
    .then(function (r) { return r.ok ? r.json() : null; })
    .then(function (data) {
      if (data) setWishlist(data.productIds);
      if (cb) cb(getWishlist());
    })
    .catch(function () { if (cb) cb(getWishlist()); });
}

// ---------- toast ----------
function showToast(msg) {
  var t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(window._scToastTimer);
  window._scToastTimer = setTimeout(function () { t.classList.remove('show'); }, 2200);
}

// ---------- newsletter ----------
function subscribeNewsletter(inputId) {
  var input = document.getElementById(inputId || 'footerNewsletterEmail');
  var val = input ? input.value.trim() : '';
  if (!val || val.indexOf('@') === -1) { showToast('Enter a valid email'); return; }

  fetch('http://localhost:4000/api/newsletter/subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: val })
  })
    .then(function (r) { return r.json(); })
    .then(function (data) {
      showToast(data.message || 'Subscribed! Welcome to Smart Choice 3D.');
      if (data.success && input) input.value = '';
    })
    .catch(function () {
      showToast('Something went wrong, please try again.');
    });
}

// ---------- search ----------
// Finds the single product a typed query most likely refers to, so a
// search from ANY page can jump straight to that product's own page even
// if the product isn't listed on the page the search was made from.
// Checked in priority order: exact name match, then name-contains, then
// brand-contains. Category/sub matches are deliberately excluded here
// since they usually match many products — those go to search.html instead.
function findBestProductMatch(q) {
  if (typeof PRODUCTS === 'undefined' || !PRODUCTS.length) return null;
  var query = String(q || '').trim().toLowerCase();
  if (!query) return null;

  var exactName = PRODUCTS.find(function (p) {
    return String(p.name || '').toLowerCase() === query;
  });
  if (exactName) return exactName;

  var byName = PRODUCTS.find(function (p) {
    return String(p.name || '').toLowerCase().indexOf(query) !== -1;
  });
  if (byName) return byName;

  var byBrand = PRODUCTS.find(function (p) {
    return String(p.brand || '').toLowerCase().indexOf(query) !== -1;
  });
  if (byBrand) return byBrand;

  return null;
}

function doNavSearch(input) {
  var q = (input && input.value ? input.value : '').trim();
  if (!q) return;

  var match = findBestProductMatch(q);
  if (match) {
    // Product exists somewhere on the site (maybe a different page/category)
    // — open its own page directly instead of a generic results list.
    window.location.href = 'product.html?id=' + encodeURIComponent(match.id);
  } else {
    window.location.href = 'search.html?q=' + encodeURIComponent(q);
  }
}

// Live "as you type" suggestions under the nav search box — shows a small
// dropdown of matching products (like a normal e-commerce search bar),
// with a "See all results" link at the bottom that goes to the full
// search.html results page. Works on every page since it's wired up from
// baseInit(), and does nothing if the page has no #mainSearchInput or no
// product-data.js loaded.
function setupNavSearchSuggestions() {
  var input = document.getElementById('mainSearchInput');
  if (!input || typeof PRODUCTS === 'undefined') return;
  if (document.getElementById('navSearchSuggest')) return; // already set up

  var wrap = input.closest('.nav-search') || input.parentElement;
  if (!wrap) return;
  if (getComputedStyle(wrap).position === 'static') wrap.style.position = 'relative';

  var dropdown = document.createElement('div');
  dropdown.id = 'navSearchSuggest';
  dropdown.style.cssText =
    'position:absolute;top:calc(100% + 6px);left:0;right:0;background:#fff;' +
    'border:1px solid rgba(20,18,40,.12);border-radius:12px;overflow:hidden;' +
    'box-shadow:0 14px 34px rgba(20,18,40,.16);max-height:380px;overflow-y:auto;' +
    'z-index:1200;display:none;';
  wrap.appendChild(dropdown);

  function render(q) {
    q = q.trim().toLowerCase();
    if (!q) { dropdown.style.display = 'none'; dropdown.innerHTML = ''; return; }

    var found = PRODUCTS.filter(function (p) {
      return String(p.name || '').toLowerCase().indexOf(q) !== -1 ||
             String(p.brand || '').toLowerCase().indexOf(q) !== -1 ||
             String(p.cat || '').toLowerCase().indexOf(q) !== -1 ||
             String(p.sub || '').toLowerCase().indexOf(q) !== -1;
    });

    var shown = found.slice(0, 6);

    if (!shown.length) {
      dropdown.innerHTML =
        '<div style="padding:16px;font-size:.82rem;color:#6b6886">No matches for &ldquo;' + q.replace(/</g, '&lt;') + '&rdquo;</div>';
      dropdown.style.display = 'block';
      return;
    }

    dropdown.innerHTML = shown.map(function (p) {
      return '<a href="product.html?id=' + encodeURIComponent(p.id) + '" ' +
        'style="display:flex;align-items:center;gap:10px;padding:10px 14px;text-decoration:none;' +
        'color:#1a1830;border-bottom:1px solid rgba(20,18,40,.06)">' +
          '<span style="flex:1;font-size:.84rem;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + p.name + '</span>' +
          '<span style="font-size:.78rem;font-weight:800;color:var(--accent,#6c5ce7);flex-shrink:0">' + money(p.price) + '</span>' +
        '</a>';
    }).join('') +
    '<a href="search.html?q=' + encodeURIComponent(q) + '" ' +
      'style="display:block;padding:12px 14px;text-align:center;font-size:.8rem;font-weight:800;' +
      'color:var(--accent,#6c5ce7);text-decoration:none;background:#f7f6fc">' +
        'See all ' + found.length + ' result' + (found.length > 1 ? 's' : '') + ' for &ldquo;' + q.replace(/</g, '&lt;') + '&rdquo; →' +
      '</a>';
    dropdown.style.display = 'block';
  }

  input.addEventListener('input', function () { render(input.value); });
  input.addEventListener('focus', function () { if (input.value.trim()) render(input.value); });
  document.addEventListener('click', function (e) {
    if (!wrap.contains(e.target)) dropdown.style.display = 'none';
  });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') dropdown.style.display = 'none';
  });
}

// ---------- unified nav & footer injection ----------
function toggleProfileDropdown(e) {
  if (e) e.stopPropagation();
  var dd = document.getElementById('profileDropdown');
  if (dd) dd.classList.toggle('open');
}

function renderStandardNav() {
  if (document.body && document.body.dataset && document.body.dataset.noNav === 'true') return;
  var path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (path === 'admin.html' || path === 'live-chat-widget.html') return;

  var isHome = path === 'index.html' || path === '' || path === 'index';
  var isCats = path === 'categories.html' || path === 'categories (2).html' || path.indexOf('fashion') !== -1 || path.indexOf('electronics') !== -1 || path.indexOf('pcs') !== -1 || path.indexOf('mobiles') !== -1 || path.indexOf('kitchen') !== -1 || path.indexOf('beauty') !== -1 || path.indexOf('books') !== -1 || path.indexOf('bags') !== -1 || path.indexOf('automotive') !== -1 || path.indexOf('groceries') !== -1 || path.indexOf('furniture') !== -1 || path.indexOf('toys') !== -1 || path.indexOf('sports') !== -1 || path.indexOf('watches') !== -1 || path.indexOf('pet') !== -1;
  var isDeals = path === 'deals.html';
  var isAbout = path === 'about.html';
  var isContact = path === 'contact.html';

  var navHTML =
    '<div class="util-bar">' +
      '<div class="ub-left">' +
        '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"/><path d="M16 8h4l3 3v5h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg> Free delivery on orders over Rs 20,000</span>' +
        '<span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L21 7V17L12 22L3 17V7L12 2Z"/><path d="M12 12L21 7M12 12L3 7M12 12V22"/></svg> Every product viewable in 3D</span>' +
      '</div>' +
      '<div class="ub-right">' +
        '<a href="orders.html">Track Order</a>' +
        '<a href="contact.html">Help Center</a>' +
        '<a href="#">EN / PKR</a>' +
      '</div>' +
    '</div>' +
    '<nav class="scnav">' +
      '<div class="container">' +
        '<a class="nav-logo" href="index.html">' +
          '<span class="logo-icon">' +
            '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
              '<path d="M12 2L20.5 6.5V17.5L12 22L3.5 17.5V6.5L12 2Z" fill="white" fill-opacity="0.12"/>' +
              '<path d="M12 2L20.5 6.5V17.5L12 22L3.5 17.5V6.5L12 2Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>' +
              '<path d="M12 2V12M12 12L20.5 6.5M12 12L3.5 6.5M12 12V22" stroke="white" stroke-width="1.1" stroke-opacity="0.6"/>' +
              '<circle cx="12" cy="12" r="2" fill="white"/>' +
            '</svg>' +
          '</span>' +
          '<span class="nav-logo-text"><b>Smart<em>Choice</em></b><small>3D Shopping</small></span>' +
        '</a>' +
        '<div class="nav-search">' +
          '<form onsubmit="event.preventDefault(); doNavSearch(document.getElementById(\'mainSearchInput\'));">' +
            '<input type="text" id="mainSearchInput" placeholder="Search products, brands, categories…">' +
            '<button type="submit" aria-label="Search">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
            '</button>' +
          '</form>' +
        '</div>' +
        '<div class="nav-links">' +
          '<a href="index.html" class="' + (isHome ? 'active' : '') + '">Home</a>' +
          '<a href="categories.html" class="' + (isCats ? 'active' : '') + '">Categories</a>' +
          '<a href="deals.html" class="' + (isDeals ? 'active' : '') + '">Deals</a>' +
          '<a href="about.html" class="' + (isAbout ? 'active' : '') + '">About</a>' +
          '<a href="contact.html" class="' + (isContact ? 'active' : '') + '">Contact</a>' +
        '</div>' +
        '<div class="nav-right">' +
          '<a class="nav-icon-btn" aria-label="Wishlist" title="Wishlist" href="wishlist.html">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>' +
          '</a>' +
          '<a class="nav-icon-btn" href="cart.html" title="Cart">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>' +
            '<span class="cart-badge" id="cartBadge">0</span>' +
          '</a>' +
          '<div class="auth-btns" id="authBtns">' +
            '<a href="login.html" class="btn-login">Log In</a>' +
            '<a href="signup.html" class="btn-signup">Sign Up</a>' +
          '</div>' +
          '<button class="profile-tab" id="profileTab" style="display:none" onclick="toggleProfileDropdown(event)">' +
            '<div class="profile-avatar" id="navAvatar"><span id="navInitial">U</span></div>' +
            '<span id="navName">Account</span>' +
          '</button>' +
        '</div>' +
      '</div>' +
      '<div class="mobile-search">' +
        '<div class="nav-search">' +
          '<form onsubmit="event.preventDefault(); doNavSearch(this.querySelector(\'input\'));">' +
            '<input type="text" placeholder="Search products, brands, categories…">' +
            '<button type="submit" aria-label="Search">' +
              '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>' +
            '</button>' +
          '</form>' +
        '</div>' +
      '</div>' +
      '<div class="profile-dropdown" id="profileDropdown">' +
        '<div class="pd-header">' +
          '<div class="pd-name" id="ddName">User</div>' +
          '<div class="pd-email" id="ddEmail">user@email.com</div>' +
        '</div>' +
        '<a href="account.html" class="pd-item"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.15em; margin-right: 4px;"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> My Account</a>' +
        '<a href="cart.html" class="pd-item"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.15em; margin-right: 4px;"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg> My Cart (<span id="ddCartCount">0</span>)</a>' +
        '<a href="orders.html" class="pd-item"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.15em; margin-right: 4px;"><path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z"/><polyline points="2.32 6.16 12 11 21.68 6.16"/><line x1="12" y1="22.76" x2="12" y2="11"/></svg> My Orders</a>' +
        '<a href="wishlist.html" class="pd-item"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.15em; margin-right: 4px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Wishlist</a>' +
        '<div class="pd-item danger" onclick="if(typeof logout===\'function\')logout();"><svg class="svg-ic" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: -0.15em; margin-right: 4px;"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg> Log Out</div>' +
      '</div>' +
    '</nav>';

  var existingUtil = document.querySelector('.util-bar');
  var existingNav = document.querySelector('nav.scnav');
  var siteHeader = document.getElementById('site-header') || document.querySelector('header');

  if (existingUtil) existingUtil.remove();
  if (existingNav) {
    existingNav.insertAdjacentHTML('beforebegin', navHTML);
    existingNav.remove();
  } else if (siteHeader) {
    siteHeader.innerHTML = navHTML;
  } else if (document.body) {
    document.body.insertAdjacentHTML('afterbegin', navHTML);
  }
}

function renderStandardFooter() {
  if (document.body && document.body.dataset && document.body.dataset.noNav === 'true') return;
  var path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (path === 'admin.html' || path === 'live-chat-widget.html') return;

  var footHTML =
    '<footer class="scfoot">' +
      '<div class="container">' +
        '<div class="scfoot-grid">' +
          '<div>' +
            '<div class="scfoot-logo">' +
              '<span class="logo-icon">' +
                '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
                  '<path d="M12 2L20.5 6.5V17.5L12 22L3.5 17.5V6.5L12 2Z" fill="white" fill-opacity="0.12"/>' +
                  '<path d="M12 2L20.5 6.5V17.5L12 22L3.5 17.5V6.5L12 2Z" stroke="white" stroke-width="1.5" stroke-linejoin="round"/>' +
                  '<path d="M12 2V12M12 12L20.5 6.5M12 12L3.5 6.5M12 12V22" stroke="white" stroke-width="1.1" stroke-opacity="0.6"/>' +
                  '<circle cx="12" cy="12" r="2" fill="white"/>' +
                '</svg>' +
              '</span>' +
              '<span>Smart<em>Choice 3D</em></span>' +
            '</div>' +
            '<p class="scfoot-desc">AI-powered, immersive 3D shopping experience. Rotate, zoom, and inspect every product before you buy — smart choice, smarter shopping.</p>' +
            '<div class="scfoot-social"><a href="#">f</a><a href="#">in</a><a href="#">ig</a><a href="#">x</a></div>' +
          '</div>' +
          '<div>' +
            '<h6>Quick Links</h6>' +
            '<ul>' +
              '<li><a href="index.html">Home</a></li>' +
              '<li><a href="categories.html">Categories</a></li>' +
              '<li><a href="deals.html">Deals</a></li>' +
              '<li><a href="account.html">My Account</a></li>' +
              '<li><a href="cart.html">My Cart</a></li>' +
              '<li><a href="about.html">About Us</a></li>' +
              '<li><a href="contact.html">Contact</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h6>Top Categories</h6>' +
            '<ul>' +
              '<li><a href="electronics.html">Electronics</a></li>' +
              '<li><a href="laptops-pcs.html">Laptops & PCs</a></li>' +
              '<li><a href="mobiles-tablets.html">Mobiles & Tablets</a></li>' +
              '<li><a href="womens-fashion.html">Women\'s Fashion</a></li>' +
              '<li><a href="home-kitchen.html">Home & Kitchen</a></li>' +
            '</ul>' +
          '</div>' +
          '<div>' +
            '<h6>Stay Updated</h6>' +
            '<p style="font-size:.83rem;color:#8d8da8;margin-bottom:14px;">Subscribe for the latest drops & deals.</p>' +
            '<div class="scfoot-news-form">' +
              '<input type="email" id="footerNewsletterEmail" placeholder="Your email">' +
              '<button onclick="if(typeof subscribeNewsletter===\'function\')subscribeNewsletter(\'footerNewsletterEmail\');">Join</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
        '<hr>' +
        '<div class="scfoot-bottom">' +
          '<span>© 2026 Smart Choice 3D. All rights reserved.</span>' +
          '<span class="pay-icons"><span>VISA</span><span>MC</span><span>PayPal</span><span>COD</span></span>' +
        '</div>' +
      '</div>' +
    '</footer>';

  var existingFoot = document.querySelector('footer.scfoot') || document.querySelector('footer');
  if (existingFoot) {
    existingFoot.insertAdjacentHTML('beforebegin', footHTML);
    existingFoot.remove();
  } else if (document.body) {
    document.body.insertAdjacentHTML('beforeend', footHTML);
  }
}

// ---------- auth ----------
function getUser() {
  var u = scGet('sc_user', null) || scGet('sc3d_user', null) || scGet('smartchoice_user', null);
  if (!u) return null;
  if (typeof u === 'string') {
    try { u = JSON.parse(u); } catch(e) {}
  }
  return u;
}

function logout() {
  localStorage.removeItem('sc_user');
  localStorage.removeItem('sc3d_user');
  localStorage.removeItem('smartchoice_user');
  localStorage.removeItem('sc_token');
  window.location.href = 'index.html';
}

function renderAuthState() {
  var user = getUser();
  var authBtns = document.getElementById('authBtns');
  var profileTab = document.getElementById('profileTab');
  if (user) {
    if (authBtns) authBtns.style.display = 'none';
    if (profileTab) profileTab.style.display = 'inline-flex';
    var displayName = user.name || (user.firstName ? user.firstName + (user.lastName ? ' ' + user.lastName : '') : (user.username || 'Account'));
    var initial = displayName.charAt(0).toUpperCase();
    var navInitial = document.getElementById('navInitial');
    var navName = document.getElementById('navName');
    var ddName = document.getElementById('ddName');
    var ddEmail = document.getElementById('ddEmail');
    if (navInitial) navInitial.textContent = initial;
    if (navName) navName.textContent = displayName;
    if (ddName) ddName.textContent = displayName;
    if (ddEmail) ddEmail.textContent = user.email || '';
  } else {
    if (authBtns) authBtns.style.display = 'inline-flex';
    if (profileTab) profileTab.style.display = 'none';
  }
}

// ---------- base init (called on every page) ----------
function baseInit() {
  renderStandardNav();
  renderStandardFooter();
  renderAuthState();
  updateCartBadge();
  setupNavSearchSuggestions();

  // close profile dropdown when clicking outside
  document.addEventListener('click', function (e) {
    var dd = document.getElementById('profileDropdown');
    var tab = document.getElementById('profileTab');
    if (!dd || !tab) return;
    if (dd.classList.contains('open') && !dd.contains(e.target) && !tab.contains(e.target)) {
      dd.classList.remove('open');
    }
  });

  if (typeof onAuthChange === 'function') onAuthChange();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', baseInit);
} else {
  baseInit();
}



