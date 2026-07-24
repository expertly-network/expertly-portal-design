/* ══════════════════════════════════════════════════════════════
   Expertly Admin - shared localStorage data layer.
   Prototype-only: everything here lives in the browser's localStorage,
   there is no real server and no real password hashing - this mirrors
   the same demo-auth pattern already used across the rest of the site
   (see assets/shared.js). Data is shared across pages in the SAME
   browser only.
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEYS = {
    ADMIN_SESSION: 'expertly_admin_session',
    ADMIN_USERS: 'expertly_admin_users',
    APPLICATIONS: 'expertly_membership_applications',
    ARTICLES: 'expertly_my_submissions',
    ADMIN_ARTICLES: 'expertly_admin_articles',
    DELETED_ARTICLE_IDS: 'expertly_deleted_article_ids',
    EVENTS: 'expertly_admin_events',
    HIDDEN_EVENT_IDS: 'expertly_hidden_event_ids',
    EVENT_SUGGESTIONS: 'expertly_event_suggestions'
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

  /* ══════════════════════════════════════════════════════════════
     Roles & permissions
     Three power tiers, as requested: one with every power, one with
     moderate power, one with limited power. Permission keys are
     checked individually so the UI can hide/disable anything a given
     role can't do.
     ══════════════════════════════════════════════════════════════ */
  var ROLES = {
    super_admin: {
      label: 'Super Admin',
      description: 'Full control - every permission, including managing other admin accounts.',
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles', 'writeArticles', 'manageEvents', 'deleteContent', 'manageAdmins']
    },
    content_manager: {
      label: 'Content Manager',
      description: 'Moderate power - can write, publish, and delete articles & events, and review applications. Cannot manage admin accounts.',
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles', 'writeArticles', 'manageEvents', 'deleteContent']
    },
    reviewer: {
      label: 'Reviewer',
      description: 'Limited power - can review and approve/reject membership applications and article submissions only. Cannot write, publish, delete, or manage admins.',
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles']
    }
  };

  function hasPermission(session, perm) {
    if (!session || !session.role) return false;
    var role = ROLES[session.role];
    if (!role) return false;
    return role.permissions.indexOf(perm) !== -1;
  }

  function getRoleLabel(roleKey) {
    return (ROLES[roleKey] && ROLES[roleKey].label) || roleKey;
  }

  /* ── Admin users (multiple credentials, seeded on first run) ── */
  function seedAdminUsers() {
    if (readArray(KEYS.ADMIN_USERS).length) return;
    writeArray(KEYS.ADMIN_USERS, [
      {
        id: makeId('adu'), name: 'Ava Sundaram', email: 'admin@expertly.com', password: 'Expertly@Admin2026',
        role: 'super_admin', createdAt: new Date().toISOString()
      },
      {
        id: makeId('adu'), name: 'Marcus Lee', email: 'content@expertly.com', password: 'Expertly@Content2026',
        role: 'content_manager', createdAt: new Date().toISOString()
      },
      {
        id: makeId('adu'), name: 'Nina Torres', email: 'reviewer@expertly.com', password: 'Expertly@Review2026',
        role: 'reviewer', createdAt: new Date().toISOString()
      }
    ]);
  }

  function getAdminUsers() {
    seedAdminUsers();
    return readArray(KEYS.ADMIN_USERS);
  }

  function addAdminUser(user) {
    var list = getAdminUsers();
    list.push(Object.assign({ id: makeId('adu'), createdAt: new Date().toISOString() }, user));
    writeArray(KEYS.ADMIN_USERS, list);
    return list;
  }

  function updateAdminUser(id, patch) {
    var list = getAdminUsers();
    list.forEach(function (u) { if (u.id === id) Object.assign(u, patch); });
    writeArray(KEYS.ADMIN_USERS, list);
    return list;
  }

  function deleteAdminUser(id) {
    var list = getAdminUsers().filter(function (u) { return u.id !== id; });
    writeArray(KEYS.ADMIN_USERS, list);
    return list;
  }

  function countSuperAdmins(excludingId) {
    return getAdminUsers().filter(function (u) { return u.role === 'super_admin' && u.id !== excludingId; }).length;
  }

  function authenticate(email, password) {
    email = (email || '').trim().toLowerCase();
    var match = getAdminUsers().find(function (u) { return u.email.toLowerCase() === email && u.password === password; });
    return match || null;
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

  function deleteArticleSubmission(index) {
    var list = readArray(KEYS.ARTICLES);
    list.splice(index, 1);
    writeArray(KEYS.ARTICLES, list);
    return list;
  }

  /* ── Admin-authored articles (written directly in the admin dashboard,
     published immediately - no review queue since an admin wrote it) ── */
  function getAdminArticles() {
    return readArray(KEYS.ADMIN_ARTICLES);
  }

  function addAdminArticle(article) {
    var list = getAdminArticles();
    list.unshift(Object.assign({ id: makeId('adart'), author: 'expertly-editorial' }, article));
    writeArray(KEYS.ADMIN_ARTICLES, list);
    return list;
  }

  function deleteAdminArticle(id) {
    var list = getAdminArticles().filter(function (a) { return a.id !== id; });
    writeArray(KEYS.ADMIN_ARTICLES, list);
    return list;
  }

  /* ── Deleting/restoring articles that ship with the static site data ── */
  function getDeletedArticleIds() {
    return readArray(KEYS.DELETED_ARTICLE_IDS);
  }

  function deleteArticleById(id) {
    var ids = getDeletedArticleIds();
    if (ids.indexOf(id) === -1) ids.push(id);
    writeArray(KEYS.DELETED_ARTICLE_IDS, ids);
    // Also remove it outright if it's an admin-authored article, rather than just hiding it.
    deleteAdminArticle(id);
    return ids;
  }

  function restoreArticleById(id) {
    var ids = getDeletedArticleIds().filter(function (x) { return x !== id; });
    writeArray(KEYS.DELETED_ARTICLE_IDS, ids);
    return ids;
  }

  /* Combines static seed articles + admin-authored articles, minus anything deleted.
     Use this instead of window.EXPERTLY_ARTICLES directly wherever articles are listed
     or looked up, so admin deletions are respected everywhere. */
  function getAllVisibleArticles() {
    var deleted = getDeletedArticleIds();
    var pool = getAdminArticles().concat(global.EXPERTLY_ARTICLES || []);
    return pool.filter(function (a) { return deleted.indexOf(a.id) === -1; });
  }

  /* ── Admin-added events (events.html merges these into its display) ── */
  function getAdminEvents() {
    return readArray(KEYS.EVENTS);
  }

  function addAdminEvent(event) {
    var list = getAdminEvents();
    list.unshift(Object.assign({ id: makeId('evt') }, event));
    writeArray(KEYS.EVENTS, list);
    return list;
  }

  function deleteAdminEvent(id) {
    var list = getAdminEvents().filter(function (e) { return e.id !== id; });
    writeArray(KEYS.EVENTS, list);
    return list;
  }

  /* ── Event suggestions (public "Suggest an event" form on events.html) ──
     Anyone - member or event organizer - can submit one. It sits in a
     review queue until an admin approves it, at which point it's published
     as a real admin event onto the public calendar. ── */
  function pushEventSuggestion(record) {
    var list = readArray(KEYS.EVENT_SUGGESTIONS);
    list.unshift(Object.assign({
      id: makeId('evsug'),
      status: 'pending',
      submittedAt: new Date().toISOString()
    }, record));
    writeArray(KEYS.EVENT_SUGGESTIONS, list);
    return list;
  }

  function getEventSuggestions() {
    return readArray(KEYS.EVENT_SUGGESTIONS);
  }

  function setEventSuggestionStatus(id, status) {
    var list = readArray(KEYS.EVENT_SUGGESTIONS);
    var match = list.find(function (s) { return s.id === id; });
    if (match) {
      match.status = status;
      if (status === 'approved') {
        addAdminEvent({
          title: match.title, desc: match.desc, org: match.org,
          start: match.start, end: match.end || null,
          city: match.city, country: match.country,
          format: match.format, category: match.category,
          website: match.website
        });
      }
    }
    writeArray(KEYS.EVENT_SUGGESTIONS, list);
    return list;
  }

  function deleteEventSuggestion(id) {
    var list = readArray(KEYS.EVENT_SUGGESTIONS).filter(function (s) { return s.id !== id; });
    writeArray(KEYS.EVENT_SUGGESTIONS, list);
    return list;
  }

  /* ── Deleting/restoring events that ship with the static site data ── */
  function getHiddenEventIds() {
    return readArray(KEYS.HIDDEN_EVENT_IDS);
  }

  function deleteStaticEvent(id) {
    var ids = getHiddenEventIds();
    if (ids.indexOf(id) === -1) ids.push(id);
    writeArray(KEYS.HIDDEN_EVENT_IDS, ids);
    return ids;
  }

  function restoreStaticEvent(id) {
    var ids = getHiddenEventIds().filter(function (x) { return x !== id; });
    writeArray(KEYS.HIDDEN_EVENT_IDS, ids);
    return ids;
  }

  /* Combines admin-added events + static seed events, minus anything hidden.
     Use this instead of window.EXPERTLY_EVENTS directly wherever events are listed. */
  function getAllVisibleEvents() {
    var hidden = getHiddenEventIds();
    var staticEvents = (global.EXPERTLY_EVENTS || []).filter(function (e) { return hidden.indexOf(e.id) === -1; });
    return getAdminEvents().concat(staticEvents);
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
    ROLES: ROLES,
    hasPermission: hasPermission,
    getRoleLabel: getRoleLabel,

    getAdminUsers: getAdminUsers,
    addAdminUser: addAdminUser,
    updateAdminUser: updateAdminUser,
    deleteAdminUser: deleteAdminUser,
    countSuperAdmins: countSuperAdmins,
    authenticate: authenticate,

    pushApplication: pushApplication,
    getApplications: getApplications,
    setApplicationStatus: setApplicationStatus,

    getArticleSubmissions: getArticleSubmissions,
    setArticleStatus: setArticleStatus,
    deleteArticleSubmission: deleteArticleSubmission,

    getAdminArticles: getAdminArticles,
    addAdminArticle: addAdminArticle,
    deleteAdminArticle: deleteAdminArticle,
    getDeletedArticleIds: getDeletedArticleIds,
    deleteArticleById: deleteArticleById,
    restoreArticleById: restoreArticleById,
    getAllVisibleArticles: getAllVisibleArticles,

    getAdminEvents: getAdminEvents,
    addAdminEvent: addAdminEvent,
    deleteAdminEvent: deleteAdminEvent,
    pushEventSuggestion: pushEventSuggestion,
    getEventSuggestions: getEventSuggestions,
    setEventSuggestionStatus: setEventSuggestionStatus,
    deleteEventSuggestion: deleteEventSuggestion,
    getHiddenEventIds: getHiddenEventIds,
    deleteStaticEvent: deleteStaticEvent,
    restoreStaticEvent: restoreStaticEvent,
    getAllVisibleEvents: getAllVisibleEvents,

    getAdminSession: getAdminSession,
    setAdminSession: setAdminSession,
    clearAdminSession: clearAdminSession
  };
})(window);
