/* ══════════════════════════════════════════════════════════════
   Dashboard layout variations — shared mock data + render helpers
   Depends on window.EXPERTLY_MEMBERS / EXPERTLY_ARTICLES / EXPERTLY_EVENTS
   (assets/members.js) being loaded first. Everything here is namespaced
   under window.MV so each dashboard-alt-N.html can pick and choose.
   ══════════════════════════════════════════════════════════════ */
(function () {
  const ME_ID = 'amara-osei';

  const MEMBERSHIP = {
    tier: 'Founding Member',
    startDate: 'Sep 18, 2024',
    renewalDate: 'Sep 18, 2026',
    daysLeft: 48,
    pct: 93
  };

  const CONTRIBUTIONS = [
    { label: 'Peer Connects', num: '12', pct: 80 },
    { label: 'Articles', num: '3/4', pct: 75 },
    { label: 'Reach', num: '8.4k', pct: 68 },
    { label: 'Referrals', num: '5', pct: 62 }
  ];

  // Upcoming meetings — mapped onto the "today" the app context reports (Aug 1, 2026)
  const CAL_YEAR = 2026, CAL_MONTH = 7; // August (0-indexed)
  const SCHEDULE = [
    { day: 6, month: 'Aug', time: '11:00', title: 'Cross-border M&A intro call', subtitle: 'w/ David Whitfield', href: 'consultation-requests.html', alt: false },
    { day: 14, month: 'Aug', time: '15:30', title: 'Peer Connect sync', subtitle: 'w/ Ananya Krishnamurthy', href: 'peer-connect.html', alt: true },
    { day: 21, month: 'Aug', time: '10:00', title: 'GST refund consultation', subtitle: 'w/ Larissa Kim', href: 'consultation-requests.html', alt: false }
  ];

  const REMINDERS = [
    { title: 'Membership renews in 48 days', sub: 'Sep 18, 2026', href: 'membership.html', icon: 'card' },
    { title: 'Peer Connect match expires soon', sub: 'Respond within 5 days', href: 'peer-connect.html', icon: 'users' },
    { title: '1 article still in draft', sub: 'Finish "Transfer Pricing Update"', href: 'articles.html', icon: 'doc' }
  ];

  const CONSULTATIONS = [
    { name: 'David Whitfield', type: 'member', avatar: 'https://randomuser.me/api/portraits/men/11.jpg', work: 'Looking for advice on structuring a cross-border M&A deal between a UK acquirer and an Indian target - need help on tax-efficient holding structure, withholding tax exposure, and post-deal integration.', email: 'david.whitfield@whitfieldcapital.com', phone: '+44 7700 900123', received: 'Jul 18, 2026', status: 'pending' },
    { name: 'Larissa Kim', type: 'user', work: 'Reviewing a GST refund claim for exports of services - want a second opinion on the documentation before we file, and guidance on likely turnaround time with the department.', email: 'larissa.kim@gmail.com', phone: '+82 10 2345 6789', received: 'Jul 16, 2026', status: 'pending' },
    { name: 'Kenji Tanaka', type: 'member', avatar: 'https://randomuser.me/api/portraits/men/54.jpg', work: 'Advising on a joint venture structure between a Japanese manufacturer and a Vietnamese distributor - need input on FDI approval timelines and profit repatriation rules.', email: 'kenji.tanaka@tanakalegal.jp', phone: '+81 90 1234 5678', received: 'Jul 14, 2026', status: 'completed' }
  ];
  const STATUS_LABEL = { pending: 'Pending', completed: 'Completed' };

  const TASKS = [
    {
      tone: 'dark', priority: 'high', title: 'Reply to consultation request',
      desc: 'David Whitfield is waiting on your read of a cross-border M&A holding structure - due within 48 hours to keep your response-rate badge.',
      due: 'Due 3 Aug 2026', href: 'consultation-requests.html',
      avatars: ['https://randomuser.me/api/portraits/men/11.jpg']
    },
    {
      tone: 'tint', priority: 'low', title: 'Finish draft: Transfer Pricing Update',
      desc: 'Your BEPS 2.0 draft is 70% complete. Publishing keeps your monthly article streak on track.',
      due: 'Due 8 Aug 2026', href: 'articles.html',
      avatars: ['https://randomuser.me/api/portraits/women/65.jpg', 'https://randomuser.me/api/portraits/men/32.jpg']
    }
  ];

  const TIMELINE = [
    { date: 'Today', items: [
      { icon: 'msg', title: 'New consultation request from David Whitfield', meta: 'Cross-border M&A · 2 hours ago', tag: 'Request', href: 'consultation-requests.html' },
      { icon: 'users', title: 'Peer Connect matched you with Ananya Krishnamurthy', meta: 'M&A Tax · APAC · 5 hours ago', tag: 'Match', href: 'peer-connect.html' }
    ]},
    { date: 'Yesterday', items: [
      { icon: 'doc', title: 'You published "Navigating Stamp Duty on Mergers"', meta: '3 min read · Direct Tax', tag: 'Article', href: 'article.html?id=stamp-duty-mergers' },
      { icon: 'gift', title: 'You referred Fatima Al-Hassan to a new client', meta: 'Referral tracked · Compliance', tag: 'Referral', href: 'members.html?id=fatima-al-hassan' }
    ]},
    { date: 'Jul 28, 2026', items: [
      { icon: 'msg', title: 'Consultation with Larissa Kim marked completed', meta: 'GST refund review', tag: 'Consultation', href: 'consultation-requests.html' },
      { icon: 'cal', title: 'Attended IPT 2026 Sales Tax School II', meta: 'Atlanta, GA · In person', tag: 'Event', href: 'events.html' }
    ]}
  ];

  const ICONS = {
    card: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>',
    users: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/></svg>',
    msg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>',
    gift: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.59 13.41L13.42 20.6a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><circle cx="7" cy="7" r="1.5"/></svg>',
    cal: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
    bell: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 01-3.46 0"/></svg>',
    edit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z"/></svg>',
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>',
    chevL: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>',
    chevR: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    eye: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',
    flip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2v6h-6M3 22v-6h6"/><path d="M3 8a9 9 0 0114.65-4.65L21 8M21 16a9 9 0 01-14.65 4.65L3 16"/></svg>'
  };

  function esc(s) { return String(s == null ? '' : s); }

  function getMembers() { return window.EXPERTLY_MEMBERS || []; }
  function getArticles() { return window.EXPERTLY_ARTICLES || []; }
  function getMe() { return getMembers().find(m => m.id === ME_ID) || getMembers()[0] || {}; }

  /* ── Profile card ─────────────────────────────────────────── */
  function profileCardHTML() {
    const me = getMe();
    return `
      <div class="mv-profile-label">Profile</div>
      <a href="member-profile.html?id=${me.id}" class="mv-profile-edit" title="Edit profile" aria-label="Edit profile">${ICONS.edit}</a>
      <div class="mv-profile-avatar"><img src="${me.img || ''}" alt="${esc(me.name)}"></div>
      <div class="mv-profile-name">${esc(me.name)}${me.verified ? '<span class="db-people-verified-circle" style="width:15px;height:15px;"><svg viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\"><path d=\"M5 12l5 5L20 7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg></span>' : ''}</div>
      <div class="mv-profile-email">${esc(me.title)}${me.firm ? ' · ' + esc(me.firm) : ''}</div>
      <div class="mv-profile-role">${esc(me.location)}</div>`;
  }

  /* ── Membership card ──────────────────────────────────────── */
  function membershipCardHTML(m) {
    m = m || MEMBERSHIP;
    return `
      <div class="mv-membership-head">
        <div class="mv-membership-title">Membership</div>
        <span class="mv-membership-tier">${esc(m.tier)}</span>
      </div>
      <div class="mv-membership-dates">
        <div><span class="lbl">Start date</span><span class="val">${esc(m.startDate)}</span></div>
        <div><span class="lbl">Renewal date</span><span class="val">${esc(m.renewalDate)}</span></div>
      </div>
      <div class="mv-membership-bar"><div class="mv-membership-bar-fill" style="width:${m.pct}%"></div></div>
      <div class="mv-membership-note"><span>Current cycle</span><strong>${m.daysLeft} days left</strong></div>`;
  }

  /* ── Contribution rings ───────────────────────────────────── */
  function contribRingSVG(pct) {
    const CIRC = 131.9;
    const offset = (CIRC * (1 - Math.max(0, Math.min(1, pct / 100)))).toFixed(1);
    return `<svg viewBox="0 0 60 60"><circle class="track" cx="30" cy="30" r="21"/><circle class="prog" cx="30" cy="30" r="21" stroke-dashoffset="${offset}"/></svg>`;
  }
  function contribRowHTML(stats) {
    stats = stats || CONTRIBUTIONS;
    return stats.map(s => `
      <div class="mv-contrib-item">
        <div class="mv-contrib-ring">${contribRingSVG(s.pct)}<div class="mv-contrib-ring-num">${s.num}</div></div>
        <div class="mv-contrib-label">${esc(s.label)}</div>
      </div>`).join('');
  }

  /* ── Mini calendar ─────────────────────────────────────────── */
  const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const DOW = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  function calendarHTML(year, month, eventDays, todayDay, linkHref) {
    eventDays = eventDays || [];
    const first = new Date(year, month, 1);
    const startOffset = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const daysInPrev = new Date(year, month, 0).getDate();
    let cells = '';
    for (let i = 0; i < startOffset; i++) {
      cells += `<div class="mv-cal-day muted">${daysInPrev - startOffset + i + 1}</div>`;
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const isToday = d === todayDay;
      const isEvent = eventDays.includes(d);
      const cls = ['mv-cal-day'];
      if (isToday) cls.push('today');
      if (isEvent) cls.push('event');
      const tag = isEvent ? 'a' : 'div';
      const hrefAttr = isEvent ? ` href="${linkHref || 'my-consultations.html'}"` : '';
      cells += `<${tag} class="${cls.join(' ')}"${hrefAttr}>${d}</${tag}>`;
    }
    const totalSoFar = startOffset + daysInMonth;
    const trailing = (7 - (totalSoFar % 7)) % 7;
    for (let d = 1; d <= trailing; d++) {
      cells += `<div class="mv-cal-day muted">${d}</div>`;
    }
    return {
      head: `
        <div class="mv-cal-month">${MONTH_NAMES[month]} ${year}</div>
        <div class="mv-cal-nav">
          <button type="button" aria-label="Previous month">${ICONS.chevL}</button>
          <button type="button" aria-label="Next month">${ICONS.chevR}</button>
        </div>`,
      grid: DOW.map(d => `<div class="mv-cal-dow">${d}</div>`).join('') + cells
    };
  }

  function renderCalendar(rootId, opts) {
    const root = document.getElementById(rootId);
    if (!root) return;
    opts = opts || {};
    const { head, grid } = calendarHTML(
      opts.year || CAL_YEAR, opts.month != null ? opts.month : CAL_MONTH,
      opts.eventDays || SCHEDULE.map(s => s.day),
      opts.today != null ? opts.today : 1,
      opts.href
    );
    root.innerHTML = `<div class="mv-cal-head">${head}</div><div class="mv-cal-grid">${grid}</div>`;
  }

  /* ── Schedule list ─────────────────────────────────────────── */
  function scheduleHTML(items) {
    items = items || SCHEDULE;
    return items.map((s, i) => `
      <a href="${s.href}" class="mv-sched-item${s.alt ? ' alt' : ''}">
        <div class="mv-sched-time">${s.month ? `<span class="mv-sched-date">${esc(s.month)} ${s.day}</span>` : ''}<span class="mv-sched-time-val">${s.time}</span></div>
        <div class="mv-sched-body"><b>${esc(s.title)}</b><span>${esc(s.subtitle)}</span></div>
      </a>`).join('');
  }
  function renderSchedule(rootId, items) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = scheduleHTML(items);
  }

  /* ── Reminders ────────────────────────────────────────────── */
  function remindersHTML(items) {
    items = items || REMINDERS;
    return items.map(r => `
      <a href="${r.href}" class="mv-reminder-item" style="text-decoration:none;">
        <div class="mv-reminder-icon">${ICONS[r.icon] || ICONS.bell}</div>
        <div class="mv-reminder-body"><b>${esc(r.title)}</b><span>${esc(r.sub)}</span></div>
      </a>`).join('');
  }
  function renderReminders(rootId, items) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = remindersHTML(items);
  }

  /* ── Article cards (My Articles) ─────────────────────────── */
  function articleCardsHTML(articles, max) {
    articles = (articles || []).slice(0, max || 3);
    return articles.map((a, i) => {
      const pct = [82, 46, 100, 65, 30][i % 5];
      const status = pct >= 100 ? 'published' : 'draft';
      return `
      <a href="article.html?id=${a.id}" class="mv-article-card" data-status="${status}">
        <div class="mv-article-top">
          <div class="mv-article-thumb"><img src="${a.image}" alt="" loading="lazy"></div>
          <div style="min-width:0;">
            <div class="mv-article-title">${esc(a.title)}</div>
            <div class="mv-article-author">${esc(a.category)} · ${esc(a.readTime)} read</div>
          </div>
        </div>
        <span class="mv-article-status ${status}">${status === 'published' ? 'Published' : 'In progress'}</span>
        <div class="mv-article-meta-row">
          <span>${ICONS.eye}${(a.views || (400 + i * 210))}</span>
          <span>${ICONS.clock}${esc(a.date || a.readTime)}</span>
        </div>
        <div class="mv-article-bar-wrap">
          <div class="mv-article-bar"><div class="mv-article-bar-fill" style="width:${pct}%"></div></div>
          <div class="mv-article-bar-pct">${pct}%</div>
        </div>
      </a>`;
    }).join('');
  }
  function renderArticleCards(rootId, articles, max) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = articleCardsHTML(articles || getArticles(), max);
  }

  /* ── Consultation requests (wide "assignment" rows) ─────────── */
  function consultationsHTML(items) {
    items = items || CONSULTATIONS;
    if (!items.length) return '<div class="db-consult-empty">No consultation requests yet.</div>';
    return items.map(c => `
      <a href="consultation-requests.html" class="db-consult-row" style="text-decoration:none; color:inherit; cursor:pointer;">
        <div class="db-consult-avatar">${c.type === 'member'
          ? `<img src="${c.avatar}" alt="${esc(c.name)}" loading="lazy">`
          : `<div class="db-consult-avatar-placeholder">${ICONS.users}</div>`}</div>
        <div class="db-consult-body">
          <div class="db-consult-name">${esc(c.name)}${c.type === 'member' ? `<span class="db-consult-verified" title="Verified member"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M20 6L9 17l-5-5"/></svg></span>` : ''}</div>
          <div class="db-consult-topic">${esc(c.work)}</div>
          <div class="db-consult-meta">
            <span class="db-consult-meta-item">${ICONS.cal}Received <strong>${esc(c.received)}</strong></span>
          </div>
        </div>
        <span class="db-consult-status ${c.status}">${STATUS_LABEL[c.status]}</span>
      </a>`).join('');
  }
  function renderConsultations(rootId, items) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = consultationsHTML(items);
  }

  /* ── Task cards ───────────────────────────────────────────── */
  function taskCardsHTML(tasks) {
    tasks = tasks || TASKS;
    return tasks.map(t => `
      <a href="${t.href}" class="mv-task-card ${t.tone}">
        <div class="mv-task-head">
          <div class="mv-task-title">${esc(t.title)}</div>
          <span class="mv-task-priority ${t.priority}">${t.priority === 'high' ? 'High' : 'Low'}</span>
        </div>
        <div class="mv-task-desc">${esc(t.desc)}</div>
        <div class="mv-task-foot">
          <span class="mv-task-due">${ICONS.clock}${esc(t.due)}</span>
          <div class="mv-task-avatars">${(t.avatars || []).map(src => `<img src="${src}" alt="">`).join('')}</div>
        </div>
      </a>`).join('');
  }
  function renderTaskCards(rootId, tasks) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = taskCardsHTML(tasks);
  }

  /* ── Avatar stack ─────────────────────────────────────────── */
  function avatarStackHTML(members, showCount, href) {
    members = members || getMembers();
    showCount = showCount || 5;
    const shown = members.slice(0, showCount);
    const rest = Math.max(0, members.length - showCount);
    return `
      <a href="${href || 'members.html'}" class="mv-avatar-stack">
        ${shown.map(m => `<img src="${m.img || ''}" alt="${esc(m.name)}" title="${esc(m.name)}">`).join('')}
        ${rest > 0 ? `<div class="mv-avatar-stack-more">+${rest}</div>` : ''}
      </a>`;
  }
  function renderAvatarStack(rootId, members, showCount, href) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = avatarStackHTML(members, showCount, href);
  }

  /* ── Spotlight (Peer Connect match) ──────────────────────── */
  function spotlightHTML(member) {
    const m = member || getMembers().find(x => x.id === 'ananya-krishnamurthy') || getMembers()[1] || getMe();
    return `
      <div class="mv-spotlight-top">
        <div class="mv-spotlight-avatar"><img src="${m.img || ''}" alt="${esc(m.name)}"></div>
        <div>
          <div class="mv-spotlight-name">${esc(m.name)}</div>
          <div class="mv-spotlight-role">${esc(m.title)}${m.firm ? ' · ' + esc(m.firm) : ''}</div>
        </div>
      </div>
      <div class="mv-spotlight-tags">
        <span class="mv-spotlight-tag">${esc(m.practice || 'Cross-Border Tax')}</span>
        <span class="mv-spotlight-tag">${esc(m.location || '')}</span>
        ${m.verified ? '<span class="mv-spotlight-tag">✓ Verified</span>' : ''}
      </div>`;
  }
  function renderSpotlight(rootId, member) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = spotlightHTML(member);
    root.setAttribute('href', `member-profile.html?id=${(member || {}).id || 'ananya-krishnamurthy'}`);
  }

  /* ── Timeline ─────────────────────────────────────────────── */
  function timelineHTML(groups) {
    groups = groups || TIMELINE;
    return groups.map(g => `
      <div class="mv-timeline-group">
        <div class="mv-timeline-date">${esc(g.date)}</div>
        ${g.items.map(it => `
          <a href="${it.href}" class="mv-timeline-item">
            <div class="mv-timeline-icon">${ICONS[it.icon] || ICONS.bell}</div>
            <div class="mv-timeline-body">
              <div class="mv-timeline-title">${esc(it.title)}</div>
              <div class="mv-timeline-meta">${esc(it.meta)}</div>
            </div>
            <span class="mv-timeline-tag">${esc(it.tag)}</span>
          </a>`).join('')}
      </div>`).join('');
  }
  function renderTimeline(rootId, groups) {
    const root = document.getElementById(rootId);
    if (!root) return;
    root.innerHTML = timelineHTML(groups);
  }

  /* ── Bell dropdown wiring ─────────────────────────────────── */
  function wireBell(btnId, panelId) {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    panel.innerHTML = `
      <div class="mv-bell-panel-head">Notifications</div>
      ${REMINDERS.map(r => `
        <div class="mv-bell-item">
          <div class="mv-bell-icon">${ICONS[r.icon] || ICONS.bell}</div>
          <div class="mv-bell-body"><b>${esc(r.title)}</b><span>${esc(r.sub)}</span></div>
        </div>`).join('')}`;
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      panel.classList.toggle('open');
    });
    document.addEventListener('click', (e) => {
      if (!panel.contains(e.target) && e.target !== btn) panel.classList.remove('open');
    });
  }

  /* ── Tabs (filter article cards by data-status) ──────────── */
  function wireTabs(tabsSelector, cardsSelector) {
    const tabs = document.querySelectorAll(tabsSelector + ' .mv-tab');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const filter = tab.getAttribute('data-filter') || 'all';
        document.querySelectorAll(cardsSelector).forEach(card => {
          const status = card.getAttribute('data-status');
          card.style.display = (filter === 'all' || filter === status) ? '' : 'none';
        });
      });
    });
  }

  /* ── Panel tabs (segmented control switching whole sections,
       variation 4) — tabs carry data-panel="key", panels carry
       data-panel-content="key". ─────────────────────────────── */
  function wirePanelTabs(tabsSelector) {
    const tabs = document.querySelectorAll(tabsSelector + ' .mv-tab');
    const panels = document.querySelectorAll('[data-panel-content]');
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const target = tab.getAttribute('data-panel');
        panels.forEach(p => { p.style.display = (p.getAttribute('data-panel-content') === target) ? '' : 'none'; });
      });
    });
  }

  /* ── Flip card wiring (variation 5) ──────────────────────── */
  function wireFlip(cardSelector, toggleSelector) {
    document.querySelectorAll(cardSelector).forEach(card => {
      const toggle = card.querySelector(toggleSelector);
      if (!toggle) return;
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        card.classList.toggle('flipped');
      });
    });
  }

  /* ── Header icon injection (search box + bell button) ───────── */
  function wireHeaderIcons(searchBoxSelector, bellBtnSelector) {
    document.querySelectorAll(searchBoxSelector + ' .search-icon').forEach(el => el.innerHTML = ICONS.search);
    document.querySelectorAll(bellBtnSelector + ' .bell-icon').forEach(el => el.innerHTML = ICONS.bell);
  }

  /* ── Sidebar hover-reveal (same pattern as dashboard.html) ── */
  function wireSidebarReveal() {
    const shell = document.getElementById('d1-shell');
    const sidebar = document.querySelector('.d1-sidebar');
    if (sidebar && shell) {
      sidebar.addEventListener('mouseenter', () => shell.classList.add('revealed'));
      sidebar.addEventListener('mouseleave', () => shell.classList.remove('revealed'));
    }
  }

  window.MV = {
    ME_ID, MEMBERSHIP, CONTRIBUTIONS, SCHEDULE, REMINDERS, TASKS, TIMELINE, ICONS, CONSULTATIONS,
    CAL_YEAR, CAL_MONTH,
    getMembers, getArticles, getMe,
    profileCardHTML, membershipCardHTML, contribRowHTML,
    renderCalendar, renderSchedule, renderReminders, renderArticleCards,
    renderTaskCards, renderAvatarStack, renderSpotlight, renderTimeline, renderConsultations,
    scheduleHTML, remindersHTML, articleCardsHTML, taskCardsHTML, avatarStackHTML, spotlightHTML, timelineHTML, consultationsHTML,
    wireBell, wireTabs, wirePanelTabs, wireFlip, wireSidebarReveal, wireHeaderIcons
  };
})();
