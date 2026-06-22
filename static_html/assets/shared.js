/**
 * Expertly Static Site Shared JavaScript
 * Vanilla JS implementation of Nav Scroll, Counter, Global Search (Cmd+K), Floating Search, and Tweaks Panel.
 */

// HSL Color calculation helpers for customizer
function hexToHsl(hex) {
  hex = hex.replace(/^#/, '');
  let r = parseInt(hex.substring(0, 2), 16) / 255;
  let g = parseInt(hex.substring(2, 4), 16) / 255;
  let b = parseInt(hex.substring(4, 6), 16) / 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;
  if (max === min) h = s = 0;
  else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  let c = (1 - Math.abs(2 * l - 1)) * s;
  let x = c * (1 - Math.abs((h / 60) % 2 - 1));
  let m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (0 <= h && h < 60) { r = c; g = x; b = 0; }
  else if (60 <= h && h < 120) { r = x; g = c; b = 0; }
  else if (120 <= h && h < 180) { r = 0; g = c; b = x; }
  else if (180 <= h && h < 240) { r = 0; g = x; b = c; }
  else if (240 <= h && h < 300) { r = x; g = 0; b = c; }
  else if (300 <= h && h < 360) { r = c; g = 0; b = x; }
  let rHex = Math.round((r + m) * 255).toString(16).padStart(2, '0');
  let gHex = Math.round((g + m) * 255).toString(16).padStart(2, '0');
  let bHex = Math.round((b + m) * 255).toString(16).padStart(2, '0');
  return `#${rHex}${gHex}${bHex}`;
}

function applyCustomColor(hex) {
  if (!hex || !/^#[0-9A-F]{6}$/i.test(hex)) return;
  const hsl = hexToHsl(hex);
  const accent2 = hex;
  const accent = hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 8));
  const bgAlt = hslToHex(hsl.h, Math.min(100, hsl.s * 0.7), 96);
  const neon = hslToHex(hsl.h, hsl.s, Math.max(65, hsl.l + 38));
  const navGreen = hslToHex(hsl.h, Math.min(100, hsl.s * 0.95), 12);

  const root = document.documentElement;
  root.style.setProperty('--accent-2', accent2);
  root.style.setProperty('--accent', accent);
  root.style.setProperty('--bg-alt', bgAlt);
  root.style.setProperty('--neon', neon);
  root.style.setProperty('--nav-green', navGreen);

  localStorage.setItem('expertly-custom-color', hex);

  const customPreview = document.getElementById('theme-cust-color-preview-box');
  if (customPreview) customPreview.style.backgroundColor = hex;
  const pickerInput = document.getElementById('theme-cust-color-input');
  if (pickerInput) pickerInput.value = hex;
  const hexInput = document.getElementById('theme-cust-hex-input-box');
  if (hexInput) hexInput.value = hex;

  document.querySelectorAll('.theme-cust-preset').forEach(btn => {
    if (btn.getAttribute('data-color').toLowerCase() === hex.toLowerCase()) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
}

function clearCustomColor() {
  const root = document.documentElement;
  root.style.removeProperty('--accent-2');
  root.style.removeProperty('--accent');
  root.style.removeProperty('--bg-alt');
  root.style.removeProperty('--neon');
  root.style.removeProperty('--nav-green');
  localStorage.removeItem('expertly-custom-color');

  document.querySelectorAll('.theme-cust-preset').forEach(btn => {
    if (btn.getAttribute('data-color') === '#00C99E') {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });
  const customPreview = document.getElementById('theme-cust-color-preview-box');
  if (customPreview) customPreview.style.backgroundColor = '#00C99E';
  const pickerInput = document.getElementById('theme-cust-color-input');
  if (pickerInput) pickerInput.value = '#00C99E';
  const hexInput = document.getElementById('theme-cust-hex-input-box');
  if (hexInput) hexInput.value = '#00C99E';
}

// Self-invoking function to load saved theme immediately
(function () {
  const savedColor = localStorage.getItem('expertly-custom-color');
  if (savedColor) {
    const hsl = hexToHsl(savedColor);
    const accent2 = savedColor;
    const accent = hslToHex(hsl.h, hsl.s, Math.max(15, hsl.l - 8));
    const bgAlt = hslToHex(hsl.h, Math.min(100, hsl.s * 0.7), 96);
    const neon = hslToHex(hsl.h, hsl.s, Math.max(65, hsl.l + 38));
    const navGreen = hslToHex(hsl.h, Math.min(100, hsl.s * 0.95), 12);
    const root = document.documentElement;
    root.style.setProperty('--accent-2', accent2);
    root.style.setProperty('--accent', accent);
    root.style.setProperty('--bg-alt', bgAlt);
    root.style.setProperty('--neon', neon);
    root.style.setProperty('--nav-green', navGreen);
  }
})();

// Global state for search and tweaks
let searchOpen = false;
let searchActiveIndex = 0;
let flatSearchResults = [];
let searchTimer = null;
let currentTweakState = {
  theme: 'editorial',
  heroStyle: 'split',
  showGrid: true
};

// Avatar Helper Function
function getAvatarHtml(member, size = 40) {
  const initials = member.initials || '';
  const imgHtml = member.img ? `<img src="${member.img}" alt="" class="avatar-img" onload="this.classList.add('loaded')" />` : '';
  return `
    <div class="avatar" style="width: ${size}px; height: ${size}px; font-size: ${size * 0.35}px;" data-initials="${initials}">
      <span class="avatar-initials" aria-hidden="true">${initials}</span>
      ${imgHtml}
    </div>
  `;
}

// Check icon Helper
function getCheckIconHtml() {
  return `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" style="width:1em; height:1em; display:inline-block; vertical-align:middle;">
      <path d="M5 12l5 5L20 7" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  // 0. Render shared navbar
  renderNav();

  // 1. Navigation Scroll State and active link logic
  initNavigation();

  // 2. Dynamic injection of Global Search, Floating Search, and Tweaks Panel elements
  injectDynamicElements();

  // 3. Initialize Global Search Logic
  initGlobalSearch();

  // 4. Initialize Floating Search
  initFloatingSearch();

  // 5. Initialize Tweaks Panel
  initTweaksPanel();

  // 6. Initialize Theme Color Customizer
  initThemeColorCustomizer();

  // 7. Initialize Animated Counters
  initCounters();
});

/* ==========================================================================
   0. NAVBAR RENDER — single source of truth for all pages
   ========================================================================== */
function renderNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  let session = null;
  try { session = JSON.parse(localStorage.getItem('expertly_session')); } catch (e) { }

  let actionsHtml;
  if (session && session.email) {
    const initial = session.email.charAt(0).toUpperCase();
    const avatar = `
      <div class="nav-avatar" id="nav-avatar-btn" title="${session.email}">
        ${initial}
        <div class="nav-avatar-menu" id="nav-avatar-menu">
          <span class="nav-avatar-email">${session.email}</span>
          <button id="nav-logout-btn">Log out</button>
        </div>
      </div>`;
    actionsHtml = session.role === 'member'
      ? avatar
      : `<a href="apply.html" class="btn btn-primary">Apply</a>${avatar}`;
  } else {
    actionsHtml = `<a href="login.html" class="btn btn-primary">Log in</a>`;
  }

  nav.innerHTML = `
    <div class="nav-inner">
      <a href="index.html">
        <span class="nav-logo" style="font-size:23px;">Expertly<span class="dot"></span></span>
      </a>
      <div class="nav-links">
        <a href="members.html">Members</a>
        <a href="articles.html">Articles</a>
        <a href="events.html">Events</a>
        <a href="membership-combined.html">Membership</a>
      </div>
      <div class="nav-actions">${actionsHtml}</div>
    </div>`;

  const avatarBtn = document.getElementById('nav-avatar-btn');
  const avatarMenu = document.getElementById('nav-avatar-menu');
  const logoutBtn = document.getElementById('nav-logout-btn');

  if (avatarBtn && avatarMenu) {
    avatarBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      avatarMenu.classList.toggle('open');
    });
    document.addEventListener('click', () => avatarMenu.classList.remove('open'), { once: false });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('expertly_session');
      window.location.href = 'index.html';
    });
  }
}

/* ==========================================================================
   1. NAVIGATION
   ========================================================================== */
function initNavigation() {
  const nav = document.querySelector('.nav');
  if (nav) {
    const updateNav = () => {
      const scrollY = window.scrollY;
      const p = Math.min(1, Math.max(0, scrollY / 80));
      document.documentElement.style.setProperty('--nav-p', p.toFixed(3));
      if (scrollY > 8) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  // Active navigation link highlighting based on path
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ==========================================================================
   2. ELEMENT INJECTION
   ========================================================================== */
function injectDynamicElements() {
  // Inject Theme Color Customizer CSS styles dynamically
  const styleEl = document.createElement('style');
  styleEl.textContent = `
    /* Theme Customizer FAB */
    .theme-cust-fab {
      position: fixed; bottom: 20px; right: 20px;
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--ink); color: var(--bg);
      display: flex; align-items: center; justify-content: center;
      z-index: 99; cursor: pointer; border: 1px solid var(--line);
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
      transition: all 0.2s cubic-bezier(0.22,1,0.36,1);
    }
    .theme-cust-fab:hover {
      transform: scale(1.05) translateY(-2px);
      box-shadow: 0 12px 32px rgba(0,0,0,0.18);
      border-color: var(--accent-2);
    }
    .theme-cust-fab svg {
      width: 20px; height: 20px;
      transition: transform 0.4s ease;
    }
    .theme-cust-fab:hover svg {
      transform: rotate(45deg);
    }

    /* Popover Panel */
    .theme-cust-panel {
      position: fixed; bottom: 80px; right: 20px;
      background: var(--bg-card); color: var(--ink);
      border: 1px solid var(--line-2);
      border-radius: 16px;
      padding: 20px;
      width: 280px;
      z-index: 101;
      box-shadow: 0 20px 48px rgba(0,0,0,0.16);
      display: none;
      animation: themeCustIn 0.25s cubic-bezier(0.22,1,0.36,1);
    }
    @keyframes themeCustIn {
      from { opacity: 0; transform: translateY(10px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }
    .theme-cust-panel.open { display: block; }
    .theme-cust-panel h3 {
      font-size: 14px; font-weight: 600; margin-bottom: 16px;
      display: flex; justify-content: space-between; align-items: center;
      letter-spacing: -0.01em;
    }
    .theme-cust-panel h3 button {
      color: var(--ink-3); font-size: 20px; line-height: 1; transition: all 0.15s;
      width: 24px; height: 24px; display: inline-flex; align-items: center; justify-content: center;
      border-radius: 50%; cursor: pointer;
    }
    .theme-cust-panel h3 button:hover { color: var(--ink); background: var(--bg-alt); }

    .theme-cust-section { margin-bottom: 16px; }
    .theme-cust-section label {
      display: block; font-family: 'Archivo', sans-serif; font-size: 10px;
      letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-3);
      margin-bottom: 8px; font-weight: 600;
    }

    /* Preset circles */
    .theme-cust-presets {
      display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;
    }
    .theme-cust-preset {
      width: 28px; height: 28px; border-radius: 50%;
      border: 2px solid transparent; cursor: pointer;
      transition: all 0.15s;
    }
    .theme-cust-preset:hover { transform: scale(1.1); }
    .theme-cust-preset.active { border-color: var(--ink); transform: scale(1.05); }

    /* Custom picker row */
    .theme-cust-picker-row {
      display: flex; align-items: center; gap: 10px;
      background: var(--bg-alt); padding: 8px 12px; border-radius: 8px;
      border: 1px solid var(--line);
    }
    .theme-cust-color-preview {
      width: 24px; height: 24px; border-radius: 50%;
      border: 1px solid var(--line-2); cursor: pointer;
      position: relative; overflow: hidden;
    }
    .theme-cust-color-preview input[type="color"] {
      position: absolute; top: -5px; left: -5px; width: 34px; height: 34px;
      opacity: 0; cursor: pointer; border: none; padding: 0;
    }
    .theme-cust-hex-input {
      flex: 1; background: transparent; border: none; outline: none;
      font-family: 'Archivo', monospace; font-size: 13px; color: var(--ink);
      text-transform: uppercase; width: 100%;
    }

    /* Reset button */
    .theme-cust-reset {
      width: 100%; padding: 10px; border-radius: 8px;
      background: var(--bg-alt); color: var(--ink-2);
      border: 1px solid var(--line); font-size: 12px; font-weight: 500;
      transition: all 0.15s; text-align: center; margin-top: 12px; cursor: pointer;
    }
    .theme-cust-reset:hover {
      background: var(--ink); color: var(--bg); border-color: var(--ink);
    }

    /* Tweaks Panel and FAB offset */
    #tweaks-container .tweaks-fab {
      right: 80px !important;
    }
    #tweaks-container .tweaks-panel {
      right: 80px !important;
    }
  `;
  document.head.appendChild(styleEl);

  const custContainer = document.createElement('div');
  custContainer.id = 'theme-customizer-container';
  custContainer.innerHTML = `
    <button class="theme-cust-fab" id="theme-cust-fab-btn" aria-label="Customize Theme Color">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" />
        <circle cx="7.5" cy="10.5" r="1.5" fill="currentColor" />
        <circle cx="11.5" cy="7.5" r="1.5" fill="currentColor" />
        <circle cx="16.5" cy="9.5" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor" />
      </svg>
    </button>
    <div class="theme-cust-panel" id="theme-cust-settings-panel">
      <h3>Theme Color <button id="theme-cust-close-btn">×</button></h3>
      <div class="theme-cust-section">
        <label>Presets</label>
        <div class="theme-cust-presets">
          <button class="theme-cust-preset" data-color="#00C99E" style="background: #00C99E;" title="Neon Mint (Default)"></button>
          <button class="theme-cust-preset" data-color="#8A6BFF" style="background: #8A6BFF;" title="Neon Lilac"></button>
          <button class="theme-cust-preset" data-color="#34A8FF" style="background: #34A8FF;" title="Neon Sky"></button>
          <button class="theme-cust-preset" data-color="#FFB800" style="background: #FFB800;" title="Neon Gold"></button>
          <button class="theme-cust-preset" data-color="#FF4D80" style="background: #FF4D80;" title="Neon Rose"></button>
        </div>
      </div>
      <div class="theme-cust-section">
        <label>Custom Color</label>
        <div class="theme-cust-picker-row">
          <div class="theme-cust-color-preview" id="theme-cust-color-preview-box" style="background: #00C99E;">
            <input type="color" id="theme-cust-color-input" value="#00C99E" />
          </div>
          <input type="text" class="theme-cust-hex-input" id="theme-cust-hex-input-box" value="#00C99E" maxlength="7" />
        </div>
      </div>
      <button class="theme-cust-reset" id="theme-cust-reset-btn">Reset to Default</button>
    </div>
  `;
  document.body.appendChild(custContainer);

  // Inject Global Search Overlay
  const searchOverlay = document.createElement('div');
  searchOverlay.className = 'gsearch';
  searchOverlay.id = 'global-search-overlay';
  searchOverlay.setAttribute('aria-hidden', 'true');
  searchOverlay.innerHTML = `
    <div class="gsearch-backdrop" id="gsearch-backdrop"></div>
    <div class="gsearch-panel" role="dialog" aria-modal="true" aria-label="Search Expertly">
      <div class="gsearch-bar">
        <span class="gsearch-spark">✦</span>
        <input class="gsearch-input" id="gsearch-input" placeholder="Ask anything — try &quot;M&amp;A tax advisor in Singapore under $500/hr&quot;" />
        <button class="gsearch-clear" id="gsearch-clear" aria-label="Clear" style="display: none;">×</button>
        <button class="gsearch-esc" id="gsearch-close">Esc</button>
      </div>
      <div class="gsearch-body">
        <div class="gsearch-suggest" id="gsearch-suggest">
          <div class="gsearch-suggest-label">Suggested searches</div>
          <div class="gsearch-suggest-row" id="gsearch-suggest-row">
            <!-- Populated dynamically -->
          </div>
        </div>
        <div class="gsearch-results" id="gsearch-results" style="display: none;"></div>
        <div class="gsearch-empty" id="gsearch-empty" style="display: none;">
          <div class="gsearch-empty-spark">✦</div>
          <h4>No matches for “<span id="gsearch-query-display"></span>”</h4>
          <p>Try a practice area, a jurisdiction, or a name.</p>
        </div>
      </div>
      <div class="gsearch-foot">
        <div class="gsearch-foot-keys">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
        <div class="gsearch-foot-brand"><span class="ai-pulse small"></span> Powered by Expertly AI</div>
      </div>
    </div>
  `;
  document.body.appendChild(searchOverlay);

  // Inject Floating Search Button
  const floatBtn = document.createElement('button');
  floatBtn.className = 'floating-search';
  floatBtn.id = 'floating-search-btn';
  floatBtn.setAttribute('aria-label', 'Search Expertly');
  floatBtn.innerHTML = `
    <span class="floating-search-spark">✦</span>
    <span class="floating-search-text">Search experts, articles & events</span>
    <span class="floating-search-kbd mono">⌘K</span>
  `;
  document.body.appendChild(floatBtn);

  // Inject Tweaks Panel
  const tweaksContainer = document.createElement('div');
  tweaksContainer.id = 'tweaks-container';
  tweaksContainer.innerHTML = `
    <button class="tweaks-fab" id="tweaks-fab-btn" style="display: none;">Tweaks</button>
    <div class="tweaks-panel" id="tweaks-settings-panel">
      <h3>Tweaks <button id="tweaks-close-btn">×</button></h3>
      <div class="tweak-group">
        <label>Aesthetic</label>
        <div class="radio-row">
          <button class="tweak-theme-btn active" data-theme="editorial"><span class="swatch" style="background: #00C99E;"></span>Neon Mint</button>
          <button class="tweak-theme-btn" data-theme="navy"><span class="swatch" style="background: #8A6BFF;"></span>Neon Lilac</button>
          <button class="tweak-theme-btn" data-theme="sage"><span class="swatch" style="background: #34A8FF;"></span>Neon Sky</button>
        </div>
      </div>
      <div class="tweak-group">
        <label>Hero style</label>
        <div class="radio-row">
          <button class="tweak-hero-btn active" data-hero="split">Split · members preview</button>
          <button class="tweak-hero-btn" data-hero="mosaic">Mosaic · full-bleed grid</button>
          <button class="tweak-hero-btn" data-hero="editorial">Editorial · masthead</button>
        </div>
      </div>
      <div class="tweak-group">
        <label>Background grid</label>
        <div class="radio-row">
          <button class="tweak-grid-btn active" id="tweak-grid-toggle">◉ On</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(tweaksContainer);
}

/* ==========================================================================
   3. GLOBAL SEARCH (COMMAND PALETTE)
   ========================================================================== */
function initGlobalSearch() {
  const overlay = document.getElementById('global-search-overlay');
  const input = document.getElementById('gsearch-input');
  const resultsDiv = document.getElementById('gsearch-results');
  const suggestDiv = document.getElementById('gsearch-suggest');
  const emptyDiv = document.getElementById('gsearch-empty');
  const queryDisplay = document.getElementById('gsearch-query-display');
  const clearBtn = document.getElementById('gsearch-clear');
  const closeBtn = document.getElementById('gsearch-close');
  const backdrop = document.getElementById('gsearch-backdrop');
  const suggestRow = document.getElementById('gsearch-suggest-row');

  const suggestions = ['M&A tax · Chennai', 'Cross-border compliance', 'IP counsel · EU', 'Transfer pricing', 'Capital markets · Tokyo'];
  const rotatingPhrases = [
    'M&A tax advisor in Singapore under $500/hr',
    'Transfer pricing expert with BEPS 2.0 experience',
    'IP counsel for SaaS, EU + US coverage',
    'Restructuring partner — Italy, distressed debt'
  ];
  let phraseIdx = 0;

  // Set up phrase rotation in placeholder when closed
  const rotationInterval = setInterval(() => {
    if (!searchOpen && input) {
      phraseIdx = (phraseIdx + 1) % rotatingPhrases.length;
      input.setAttribute('placeholder', `Ask anything — try "${rotatingPhrases[phraseIdx]}"`);
    }
  }, 3200);

  // Populate Suggestions
  suggestRow.innerHTML = suggestions.map(s => `<button class="gsearch-suggest-btn">${s}</button>`).join('');

  // Handle Search opening
  const openSearch = (initialQuery = '') => {
    searchOpen = true;
    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    if (initialQuery) {
      input.value = initialQuery;
      clearBtn.style.display = 'block';
    } else {
      input.value = '';
      clearBtn.style.display = 'none';
    }

    setTimeout(() => input.focus(), 60);
    performSearch();
  };

  const closeSearch = () => {
    searchOpen = false;
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    input.blur();
  };

  // Click listeners
  backdrop.addEventListener('click', closeSearch);
  closeBtn.addEventListener('click', closeSearch);
  clearBtn.addEventListener('click', () => {
    input.value = '';
    clearBtn.style.display = 'none';
    input.focus();
    performSearch();
  });

  // Suggestion buttons click
  suggestRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.gsearch-suggest-btn');
    if (btn) {
      input.value = btn.textContent;
      clearBtn.style.display = 'block';
      input.focus();
      performSearch();
    }
  });

  // Listen to custom search event
  window.addEventListener('expertly:search', (e) => {
    openSearch(e.detail && e.detail.q ? e.detail.q : '');
  });

  // Hotkey Cmd+K or Ctrl+K
  window.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      if (searchOpen) {
        closeSearch();
      } else {
        openSearch();
      }
    }
    if (e.key === 'Escape' && searchOpen) {
      closeSearch();
    }
  });

  // Input typing search
  input.addEventListener('input', () => {
    clearBtn.style.display = input.value ? 'block' : 'none';
    performSearch();
  });

  // Keyboard navigation inside search results
  input.addEventListener('keydown', (e) => {
    if (flatSearchResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      searchActiveIndex = Math.min(flatSearchResults.length - 1, searchActiveIndex + 1);
      updateActiveRow();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      searchActiveIndex = Math.max(0, searchActiveIndex - 1);
      updateActiveRow();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const activeItem = flatSearchResults[searchActiveIndex];
      if (activeItem) {
        window.location.href = activeItem.href;
      }
    }
  });

  function performSearch() {
    const q = input.value.trim();
    if (!q) {
      suggestDiv.style.display = 'block';
      resultsDiv.style.display = 'none';
      emptyDiv.style.display = 'none';
      flatSearchResults = [];
      searchActiveIndex = 0;
      return;
    }

    suggestDiv.style.display = 'none';

    const term = q.toLowerCase();
    const words = term.split(/\s+/).filter(Boolean);

    // Attempt strict AND match
    const strictMatch = (text) => {
      return words.every(w => text.toLowerCase().includes(w));
    };

    let matchedMembers = (window.EXPERTLY_MEMBERS || []).filter(m =>
      strictMatch(`${m.name} ${m.practice} ${m.location} ${m.title} ${m.firm}`)
    );
    let matchedArticles = (window.EXPERTLY_ARTICLES || []).filter(a =>
      strictMatch(`${a.title} ${a.category} ${a.excerpt}`)
    );
    let matchedEvents = (window.EXPERTLY_EVENTS || []).filter(e =>
      strictMatch(`${e.title} ${e.category} ${e.city} ${e.country} ${e.desc}`)
    );

    // If zero total results, use semantic/OR keyword fallback
    if (matchedMembers.length === 0 && matchedArticles.length === 0 && matchedEvents.length === 0) {
      const stopWords = new Set(['in', 'under', 'for', 'advisor', 'advisors', 'expert', 'experts', 'with', 'the', 'a', 'an', 'of', 'to', 'at', 'on', 'by', 'is', 'and', 'or', 'about', 'who', 'what', 'where']);
      const queryKeywords = words.filter(w => !stopWords.has(w));

      if (queryKeywords.length > 0) {
        const getMatchScore = (text) => {
          let score = 0;
          queryKeywords.forEach(w => {
            if (text.toLowerCase().includes(w)) {
              score += 1;
            }
          });
          return score;
        };

        matchedMembers = (window.EXPERTLY_MEMBERS || [])
          .map(m => ({ m, score: getMatchScore(`${m.name} ${m.practice} ${m.location} ${m.title} ${m.firm}`) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(x => x.m);

        matchedArticles = (window.EXPERTLY_ARTICLES || [])
          .map(a => ({ a, score: getMatchScore(`${a.title} ${a.category} ${a.excerpt}`) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(x => x.a);

        matchedEvents = (window.EXPERTLY_EVENTS || [])
          .map(e => ({ e, score: getMatchScore(`${e.title} ${e.category} ${e.city} ${e.country} ${e.desc}`) }))
          .filter(x => x.score > 0)
          .sort((a, b) => b.score - a.score)
          .map(x => x.e);
      }
    }

    const members = matchedMembers.slice(0, 5);
    const articles = matchedArticles.slice(0, 4);
    const events = matchedEvents.slice(0, 3);

    const total = members.length + articles.length + events.length;

    if (total === 0) {
      resultsDiv.style.display = 'none';
      queryDisplay.textContent = q;
      emptyDiv.style.display = 'block';
      flatSearchResults = [];
      searchActiveIndex = 0;
      return;
    }

    emptyDiv.style.display = 'none';
    resultsDiv.style.display = 'block';

    // Compile flat search array for keyboard indexing
    flatSearchResults = [
      ...members.map(m => ({ type: 'member', href: `members.html#${m.id}`, data: m })),
      ...articles.map(a => ({ type: 'article', href: `articles.html#${a.id}`, data: a })),
      ...events.map(e => ({ type: 'event', href: `events.html#${e.id}`, data: e }))
    ];

    searchActiveIndex = 0;

    // Render HTML
    let html = '';

    // Render Members
    if (members.length > 0) {
      html += `
        <div class="gsearch-group">
          <div class="gsearch-group-head"><span>Experts</span><span class="gsearch-group-count">${members.length}</span></div>
      `;
      members.forEach(m => {
        const flatIdx = flatSearchResults.findIndex(item => item.type === 'member' && item.data.id === m.id);
        const activeClass = flatIdx === searchActiveIndex ? 'active' : '';
        const verifiedBadge = m.verified ? `<span class="float-tick">${getCheckIconHtml()}</span>` : '';
        html += `
          <a href="members.html#${m.id}" class="gsearch-row ${activeClass}" data-index="${flatIdx}">
            ${getAvatarHtml(m, 40)}
            <div class="gsearch-row-body">
              <div class="gsearch-row-title">${m.name}${verifiedBadge}</div>
              <div class="gsearch-row-meta">${m.title} · ${m.location}</div>
            </div>
            <div class="gsearch-row-tag">${m.practice}</div>
            <div class="gsearch-row-rate mono">${m.rate}</div>
          </a>
        `;
      });
      html += `</div>`;
    }

    // Render Articles
    if (articles.length > 0) {
      html += `
        <div class="gsearch-group">
          <div class="gsearch-group-head"><span>Articles</span><span class="gsearch-group-count">${articles.length}</span></div>
      `;
      articles.forEach(a => {
        const flatIdx = flatSearchResults.findIndex(item => item.type === 'article' && item.data.id === a.id);
        const activeClass = flatIdx === searchActiveIndex ? 'active' : '';
        const author = (window.EXPERTLY_MEMBERS || []).find(m => m.id === a.author);
        const authorName = author ? author.name : 'Expertly Counsel';
        html += `
          <a href="articles.html#${a.id}" class="gsearch-row ${activeClass}" data-index="${flatIdx}">
            <div class="gsearch-row-icon gsearch-icon-article">¶</div>
            <div class="gsearch-row-body">
              <div class="gsearch-row-title">${a.title}</div>
              <div class="gsearch-row-meta">${authorName} · ${a.readTime} read</div>
            </div>
            <div class="gsearch-row-tag">${a.category}</div>
          </a>
        `;
      });
      html += `</div>`;
    }

    // Render Events
    if (events.length > 0) {
      html += `
        <div class="gsearch-group">
          <div class="gsearch-group-head"><span>Events</span><span class="gsearch-group-count">${events.length}</span></div>
      `;
      events.forEach(e => {
        const flatIdx = flatSearchResults.findIndex(item => item.type === 'event' && item.data.id === e.id);
        const activeClass = flatIdx === searchActiveIndex ? 'active' : '';
        const month = e.start.split(' ')[0];
        const day = e.start.split(' ')[1];
        html += `
          <a href="events.html#${e.id}" class="gsearch-row ${activeClass}" data-index="${flatIdx}">
            <div class="gsearch-row-icon gsearch-icon-event"><b>${day}</b><span>${month}</span></div>
            <div class="gsearch-row-body">
              <div class="gsearch-row-title">${e.title}</div>
              <div class="gsearch-row-meta">${e.city}, ${e.country} · ${e.format}</div>
            </div>
            <div class="gsearch-row-tag">${e.category}</div>
          </a>
        `;
      });
      html += `</div>`;
    }

    resultsDiv.innerHTML = html;

    // Attach Mouse Hover mapping
    resultsDiv.querySelectorAll('.gsearch-row').forEach(row => {
      row.addEventListener('mouseenter', () => {
        searchActiveIndex = parseInt(row.getAttribute('data-index'), 10);
        updateActiveRow();
      });
    });
  }

  function updateActiveRow() {
    resultsDiv.querySelectorAll('.gsearch-row').forEach(row => {
      const idx = parseInt(row.getAttribute('data-index'), 10);
      if (idx === searchActiveIndex) {
        row.classList.add('active');
        row.scrollIntoView({ block: 'nearest' });
      } else {
        row.classList.remove('active');
      }
    });
  }
}

/* ==========================================================================
   4. FLOATING SEARCH LAUNCHER
   ========================================================================== */
function initFloatingSearch() {
  const btn = document.getElementById('floating-search-btn');
  if (!btn) return;
  const onScroll = () => {
    if (window.scrollY > 620) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  btn.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: '' } }));
  });
}

/* ==========================================================================
   5. TWEAKS PANEL
   ========================================================================== */
function initTweaksPanel() {
  const fab = document.getElementById('tweaks-fab-btn');
  const panel = document.getElementById('tweaks-settings-panel');
  const closeBtn = document.getElementById('tweaks-close-btn');

  if (!fab || !panel) return;

  // Manage Edit Mode triggers from iframe hosting environment
  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') {
      fab.style.display = 'flex';
    }
    if (e.data.type === '__deactivate_edit_mode') {
      fab.style.display = 'none';
      panel.classList.remove('open');
    }
  });

  // Announce that edit mode is supported
  window.parent.postMessage({ type: '__edit_mode_available' }, '*');

  fab.addEventListener('click', () => {
    panel.classList.add('open');
    fab.style.display = 'none';
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
    fab.style.display = 'flex';
  });

  // Theme Switching Buttons
  const themeBtns = document.querySelectorAll('.tweak-theme-btn');
  themeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Clear custom color first so default theme values apply
      clearCustomColor();

      themeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const themeVal = btn.getAttribute('data-theme');
      currentTweakState.theme = themeVal;

      const themeMap = { editorial: '', navy: 'navy', sage: 'sage' };
      document.documentElement.setAttribute('data-theme', themeMap[themeVal] || '');

      // sync modifications back to parent frame
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { theme: themeVal } }, '*');
    });
  });

  // Hero Style Selection
  const heroBtns = document.querySelectorAll('.tweak-hero-btn');
  heroBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      heroBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const heroVal = btn.getAttribute('data-hero');
      currentTweakState.heroStyle = heroVal;

      document.documentElement.setAttribute('data-hero', heroVal);

      // Dispatch event to allow homepage to swap layout if needed
      window.dispatchEvent(new CustomEvent('expertly:hero-change', { detail: { style: heroVal } }));

      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { heroStyle: heroVal } }, '*');
    });
  });

  // Background Grid Toggle
  const gridBtn = document.getElementById('tweak-grid-toggle');
  if (gridBtn) {
    gridBtn.addEventListener('click', () => {
      currentTweakState.showGrid = !currentTweakState.showGrid;
      if (currentTweakState.showGrid) {
        gridBtn.classList.add('active');
        gridBtn.textContent = '◉ On';
        document.documentElement.setAttribute('data-grid', '1');
      } else {
        gridBtn.classList.remove('active');
        gridBtn.textContent = '○ Off';
        document.documentElement.setAttribute('data-grid', '0');
      }
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { showGrid: currentTweakState.showGrid } }, '*');
    });
  }
}

/* ==========================================================================
   6. ANIMATED COUNTERS
   ========================================================================== */
function initCounters() {
  const counters = document.querySelectorAll('[data-counter-value]');
  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          if (el.dataset.started) return;
          el.dataset.started = 'true';
          animateCounter(el);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.05 });
    counters.forEach(c => observer.observe(c));
  } else {
    // fallback immediately if IntersectionObserver isn't supported
    counters.forEach(c => animateCounter(c));
  }
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-counter-value'), 10) || 0;
  const suffix = el.getAttribute('data-counter-suffix') || '';
  const duration = parseInt(el.getAttribute('data-counter-duration'), 10) || 1600;
  const start = performance.now();

  const tick = (t) => {
    const p = Math.min(1, (t - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3); // cubic ease-out
    el.textContent = Math.floor(target * eased) + suffix;
    if (p < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = target + suffix;
    }
  };
  requestAnimationFrame(tick);
}

// Global utility references so templates can make styling/markup changes easily
window.getAvatarHtml = getAvatarHtml;
window.getCheckIconHtml = getCheckIconHtml;

/* ==========================================================================
   7. THEME COLOR CUSTOMIZER INITIALIZATION
   ========================================================================== */
function initThemeColorCustomizer() {
  const fab = document.getElementById('theme-cust-fab-btn');
  const panel = document.getElementById('theme-cust-settings-panel');
  const closeBtn = document.getElementById('theme-cust-close-btn');
  const presets = document.querySelectorAll('.theme-cust-preset');
  const colorInput = document.getElementById('theme-cust-color-input');
  const hexInput = document.getElementById('theme-cust-hex-input-box');
  const resetBtn = document.getElementById('theme-cust-reset-btn');

  if (!fab || !panel) return;

  // Toggle Panel
  fab.addEventListener('click', () => {
    panel.classList.toggle('open');
  });

  closeBtn.addEventListener('click', () => {
    panel.classList.remove('open');
  });

  // Close panel when clicking outside
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !fab.contains(e.target)) {
      panel.classList.remove('open');
    }
  });

  // Preset clicks
  presets.forEach(btn => {
    btn.addEventListener('click', () => {
      const color = btn.getAttribute('data-color');
      applyCustomColor(color);
    });
  });

  // Color picker input
  colorInput.addEventListener('input', (e) => {
    applyCustomColor(e.target.value);
  });

  // Hex text input
  hexInput.addEventListener('input', (e) => {
    let val = e.target.value;
    if (!val.startsWith('#')) {
      val = '#' + val;
      hexInput.value = val;
    }
    if (/^#[0-9A-F]{6}$/i.test(val)) {
      applyCustomColor(val);
    }
  });

  // Reset button click
  resetBtn.addEventListener('click', () => {
    clearCustomColor();
  });

  // Load initial saved color state into customizer inputs
  const savedColor = localStorage.getItem('expertly-custom-color') || '#00C99E';
  applyCustomColor(savedColor);
}
