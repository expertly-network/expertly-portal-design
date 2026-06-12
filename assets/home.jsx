// Homepage sections — Hero, How it works, Members, Articles, Events, Trust, Testimonials, Dual CTA, FAQ
const { useState: useS, useEffect: useE, useRef: useR, useMemo: useM } = React;

// ====================== AI SEARCH DEMO (hero right) ======================
function AISearchDemo() {
  const scenarios = [
  {
    query: 'M&A tax advisor in Singapore under $500/hr',
    results: [
    { kind: 'EXPERT', title: 'Marcus Chen', meta: 'Senior Tax Advisor · Singapore · $450/hr', match: 98, id: 'marcus-chen' },
    { kind: 'EXPERT', title: 'Mukesh Kumar M', meta: 'Co-Founder, M2K · Chennai · $420/hr', match: 94, id: 'mukesh-kumar-m' },
    { kind: 'ARTICLE', title: 'Singapore Corporate Income Tax Rebate YA 2026', meta: 'Marcus Chen · 3 min read', match: 91 }]

  },
  {
    query: 'BEPS 2.0 transfer pricing · Europe',
    results: [
    { kind: 'EXPERT', title: 'Diego Martínez', meta: 'Transfer Pricing Lead · Madrid · $410/hr', match: 97, id: 'diego-martinez' },
    { kind: 'ARTICLE', title: 'Transfer Pricing in 2026: BEPS 2.0 and What Comes Next', meta: 'Diego Martínez · 4 min', match: 95 },
    { kind: 'EVENT', title: 'TP Minds International', meta: 'London · May 12–14', match: 88 }]

  },
  {
    query: 'IP counsel for AI training data disputes',
    results: [
    { kind: 'EXPERT', title: 'Elena Volkova', meta: 'IP & Technology Counsel · London · $520/hr', match: 96, id: 'elena-volkova' },
    { kind: 'ARTICLE', title: 'IP Rights in the Era of AI Training Data', meta: 'Elena Volkova · 6 min', match: 94 },
    { kind: 'EVENT', title: 'IBA Annual Conference 2026', meta: 'Seoul · May 3–7', match: 82 }]

  }];


  const [sIdx, setSIdx] = useS(0);
  const [typed, setTyped] = useS('');
  const [phase, setPhase] = useS('typing'); // typing -> thinking -> results -> idle
  const [visibleResults, setVisibleResults] = useS(0);

  useE(() => {
    let cancelled = false;
    const run = async () => {
      const scen = scenarios[sIdx];
      // typing
      setPhase('typing');
      setTyped('');
      setVisibleResults(0);
      for (let i = 1; i <= scen.query.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 32 + Math.random() * 40));
        setTyped(scen.query.slice(0, i));
      }
      if (cancelled) return;
      await new Promise((r) => setTimeout(r, 350));
      // thinking
      setPhase('thinking');
      await new Promise((r) => setTimeout(r, 900));
      if (cancelled) return;
      // results
      setPhase('results');
      for (let i = 1; i <= scen.results.length; i++) {
        if (cancelled) return;
        await new Promise((r) => setTimeout(r, 260));
        setVisibleResults(i);
      }
      await new Promise((r) => setTimeout(r, 2600));
      if (cancelled) return;
      setSIdx((x) => (x + 1) % scenarios.length);
    };
    run();
    return () => {cancelled = true;};
  }, [sIdx]);

  const scen = scenarios[sIdx];
  const kindColor = { EXPERT: 'var(--accent)', ARTICLE: '#4F7BE8', EVENT: '#10A67A' };

  return (
    <div className="ai-demo">
      <div className="ai-demo-chrome">
        <div className="ai-demo-dots">
          <span /><span /><span />
        </div>
        <div className="ai-demo-url mono">expertly.network/search</div>
        <div className="ai-demo-live">
          <span className="ai-pulse small" /> <span className="mono">Live</span>
        </div>
      </div>

      <div className="ai-demo-body">
        <div className="ai-demo-input">
          <span className="ai-demo-spark">✦</span>
          <div className="ai-demo-text">
            {typed}
            {phase === 'typing' && <span className="ai-caret" />}
          </div>
        </div>

        {phase === 'thinking' &&
        <div className="ai-demo-thinking">
            <div className="ai-thinking-dot" />
            <div className="ai-thinking-dot" />
            <div className="ai-thinking-dot" />
            <span className="mono">Searching experts · articles · events</span>
          </div>
        }

        {phase === 'results' &&
        <>
            <div className="ai-demo-meta mono">
              <span>✓ {scen.results.length} Matches</span>
              <span>·</span>
              <span>0.{Math.floor(Math.random() * 80 + 20)}s</span>
            </div>
            <div className="ai-demo-results">
              {scen.results.slice(0, visibleResults).map((r, i) => {
              const expert = r.id ? window.EXPERTLY_MEMBERS.find((m) => m.id === r.id) : null;
              return (
                <div className="ai-result" key={`${sIdx}-${i}`}>
                    <div className="ai-result-kind" style={{ color: kindColor[r.kind] }}>
                      {r.kind === 'EXPERT' ? expert && <Avatar member={expert} size={36} /> :
                    <div className="ai-result-icon" style={{ background: `color-mix(in oklab, ${kindColor[r.kind]} 15%, transparent)`, color: kindColor[r.kind] }}>
                          {r.kind === 'ARTICLE' ? '📄' : '📅'}
                        </div>
                    }
                    </div>
                    <div className="ai-result-body">
                      <div className="ai-result-type mono" style={{ color: kindColor[r.kind] }}>{r.kind[0] + r.kind.slice(1).toLowerCase()}</div>
                      <div className="ai-result-title">{r.title}</div>
                      <div className="ai-result-meta">{r.meta}</div>
                    </div>
                    <div className="ai-result-match">
                      <div className="ai-match-num">{r.match}<span>%</span></div>
                      <div className="ai-match-label mono">Match</div>
                    </div>
                  </div>);

            })}
            </div>
          </>
        }

        <div className="ai-demo-chips">
          {scenarios.map((s, i) =>
          <button key={i} className={`ai-chip ${i === sIdx ? 'active' : ''}`} onClick={() => setSIdx(i)}>
              {s.query.split(' ').slice(0, 3).join(' ')}…
            </button>
          )}
        </div>
      </div>

      <div className="ai-demo-foot mono">
        <span>Powered by Expertly AI</span>
        <span>Experts · Articles · Events</span>
      </div>
    </div>);

}

// ====================== HERO - SPLIT ======================
function HeroSplit() {
  const [query, setQuery] = useS('');
  const phrases = [
  { q: 'M&A tax advisor in Singapore under $500/hr', label: 'Find experts' },
  { q: 'Articles on UAE corporate tax for 2026', label: 'Find articles' },
  { q: 'Transfer pricing conferences in London', label: 'Find events' },
  { q: 'IP counsel for SaaS, EU + US coverage', label: 'Find experts' }];

  const [ph, setPh] = useS(0);
  useE(() => {
    const t = setInterval(() => setPh((p) => (p + 1) % phrases.length), 3200);
    return () => clearInterval(t);
  }, []);

  const featured = window.EXPERTLY_MEMBERS.slice(0, 9);

  return (
    <section className="hero-split hero-centered">
      <div className="container-wide">
        <div className="hero-center">
          <h1 className="display">
            Built by Practitioners,<br />
            <span className="accent-text">for Practitioners.</span>
          </h1>
          <p className="lede hero-lede">
            A curated network of {window.EXPERTLY_MEMBERS.length}+ practitioners across {20}+ jurisdictions. Skip the cold outreach — search, verify credentials, and book directly.
          </p>

          <div className="hero-search" onClick={() => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: query } }))}>
            <div className="hero-search-label">
              <span className="ai-pulse" /> <span className="mono">AI Search</span>
            </div>
            <div className="hero-search-input">
              <div className="hero-typebox" role="textbox" aria-label="Search Expertly">
                <span className="hero-phrase" key={ph}>{phrases[ph].q}</span>
              </div>
              <button className="btn btn-primary hero-find-btn">
                <span className="hero-find-label" key={ph}>{phrases[ph].label}</span>
                <span className="arr">→</span>
              </button>
            </div>
            <div className="hero-search-hints" onClick={(e) => e.stopPropagation()}>
              <span className="mono">Try</span>
              <button onClick={() => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: 'M&A tax · Chennai' } }))}>M&A tax · Chennai</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: 'Cross-border compliance' } }))}>Cross-border compliance</button>
              <button onClick={() => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: 'IP counsel · EU' } }))}>IP counsel · EU</button>
            </div>
          </div>

          <div className="hero-trust">
            <div><b><Counter value={window.EXPERTLY_MEMBERS.length} suffix="+" /></b><span>Verified experts</span></div>
            <div><b><Counter value={20} suffix="+" /></b><span>Countries</span></div>
            <div><b><Counter value={12} /></b><span>Practice areas</span></div>
            <div><b><Counter value={100} suffix="+" /></b><span>Consultations matched</span></div>
          </div>

        </div>
      </div>
    </section>);

}

// ====================== GLOBAL SEARCH (command palette overlay) ======================
function GlobalSearch() {
  const [open, setOpen] = useS(false);
  const [q, setQ] = useS('');
  const [active, setActive] = useS(0);
  const inputRef = useR(null);
  const rotating = [
  'M&A tax advisor in Singapore under $500/hr',
  'Transfer pricing expert with BEPS 2.0 experience',
  'IP counsel for SaaS, EU + US coverage',
  'Restructuring partner — Italy, distressed debt'];
  const [ph, setPh] = useS(0);
  useE(() => {
    if (open) return;
    const t = setInterval(() => setPh((p) => (p + 1) % rotating.length), 3200);
    return () => clearInterval(t);
  }, [open]);

  useE(() => {
    const openHandler = (e) => {setOpen(true);if (e.detail && e.detail.q != null) setQ(e.detail.q);};
    window.addEventListener('expertly:search', openHandler);
    const keyHandler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {e.preventDefault();setOpen((o) => !o);}
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', keyHandler);
    return () => {window.removeEventListener('expertly:search', openHandler);window.removeEventListener('keydown', keyHandler);};
  }, []);

  useE(() => {
    if (open) {document.body.style.overflow = 'hidden';const t = setTimeout(() => inputRef.current && inputRef.current.focus(), 60);return () => clearTimeout(t);}
    document.body.style.overflow = '';
  }, [open]);

  const results = useM(() => {
    const term = q.trim().toLowerCase();
    const match = (s) => !term || term.split(/\s+/).every((w) => s.toLowerCase().includes(w));
    const members = window.EXPERTLY_MEMBERS.filter((m) => match(`${m.name} ${m.practice} ${m.location} ${m.title} ${m.firm}`)).slice(0, 5);
    const articles = window.EXPERTLY_ARTICLES.filter((a) => match(`${a.title} ${a.category} ${a.excerpt}`)).slice(0, 4);
    const events = window.EXPERTLY_EVENTS.filter((e) => match(`${e.title} ${e.category} ${e.city} ${e.country} ${e.desc}`)).slice(0, 3);
    return { members, articles, events, total: members.length + articles.length + events.length };
  }, [q]);

  const flat = useM(() => [
  ...results.members.map((m) => ({ type: 'member', href: `members.html#${m.id}`, data: m })),
  ...results.articles.map((a) => ({ type: 'article', href: `articles.html#${a.id}`, data: a })),
  ...results.events.map((e) => ({ type: 'event', href: `events.html#${e.id}`, data: e }))],
  [results]);

  useE(() => {setActive(0);}, [q]);

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {e.preventDefault();setActive((a) => Math.min(flat.length - 1, a + 1));}
    if (e.key === 'ArrowUp') {e.preventDefault();setActive((a) => Math.max(0, a - 1));}
    if (e.key === 'Enter' && flat[active]) {window.location.href = flat[active].href;}
  };

  const authorOf = (id) => window.EXPERTLY_MEMBERS.find((m) => m.id === id);
  const suggestions = ['M&A tax · Chennai', 'Cross-border compliance', 'IP counsel · EU', 'Transfer pricing', 'Capital markets · Tokyo'];

  return (
    <div className={`gsearch ${open ? 'open' : ''}`} aria-hidden={!open}>
      <div className="gsearch-backdrop" onClick={() => setOpen(false)} />
      <div className="gsearch-panel" role="dialog" aria-modal="true" aria-label="Search Expertly">
        <div className="gsearch-bar">
          <span className="gsearch-spark">✦</span>
          <input
            ref={inputRef}
            className="gsearch-input"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={`Ask anything — try "${rotating[ph]}"`} />
          {q && <button className="gsearch-clear" onClick={() => {setQ('');inputRef.current && inputRef.current.focus();}} aria-label="Clear">×</button>}
          <button className="gsearch-esc" onClick={() => setOpen(false)}>Esc</button>
        </div>

        <div className="gsearch-body">
          {!q.trim() &&
          <div className="gsearch-suggest">
              <div className="gsearch-suggest-label">Suggested searches</div>
              <div className="gsearch-suggest-row">
                {suggestions.map((s) => <button key={s} onClick={() => setQ(s)}>{s}</button>)}
              </div>
            </div>}


          {q.trim() && results.total === 0 &&
          <div className="gsearch-empty">
              <div className="gsearch-empty-spark">✦</div>
              <h4>No matches for “{q}”</h4>
              <p>Try a practice area, a jurisdiction, or a name.</p>
            </div>}


          {results.total > 0 &&
          <div className="gsearch-results" onMouseLeave={() => {}}>
              {results.members.length > 0 &&
            <div className="gsearch-group">
                  <div className="gsearch-group-head"><span>Experts</span><span className="gsearch-group-count">{results.members.length}</span></div>
                  {results.members.map((m) => {
                const idx = flat.findIndex((f) => f.type === 'member' && f.data.id === m.id);
                return (
                  <a key={m.id} href={`members.html#${m.id}`} className={`gsearch-row ${active === idx ? 'active' : ''}`} onMouseEnter={() => setActive(idx)}>
                        <Avatar member={m} size={40} />
                        <div className="gsearch-row-body">
                          <div className="gsearch-row-title">{m.name}{m.verified && <span className="float-tick"><CheckIcon /></span>}</div>
                          <div className="gsearch-row-meta">{m.title} · {m.location}</div>
                        </div>
                        <div className="gsearch-row-tag">{m.practice}</div>
                        <div className="gsearch-row-rate mono">{m.rate}</div>
                      </a>);

              })}
                </div>}


              {results.articles.length > 0 &&
            <div className="gsearch-group">
                  <div className="gsearch-group-head"><span>Articles</span><span className="gsearch-group-count">{results.articles.length}</span></div>
                  {results.articles.map((a) => {
                const idx = flat.findIndex((f) => f.type === 'article' && f.data.id === a.id);
                return (
                  <a key={a.id} href={`articles.html#${a.id}`} className={`gsearch-row ${active === idx ? 'active' : ''}`} onMouseEnter={() => setActive(idx)}>
                        <div className="gsearch-row-icon gsearch-icon-article">¶</div>
                        <div className="gsearch-row-body">
                          <div className="gsearch-row-title">{a.title}</div>
                          <div className="gsearch-row-meta">{authorOf(a.author) ? authorOf(a.author).name : ''} · {a.readTime} read</div>
                        </div>
                        <div className="gsearch-row-tag">{a.category}</div>
                      </a>);

              })}
                </div>}


              {results.events.length > 0 &&
            <div className="gsearch-group">
                  <div className="gsearch-group-head"><span>Events</span><span className="gsearch-group-count">{results.events.length}</span></div>
                  {results.events.map((e) => {
                const idx = flat.findIndex((f) => f.type === 'event' && f.data.id === e.id);
                return (
                  <a key={e.id} href={`events.html#${e.id}`} className={`gsearch-row ${active === idx ? 'active' : ''}`} onMouseEnter={() => setActive(idx)}>
                        <div className="gsearch-row-icon gsearch-icon-event"><b>{e.start.split(' ')[1]}</b><span>{e.start.split(' ')[0]}</span></div>
                        <div className="gsearch-row-body">
                          <div className="gsearch-row-title">{e.title}</div>
                          <div className="gsearch-row-meta">{e.city}, {e.country} · {e.format}</div>
                        </div>
                        <div className="gsearch-row-tag">{e.category}</div>
                      </a>);

              })}
                </div>}

            </div>}

        </div>

        <div className="gsearch-foot">
          <div className="gsearch-foot-keys">
            <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
            <span><kbd>↵</kbd> open</span>
            <span><kbd>esc</kbd> close</span>
          </div>
          <div className="gsearch-foot-brand"><span className="ai-pulse small" /> Powered by Expertly AI</div>
        </div>
      </div>
    </div>);

}

// ====================== FLOATING SEARCH LAUNCHER ======================
function FloatingSearch() {
  const [show, setShow] = useS(false);
  useE(() => {
    const onScroll = () => setShow(window.scrollY > 620);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  const openSearch = () => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: '' } }));
  return (
    <button className={`floating-search ${show ? 'show' : ''}`} onClick={openSearch} aria-label="Search Expertly">
      <span className="floating-search-spark">✦</span>
      <span className="floating-search-text">Search experts, articles & events</span>
      <span className="floating-search-kbd mono">⌘K</span>
    </button>);

}

// ====================== STAT BAND (dark contrast) ======================
function StatBand() {
  const stats = [
  { n: 0, suffix: '%', label: 'Commission on your fees', sub: 'We never take a cut' },
  { n: 5, suffix: '-day', label: 'Average verification', sub: 'Manually reviewed' },
  { n: 100, suffix: '%', label: 'Of client fees, yours', sub: 'You own the relationship' },
  { n: 2, suffix: '×', label: 'Peer references', sub: 'Required per member' }];

  return (
    <section className="statband">
      <div className="statband-glow" />
      <div className="container-wide">
        <div className="statband-head">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>Why practitioners choose Expertly</span>
          <h2 className="section-title" style={{ color: '#fff', marginTop: 14, maxWidth: 720 }}>
            A membership, <span className="accent-text">not a marketplace.</span>
          </h2>
        </div>
        <div className="statband-grid">
          {stats.map((s, i) =>
          <div className="statband-item" key={i}>
              <div className="statband-num"><Counter value={s.n} suffix={s.suffix} /></div>
              <div className="statband-label">{s.label}</div>
              <div className="statband-sub">{s.sub}</div>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ====================== STAT BAND END ======================
// ====================== FIRMS BAND (dark scrolling logo wall) ======================
function FirmsBand() {
  // Well-known firms + member firms (styled wordmarks; swap in real logos later)
  const wellKnown = ['Deloitte', 'PwC', 'EY', 'KPMG', 'Baker McKenzie', 'Clifford Chance', 'Linklaters', 'Allen & Overy'];
  const seen = {};
  const memberFirms = [];
  window.EXPERTLY_MEMBERS.forEach((m) => {
    if (!m.firm || m.firm === 'Independent' || seen[m.firm]) return;
    seen[m.firm] = true;
    memberFirms.push(m.firm);
  });
  const firms = [...wellKnown, ...memberFirms];
  const mono = (name) => {
    const w = name.replace(/&/g, '').split(/\s+/).filter(Boolean);
    return (((w[0] || '')[0] || '') + ((w[1] || '')[0] || (w[0] || '')[1] || '')).toUpperCase();
  };
  const half = Math.ceil(firms.length / 2);
  const rows = [firms.slice(0, half), firms.slice(half)];
  return (
    <section className="firms">
      <div className="firms-glow" />
      <div className="container-wide">
        <div className="firms-head">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>Where our members practice</span>
          <h2 className="section-title" style={{ color: '#fff', marginTop: 14, maxWidth: 760 }}>
            Senior counsel from firms that <span className="accent-text">set the standard.</span>
          </h2>
          <p className="lede" style={{ marginTop: 18, maxWidth: 560, color: 'rgba(255,255,255,0.6)' }}>
            From the Big Four to elite boutiques — our members are partners, founders, and senior counsel at respected firms across {20}+ jurisdictions.
          </p>
        </div>
      </div>
      <div className="firms-marquee">
        {rows.map((row, ri) =>
        <div className={`firms-row ${ri % 2 ? 'rev' : ''}`} key={ri}>
            <div className="firms-track" style={{ animationDuration: `${42 + ri * 8}s` }}>
              {[...row, ...row].map((f, i) =>
            <span className="firm-logo" key={i}>
                  <span className="firm-logo-name">{f}</span>
                </span>
            )}
            </div>
          </div>
        )}
      </div>
    </section>);

}

// ====================== AI SEARCH SECTION (dedicated) ======================
function AISearchSection() {
  return (
    <section className="ai-section">
      <div className="ai-section-glow" />
      <div className="container-wide">
        <div className="ai-section-grid">
          <div className="ai-section-text">
            <span className="eyebrow">Expertly AI · Intelligent discovery</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>
              Ask in plain English.<br />Get <span className="accent-text">exactly</span> who & what you need.
            </h2>
            <p className="lede" style={{ marginTop: 20, maxWidth: 480 }}>
              One query searches the entire network at once — no filters to fiddle with, no jargon required. Describe the matter and Expertly AI surfaces the right people, the relevant reading, and the events worth your time.
            </p>
            <ul className="ai-section-list">
              <li><span className="ai-list-tick"><CheckIcon /></span> <div><b>Verified experts</b> — matched by practice, jurisdiction & rate</div></li>
              <li><span className="ai-list-tick"><CheckIcon /></span> <div><b>Articles & insights</b> — peer-reviewed analysis on point</div></li>
              <li><span className="ai-list-tick"><CheckIcon /></span> <div><b>Upcoming events</b> — conferences and meetings that fit</div></li>
            </ul>
            <button className="btn btn-primary btn-lg" style={{ marginTop: 32 }} onClick={() => window.dispatchEvent(new CustomEvent('expertly:search', { detail: { q: '' } }))}>Try Expertly AI <span className="arr">→</span></button>
          </div>
          <div className="ai-section-demo">
            <AISearchDemo />
          </div>
        </div>
      </div>
    </section>);

}

// ====================== HERO - MOSAIC ======================
function HeroMosaic() {
  const members = window.EXPERTLY_MEMBERS;
  return (
    <section className="hero-mosaic-section">
      <div className="mosaic-bg">
        {members.slice(0, 30).concat(members).slice(0, 40).map((m, i) =>
        <div className="mosaic-bg-cell" key={i} style={{ animationDelay: `${i * 0.05 % 2}s` }}>
            <Avatar member={m} size={72} />
          </div>
        )}
      </div>
      <div className="mosaic-overlay" />
      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        <div className="hero-mosaic-content">
          <span className="eyebrow">Global Network · 2026</span>
          <h1 className="display" style={{ marginTop: 20 }}>
            The world's most<br />
            <span className="accent-text italic">discerning</span> network<br />
            of finance & legal experts.
          </h1>
          <p className="lede" style={{ maxWidth: 620, marginTop: 28, marginLeft: 'auto', marginRight: 'auto', textAlign: 'center' }}>
            Curated. Verified. Directly accessible. Skip the RFPs and find the right counsel in minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 36 }}>
            <a href="members.html" className="btn btn-primary btn-lg">Browse network <span className="arr">→</span></a>
            <a href="apply.html" className="btn btn-outline btn-lg">Apply to join</a>
          </div>
        </div>
      </div>
    </section>);

}

// ====================== HERO - EDITORIAL MASTHEAD ======================
function HeroEditorial() {
  return (
    <section className="hero-editorial">
      <div className="container-wide">
        <div className="masthead">
          <div className="masthead-left mono">
            <div>Vol. III · Issue 04</div>
            <div>{new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
          </div>
          <div className="masthead-center">Expertly</div>
          <div className="masthead-right mono">
            <div>{window.EXPERTLY_MEMBERS.length}+ Verified Experts</div>
            <div>20+ Jurisdictions</div>
          </div>
        </div>
        <div className="hero-ed-grid">
          <div className="hero-ed-main">
            <span className="eyebrow">Cover story · The curated network</span>
            <h1 className="display" style={{ marginTop: 16 }}>
              The world's most <em className="accent-text">trusted</em> finance & legal professionals — on one platform.
            </h1>
            <p className="lede" style={{ maxWidth: 540, marginTop: 24 }}>
              Every member is vetted by credentials, experience, and peer review. No junior associates. No middlemen. Just counsel that sees through.
            </p>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <a href="members.html" className="btn btn-primary btn-lg">Browse members <span className="arr">→</span></a>
              <a href="apply.html" className="btn btn-outline btn-lg">Apply</a>
            </div>
          </div>
          <div className="hero-ed-side">
            <div className="hero-ed-card">
              <span className="mono" style={{ color: 'var(--ink-3)', fontSize: 10, letterSpacing: '0.12em' }}>Featured This Week</span>
              <h3 style={{ fontSize: 22, fontWeight: 500, marginTop: 10, letterSpacing: '-0.015em', lineHeight: 1.15 }}>Transfer Pricing in 2026: BEPS 2.0 and What Comes Next</h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20 }}>
                <Avatar member={window.EXPERTLY_MEMBERS.find((m) => m.id === 'diego-martinez')} size={36} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>Diego Martínez</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>Transfer Pricing · 4 Min Read</div>
                </div>
              </div>
            </div>
            <div className="hero-ed-search">
              <input placeholder="Ask our network…" />
              <button className="btn btn-primary">⌕</button>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ====================== HOW IT WORKS ======================
function HowItWorks() {
  const steps = [
  { n: '01', t: 'Apply & verify', d: 'Submit credentials and references. Our team reviews every application — typically within 5 business days.', icon: '◐' },
  { n: '02', t: 'Build your profile', d: 'Publish articles, set rates, and define availability. Your reputation compounds with every engagement.', icon: '◑' },
  { n: '03', t: 'Get matched', d: 'Clients find you via AI search or inbound referrals. You set terms, you own the relationship — we take zero cut.', icon: '●' }];

  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="container-wide">
        <div className="section-head">
          <span className="eyebrow">Section 01 · How it works</span>
          <h2 className="section-title" style={{ marginTop: 16, maxWidth: 780 }}>
            A membership built for practitioners who are <em className="accent-text">serious</em> about their practice.
          </h2>
        </div>
        <div className="how-grid reveal-stagger">
          {steps.map((s) =>
          <div className="how-card" key={s.n}>
              <div className="how-num mono">{s.n}</div>
              <div className="how-icon">{s.icon}</div>
              <h3>{s.t}</h3>
              <p>{s.d}</p>
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ====================== PRACTICE AREAS (split, panel left) ======================
// ====================== MARQUEE PANEL (reusable) ======================
// Splits `items` into `rowCount` rows, each an independent horizontal marquee
// scrolling in alternating directions. Track content is duplicated for a seamless loop.
function MarqueePanel({ items, rowCount = 3, renderItem, speeds = [38, 46, 42] }) {
  const rows = Array.from({ length: rowCount }, () => []);
  items.forEach((it, i) => rows[i % rowCount].push(it));
  return (
    <div className="marquee">
      {rows.map((row, ri) =>
      <div className={`marquee-row ${ri % 2 ? 'rev' : ''}`} key={ri}>
          <div className="marquee-track" style={{ animationDuration: `${speeds[ri % speeds.length]}s` }}>
            {[...row, ...row].map((it, i) =>
          <React.Fragment key={i}>{renderItem(it, i)}</React.Fragment>
          )}
          </div>
        </div>
      )}
    </div>);

}

// ====================== PRACTICE AREAS (split, panel left) ======================
function PracticeAreas() {
  const areas = window.EXPERTLY_PRACTICE_AREAS;
  return (
    <section className="section split-section">
      <div className="container-wide">
        <div className="split-feature reveal">
          <div className="split-text">
            <span className="eyebrow">Coverage</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>Specialists across every corner of finance & law.</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              From M&A tax and transfer pricing to antitrust, capital markets, and IP — find a verified expert for the exact matter in front of you, in the jurisdiction that counts.
            </p>
            <div className="split-stats">
              <div><b><Counter value={47} /></b><span>M&A tax experts</span></div>
              <div><b><Counter value={62} /></b><span>Corporate counsel</span></div>
              <div><b><Counter value={44} /></b><span>Compliance pros</span></div>
            </div>
            <a href="members.html" className="btn btn-primary btn-lg" style={{ marginTop: 28 }}>Explore all practice areas <span className="arr">→</span></a>
          </div>
          <div className="split-panel split-panel-sky tall">
            <MarqueePanel
              items={areas}
              rowCount={4}
              speeds={[44, 52, 48, 56]}
              renderItem={(p) =>
              <a href={`members.html?practice=${encodeURIComponent(p.name)}`} className="m-pill" style={{ '--h': p.h }}>
                  <span className="m-pill-thumb">
                    <img src={p.img} alt="" loading="lazy" onError={(e) => e.target.classList.add('failed')} />
                  </span>
                  <span className="m-pill-body">
                    <span className="m-pill-name">{p.name}</span>
                    <span className="m-pill-count mono">{p.count} experts</span>
                  </span>
                </a>
              } />
            
          </div>
        </div>
      </div>
    </section>);

}

// ====================== FEATURED MEMBERS (split, panel right) ======================
function FeaturedMembers() {
  const members = window.EXPERTLY_MEMBERS;
  return (
    <section className="section split-section">
      <div className="container-wide">
        <div className="split-feature reverse reveal">
          <div className="split-text">
            <span className="eyebrow">Our Network</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>A boutique network of verified practitioners.</h2>
            <p className="lede" style={{ marginTop: 20 }}>
              Every member is credential-verified and peer-reviewed before they join. No junior associates, no middlemen — just senior counsel you can reach directly.
            </p>
            <div className="split-stats">
              <div><b><Counter value={window.EXPERTLY_MEMBERS.length} suffix="+" /></b><span>Verified members</span></div>
              <div><b><Counter value={20} suffix="+" /></b><span>Jurisdictions</span></div>
              <div><b><Counter value={12} /></b><span>Practice areas</span></div>
            </div>
            <a href="members.html" className="btn btn-primary btn-lg" style={{ marginTop: 28 }}>Browse all {window.EXPERTLY_MEMBERS.length}+ members <span className="arr">→</span></a>
          </div>
          <div className="split-panel split-panel-mint tall">
            <MarqueePanel
              items={members}
              rowCount={4}
              speeds={[46, 58, 50, 54]}
              renderItem={(m) =>
              <a href={`members.html#${m.id}`} className="m-chip">
                  <Avatar member={m} size={48} />
                  <div className="m-chip-body">
                    <div className="m-chip-name">{m.name}{m.verified && <span className="float-tick"><CheckIcon /></span>}</div>
                    <div className="m-chip-role">{m.title}</div>
                    <div className="m-chip-tags">
                      <span className="m-chip-tag">{m.practice}</span>
                      <span className="m-chip-loc"><svg className="m-chip-pin" viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M12 21s-6-5.3-6-10a6 6 0 1112 0c0 4.7-6 10-6 10z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="11" r="2.2" fill="currentColor"/></svg>{m.location}</span>
                    </div>
                  </div>
                </a>
              } />
            
          </div>
        </div>
      </div>
    </section>);

}

// ====================== MEMBER SPOTLIGHT ======================
function MemberSpotlight() {
  const m = window.EXPERTLY_MEMBERS[0];
  return (
    <section className="section spotlight">
      <div className="container-wide">
        <div className="spotlight-card reveal">
          <div className="spotlight-left">
            <span className="eyebrow">Member spotlight</span>
            <h2 className="section-title" style={{ marginTop: 20, letterSpacing: '-0.02em' }}>
              "Expertly gave me access to a calibre of clients I simply couldn't reach anywhere else."
            </h2>
            <div className="spotlight-author">
              <Avatar member={m} size={52} />
              <div>
                <div className="spotlight-name">Mukesh Kumar M <span className="verified"><CheckIcon /></span></div>
                <div className="spotlight-title mono">Co-Founder, M2K Advisors · Chennai</div>
              </div>
            </div>
            <div className="spotlight-stats">
              <div><b><Counter value={48} />+</b><span>Consultations / yr</span></div>
              <div><b><Counter value={14} /></b><span>Articles published</span></div>
              <div><b>3×</b><span>Inbound growth</span></div>
            </div>
          </div>
          <div className="spotlight-right">
            <div className="spotlight-visual">
              <div className="sv-bg" />
              <Avatar member={m} size={260} />
              <div className="sv-badge">
                <span className="mono">Verified</span>
                <div>18 years · M&A Tax</div>
              </div>
              <div className="sv-badge sv-badge-2">
                <span className="mono">Latest</span>
                <div>Stamp Duty Guide · APR 14</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>);

}

// ====================== LATEST ARTICLES ======================
function LatestArticles() {
  const [featured, ...rest] = window.EXPERTLY_ARTICLES.slice(0, 5);
  const authorOf = (id) => window.EXPERTLY_MEMBERS.find((m) => m.id === id);
  return (
    <section className="section articles-section">
      <div className="container-wide">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">Knowledge Base</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>Latest articles</h2>
          </div>
          <a href="articles.html" className="btn btn-outline">View all <span className="arr">→</span></a>
        </div>
        <div className="articles-grid reveal-stagger">
          <a href={`articles.html#${featured.id}`} className="article-featured">
            <div className="article-img">
              <span className="chip chip-ink" style={{ position: 'absolute', top: 20, left: 20 }}>{featured.category}</span>
              <img className="article-photo" src={featured.image} alt={featured.title} loading="lazy" />
            </div>
            <div className="article-featured-body">
              <div className="mono" style={{ fontSize: 11, color: 'var(--ink-3)', letterSpacing: '0.1em' }}>{featured.date} · {featured.readTime} Read</div>
              <h3>{featured.title}</h3>
              <p>{featured.excerpt}</p>
              <div className="article-author">
                <Avatar member={authorOf(featured.author)} size={36} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500 }}>{authorOf(featured.author)?.name}</div>
                  <div className="mono" style={{ fontSize: 10, color: 'var(--ink-3)' }}>{authorOf(featured.author)?.title}</div>
                </div>
              </div>
            </div>
          </a>
          <div className="articles-list">
            {rest.map((a, i) =>
            <a href={`articles.html#${a.id}`} key={a.id} className="article-row">
                <div className="article-row-num mono">0{i + 2}</div>
                <div className="article-row-body">
                  <div className="article-row-meta">
                    <span className="chip">{a.category}</span>
                    <span className="mono" style={{ fontSize: 10, color: 'var(--ink-3)', letterSpacing: '0.08em' }}>{a.readTime} · {a.date}</span>
                  </div>
                  <h4>{a.title}</h4>
                  <div className="article-row-author">
                    <Avatar member={authorOf(a.author)} size={24} />
                    <span>{authorOf(a.author)?.name}</span>
                  </div>
                </div>
              </a>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ====================== EVENTS ======================
function UpcomingEvents() {
  return (
    <section className="section events-section">
      <div className="container-wide">
        <div className="section-head-row">
          <div>
            <span className="eyebrow">Calendar</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>Be part of what's next</h2>
          </div>
          <a href="events.html" className="btn btn-outline">All events <span className="arr">→</span></a>
        </div>
        <div className="events-grid reveal-stagger">
          {window.EXPERTLY_EVENTS.slice(0, 4).map((e) =>
          <a href={`events.html#${e.id}`} key={e.id} className="event-card">
              <div className="event-date mono">
                <div className="event-date-start">{e.start}</div>
                {e.end && <div className="event-date-end">→ {e.end}</div>}
              </div>
              <div className="event-body">
                <div className="event-tags">
                  <span className="chip">{e.category}</span>
                  <span className="chip chip-dot" style={{ color: e.format === 'In Person' ? 'var(--ok)' : 'var(--accent)' }}>{e.format}</span>
                </div>
                <h3>{e.title}</h3>
                <p>{e.desc}</p>
                <div className="event-foot">
                  <span className="mono">📍 {e.city}, {e.country}</span>
                  <span className="event-register">Register →</span>
                </div>
              </div>
            </a>
          )}
        </div>
      </div>
    </section>);

}

// ====================== TRUST EXPLAINER ======================
function TrustExplainer() {
  const items = [
  { t: 'Credentials reviewed', d: 'Every qualification, bar admission, and professional registration is manually verified by our team.' },
  { t: 'Peer references', d: 'Two existing members must vouch for experience and standing before we extend an invitation.' },
  { t: 'Good standing', d: 'Members must maintain good standing with their professional bodies — annually re-attested.' },
  { t: 'Transparent rates', d: 'Members publish fees and availability upfront. No bait-and-switch, no middlemen marking up.' }];

  return (
    <section id="verified" className="section trust">
      <div className="container-wide">
        <div className="trust-grid">
          <div className="trust-left">
            <span className="eyebrow">Section 06 · Trust</span>
            <h2 className="section-title" style={{ marginTop: 16 }}>
              What <span className="verified-inline"><CheckIcon /> Verified</span> actually means.
            </h2>
            <p className="lede" style={{ marginTop: 20, maxWidth: 440 }}>
              Our verification is selective by design. We'd rather reject ten good applicants than admit one we can't vouch for.
            </p>
            <a href="#" className="btn btn-outline" style={{ marginTop: 28 }}>Read the verification standard <span className="arr">→</span></a>
          </div>
          <div className="trust-right reveal-stagger">
            {items.map((it, i) =>
            <div className="trust-item" key={it.t}>
                <div className="trust-num mono">0{i + 1}</div>
                <div>
                  <h4>{it.t}</h4>
                  <p>{it.d}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}

// ====================== TESTIMONIALS ======================
function Testimonials() {
  const [tab, setTab] = useS('members');
  const data = {
    members: [
    { q: "Expertly gave me access to a calibre of clients I simply couldn't reach anywhere else. Every enquiry is from someone who genuinely values expert advice.", who: 'priya-venkatesh' },
    { q: "My inbound consultation requests tripled within 60 days of going live. The right clients finally found me.", who: 'marcus-chen' },
    { q: "Publishing articles on Expertly built my professional brand faster than anything else I've tried.", who: 'amara-osei' },
    { q: "The network events alone justify the membership. Connections that would have taken years to build.", who: 'fatima-al-hassan' }],

    clients: [
    { q: "We replaced six months of RFPs with one afternoon on Expertly. Found the right M&A counsel in Chennai by Tuesday, signed by Friday.", who: 'oliver-schmidt' },
    { q: "The rate transparency alone is worth the membership. No surprises, no hourly creep, no mystery partners billing us.", who: 'elena-volkova' },
    { q: "Finally — a network where 'verified' actually means something. Every expert we've engaged delivered on the first conversation.", who: 'claire-dubois' }]

  };
  const m = (id) => window.EXPERTLY_MEMBERS.find((x) => x.id === id);
  return (
    <section className="section testimonials">
      <div className="container-wide">
        <div className="section-head">
          <span className="eyebrow">Voices</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Trusted by professionals worldwide.</h2>
          <div className="testimonial-tabs">
            <button className={tab === 'members' ? 'active' : ''} onClick={() => setTab('members')}>For members</button>
            <button className={tab === 'clients' ? 'active' : ''} onClick={() => setTab('clients')}>For clients</button>
          </div>
        </div>
        <div className="testimonial-grid reveal-stagger" key={tab}>
          {data[tab].map((t, i) => {
            const member = m(t.who);
            if (!member) return null;
            return (
              <figure className="testimonial-card" key={i}>
                <blockquote>"{t.q}"</blockquote>
                <figcaption>
                  <Avatar member={member} size={44} />
                  <div>
                    <div className="t-name">{member.name}</div>
                    <div className="mono t-meta">{member.title} · {member.location.split(',')[0]}</div>
                  </div>
                </figcaption>
              </figure>);

          })}
        </div>
      </div>
    </section>);

}

// ====================== DUAL CTA ======================
function DualCTA() {
  return (
    <section className="section dual-cta">
      <div className="container-wide">
        <div className="section-head">
          <span className="eyebrow">Two Ways In</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>One platform. Two ways in.</h2>
        </div>
        <div className="dual-grid">
          <div className="dual-card reveal">
            <div className="dual-label mono">For Clients & Businesses</div>
            <h3>Find the right expert. Fast.</h3>
            <ul>
              <li><CheckIcon /> Browse {window.EXPERTLY_MEMBERS.length}+ vetted finance & legal professionals</li>
              <li><CheckIcon /> Read expert articles on tax, law, M&A, compliance</li>
              <li><CheckIcon /> Request consultations directly — no middlemen</li>
              <li><CheckIcon /> Transparent rates upfront before you commit</li>
            </ul>
            <a href="members.html" className="btn btn-primary btn-lg">Browse members <span className="arr">→</span></a>
          </div>
          <div className="dual-card dual-card-dark reveal">
            <div className="dual-label mono">For Finance & Legal Pros</div>
            <h3>Build your professional presence.</h3>
            <ul>
              <li><CheckIcon /> Get discovered by clients globally</li>
              <li><CheckIcon /> Publish articles, establish authority</li>
              <li><CheckIcon /> Exclusive events with verified peers</li>
              <li><CheckIcon /> Set your rates, keep 100% of fees</li>
            </ul>
            <a href="apply.html" className="btn btn-outline btn-lg">Apply for membership <span className="arr">→</span></a>
          </div>
        </div>
      </div>
    </section>);

}

// ====================== FAQ ======================
function FAQ() {
  const groups = [
  { g: 'Joining & membership', items: [
    { q: 'Who can join Expertly?', a: "Expertly is open to all practising finance and legal professionals worldwide. Whether you're independent or part of a firm, if you're serious about your practice and looking for a trusted network of verified peers, Expertly is the right place for you." },
    { q: 'What types of professionals are on Expertly?', a: 'Our network spans tax advisors, M&A counsel, investment bankers, PE/VC advisors, insolvency professionals, corporate lawyers, dispute resolution counsel, banking & finance lawyers, capital markets lawyers, IP and technology lawyers, compliance professionals, forensic accountants, and valuation experts.' },
    { q: 'Budding vs. Seasoned — what\'s the difference?', a: 'A Budding Professional has 5–12 years of experience. A Seasoned Professional has 12+ years. Professionals with fewer than 5 years are not currently eligible, though we intend to introduce an associate category for early-career professionals.' },
    { q: 'What does membership cost?', a: 'Annual membership is $499 for Budding Professionals and $699 for Seasoned Professionals. We occasionally offer promotional discount codes for new members.' }]
  },
  { g: 'Using the platform', items: [
    { q: 'Is Expertly free to browse?', a: 'Yes. Anyone can browse the member directory, view article headlines, and view event listings without signing up. Full contact details, consultation requests, and full articles require a free user account.' },
    { q: 'What does the Verified badge actually mean?', a: 'The Verified badge is awarded only to profiles we have manually reviewed and approved — covering professional credentials, qualifications, and years of experience. If a section lacks the badge, it\'s either under review or not yet verified by our team.' },
    { q: 'Can I request a consultation?', a: 'Yes. Registered users and members can send consultation requests directly to any member. Members set their own availability and fee range — you always know what to expect upfront.' },
    { q: 'Does Expertly take a cut of fees?', a: 'No. We\'re a membership platform, not a marketplace. When a client pays you, 100% of that goes to you. You pay an annual membership fee, and the client relationship is yours to keep.' }]
  }];

  const [open, setOpen] = useS('g0-q0');
  return (
    <section id="pricing" className="section faq">
      <div className="container-wide">
        <div className="faq-head">
          <span className="eyebrow">Questions</span>
          <h2 className="section-title" style={{ marginTop: 16 }}>Common questions.</h2>
          <p className="lede" style={{ marginTop: 18, maxWidth: 520 }}>Still curious? Email us at <a href="mailto:contact@expertly.global" style={{ color: 'var(--accent)', textDecoration: 'underline' }}>contact@expertly.global</a> — we reply within one business day.</p>
        </div>
        <div className="faq-columns">
          {groups.map((g, gi) =>
          <div key={gi} className="faq-group">
              <h4 className="mono">{g.g}</h4>
              {g.items.map((item, ii) => {
              const id = `g${gi}-q${ii}`;
              const isOpen = open === id;
              return (
                <div className={`faq-item ${isOpen ? 'open' : ''}`} key={id}>
                    <button className="faq-q" onClick={() => setOpen(isOpen ? null : id)}>
                      <span>{item.q}</span>
                      <span className="faq-toggle">{isOpen ? '−' : '+'}</span>
                    </button>
                    <div className="faq-a"><p>{item.a}</p></div>
                  </div>);

            })}
            </div>
          )}
        </div>
      </div>
    </section>);

}

// ====================== NEWSLETTER ======================
function Newsletter() {
  const [email, setEmail] = useS('');
  const [sent, setSent] = useS(false);
  return (
    <section className="section newsletter">
      <div className="container-wide">
        <div className="newsletter-card">
          <div className="newsletter-bg" style={{ opacity: "1" }} />
          <div className="newsletter-content">
            <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.55)' }}>The Expertly Brief · Weekly</span>
            <h2 className="section-title" style={{ marginTop: 16, color: '#fff' }}>
              Regulatory changes. New members. Case studies.<br />
              <span style={{ color: 'rgba(255,255,255,0.55)' }}>One email, every Thursday.</span>
            </h2>
            <form className="newsletter-form" onSubmit={(e) => {e.preventDefault();setSent(true);}}>
              <input type="email" placeholder="you@firm.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <button className="btn btn-primary btn-lg" type="submit">{sent ? '✓ Subscribed' : 'Subscribe'}</button>
            </form>
            <p className="mono" style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', marginTop: 16, letterSpacing: '0.08em' }}>
              No spam · Unsubscribe anytime · 4,200+ professional readers
            </p>
          </div>
        </div>
      </div>
    </section>);

}

Object.assign(window, {
  AISearchDemo, AISearchSection, GlobalSearch, FloatingSearch, StatBand, FirmsBand,
  HeroSplit, HeroMosaic, HeroEditorial,
  HowItWorks, PracticeAreas, FeaturedMembers, MemberSpotlight,
  LatestArticles, UpcomingEvents, TrustExplainer, Testimonials,
  DualCTA, FAQ, Newsletter
});