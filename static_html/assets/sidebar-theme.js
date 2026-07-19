/* ══════════════════════════════════════════════════════════════
   Sidebar theme toggle — dark ↔ light
   + Auth-aware sidebar footer (reads expertly_session)
   Default: dark. Persists to localStorage under 'expertly_sidebar_theme'.
   Include after dashboard-shell.css + sidebar-light.css.
   ══════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  var THEME_KEY = 'expertly_sidebar_theme';

  var DARK_ICON  = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/><path d="M12 3a9 9 0 000 18z" fill="currentColor"/></svg>';
  var LIGHT_ICON = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 000 18" fill="currentColor" stroke="none"/></svg>';
  var LOGOUT_SVG = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>';
  var LOGIN_SVG  = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>';

  /* ── Theme toggle ───────────────────────────────────────────── */

  function getTheme() {
    return localStorage.getItem(THEME_KEY) || 'dark';
  }

  function applyTheme(theme) {
    document.documentElement.classList.toggle('sidebar-light', theme === 'light');
    localStorage.setItem(THEME_KEY, theme);
    updateThemeButtons(theme);
  }

  function updateThemeButtons(theme) {
    document.querySelectorAll('.d1-theme-btn').forEach(function (btn) {
      btn.innerHTML = theme === 'dark' ? DARK_ICON : LIGHT_ICON;
      btn.title = theme === 'dark' ? 'Switch to light sidebar' : 'Switch to dark sidebar';
      btn.setAttribute('aria-label', btn.title);
    });
  }

  function handleToggle() {
    applyTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  /* ── Auth-aware sidebar footer ──────────────────────────────── */

  function getSession() {
    try { return JSON.parse(localStorage.getItem('expertly_session')) || null; } catch (e) { return null; }
  }

  function logout() {
    localStorage.removeItem('expertly_session');
    window.location.reload();
  }

  function wireLogout(el) {
    if (el && !el.dataset.authWired) {
      el.dataset.authWired = '1';
      el.addEventListener('click', function (e) { e.preventDefault(); logout(); });
    }
  }

  /* Standard footer: d1-user-avatar / d1-user-info / d1-logout-btn
     Used by articles, events, members, membership, dashboard, peer-connect */
  function initStandardFooter(session) {
    var foot = document.querySelector('.d1-sidebar-foot .d1-user-avatar');
    if (!foot) return;
    var footEl   = foot.closest('.d1-sidebar-foot');
    var avatarEl = footEl.querySelector('.d1-user-avatar');
    var infoEl   = footEl.querySelector('.d1-user-info');
    var actionEl = footEl.querySelector('.d1-logout-btn');

    if (session && session.email) {
      if (avatarEl) avatarEl.textContent = session.email.charAt(0).toUpperCase();
      if (infoEl) {
        var b = infoEl.querySelector('b');
        var s = infoEl.querySelector('span');
        if (b) b.textContent = session.role === 'member' ? 'Member' : 'User';
        if (s) s.textContent = session.email;
      }
      if (actionEl) {
        actionEl.removeAttribute('href');
        actionEl.innerHTML = LOGOUT_SVG;
        actionEl.title = 'Log out';
        actionEl.setAttribute('aria-label', 'Log out');
        actionEl.style.cursor = 'pointer';
        wireLogout(actionEl);
      }
    } else {
      if (avatarEl) avatarEl.textContent = '?';
      if (infoEl) {
        var b = infoEl.querySelector('b');
        var s = infoEl.querySelector('span');
        if (b) b.textContent = 'Guest';
        if (s) s.textContent = 'Not signed in';
      }
      if (actionEl) {
        actionEl.href = 'login.html';
        actionEl.title = 'Sign in';
        actionEl.setAttribute('aria-label', 'Sign in');
        actionEl.innerHTML = LOGIN_SVG;
        actionEl.style.cursor = '';
      }
    }
  }

  /* Home/marketing sidebar footer: sb-cta-group (Apply Now + Sign In)
     Used by index.html */
  function initHomepageFooter(session) {
    var ctaGroup = document.querySelector('.sb-cta-group');
    if (!ctaGroup) return;

    var primaryBtn = ctaGroup.querySelector('.sb-btn-primary');
    var ghostBtn   = ctaGroup.querySelector('.sb-btn-ghost');
    var signInIcon = document.querySelector('.sb-signin-icon');

    if (session && session.email) {
      var initial = session.email.charAt(0).toUpperCase();

      if (primaryBtn) {
        primaryBtn.href        = 'dashboard.html';
        primaryBtn.textContent = 'My Dashboard';
      }
      if (ghostBtn) {
        ghostBtn.removeAttribute('href');
        ghostBtn.textContent  = 'Log out (' + initial + ')';
        ghostBtn.style.cursor = 'pointer';
        wireLogout(ghostBtn);
      }
      if (signInIcon) {
        signInIcon.removeAttribute('href');
        signInIcon.title = session.email;
        signInIcon.setAttribute('aria-label', session.email);
        signInIcon.innerHTML = '<span style="font-size:13px;font-weight:700;">' + initial + '</span>';
        signInIcon.style.cursor = 'default';
      }
    }
    /* Not logged in: keep Apply Now + Sign In as-is */
  }

  /* ── Boot ───────────────────────────────────────────────────── */

  /* ── Auth-aware nav items ───────────────────────────────────── */

  function initNavAuth(session) {
    if (session && session.role === 'member') {
      document.body.classList.add('session-member');
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.d1-theme-btn').forEach(function (btn) {
      btn.addEventListener('click', handleToggle);
    });
    updateThemeButtons(getTheme());

    var session = getSession();
    initStandardFooter(session);
    initHomepageFooter(session);
    initNavAuth(session);
  });
})();
