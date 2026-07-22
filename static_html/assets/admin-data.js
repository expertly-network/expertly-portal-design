/* ══════════════════════════════════════════════════════════════
   Expertly Admin — shared localStorage data layer.
   Prototype-only: everything here lives in the browser's localStorage,
   there is no real server. Data is shared across pages in the SAME
   browser only. Follows the existing `expertly_` key convention and
   try/catch JSON.parse pattern already used in assets/shared.js.
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEYS = {
    ADMIN_SESSION: 'expertly_admin_session',
    APPLICATIONS: 'expertly_membership_applications',
    ARTICLES: 'expertly_my_submissions',
    EVENTS: 'expertly_admin_events'
  };

  function readArray(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  function writeArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function makeId(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  /* ── Membership applications (apply.html + onboarding_form.html feed this) ── */
  function pushApplication(record) {
    var list = readArray(KEYS.APPLICATIONS);
    list.unshift(Object.assign({
      id: makeId('app'),
      status: 'pending',
      submittedAt: new Date().toISOString()
    }, record));
    writeArray(KEYS.APPLICATIONS, list);
    return list;
  }

  function getApplications() {
    return readArray(KEYS.APPLICATIONS);
  }

  function setApplicationStatus(id, status) {
    var list = readArray(KEYS.APPLICATIONS);
    list.forEach(function (a) { if (a.id === id) a.status = status; });
    writeArray(KEYS.APPLICATIONS, list);
    return list;
  }

  /* ── Article submissions (articles.html "Write" flow feeds this) ── */
  function getArticleSubmissions() {
    return readArray(KEYS.ARTICLES);
  }

  function setArticleStatus(index, status) {
    var list = readArray(KEYS.ARTICLES);
    if (list[index]) list[index].status = status;
    writeArray(KEYS.ARTICLES, list);
    return list;
  }

  /* ── Admin-added events (events.html merges these into its display) ── */
  function getAdminEvents() {
    return readArray(KEYS.EVENTS);
  }

  function addAdminEvent(event) {
    var list = readArray(KEYS.EVENTS);
    list.unshift(Object.assign({ id: makeId('evt') }, event));
    writeArray(KEYS.EVENTS, list);
    return list;
  }

  function deleteAdminEvent(id) {
    var list = readArray(KEYS.EVENTS).filter(function (e) { return e.id !== id; });
    writeArray(KEYS.EVENTS, list);
    return list;
  }

  /* ── Admin session (separate from the public expertly_session key) ── */
  function getAdminSession() {
    try { return JSON.parse(localStorage.getItem(KEYS.ADMIN_SESSION)); } catch (e) { return null; }
  }

  function setAdminSession(session) {
    localStorage.setItem(KEYS.ADMIN_SESSION, JSON.stringify(session));
  }

  function clearAdminSession() {
    localStorage.removeItem(KEYS.ADMIN_SESSION);
  }

  global.ExpertlyAdmin = {
    KEYS: KEYS,
    pushApplication: pushApplication,
    getApplications: getApplications,
    setApplicationStatus: setApplicationStatus,
    getArticleSubmissions: getArticleSubmissions,
    setArticleStatus: setArticleStatus,
    getAdminEvents: getAdminEvents,
    addAdminEvent: addAdminEvent,
    deleteAdminEvent: deleteAdminEvent,
    getAdminSession: getAdminSession,
    setAdminSession: setAdminSession,
    clearAdminSession: clearAdminSession
  };
})(window);
