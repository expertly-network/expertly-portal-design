/**
 * Expertly Static Site Homepage Interactivity
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. AI Search Demo Simulation
  initAISearchDemo();

  // 2. Hero Tweak Listener (Shows/Hides Hero Layouts based on tweaks panel selection)
  initHeroSwitcher();

  // 3. Testimonials Tabs
  initTestimonials();

  // 4. FAQ Accordion Toggles
  initFAQ();

  // 5. Newsletter Signup Handler
  initNewsletter();

  // 6. Dynamic Marquees, Articles, and Events
  initFeaturedMembers();
  initPracticeAreas();
  initFirmsBand();
  initLatestArticles();
  initUpcomingEvents();
});

/* ==========================================================================
   1. AI SEARCH DEMO (Hero Right terminal)
   ========================================================================== */
function initAISearchDemo() {
  const container = document.querySelector('.ai-demo');
  if (!container) return;

  const scenarios = [
    {
      query: 'M&A tax advisor in Singapore under $500/hr',
      results: [
        { kind: 'EXPERT', title: 'Marcus Chen', meta: 'Senior Tax Advisor · Singapore · $450/hr', match: 98, id: 'marcus-chen' },
        { kind: 'EXPERT', title: 'Mukesh Kumar M', meta: 'Co-Founder, M2K · Chennai · $420/hr', match: 94, id: 'mukesh-kumar-m' },
        { kind: 'ARTICLE', title: 'Singapore Corporate Income Tax Rebate YA 2026', meta: 'Marcus Chen · 3 min read', match: 91 }
      ]
    },
    {
      query: 'BEPS 2.0 transfer pricing · Europe',
      results: [
        { kind: 'EXPERT', title: 'Diego Martínez', meta: 'Transfer Pricing Lead · Madrid · $410/hr', match: 97, id: 'diego-martinez' },
        { kind: 'ARTICLE', title: 'Transfer Pricing in 2026: BEPS 2.0 and What Comes Next', meta: 'Diego Martínez · 4 min', match: 95 },
        { kind: 'EVENT', title: 'TP Minds International', meta: 'London · May 12–14', match: 88 }
      ]
    },
    {
      query: 'IP counsel for AI training data disputes',
      results: [
        { kind: 'EXPERT', title: 'Elena Volkova', meta: 'IP & Technology Counsel · London · $520/hr', match: 96, id: 'elena-volkova' },
        { kind: 'ARTICLE', title: 'IP Rights in the Era of AI Training Data', meta: 'Elena Volkova · 6 min', match: 94 },
        { kind: 'EVENT', title: 'IBA Annual Conference 2026', meta: 'Seoul · May 3–7', match: 82 }
      ]
    }
  ];

  let currentScenIdx = 0;
  let activeTimer = null;
  let cancelled = false;

  const inputArea = container.querySelector('.ai-demo-text');
  const bodyArea = container.querySelector('.ai-demo-body');
  const chipContainer = container.querySelector('.ai-demo-chips');

  // Create thinking block element
  const thinkingEl = document.createElement('div');
  thinkingEl.className = 'ai-demo-thinking';
  thinkingEl.style.display = 'none';
  thinkingEl.innerHTML = `
    <div class="ai-thinking-dot"></div>
    <div class="ai-thinking-dot"></div>
    <div class="ai-thinking-dot"></div>
    <span class="mono">Searching experts · articles · events</span>
  `;

  // Create results container elements
  const resultsMetaEl = document.createElement('div');
  resultsMetaEl.className = 'ai-demo-meta mono';
  resultsMetaEl.style.display = 'none';

  const resultsListEl = document.createElement('div');
  resultsListEl.className = 'ai-demo-results';
  resultsListEl.style.display = 'none';

  // Inject dynamic areas in demo body before chips
  const chipsDiv = container.querySelector('.ai-demo-chips');
  bodyArea.insertBefore(thinkingEl, chipsDiv);
  bodyArea.insertBefore(resultsMetaEl, chipsDiv);
  bodyArea.insertBefore(resultsListEl, chipsDiv);

  // Render Chip Controls
  chipContainer.innerHTML = scenarios.map((s, idx) => `
    <button class="ai-chip ${idx === 0 ? 'active' : ''}" data-index="${idx}">
      ${s.query.split(' ').slice(0, 3).join(' ')}…
    </button>
  `).join('');

  // Handle chip clicks
  chipContainer.querySelectorAll('.ai-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chipContainer.querySelectorAll('.ai-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const idx = parseInt(chip.getAttribute('data-index'), 10);
      currentScenIdx = idx;
      runSimulation();
    });
  });

  const kindColors = { EXPERT: 'var(--accent)', ARTICLE: '#4F7BE8', EVENT: '#10A67A' };

  async function runSimulation() {
    // Clear any previous running simulation
    if (activeTimer) {
      clearTimeout(activeTimer);
    }
    cancelled = true;
    // Small delay to let previous loop cancel safely
    await new Promise(r => setTimeout(r, 50));
    cancelled = false;

    const scen = scenarios[currentScenIdx];
    
    // 1. Typing phase
    inputArea.innerHTML = `<span class="ai-caret"></span>`;
    thinkingEl.style.display = 'none';
    resultsMetaEl.style.display = 'none';
    resultsListEl.style.display = 'none';
    resultsListEl.innerHTML = '';

    for (let i = 1; i <= scen.query.length; i++) {
      if (cancelled) return;
      inputArea.innerHTML = `${scen.query.slice(0, i)}<span class="ai-caret"></span>`;
      await new Promise(r => setTimeout(r, 32 + Math.random() * 40));
    }

    if (cancelled) return;
    // Remove cursor caret and wait
    inputArea.innerHTML = scen.query;
    await new Promise(r => setTimeout(r, 350));

    // 2. Thinking phase
    if (cancelled) return;
    thinkingEl.style.display = 'flex';

    await new Promise(r => setTimeout(r, 900));
    if (cancelled) return;
    thinkingEl.style.display = 'none';

    // 3. Results rendering phase
    resultsMetaEl.style.display = 'flex';
    resultsMetaEl.innerHTML = `
      <span>✓ ${scen.results.length} Matches</span>
      <span>·</span>
      <span>0.${Math.floor(Math.random() * 80 + 20)}s</span>
    `;

    resultsListEl.style.display = 'flex';
    resultsListEl.innerHTML = '';

    for (let i = 0; i < scen.results.length; i++) {
      if (cancelled) return;
      const r = scen.results[i];
      const expert = r.id ? (window.EXPERTLY_MEMBERS || []).find(m => m.id === r.id) : null;
      
      const itemEl = document.createElement('div');
      itemEl.className = 'ai-result';
      
      let iconHtml = '';
      if (r.kind === 'EXPERT' && expert) {
        iconHtml = window.getAvatarHtml(expert, 36);
      } else {
        const char = r.kind === 'ARTICLE' ? '📄' : '📅';
        iconHtml = `<div class="ai-result-icon" style="background: color-mix(in oklab, ${kindColors[r.kind]} 15%, transparent); color: ${kindColors[r.kind]};">${char}</div>`;
      }

      itemEl.innerHTML = `
        <div class="ai-result-kind" style="color: ${kindColors[r.kind]};">
          ${iconHtml}
        </div>
        <div class="ai-result-body">
          <div class="ai-result-type mono" style="color: ${kindColors[r.kind]};">${r.kind[0] + r.kind.slice(1).toLowerCase()}</div>
          <div class="ai-result-title">${r.title}</div>
          <div class="ai-result-meta">${r.meta}</div>
        </div>
        <div class="ai-result-match">
          <div class="ai-match-num">${r.match}<span>%</span></div>
          <div class="ai-match-label mono">Match</div>
        </div>
      `;
      
      resultsListEl.appendChild(itemEl);
      await new Promise(r => setTimeout(r, 260));
    }

    // Auto rotate to next scenario
    if (cancelled) return;
    activeTimer = setTimeout(() => {
      currentScenIdx = (currentScenIdx + 1) % scenarios.length;
      // update active chip style
      chipContainer.querySelectorAll('.ai-chip').forEach((c, idx) => {
        if (idx === currentScenIdx) c.classList.add('active');
        else c.classList.remove('active');
      });
      runSimulation();
    }, 4500);
  }

  // Initial trigger
  runSimulation();
}

/* ==========================================================================
   2. HERO SWITCHER (TWEAKS PANEL INTEGRATION)
   ========================================================================== */
function initHeroSwitcher() {
  const switchHero = (style) => {
    const splitHero = document.querySelector('.hero-split');
    const mosaicHero = document.querySelector('.hero-mosaic-section');
    const edHero = document.querySelector('.hero-editorial');

    if (splitHero) splitHero.style.display = 'none';
    if (mosaicHero) mosaicHero.style.display = 'none';
    if (edHero) edHero.style.display = 'none';

    if (style === 'split' && splitHero) {
      splitHero.style.display = '';
    } else if (style === 'mosaic' && mosaicHero) {
      mosaicHero.style.display = '';
    } else if (style === 'editorial' && edHero) {
      edHero.style.display = '';
    }
  };

  // Listen for tweak events
  window.addEventListener('expertly:hero-change', (e) => {
    if (e.detail && e.detail.style) {
      switchHero(e.detail.style);
    }
  });

  // Read initial setting from page load
  const initialHero = document.documentElement.getAttribute('data-hero') || 'split';
  switchHero(initialHero);

  // Hook home search interaction in HeroSplit
  const heroSearch = document.querySelector('.hero-search');
  if (heroSearch) {
    heroSearch.addEventListener('click', (e) => {
      // Find what search query we should pre-fill
      let queryVal = '';
      const phraseEl = heroSearch.querySelector('.hero-phrase');
      if (phraseEl) {
        queryVal = phraseEl.textContent;
      }
      window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: queryVal } }));
    });

    // Handle suggestions click
    heroSearch.querySelectorAll('.hero-search-hints button').forEach(hint => {
      hint.addEventListener('click', (e) => {
        e.stopPropagation();
        window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: hint.textContent } }));
      });
    });
  }

  // Handle typing phrases rotation on the Split Hero search box
  const searchPhrases = [
    { q: 'M&A tax advisor in Singapore under $500/hr', label: 'Find experts' },
    { q: 'Articles on UAE corporate tax for 2026', label: 'Find articles' },
    { q: 'Transfer pricing conferences in London', label: 'Find events' },
    { q: 'IP counsel for SaaS, EU + US coverage', label: 'Find experts' }
  ];
  let phraseIdx = 0;
  const typebox = document.querySelector('.hero-typebox');
  const findBtnLabel = document.querySelector('.hero-find-label');

  // phrase cycling handled by typewriter script in index.html
}

/* ==========================================================================
   3. TESTIMONIALS
   ========================================================================== */
function initTestimonials() {
  const container = document.querySelector('.testimonials');
  if (!container) return;

  const tabButtons = container.querySelectorAll('.testimonial-tabs button');
  const cardsGrid = container.querySelector('.testimonial-grid');

  const testimonialData = {
    members: [
      { q: "Expertly gave me access to a calibre of clients I simply couldn't reach anywhere else. Every enquiry is from someone who genuinely values expert advice.", who: 'priya-venkatesh' },
      { q: "My inbound consultation requests tripled within 60 days of going live. The right clients finally found me.", who: 'marcus-chen' },
      { q: "Publishing articles on Expertly built my professional brand faster than anything else I've tried.", who: 'amara-osei' },
      { q: "The network events alone justify the membership. Connections that would have taken years to build.", who: 'fatima-al-hassan' }
    ],
    clients: [
      { q: "We replaced six months of RFPs with one afternoon on Expertly. Found the right M&A counsel in Chennai by Tuesday, signed by Friday.", who: 'oliver-schmidt' },
      { q: "The rate transparency alone is worth the membership. No surprises, no hourly creep, no mystery partners billing us.", who: 'elena-volkova' },
      { q: "Finally — a network where 'verified' actually means something. Every expert we've engaged delivered on the first conversation.", who: 'claire-dubois' }
    ]
  };

  const renderTab = (tabName) => {
    const items = testimonialData[tabName];
    cardsGrid.innerHTML = items.map(t => {
      const member = (window.EXPERTLY_MEMBERS || []).find(x => x.id === t.who);
      if (!member) return '';
      return `
        <figure class="testimonial-card" style="animation: riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both;">
          <blockquote>"${t.q}"</blockquote>
          <figcaption>
            ${window.getAvatarHtml(member, 44)}
            <div>
              <div class="t-name">${member.name}</div>
              <div class="mono t-meta">${member.title} · ${member.location.split(',')[0]}</div>
            </div>
          </figcaption>
        </figure>
      `;
    }).join('');
  };

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const tabName = btn.textContent.toLowerCase().includes('member') ? 'members' : 'clients';
      renderTab(tabName);
    });
  });

  // Initial render
  renderTab('members');
}

/* ==========================================================================
   4. FAQ ACCORDION
   ========================================================================== */
function initFAQ() {
  const container = document.querySelector('.faq');
  if (!container) return;

  const items = container.querySelectorAll('.faq-item');
  
  items.forEach(item => {
    const qBtn = item.querySelector('.faq-q');
    qBtn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      
      // Close all other FAQs
      items.forEach(it => {
        it.classList.remove('open');
        const t = it.querySelector('.faq-toggle');
        if (t) t.textContent = '+';
      });

      // Toggle this one
      if (!isOpen) {
        item.classList.add('open');
        const t = item.querySelector('.faq-toggle');
        if (t) t.textContent = '−';
      }
    });
  });
}

/* ==========================================================================
   5. NEWSLETTER
   ========================================================================== */
function initNewsletter() {
  const form = document.querySelector('.newsletter-form');
  if (!form) return;

  const btn = form.querySelector('button');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const input = form.querySelector('input');
    if (input && input.value) {
      btn.textContent = '✓ Subscribed';
      btn.disabled = true;
      input.disabled = true;
      input.style.opacity = '0.7';
    }
  });
}

/* ==========================================================================
   6. FEATURED MEMBERS (R Network Marquee)
   ========================================================================== */
function initFeaturedMembers() {
  const container = document.getElementById('featured-members-marquee');
  if (!container) return;

  const members = window.EXPERTLY_MEMBERS || [];
  const rowCount = 4;
  const speeds = [46, 58, 50, 54];

  const rows = Array.from({ length: rowCount }, () => []);
  members.forEach((m, idx) => {
    rows[idx % rowCount].push(m);
  });

  let html = '';
  rows.forEach((row, ri) => {
    const revClass = ri % 2 ? 'rev' : '';
    const speed = speeds[ri % speeds.length];
    const fullRow = [...row, ...row];

    html += `
      <div class="marquee-row ${revClass}">
        <div class="marquee-track" style="animation-duration: ${speed}s;">
          ${fullRow.map(m => `
            <a href="members.html#${m.id}" class="m-chip">
              ${window.getAvatarHtml(m, 48)}
              <div class="m-chip-body">
                <div class="m-chip-name">${m.name}${m.verified ? ` <span class="float-tick">${window.getCheckIconHtml()}</span>` : ''}</div>
                <div class="m-chip-role">${m.title}</div>
                <div class="m-chip-tags">
                  <span class="m-chip-practice">${m.practice}</span>
                  <span class="m-chip-loc">
                    <svg class="m-chip-pin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                      <circle cx="12" cy="11" r="2.2" fill="currentColor"/>
                    </svg>${m.location}
                  </span>
                </div>
              </div>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   7. PRACTICE AREAS Marquee
   ========================================================================== */
function initPracticeAreas() {
  const container = document.getElementById('practice-areas-marquee');
  if (!container) return;

  const areas = window.EXPERTLY_PRACTICE_AREAS || [];
  const rowCount = 4;
  const speeds = [44, 52, 48, 56];

  const rows = Array.from({ length: rowCount }, () => []);
  areas.forEach((p, idx) => {
    rows[idx % rowCount].push(p);
  });

  let html = '';
  rows.forEach((row, ri) => {
    const revClass = ri % 2 ? 'rev' : '';
    const speed = speeds[ri % speeds.length];
    const fullRow = [...row, ...row];

    html += `
      <div class="marquee-row ${revClass}">
        <div class="marquee-track" style="animation-duration: ${speed}s;">
          ${fullRow.map(p => `
            <a href="members.html?practice=${encodeURIComponent(p.name)}" class="m-pill" style="--h: ${p.h};">
              <span class="m-pill-thumb">
                <img src="${p.img}" alt="" loading="lazy" onerror="this.classList.add('failed')" />
              </span>
              <span class="m-pill-body">
                <span class="m-pill-name">${p.name}</span>
                <span class="m-pill-count mono">${p.count} experts</span>
              </span>
            </a>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   8. FIRMS BAND Marquee
   ========================================================================== */
function initFirmsBand() {
  const container = document.getElementById('firms-marquee-container');
  if (!container) return;

  const wellKnown = ['Deloitte', 'PwC', 'EY', 'KPMG', 'Baker McKenzie', 'Clifford Chance', 'Linklaters', 'Allen & Overy'];
  const seen = {};
  const memberFirms = [];
  (window.EXPERTLY_MEMBERS || []).forEach(m => {
    if (!m.firm || m.firm === 'Independent' || seen[m.firm]) return;
    seen[m.firm] = true;
    memberFirms.push(m.firm);
  });

  const firms = [...wellKnown, ...memberFirms];
  const half = Math.ceil(firms.length / 2);
  const rows = [firms.slice(0, half), firms.slice(half)];

  let html = '';
  rows.forEach((row, ri) => {
    const revClass = ri % 2 ? 'rev' : '';
    const speed = 42 + ri * 8;
    const fullRow = [...row, ...row];

    html += `
      <div class="firms-row ${revClass}">
        <div class="firms-track" style="animation-duration: ${speed}s;">
          ${fullRow.map(f => `
            <span class="firm-logo"><span class="firm-logo-name">${f}</span></span>
          `).join('')}
        </div>
      </div>
    `;
  });

  container.innerHTML = html;
}

/* ==========================================================================
   9. LATEST ARTICLES
   ========================================================================== */
function initLatestArticles() {
  const container = document.getElementById('latest-articles-container');
  if (!container) return;

  const articles = window.EXPERTLY_ARTICLES || [];
  if (articles.length === 0) return;

  const [featured, ...rest] = articles.slice(0, 5);
  const authorOf = (id) => (window.EXPERTLY_MEMBERS || []).find(m => m.id === id);

  const featuredAuthor = authorOf(featured.author) || { name: 'Expertly Counsel', title: 'Specialist' };
  
  let html = `
    <a href="articles.html#${featured.id}" class="article-featured">
      <div class="article-img">
        <span class="chip chip-ink" style="position: absolute; top: 20px; left: 20px;">${featured.category}</span>
        <img class="article-photo" src="${featured.image}" alt="${featured.title}" loading="lazy" />
      </div>
      <div class="article-featured-body">
        <div class="mono" style="font-size: 11px; color: var(--ink-3); letter-spacing: 0.1em;">${featured.date} · ${featured.readTime} Read</div>
        <h3>${featured.title}</h3>
        <div class="article-author">
          ${window.getAvatarHtml(featuredAuthor, 60)}
          <div>
            <div style="font-size: 14px; font-weight: 500;">${featuredAuthor.name}</div>
            <div class="mono" style="font-size: 11px; color: var(--ink-3);">${featuredAuthor.title}${featuredAuthor.firm ? `, ${featuredAuthor.firm}` : ''}</div>
          </div>
        </div>
      </div>
    </a>
    <div class="articles-list">
      ${rest.map((a, i) => {
        const author = authorOf(a.author) || { name: 'Expertly Counsel' };
        return `
          <a href="articles.html#${a.id}" class="article-row">
            <div class="article-row-num mono">0${i + 2}</div>
            <div class="article-row-body">
              <div class="article-row-meta">
                <span class="chip">${a.category}</span>
                <span class="mono" style="font-size: 10px; color: var(--ink-3); letter-spacing: 0.08em;">${a.readTime} · ${a.date}</span>
              </div>
              <h4>${a.title}</h4>
              <div class="article-row-author">
                ${window.getAvatarHtml(author, 36)}
                <div>
                  <div style="font-size:13px;font-weight:500;color:var(--ink-2);line-height:1.3;">${author.name}</div>
                  <div class="mono" style="font-size:10px;color:var(--ink-3);">${author.title || ''}${author.firm ? `, ${author.firm}` : ''}</div>
                </div>
              </div>
            </div>
          </a>
        `;
      }).join('')}
    </div>
  `;

  container.innerHTML = html;
}

/* ==========================================================================
   10. UPCOMING EVENTS
   ========================================================================== */
function initUpcomingEvents() {
  const container = document.getElementById('upcoming-events-container');
  if (!container) return;

  const events = (window.EXPERTLY_EVENTS || []).slice(0, 4);

  let html = events.map(e => {
    const startParts = e.start.split(' ');
    const month = startParts[0];
    const startDay = parseInt(startParts[1], 10);

    let dateHtml = '';
    if (e.end) {
      const endParts = e.end.split(' ');
      const endDay = parseInt(endParts[1], 10);
      dateHtml = `
        <div class="event-date-month">${month}</div>
        <div class="event-date-range">${startDay}–${endDay}</div>
      `;
    } else {
      dateHtml = `
        <div class="event-date-month">${month}</div>
        <div class="event-date-day">${startDay}</div>
      `;
    }

    return `
      <a href="events.html#${e.id}" class="event-card">
        <div class="event-date">
          ${dateHtml}
        </div>
        <div class="event-body">
          <div class="event-tags">
            <span class="chip">${e.category}</span>
            <span class="chip chip-dot" style="color: ${e.format === 'In Person' ? 'var(--ok)' : 'var(--accent)'}">${e.format}</span>
          </div>
          <h3>${e.title}</h3>
          <p>${e.desc}</p>
          <div class="event-foot">
            <span class="mono">📍 ${e.city}, ${e.country}</span>
            <span class="event-register">Register →</span>
          </div>
        </div>
      </a>
    `;
  }).join('');

  container.innerHTML = html;
}
