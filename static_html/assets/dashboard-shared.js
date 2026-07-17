/* ==========================================================================
   Member Portal — shared logic across the portal (dashboard, articles, events)
   Session guard + identity fill-in + logout, reusing the same
   'expertly_session' localStorage contract as shared.js / member-profile.html
   ========================================================================== */

function dashboardGetSession() {
  try { return JSON.parse(localStorage.getItem('expertly_session')); }
  catch (e) { return null; }
}

function dashboardNameFromEmail(email) {
  const local = (email || '').split('@')[0] || 'Member';
  return local
    .replace(/[._-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ') || 'Member';
}

// TEMPORARY: member-only gating is disabled while these dashboard variants
// are under review, so they're viewable without logging in. Set to true to
// re-enable the auth wall (real member session required) once a variant is picked.
const DASHBOARD_REQUIRE_LOGIN = false;

function dashboardGuard() {
  const wall = document.getElementById('dash-auth-wall');
  const app = document.getElementById('dash-app');
  const session = dashboardGetSession();

  if (DASHBOARD_REQUIRE_LOGIN && (!session || !session.email)) {
    if (wall) wall.style.display = 'flex';
    if (app) app.style.display = 'none';
    return null;
  }

  if (wall) wall.style.display = 'none';
  if (app) app.style.display = 'block';

  const name = session && session.email ? dashboardNameFromEmail(session.email) : 'Member';
  const email = session && session.email ? session.email : 'you@firm.com';
  const initial = name.charAt(0).toUpperCase();

  document.querySelectorAll('[data-dash-name]').forEach(el => el.textContent = name);
  document.querySelectorAll('[data-dash-email]').forEach(el => el.textContent = email);
  document.querySelectorAll('[data-dash-initial]').forEach(el => el.textContent = initial);

  document.querySelectorAll('[data-dash-logout]').forEach(btn => {
    btn.addEventListener('click', () => {
      localStorage.removeItem('expertly_session');
      window.location.href = 'login.html';
    });
  });

  return session;
}

/* ── Shared sidebar — identical nav/theme across every portal page ──
   Each page sets `window.DASH_ACTIVE = 'dashboard' | 'articles' | 'events'
   | 'peer' | 'members'` before this script runs, and includes an empty
   <aside id="dash-sidebar"></aside> placeholder for this to fill. */
function dashboardRenderSidebar() {
  const mount = document.getElementById('dash-sidebar');
  if (!mount) return;
  const active = window.DASH_ACTIVE || '';
  const isActive = key => active === key ? ' active' : '';
  const dashboardHref = 'dashboard-v2.html';
  const articlesHref = 'my-articles-v2.html';
  const eventsHref = 'my-events-v2.html';

  mount.className = 'd1-sidebar';
  mount.innerHTML = `
    <a href="${dashboardHref}" class="d1-logo">Expertly<span class="dot"></span></a>

    <div class="d1-sidebar-tools">
      <button class="d1-search-trigger" id="d1-search-trigger" aria-label="Search articles, events and members" title="Search (Ctrl/Cmd+K)">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <span class="lbl">Search</span>
        <span class="d1-kbd">⌘K</span>
      </button>
      <button class="d1-notif-btn" id="d1-notif-btn" aria-label="Notifications" aria-expanded="false">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>
        <span class="d1-notif-dot" id="d1-notif-dot"></span>
      </button>
      <div class="d1-notif-panel" id="d1-notif-panel">
        <div class="d1-notif-panel-head">
          <span>Notifications</span>
          <button class="d1-notif-mark-read" id="d1-notif-mark-read">Mark all read</button>
        </div>
        <div class="d1-notif-list" id="d1-notif-list"></div>
      </div>
    </div>

    <div class="d1-nav-label">Portal</div>
    <nav class="d1-nav">
      <a href="${dashboardHref}" class="${isActive('dashboard')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="9" rx="1"/><rect x="14" y="3" width="7" height="5" rx="1"/><rect x="14" y="12" width="7" height="9" rx="1"/><rect x="3" y="16" width="7" height="5" rx="1"/></svg>Dashboard</a>
      <a href="${articlesHref}" class="${isActive('articles')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>Articles</a>
      <a href="${eventsHref}" class="${isActive('events')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>Events</a>
      <a href="my-peer-connect-v2.html" class="${isActive('peer')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>Peer Connect</a>
      <a href="my-members-v2.html" class="${isActive('members')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>Browse Members</a>
      <a href="${dashboardHref}#deals-panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41L13.42 20.6a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>Discounts<span class="soon">Soon</span></a>
      <a href="${dashboardHref}#discuss-panel"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>Discussions<span class="soon">Soon</span></a>
    </nav>

    <div class="d1-nav-label">Account</div>
    <nav class="d1-nav">
      <a href="../member-profile.html" class="${isActive('profile')}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>My Profile</a>
      <a href="../membership.html"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>Membership</a>
    </nav>

    <div class="d1-sidebar-foot">
      <div class="d1-user-avatar" data-dash-initial>M</div>
      <div class="d1-user-info">
        <b data-dash-name>Member</b>
        <span data-dash-email>—</span>
      </div>
      <button class="d1-logout-btn" data-dash-logout title="Log out" aria-label="Log out">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><path d="M16 17l5-5-5-5M21 12H9"/></svg>
      </button>
    </div>`;
}

/* ── Shared data binding — every page reads stats/peer-match/etc. from the
   single window.EXPERTLY_DASHBOARD object (assets/dashboard-data.js) instead
   of hardcoding numbers, so values can't drift between pages.
   Usage: <span data-bind="peerMatch.name"></span>, <img data-bind-src="peerMatch.photo">,
   or <span data-bind="peerStats.monthStreak" data-bind-suffix="🔥"></span> */
function dashboardResolvePath(obj, path) {
  return path.split('.').reduce((val, key) => (val == null ? undefined : val[key]), obj);
}

function dashboardBindData() {
  const data = window.EXPERTLY_DASHBOARD;
  if (!data) return;

  document.querySelectorAll('[data-bind]').forEach(el => {
    const value = dashboardResolvePath(data, el.getAttribute('data-bind'));
    if (value === undefined) return;
    const suffix = el.getAttribute('data-bind-suffix') || '';
    el.textContent = value + suffix;
  });

  document.querySelectorAll('[data-bind-src]').forEach(el => {
    const value = dashboardResolvePath(data, el.getAttribute('data-bind-src'));
    if (value === undefined) return;
    el.src = value;
  });

  document.querySelectorAll('[data-bind-alt]').forEach(el => {
    const value = dashboardResolvePath(data, el.getAttribute('data-bind-alt'));
    if (value === undefined) return;
    el.alt = value;
  });
}

/* ── Notifications — bell icon in the sidebar tools row. Reads from
   window.EXPERTLY_DASHBOARD.notifications (assets/dashboard-data.js).
   "Read" state is session-only (resets on reload) — there's no backend
   yet, this is just the UI. ── */
const DASHBOARD_NOTIF_ICONS = {
  peer: '<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>',
  article: '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>',
  event: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  profile: '<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  member: '<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>'
};

function dashboardRenderNotifications() {
  const btn = document.getElementById('d1-notif-btn');
  const panel = document.getElementById('d1-notif-panel');
  const dot = document.getElementById('d1-notif-dot');
  const list = document.getElementById('d1-notif-list');
  const markReadBtn = document.getElementById('d1-notif-mark-read');
  if (!btn || !panel || !list) return;

  const items = (window.EXPERTLY_DASHBOARD && window.EXPERTLY_DASHBOARD.notifications) || [];

  function draw() {
    const unreadCount = items.filter(n => !n.read).length;
    dot.classList.toggle('show', unreadCount > 0);

    list.innerHTML = items.length ? items.map(n => `
      <div class="d1-notif-item${n.read ? '' : ' unread'}">
        <div class="d1-notif-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${DASHBOARD_NOTIF_ICONS[n.icon] || DASHBOARD_NOTIF_ICONS.article}</svg></div>
        <div class="d1-notif-body">
          <b>${n.title}</b>
          <p>${n.body}</p>
          <span class="d1-notif-time">${n.time}</span>
        </div>
      </div>
    `).join('') : '<div class="d1-notif-empty">You\'re all caught up.</div>';
  }

  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const open = panel.classList.toggle('open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && e.target !== btn) {
      panel.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    }
  });
  if (markReadBtn) {
    markReadBtn.addEventListener('click', () => {
      items.forEach(n => n.read = true);
      draw();
    });
  }

  draw();
}

/* ── Portal-wide search (⌘K) — searches Articles/Events/Members from
   window.EXPERTLY_ARTICLES / EXPERTLY_EVENTS / EXPERTLY_MEMBERS
   (assets/members.js). Not the marketing AI-search bar — a plain,
   functional filter over real portal content. ── */
function dashboardInitGlobalSearch() {
  const trigger = document.getElementById('d1-search-trigger');
  if (!trigger || document.getElementById('d1-gsearch-overlay')) return;

  const overlay = document.createElement('div');
  overlay.className = 'd1-gsearch-overlay';
  overlay.id = 'd1-gsearch-overlay';
  overlay.innerHTML = `
    <div class="d1-gsearch-panel" role="dialog" aria-modal="true" aria-label="Search the portal">
      <div class="d1-gsearch-bar">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
        <input type="text" id="d1-gsearch-input" placeholder="Search articles, events, members…">
        <button class="d1-gsearch-esc" id="d1-gsearch-close">Esc</button>
      </div>
      <div class="d1-gsearch-results" id="d1-gsearch-results"></div>
    </div>`;
  document.body.appendChild(overlay);

  const input = document.getElementById('d1-gsearch-input');
  const results = document.getElementById('d1-gsearch-results');
  const closeBtn = document.getElementById('d1-gsearch-close');

  function open() {
    overlay.classList.add('open');
    input.value = '';
    renderResults('');
    setTimeout(() => input.focus(), 30);
  }
  function close() { overlay.classList.remove('open'); }

  function renderResults(query) {
    const q = query.trim().toLowerCase();
    const members = window.EXPERTLY_MEMBERS || [];
    const getAuthor = id => members.find(m => m.id === id);

    if (!q) {
      results.innerHTML = '<div class="d1-gsearch-empty">Start typing to search articles, events and members.</div>';
      return;
    }

    const articles = (window.EXPERTLY_ARTICLES || [])
      .filter(a => a.title.toLowerCase().includes(q) || a.category.toLowerCase().includes(q))
      .slice(0, 5);
    const events = (window.EXPERTLY_EVENTS || [])
      .filter(e => e.title.toLowerCase().includes(q) || e.city.toLowerCase().includes(q) || e.country.toLowerCase().includes(q))
      .slice(0, 5);
    const matchedMembers = members
      .filter(m => m.name.toLowerCase().includes(q) || m.practice.toLowerCase().includes(q) || m.location.toLowerCase().includes(q))
      .slice(0, 5);

    if (!articles.length && !events.length && !matchedMembers.length) {
      results.innerHTML = `<div class="d1-gsearch-empty">No matches for "${query}".</div>`;
      return;
    }

    const articleIcon = '<path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>';
    const eventIcon = '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>';

    let html = '';
    if (articles.length) {
      html += '<div class="d1-gsearch-group-label">Articles</div>';
      html += articles.map(a => `
        <a href="../article.html?id=${a.id}" class="d1-gsearch-item">
          <div class="d1-gsearch-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${articleIcon}</svg></div>
          <div class="d1-gsearch-item-body"><b>${a.title}</b><span>${a.category}</span></div>
        </a>`).join('');
    }
    if (events.length) {
      html += '<div class="d1-gsearch-group-label">Events</div>';
      html += events.map(e => `
        <a href="../events.html#${e.id}" class="d1-gsearch-item">
          <div class="d1-gsearch-item-icon"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${eventIcon}</svg></div>
          <div class="d1-gsearch-item-body"><b>${e.title}</b><span>${e.city}, ${e.country}</span></div>
        </a>`).join('');
    }
    if (matchedMembers.length) {
      html += '<div class="d1-gsearch-group-label">Members</div>';
      html += matchedMembers.map(m => `
        <a href="../member-profile.html?id=${m.id}" class="d1-gsearch-item">
          <div class="d1-gsearch-item-icon">${m.img ? `<img src="${m.img}" alt="${m.name}">` : m.initials}</div>
          <div class="d1-gsearch-item-body"><b>${m.name}</b><span>${m.practice} · ${m.location}</span></div>
        </a>`).join('');
    }
    results.innerHTML = html;
  }

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
  input.addEventListener('input', () => renderResults(input.value));

  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      overlay.classList.contains('open') ? close() : open();
    } else if (e.key === 'Escape' && overlay.classList.contains('open')) {
      close();
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  dashboardRenderSidebar();
  dashboardGuard();
  dashboardBindData();
  dashboardRenderNotifications();
  dashboardInitGlobalSearch();
});
