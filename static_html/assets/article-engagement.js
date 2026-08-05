/* ══════════════════════════════════════════════════════════════
   Expertly - article engagement (views, likes, comments)
   Prototype-only: everything lives in this browser's localStorage,
   mirroring the same demo-data pattern used across the rest of the
   site (see assets/shared.js, assets/admin-data.js).
   ══════════════════════════════════════════════════════════════ */
(function (global) {
  'use strict';

  var KEYS = {
    VIEWS: 'expertly_article_views',
    LIKES: 'expertly_article_likes',
    LIKED_BY_ME: 'expertly_article_liked_by_me',
    COMMENTS: 'expertly_article_comments'
  };

  function readObj(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      return v && typeof v === 'object' ? v : fallback;
    } catch (e) { return fallback; }
  }
  function writeObj(key, obj) {
    localStorage.setItem(key, JSON.stringify(obj));
  }
  function makeId() {
    return 'cmt_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 7);
  }

  var VIEWED_THIS_SESSION_KEY = 'expertly_article_viewed_session';

  function recordView(articleId) {
    if (!articleId) return 0;
    var sessionSeen = readObj(VIEWED_THIS_SESSION_KEY, {});
    var views = readObj(KEYS.VIEWS, {});
    if (!sessionSeen[articleId]) {
      views[articleId] = (views[articleId] || 0) + 1;
      writeObj(KEYS.VIEWS, views);
      sessionSeen[articleId] = true;
      writeObj(VIEWED_THIS_SESSION_KEY, sessionSeen);
    }
    return views[articleId] || 0;
  }

  function getViews(articleId) {
    return readObj(KEYS.VIEWS, {})[articleId] || 0;
  }

  function isLiked(articleId) {
    return !!readObj(KEYS.LIKED_BY_ME, {})[articleId];
  }

  function getLikes(articleId) {
    return readObj(KEYS.LIKES, {})[articleId] || 0;
  }

  function toggleLike(articleId) {
    var likedMap = readObj(KEYS.LIKED_BY_ME, {});
    var likes = readObj(KEYS.LIKES, {});
    var nowLiked = !likedMap[articleId];
    likedMap[articleId] = nowLiked;
    likes[articleId] = Math.max(0, (likes[articleId] || 0) + (nowLiked ? 1 : -1));
    writeObj(KEYS.LIKED_BY_ME, likedMap);
    writeObj(KEYS.LIKES, likes);
    return { liked: nowLiked, count: likes[articleId] };
  }

  function getComments(articleId) {
    var all = readObj(KEYS.COMMENTS, {});
    return all[articleId] || [];
  }

  function addComment(articleId, comment) {
    var all = readObj(KEYS.COMMENTS, {});
    var list = all[articleId] || [];
    var record = {
      id: makeId(),
      name: (comment.name || 'Anonymous').trim() || 'Anonymous',
      text: (comment.text || '').trim(),
      at: new Date().toISOString()
    };
    list.push(record);
    all[articleId] = list;
    writeObj(KEYS.COMMENTS, all);
    return record;
  }

  function getCounts(articleId) {
    return {
      views: getViews(articleId),
      likes: getLikes(articleId),
      comments: getComments(articleId).length
    };
  }

  global.ExpertlyEngagement = {
    recordView: recordView,
    getViews: getViews,
    isLiked: isLiked,
    getLikes: getLikes,
    toggleLike: toggleLike,
    getComments: getComments,
    addComment: addComment,
    getCounts: getCounts
  };
})(window);
