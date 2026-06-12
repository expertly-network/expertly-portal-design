// Shared UI: Nav, Footer, utilities, reveal observer, tweaks panel
const { useState, useEffect, useRef, useMemo } = React;

// Logo
function Logo({ size = 23 }) {
  return (
    <span className="nav-logo" style={{ fontSize: size }}>
      Expertly<span className="dot" />
    </span>);

}

function Nav({ active }) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const p = Math.min(1, Math.max(0, window.scrollY / 80));
      document.documentElement.style.setProperty('--nav-p', p.toFixed(3));
      setScrolled(window.scrollY > 8);
    };
    const onScroll = () => {if (!raf) raf = requestAnimationFrame(update);};
    window.addEventListener('scroll', onScroll, { passive: true });
    update();
    return () => {window.removeEventListener('scroll', onScroll);if (raf) cancelAnimationFrame(raf);};
  }, []);
  return (
    <nav className={`nav ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <a href="index.html"><Logo /></a>
        <div className="nav-links">
          <a href="members.html" className={active === 'members' ? 'active' : ''}>Members</a>
          <a href="articles.html" className={active === 'articles' ? 'active' : ''}>Articles</a>
          <a href="events.html" className={active === 'events' ? 'active' : ''}>Events</a>
          <a href="how-it-works.html" className={active === 'how' ? 'active' : ''}>How it works</a>
          <a href="pricing.html" className={active === 'pricing' ? 'active' : ''}>Pricing</a>
        </div>
        <div className="nav-actions">
          <a href="login.html" className="btn btn-ghost">Log in</a>
          <a href="apply.html" className="btn btn-primary">Apply <span className="arr">→</span></a>
        </div>
      </div>
    </nav>);

}

function Footer() {
  return (
    <footer className="footer">
      <div className="container-wide">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="wordmark">Expertly<span style={{ width: 9, height: 9, background: 'var(--accent)', borderRadius: '50%', display: 'inline-block', marginLeft: 2 }}></span></div>
            <p>The curated professional network for verified finance & legal experts worldwide.</p>
          </div>
          <div>
            <h4>Platform</h4>
            <ul>
              <li><a href="members.html">Member Directory</a></li>
              <li><a href="articles.html">Articles</a></li>
              <li><a href="events.html">Events</a></li>
              <li><a href="apply.html">Apply for Membership</a></li>
            </ul>
          </div>
          <div>
            <h4>About</h4>
            <ul>
              <li><a href="#">Our Mission</a></li>
              <li><a href="#">How It Works</a></li>
              <li><a href="#">Verified Experts</a></li>
              <li><a href="#">Membership Benefits</a></li>
            </ul>
          </div>
          <div>
            <h4>Contact</h4>
            <ul>
              <li><a href="mailto:contact@expertly.global">contact@expertly.global</a></li>
              <li><a href="#">LinkedIn</a></li>
              <li><a href="#">Privacy Policy</a></li>
              <li><a href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 Expertly · All Rights Reserved</span>
          <span>Verified · Global · Independent</span>
        </div>
      </div>
    </footer>);

}

// Checkmark
function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>);

}

// Avatar
function Avatar({ member, size = 40 }) {
  return (
    <div className="avatar" style={{ width: size, height: size, fontSize: size * 0.35 }} data-initials={member.initials}>
      <span className="avatar-initials" aria-hidden="true">{member.initials}</span>
      {member.img ? <img src={member.img} alt="" loading="lazy" onLoad={(e) => e.target.classList.add('loaded')} /> : null}
    </div>);

}

// Reveal on scroll — handled by plain-JS assets/reveal.js (resilient to React's late render).
function useReveal() {}

// Animated counter
function Counter({ value, suffix = '', duration = 1600 }) {
  const [n, setN] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);
  useEffect(() => {
    if (!ref.current) return;
    const animate = () => {
      if (started.current) return;
      started.current = true;
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setN(Math.floor(value * eased));
        if (p < 1) requestAnimationFrame(tick);else
        setN(value);
      };
      requestAnimationFrame(tick);
    };
    const check = () => {
      if (started.current || !ref.current) return;
      const vh = window.innerHeight || document.documentElement.clientHeight;
      const r = ref.current.getBoundingClientRect();
      if (r.top < vh - 20 && r.bottom > 0) {
        animate();
        window.removeEventListener('scroll', onScroll);
      }
    };
    let ticking = false;
    const onScroll = () => {if (!ticking) {ticking = true;requestAnimationFrame(() => {ticking = false;check();});}};
    check();
    const t = setTimeout(check, 300);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {clearTimeout(t);window.removeEventListener('scroll', onScroll);};
  }, [value, duration]);
  return <span ref={ref}>{n}{suffix}</span>;
}

// Tweaks panel (aesthetic variants)
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "theme": "editorial",
  "heroStyle": "split",
  "showGrid": true
} /*EDITMODE-END*/;

function TweaksPanel() {
  const [available, setAvailable] = useState(false);
  const [open, setOpen] = useState(false);
  const [state, setState] = useState(TWEAK_DEFAULTS);

  useEffect(() => {
    const applyTheme = (t) => {
      const map = { editorial: '', navy: 'navy', sage: 'sage' };
      document.documentElement.setAttribute('data-theme', map[t] || '');
    };
    applyTheme(state.theme);
    document.documentElement.setAttribute('data-hero', state.heroStyle || 'split');
    document.documentElement.setAttribute('data-grid', state.showGrid ? '1' : '0');
  }, [state]);

  useEffect(() => {
    const onMsg = (e) => {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setAvailable(true);
      if (e.data.type === '__deactivate_edit_mode') {setAvailable(false);setOpen(false);}
    };
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const update = (patch) => {
    const next = { ...state, ...patch };
    setState(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: patch }, '*');
  };

  if (!available) return null;

  return (
    <>
      {!open &&
      <button className="tweaks-fab" style={{ display: 'flex' }} onClick={() => setOpen(true)}>Tweaks</button>
      }
      <div className={`tweaks-panel ${open ? 'open' : ''}`}>
        <h3>Tweaks <button onClick={() => setOpen(false)}>×</button></h3>
        <div className="tweak-group">
          <label>Aesthetic</label>
          <div className="radio-row">
            {[
            { k: 'editorial', name: 'Neon Mint', c: '#00C99E' },
            { k: 'navy', name: 'Neon Lilac', c: '#8A6BFF' },
            { k: 'sage', name: 'Neon Sky', c: '#34A8FF' }].
            map((o) =>
            <button key={o.k} className={state.theme === o.k ? 'active' : ''} onClick={() => update({ theme: o.k })}>
                <span className="swatch" style={{ background: o.c }} />{o.name}
              </button>
            )}
          </div>
        </div>
        <div className="tweak-group">
          <label>Hero style</label>
          <div className="radio-row">
            {[
            { k: 'split', name: 'Split · members preview' },
            { k: 'mosaic', name: 'Mosaic · full-bleed grid' },
            { k: 'editorial', name: 'Editorial · masthead' }].
            map((o) =>
            <button key={o.k} className={state.heroStyle === o.k ? 'active' : ''} onClick={() => update({ heroStyle: o.k })}>
                {o.name}
              </button>
            )}
          </div>
        </div>
        <div className="tweak-group">
          <label>Background grid</label>
          <div className="radio-row">
            <button className={state.showGrid ? 'active' : ''} onClick={() => update({ showGrid: !state.showGrid })}>
              {state.showGrid ? '◉ On' : '○ Off'}
            </button>
          </div>
        </div>
      </div>
    </>);

}

Object.assign(window, { Logo, Nav, Footer, Avatar, CheckIcon, useReveal, Counter, TweaksPanel });