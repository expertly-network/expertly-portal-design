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
    EVENT_SUGGESTIONS: 'expertly_event_suggestions',
    MEMBERS: 'expertly_admin_members',
    HIDDEN_MEMBER_IDS: 'expertly_hidden_member_ids',
    PERKS: 'expertly_perks',
    TEMPLATES: 'expertly_templates',
    LEARNINGS: 'expertly_learnings',
    CONSULTATIONS: 'expertly_my_consultations',
    PROFILE_EDITS: 'expertly_profile_edits',
    PROFILE_OVERRIDES: 'expertly_profile_overrides',
    RENEWAL_POLICY: 'expertly_renewal_policy',
    MEMBERSHIP_DATES: 'expertly_membership_dates',
    EXPERIENCE_FEEDBACK: 'expertly_experience_feedback',
    USERS: 'expertly_users',
    SUBSCRIBERS: 'expertly_subscribers'
  };

  function slugify(s) {
    return String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  function readArray(key) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return Array.isArray(v) ? v : [];
    } catch (e) { return []; }
  }

  function writeArray(key, arr) {
    localStorage.setItem(key, JSON.stringify(arr));
  }

  function readObj(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }

  function writeObj(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
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
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles', 'writeArticles', 'manageEvents', 'deleteContent', 'manageAdmins', 'manageMembers', 'manageConsultations', 'manageResources']
    },
    content_manager: {
      label: 'Content Manager',
      description: 'Moderate power - can write, publish, and delete articles & events, and review applications. Cannot manage admin accounts.',
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles', 'writeArticles', 'manageEvents', 'deleteContent', 'manageMembers', 'manageConsultations', 'manageResources']
    },
    reviewer: {
      label: 'Reviewer',
      description: 'Limited power - can review and approve/reject membership applications and article submissions only. Cannot write, publish, delete, or manage admins.',
      permissions: ['viewDashboard', 'manageApplications', 'manageArticles', 'manageMembers', 'manageConsultations']
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

  function setApplicationStatus(id, status, remark) {
    var list = readArray(KEYS.APPLICATIONS);
    var match = null;
    list.forEach(function (a) {
      if (a.id === id) {
        a.status = status;
        a.remark = remark || '';
        a.remarkAt = new Date().toISOString();
        a.remarkHistory = (a.remarkHistory || []).concat([{ status: status, remark: remark || '', at: a.remarkAt }]);
        match = a;
      }
    });
    writeArray(KEYS.APPLICATIONS, list);
    if (match && status === 'approved' && !match.promotedMemberId) {
      var memberId = promoteApplicationToMember(match);
      list.forEach(function (a) { if (a.id === id) a.promotedMemberId = memberId; });
      writeArray(KEYS.APPLICATIONS, list);
    }
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

  /* ── Members (members.html / member-profile.html read window.EXPERTLY_MEMBERS as
     the static seed; admin-added/promoted members merge on top, static ones can be
     hidden. Same "seed + admin additions - hidden = visible" pattern as events/articles,
     since member ids (slugs) are already stable and meaningful. ── */
  function getAdminMembers() {
    return readArray(KEYS.MEMBERS);
  }

  function addAdminMember(member) {
    var list = getAdminMembers();
    var record = Object.assign({ id: member.id || makeId('mem'), createdAt: new Date().toISOString() }, member);
    list.unshift(record);
    writeArray(KEYS.MEMBERS, list);
    return record;
  }

  function updateAdminMember(id, patch) {
    var list = getAdminMembers();
    list.forEach(function (m) { if (m.id === id) Object.assign(m, patch); });
    writeArray(KEYS.MEMBERS, list);
    return list;
  }

  function deleteAdminMember(id) {
    var list = getAdminMembers().filter(function (m) { return m.id !== id; });
    writeArray(KEYS.MEMBERS, list);
    return list;
  }

  function getHiddenMemberIds() {
    return readArray(KEYS.HIDDEN_MEMBER_IDS);
  }

  function deleteStaticMember(id) {
    var ids = getHiddenMemberIds();
    if (ids.indexOf(id) === -1) ids.push(id);
    writeArray(KEYS.HIDDEN_MEMBER_IDS, ids);
    return ids;
  }

  function restoreStaticMember(id) {
    var ids = getHiddenMemberIds().filter(function (x) { return x !== id; });
    writeArray(KEYS.HIDDEN_MEMBER_IDS, ids);
    return ids;
  }

  /* Combines admin members (added directly or promoted from an approved application)
     + static seed members, minus anything hidden/deactivated. Use instead of
     window.EXPERTLY_MEMBERS directly wherever members are listed or looked up on
     public-facing pages (members.html, member-profile.html, etc). */
  function getAllVisibleMembers() {
    var hidden = getHiddenMemberIds();
    var staticMembers = (global.EXPERTLY_MEMBERS || []).filter(function (m) { return hidden.indexOf(m.id) === -1; });
    return getAdminMembers().filter(function (m) { return m.status !== 'deactivated'; }).concat(staticMembers);
  }

  /* Same as getAllVisibleMembers but includes deactivated members - for the admin
     dashboard's own Members tab, so a deactivated member can still be found and
     reactivated instead of disappearing from admin entirely. */
  function getAllMembersForAdmin() {
    var hidden = getHiddenMemberIds();
    var staticMembers = (global.EXPERTLY_MEMBERS || []).filter(function (m) { return hidden.indexOf(m.id) === -1; });
    return getAdminMembers().concat(staticMembers);
  }

  /* ── Renewal policy ──────────────────────────────────────────
     A single sitewide policy (period + reminder window) applied against
     each member's membership date. Promoted members get their membership
     date set automatically (application approval date); it can also be
     set/edited manually per member for pre-existing/static members. ── */
  var DEFAULT_RENEWAL_POLICY = { periodMonths: 12, reminderDays: 30 };

  function getRenewalPolicy() {
    return Object.assign({}, DEFAULT_RENEWAL_POLICY, readObj(KEYS.RENEWAL_POLICY, {}));
  }

  function setRenewalPolicy(policy) {
    var clean = {
      periodMonths: Math.max(1, parseInt(policy.periodMonths, 10) || DEFAULT_RENEWAL_POLICY.periodMonths),
      reminderDays: Math.max(0, parseInt(policy.reminderDays, 10) || DEFAULT_RENEWAL_POLICY.reminderDays)
    };
    writeObj(KEYS.RENEWAL_POLICY, clean);
    return clean;
  }

  function getMembershipDates() {
    return readObj(KEYS.MEMBERSHIP_DATES, {});
  }

  function getMembershipDate(memberId) {
    return getMembershipDates()[memberId] || null;
  }

  function setMembershipDate(memberId, isoDate) {
    var map = getMembershipDates();
    if (isoDate) map[memberId] = isoDate; else delete map[memberId];
    writeObj(KEYS.MEMBERSHIP_DATES, map);
    return map;
  }

  /* Effective membership date: manual override first, then the date the
     member record was created (e.g. application approval), else null. */
  function getEffectiveMembershipDate(member) {
    return getMembershipDate(member.id) || member.createdAt || null;
  }

  function getRenewalInfo(member) {
    var policy = getRenewalPolicy();
    var startIso = getEffectiveMembershipDate(member);
    if (!startIso) return { state: 'unknown', dueDate: null, daysLeft: null };
    var start = new Date(startIso);
    if (isNaN(start)) return { state: 'unknown', dueDate: null, daysLeft: null };
    var due = new Date(start);
    due.setMonth(due.getMonth() + policy.periodMonths);
    var daysLeft = Math.ceil((due - new Date()) / 86400000);
    var state = daysLeft < 0 ? 'overdue' : daysLeft <= policy.reminderDays ? 'due-soon' : 'active';
    return { state: state, dueDate: due.toISOString(), daysLeft: daysLeft };
  }

  function initialsOf(name) {
    var parts = String(name || '').trim().split(/\s+/).filter(Boolean);
    if (!parts.length) return '?';
    return (parts[0][0] + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }

  /* Turns an approved membership application into a real, listable member record. */
  function promoteApplicationToMember(app) {
    var record = addAdminMember({
      id: slugify(app.name) + '-' + makeId('m'),
      name: app.name,
      initials: initialsOf(app.name),
      title: app.title || 'Member',
      firm: app.firm || 'Independent',
      location: app.location || [app.city, app.country].filter(Boolean).join(', '),
      country: app.country || '',
      practice: app.practiceArea || '',
      verified: true,
      tenure: app.yearsExp ? app.yearsExp + 'y' : '',
      rate: app.rateRange ? '$' + app.rateRange + '/hr' : '',
      img: 'https://ui-avatars.com/api/?background=random&name=' + encodeURIComponent(app.name || '?'),
      status: 'active',
      ownerEmail: app.email || '',
      fromApplicationId: app.id
    });
    return record.id;
  }

  function setMemberStatus(id, status) {
    var list = getAdminMembers();
    var found = list.some(function (m) { return m.id === id; });
    if (found) {
      updateAdminMember(id, { status: status });
    } else {
      // A static seed member being deactivated - promote it into the admin list
      // (as an override) rather than deleting it outright, so it can be reactivated.
      var seedMatch = (global.EXPERTLY_MEMBERS || []).find(function (m) { return m.id === id; });
      if (seedMatch) {
        deleteStaticMember(id);
        addAdminMember(Object.assign({}, seedMatch, { status: status }));
      }
    }
    return getAllVisibleMembers();
  }

  /* ── Profile edit submissions (member self-edits + proof, reviewed by admin) ──
     A member editing their own profile page never writes their change live - it's
     submitted here as a pending record with proof (an uploaded file, stored as a
     data URL for this prototype, and/or an external link). Only once an admin
     approves it does the change get merged into PROFILE_OVERRIDES for that member/
     section, which is what member-profile.html actually renders (base seed data,
     overlaid with any approved override) - so public and self views both only ever
     show manually-verified content. ── */
  function submitProfileEdit(record) {
    var list = readArray(KEYS.PROFILE_EDITS);
    var full = Object.assign({
      id: makeId('pedit'),
      status: 'pending',
      submittedAt: new Date().toISOString()
    }, record);
    list.unshift(full);
    writeArray(KEYS.PROFILE_EDITS, list);
    return full;
  }

  function getProfileEdits() {
    return readArray(KEYS.PROFILE_EDITS);
  }

  function getMemberProfileEdits(memberId) {
    return getProfileEdits().filter(function (e) { return e.memberId === memberId; });
  }

  // Most recent edit per member+section - used to show "pending review" state to the owner.
  function getLatestProfileEdit(memberId, section) {
    var matches = getMemberProfileEdits(memberId).filter(function (e) { return e.section === section; });
    return matches.length ? matches[0] : null;
  }

  function getProfileOverrides(memberId) {
    var all = {};
    try { all = JSON.parse(localStorage.getItem(KEYS.PROFILE_OVERRIDES)) || {}; } catch (e) { all = {}; }
    return all[memberId] || {};
  }

  function setProfileEditStatus(id, status, note) {
    var list = readArray(KEYS.PROFILE_EDITS);
    var match = null;
    list.forEach(function (e) { if (e.id === id) { e.status = status; e.reviewNote = note || ''; e.reviewedAt = new Date().toISOString(); match = e; } });
    writeArray(KEYS.PROFILE_EDITS, list);

    if (match && status === 'verified') {
      var all = {};
      try { all = JSON.parse(localStorage.getItem(KEYS.PROFILE_OVERRIDES)) || {}; } catch (e) { all = {}; }
      all[match.memberId] = all[match.memberId] || {};
      all[match.memberId][match.section] = match.payload;
      localStorage.setItem(KEYS.PROFILE_OVERRIDES, JSON.stringify(all));
    }
    return list;
  }

  function deleteProfileEdit(id) {
    var list = readArray(KEYS.PROFILE_EDITS).filter(function (e) { return e.id !== id; });
    writeArray(KEYS.PROFILE_EDITS, list);
    return list;
  }

  /* ── Perks, Templates, Learnings ──────────────────────────────────
     None of these ship with a persistence layer or stable ids today - they're
     hardcoded display arrays per page. We fully migrate them into admin-owned,
     localStorage-backed lists (seeded once from the same content that used to be
     hardcoded) so every record is uniformly addable/editable/deletable, rather than
     juggling a seed+hidden-id split for data that has no natural unique id. ── */
  var DEFAULT_PERKS = [
    { cat: 'tax', catLabel: 'Tax & Compliance', name: 'ClearFile Tax Suite', initials: 'CF', color: '#0f766e', discount: '20% off annual plan', desc: 'Return filing, GST reconciliation and compliance tracking for tax practices of every size.', link: '' },
    { cat: 'tax', catLabel: 'Tax & Compliance', name: 'ComplyIQ', initials: 'CQ', color: '#1d4ed8', discount: '3 months free', desc: 'Automated regulatory tracking and compliance calendars across jurisdictions.', link: '' },
    { cat: 'tax', catLabel: 'Tax & Compliance', name: 'AuditFlow', initials: 'AF', color: '#7c3aed', discount: '15% off first year', desc: 'Workpaper management and review workflows built for audit teams.', link: '' },
    { cat: 'legal', catLabel: 'Legal Tools', name: 'CaseVault', initials: 'CV', color: '#b91c1c', discount: '25% off annual plan', desc: 'Secure case and matter management with client-facing portals.', link: '' },
    { cat: 'legal', catLabel: 'Legal Tools', name: 'LawDesk Research', initials: 'LD', color: '#0369a1', discount: '2 months free', desc: 'Case law and statute research platform with AI-assisted search.', link: '' },
    { cat: 'legal', catLabel: 'Legal Tools', name: 'ContractPilot', initials: 'CP', color: '#166534', discount: '20% off annual plan', desc: 'Contract lifecycle management - drafting, redlining and e-signature in one place.', link: '' },
    { cat: 'ai', catLabel: 'AI Tools', name: 'DraftGenie AI', initials: 'DG', color: '#9333ea', discount: '30% off Pro plan', desc: 'AI drafting assistant trained on legal and tax document formats.', link: '' },
    { cat: 'ai', catLabel: 'AI Tools', name: 'SummarEase', initials: 'SE', color: '#c2410c', discount: '1 month free', desc: 'Summarise long contracts, judgments and filings in seconds.', link: '' },
    { cat: 'ai', catLabel: 'AI Tools', name: 'InsightIQ Analytics', initials: 'IQ', color: '#0f766e', discount: '20% off annual plan', desc: 'AI-powered financial statement analysis and anomaly detection.', link: '' },
    { cat: 'productivity', catLabel: 'Productivity', name: 'SheetSmart', initials: 'SS', color: '#15803d', discount: '15% off annual plan', desc: 'Excel add-ins for financial modelling, reconciliation and reporting.', link: '' },
    { cat: 'productivity', catLabel: 'Productivity', name: 'PitchDeck Studio', initials: 'PD', color: '#b45309', discount: '25% off annual plan', desc: 'Presentation design tool with ready-made templates for client decks.', link: '' },
    { cat: 'productivity', catLabel: 'Productivity', name: 'FocusFlow', initials: 'FF', color: '#4338ca', discount: '2 months free', desc: 'Time tracking and billing built for professional services firms.', link: '' }
  ];

  var DEFAULT_TEMPLATES = [
    { cat: 'audit', catLabel: 'Audit', title: 'Audit Planning Memorandum', desc: 'Scope, risk assessment and engagement timeline in a standard planning format.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'audit', catLabel: 'Audit', title: 'Internal Controls Checklist', desc: 'Walkthrough checklist covering entity-level and process-level controls.', type: 'xls', format: 'Excel · .xlsx', fileUrl: '' },
    { cat: 'audit', catLabel: 'Audit', title: 'Audit Report - Standard Format', desc: 'A clean, review-ready structure for opinions, findings and management letters.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'audit', catLabel: 'Audit', title: 'Sampling & Materiality Workbook', desc: 'Pre-built formulas for sample size, materiality thresholds and error projection.', type: 'xls', format: 'Excel · .xlsx', fileUrl: '' },
    { cat: 'tax', catLabel: 'Tax', title: 'Tax Due Diligence Checklist', desc: 'A structured checklist for M&A and transaction tax due diligence reviews.', type: 'xls', format: 'Excel · .xlsx', fileUrl: '' },
    { cat: 'tax', catLabel: 'Tax', title: 'GST Reconciliation Workbook', desc: 'Reconcile GSTR filings against books with pre-built variance formulas.', type: 'xls', format: 'Excel · .xlsx', fileUrl: '' },
    { cat: 'tax', catLabel: 'Tax', title: 'Transfer Pricing Documentation Template', desc: 'Local file structure covering functional analysis, benchmarking and conclusions.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'tax', catLabel: 'Tax', title: 'Tax Position Memo', desc: 'A concise format for documenting and defending technical tax positions.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'legal', catLabel: 'Legal', title: 'Engagement Letter Template', desc: 'Standard client engagement letter with scope, fees and liability clauses.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'legal', catLabel: 'Legal', title: 'NDA - Mutual', desc: 'A balanced mutual non-disclosure agreement for early-stage client discussions.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'legal', catLabel: 'Legal', title: 'Board Resolution Template', desc: 'Common board resolution formats for approvals, appointments and authorisations.', type: 'doc', format: 'Word · .docx', fileUrl: '' },
    { cat: 'legal', catLabel: 'Legal', title: 'Client Pitch Deck - Legal Services', desc: 'A ready-to-brand deck structure for pitching legal engagements to new clients.', type: 'ppt', format: 'PowerPoint · .pptx', fileUrl: '' }
  ];

  var DEFAULT_LEARNINGS = [
    { cat: 'ai', catLabel: 'AI', title: 'AI for Tax & Legal Practitioners', desc: 'A practical introduction to using AI tools safely and effectively in client-facing tax and legal work.', level: 'Beginner', duration: '2h 30m', lessons: 8, link: '' },
    { cat: 'ai', catLabel: 'AI', title: 'Prompt Engineering for Client Work', desc: 'Write prompts that produce reliable first drafts of memos, summaries and client communications.', level: 'Intermediate', duration: '1h 45m', lessons: 6, link: '' },
    { cat: 'ai', catLabel: 'AI', title: 'AI Research & Due Diligence Workflows', desc: 'Use AI to accelerate document review and due diligence without compromising accuracy or confidentiality.', level: 'Advanced', duration: '2h 10m', lessons: 7, link: '' },
    { cat: 'excel', catLabel: 'Excel', title: 'Excel for Financial Modelling', desc: 'Build clean, auditable financial models from scratch - structure, formulas and formatting best practice.', level: 'Beginner', duration: '3h 00m', lessons: 10, link: '' },
    { cat: 'excel', catLabel: 'Excel', title: 'Advanced Excel: Macros & Automation', desc: 'Automate repetitive reconciliation and reporting tasks using macros, Power Query and dynamic arrays.', level: 'Advanced', duration: '2h 20m', lessons: 8, link: '' },
    { cat: 'excel', catLabel: 'Excel', title: 'PivotTables for Audit & Tax Analysis', desc: 'Summarise large datasets fast - pivot tables, slicers and dashboards for engagement reporting.', level: 'Intermediate', duration: '1h 30m', lessons: 5, link: '' },
    { cat: 'ppt', catLabel: 'Presentation', title: 'PowerPoint for Client Presentations', desc: 'Design clear, professional decks for board meetings and client pitches - layout, structure and visual hierarchy.', level: 'Beginner', duration: '1h 30m', lessons: 6, link: '' },
    { cat: 'ppt', catLabel: 'Presentation', title: 'Board-Ready Decks: Storytelling with Data', desc: 'Turn dense financial and legal analysis into a narrative your clients and partners will actually remember.', level: 'Intermediate', duration: '2h 00m', lessons: 7, link: '' },
    { cat: 'drafting', catLabel: 'Drafting', title: 'Legal Drafting Fundamentals for Juniors', desc: 'A structured introduction to drafting clear, precise contracts, memos and correspondence.', level: 'Beginner', duration: '2h 15m', lessons: 9, link: '' },
    { cat: 'drafting', catLabel: 'Drafting', title: 'Tax Memo Writing', desc: 'Structure technical tax positions into memos that are defensible, concise and easy for clients to act on.', level: 'Advanced', duration: '1h 30m', lessons: 5, link: '' },
    { cat: 'drafting', catLabel: 'Drafting', title: 'Reviewing & Redlining Contracts', desc: 'A junior-friendly walkthrough of what to flag, what to escalate, and how to redline efficiently.', level: 'Intermediate', duration: '1h 50m', lessons: 6, link: '' }
  ];

  function makeCrudLayer(key, prefix, defaults) {
    function seed() {
      if (readArray(key).length) return;
      writeArray(key, defaults.map(function (d) { return Object.assign({ id: makeId(prefix) }, d); }));
    }
    function getAll() { seed(); return readArray(key); }
    function add(record) {
      var list = getAll();
      var full = Object.assign({ id: makeId(prefix) }, record);
      list.unshift(full);
      writeArray(key, list);
      return full;
    }
    function update(id, patch) {
      var list = getAll();
      list.forEach(function (r) { if (r.id === id) Object.assign(r, patch); });
      writeArray(key, list);
      return list;
    }
    function remove(id) {
      var list = getAll().filter(function (r) { return r.id !== id; });
      writeArray(key, list);
      return list;
    }
    return { getAll: getAll, add: add, update: update, remove: remove };
  }

  var perksLayer = makeCrudLayer(KEYS.PERKS, 'perk', DEFAULT_PERKS);
  var templatesLayer = makeCrudLayer(KEYS.TEMPLATES, 'tpl', DEFAULT_TEMPLATES);
  var learningsLayer = makeCrudLayer(KEYS.LEARNINGS, 'crs', DEFAULT_LEARNINGS);

  /* ── Consultation requests ─────────────────────────────────────────
     Canonical shape (matches what member-profile.html's saveConsultationRequest
     already writes to the shared 'expertly_my_consultations' localStorage key):
     { id, requesterName, requesterEmail, requesterContactEmail, requesterPhone,
       requesterFirm, memberId, memberName, memberFirm, memberAvatar, memberPractice,
       message, sentAt, status: 'pending'|'completed'|'declined' }
     Seeded once from the same mock data that used to be hardoded on
     consultation-requests.html so admin has something to review immediately. ── */
  var DEFAULT_CONSULTATIONS = [
    { requesterName: 'David Whitfield', requesterFirm: 'Whitfield Capital, London', requesterEmail: 'david.whitfield@whitfieldcapital.com', requesterContactEmail: 'david.whitfield@whitfieldcapital.com', requesterPhone: '+44 7700 900123', memberPractice: 'M&A Tax', message: 'Looking for advice on structuring a cross-border M&A deal between a UK acquirer and an Indian target. We need help on a tax-efficient holding structure, withholding tax exposure on the consideration, and how to sequence the post-deal integration.', sentAt: 'Jul 18, 2026', status: 'pending' },
    { requesterName: 'Larissa Kim', requesterFirm: 'Kim & Partners, Seoul', requesterEmail: 'larissa.kim@kimpartners.kr', requesterContactEmail: 'larissa.kim@kimpartners.kr', requesterPhone: '+82 10 2345 6789', memberPractice: 'Indirect Tax', message: 'Reviewing a GST refund claim for exports of services and want a second opinion on the documentation before we file.', sentAt: 'Jul 16, 2026', status: 'pending' },
    { requesterName: 'Marcus Chen', requesterFirm: 'Chen Holdings, Singapore', requesterEmail: 'marcus.chen@chenholdings.sg', requesterContactEmail: 'marcus.chen@chenholdings.sg', requesterPhone: '+65 8123 4567', memberPractice: 'Corporate Law', message: 'Setting up a regional holding structure across Singapore and Hong Kong and need guidance on substance requirements and treaty access.', sentAt: 'Jul 15, 2026', status: 'pending' },
    { requesterName: 'Amelia Ross', requesterFirm: '', requesterEmail: 'amelia.ross@gmail.com', requesterContactEmail: 'amelia.ross@gmail.com', requesterPhone: '+1 212 555 0148', memberPractice: 'IP & Tech', message: 'Reviewing an AI licensing agreement with a US vendor before we sign - want to flag liability and data-training clauses.', sentAt: 'Jul 14, 2026', status: 'pending' },
    { requesterName: 'Rohan Verma', requesterFirm: 'Verma Textiles, Mumbai', requesterEmail: 'rohan.verma@vermatextiles.in', requesterContactEmail: 'rohan.verma@vermatextiles.in', requesterPhone: '+91 98200 12345', memberPractice: 'Direct Tax', message: 'Need a second opinion on a transfer pricing adjustment raised by the department for FY24.', sentAt: 'Jul 12, 2026', status: 'pending' },
    { requesterName: 'Sophie Anderson', requesterFirm: '', requesterEmail: 'sophie.anderson@outlook.com', requesterContactEmail: 'sophie.anderson@outlook.com', requesterPhone: '+1 617 555 0199', memberPractice: 'Capital Markets', message: 'Preparing for a Series C round with a US lead investor and need help structuring the SAFE conversion.', sentAt: 'Jul 11, 2026', status: 'completed' },
    { requesterName: 'James Okafor', requesterFirm: 'Okafor & Co, Lagos', requesterEmail: 'james.okafor@okaforco.ng', requesterContactEmail: 'james.okafor@okaforco.ng', requesterPhone: '+234 802 345 6789', memberPractice: 'M&A', message: 'Due diligence support needed on a pan-African acquisition across four jurisdictions.', sentAt: 'Jul 9, 2026', status: 'pending' },
    { requesterName: 'Fatima Al-Hassan', requesterFirm: '', requesterEmail: 'fatima.alhassan@yahoo.com', requesterContactEmail: 'fatima.alhassan@yahoo.com', requesterPhone: '+971 50 123 4567', memberPractice: 'Compliance', message: 'Building an AML/KYC compliance programme for a new fintech licence and want a gap assessment.', sentAt: 'Jul 8, 2026', status: 'declined' },
    { requesterName: 'Diego Martinez', requesterFirm: 'Martinez Group, Mexico City', requesterEmail: 'diego.martinez@martinezgroup.mx', requesterContactEmail: 'diego.martinez@martinezgroup.mx', requesterPhone: '+52 55 1234 5678', memberPractice: 'Transfer Pricing', message: 'Reassessing our intercompany pricing policy under BEPS 2.0 Pillar Two and need a benchmarking study refresh.', sentAt: 'Jul 6, 2026', status: 'pending' },
    { requesterName: 'Claire Dubois', requesterFirm: '', requesterEmail: 'claire.dubois@gmail.com', requesterContactEmail: 'claire.dubois@gmail.com', requesterPhone: '+33 6 12 34 56 78', memberPractice: 'Antitrust', message: 'Filing a merger notification with the EU competition authority and need help anticipating remedy requirements.', sentAt: 'Jul 3, 2026', status: 'pending' }
  ];

  function seedConsultations() {
    if (readArray(KEYS.CONSULTATIONS).length) return;
    writeArray(KEYS.CONSULTATIONS, DEFAULT_CONSULTATIONS.map(function (c) {
      return Object.assign({ id: makeId('consult') }, c);
    }));
  }

  function getConsultations() {
    seedConsultations();
    return readArray(KEYS.CONSULTATIONS);
  }

  function pushConsultationRequest(record) {
    var list = readArray(KEYS.CONSULTATIONS);
    list.unshift(Object.assign({ id: makeId('consult'), status: 'pending', sentAt: Date.now() }, record));
    writeArray(KEYS.CONSULTATIONS, list);
    return list;
  }

  function setConsultationStatus(id, status) {
    var list = readArray(KEYS.CONSULTATIONS);
    list.forEach(function (c) { if (c.id === id) c.status = status; });
    writeArray(KEYS.CONSULTATIONS, list);
    return list;
  }

  function deleteConsultationRequest(id) {
    var list = readArray(KEYS.CONSULTATIONS).filter(function (c) { return c.id !== id; });
    writeArray(KEYS.CONSULTATIONS, list);
    return list;
  }

  /* ── Homepage "share your experience" dropbox (general feedback or a
     deal-closed success story) - visitor-submitted, reviewable by admins. ── */
  function pushExperienceFeedback(record) {
    var list = readArray(KEYS.EXPERIENCE_FEEDBACK);
    list.unshift(Object.assign({
      id: makeId('fb'),
      submittedAt: new Date().toISOString()
    }, record));
    writeArray(KEYS.EXPERIENCE_FEEDBACK, list);
    return list;
  }

  function getExperienceFeedback() {
    return readArray(KEYS.EXPERIENCE_FEEDBACK);
  }

  /* ── User directory: client/user account signups (login.html "User" tab)
     and newsletter subscribers - separate from the Members (verified
     professionals) list, so the admin dashboard can see everyone who has
     touched the platform, not just applicants. ── */
  function pushUser(record) {
    var list = readArray(KEYS.USERS);
    var email = (record.email || '').trim().toLowerCase();
    var existing = email && list.find(function (u) { return (u.email || '').toLowerCase() === email; });
    if (existing) {
      Object.assign(existing, record, { lastSeenAt: new Date().toISOString() });
    } else {
      list.unshift(Object.assign({
        id: makeId('usr'),
        joinedAt: new Date().toISOString(),
        lastSeenAt: new Date().toISOString()
      }, record));
    }
    writeArray(KEYS.USERS, list);
    return list;
  }

  function getUsers() {
    return readArray(KEYS.USERS);
  }

  function pushSubscriber(email, jurisdiction) {
    email = (email || '').trim().toLowerCase();
    if (!email) return getSubscribers();
    var list = readArray(KEYS.SUBSCRIBERS);
    var regions = (jurisdiction && jurisdiction.regions) || [];
    var countries = (jurisdiction && jurisdiction.countries) || [];
    if (!list.some(function (s) { return s.email === email; })) {
      list.unshift({ id: makeId('sub'), email: email, regions: regions, countries: countries, subscribedAt: new Date().toISOString() });
      writeArray(KEYS.SUBSCRIBERS, list);
    }
    return list;
  }

  function getSubscribers() {
    return readArray(KEYS.SUBSCRIBERS);
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
    clearAdminSession: clearAdminSession,

    getAdminMembers: getAdminMembers,
    addAdminMember: addAdminMember,
    updateAdminMember: updateAdminMember,
    deleteAdminMember: deleteAdminMember,
    getHiddenMemberIds: getHiddenMemberIds,
    deleteStaticMember: deleteStaticMember,
    restoreStaticMember: restoreStaticMember,
    getAllVisibleMembers: getAllVisibleMembers,
    getAllMembersForAdmin: getAllMembersForAdmin,
    setMemberStatus: setMemberStatus,
    promoteApplicationToMember: promoteApplicationToMember,

    getRenewalPolicy: getRenewalPolicy,
    setRenewalPolicy: setRenewalPolicy,
    getMembershipDate: getMembershipDate,
    setMembershipDate: setMembershipDate,
    getEffectiveMembershipDate: getEffectiveMembershipDate,
    getRenewalInfo: getRenewalInfo,

    submitProfileEdit: submitProfileEdit,
    getProfileEdits: getProfileEdits,
    getMemberProfileEdits: getMemberProfileEdits,
    getLatestProfileEdit: getLatestProfileEdit,
    getProfileOverrides: getProfileOverrides,
    setProfileEditStatus: setProfileEditStatus,
    deleteProfileEdit: deleteProfileEdit,

    getPerks: perksLayer.getAll,
    addPerk: perksLayer.add,
    updatePerk: perksLayer.update,
    deletePerk: perksLayer.remove,

    getTemplates: templatesLayer.getAll,
    addTemplate: templatesLayer.add,
    updateTemplate: templatesLayer.update,
    deleteTemplate: templatesLayer.remove,

    getLearnings: learningsLayer.getAll,
    addLearning: learningsLayer.add,
    updateLearning: learningsLayer.update,
    deleteLearning: learningsLayer.remove,

    getConsultations: getConsultations,
    pushConsultationRequest: pushConsultationRequest,
    setConsultationStatus: setConsultationStatus,
    deleteConsultationRequest: deleteConsultationRequest,

    pushExperienceFeedback: pushExperienceFeedback,
    getExperienceFeedback: getExperienceFeedback,

    pushUser: pushUser,
    getUsers: getUsers,
    pushSubscriber: pushSubscriber,
    getSubscribers: getSubscribers
  };
})(window);
