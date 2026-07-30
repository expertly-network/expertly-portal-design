/* Ambient hero canvas — one shared engine, a different motif per page topic.
   Each <canvas class="hero-mesh" data-motif="..."> in a dark hero picks up
   the matching renderer below. Purely decorative: pointer-events none,
   respects prefers-reduced-motion. */
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const MINT_LINE = (a) => `rgba(0,201,158,${a})`;
  const MINT_DOT = (a) => `rgba(139,252,216,${a})`;

  function host(canvas) { return canvas.closest('section') || canvas.parentElement; }

  function sized(canvas, onResize) {
    let w, h;
    function resize() {
      w = host(canvas).clientWidth;
      h = host(canvas).clientHeight;
      canvas.width = w;
      canvas.height = h;
      onResize(w, h);
    }
    resize();
    window.addEventListener('resize', resize);
    return () => [w, h];
  }

  function loop(fn) { (function frame() { fn(); requestAnimationFrame(frame); })(); }

  /* ── network: drifting nodes + proximity links (dashboard: the member network) ── */
  function network(canvas, density) {
    const ctx = canvas.getContext('2d');
    let nodes = [];
    const COUNT = density || 26, LINK = 150, SPEED = 0.32;
    const dims = sized(canvas, (w, h) => {
      nodes = Array.from({ length: COUNT }, () => ({
        x: w * 0.42 + Math.random() * w * 0.58,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * SPEED,
        vy: (Math.random() - 0.5) * SPEED,
        r: 1.5 + Math.random() * 2
      }));
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < w * 0.38 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < LINK) { ctx.strokeStyle = MINT_LINE(0.22 * (1 - d / LINK)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke(); }
      }
      for (const n of nodes) { ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.85); ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2); ctx.fill(); }
    });
  }

  /* ── cluster: members — loose groups of nodes (communities), sparse cross-links ── */
  function cluster(canvas) {
    const ctx = canvas.getContext('2d');
    let groups = [];
    const dims = sized(canvas, (w, h) => {
      const centers = [
        { x: w * 0.62, y: h * 0.28 }, { x: w * 0.85, y: h * 0.55 }, { x: w * 0.6, y: h * 0.78 }
      ];
      groups = centers.map(c => ({
        c, nodes: Array.from({ length: 7 }, () => ({
          a: Math.random() * Math.PI * 2, rad: 18 + Math.random() * 34,
          spin: (Math.random() - 0.5) * 0.014, r: 1.6 + Math.random() * 1.8
        }))
      }));
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      for (const g of groups) {
        const pts = g.nodes.map(n => { n.a += n.spin; return { x: g.c.x + Math.cos(n.a) * n.rad, y: g.c.y + Math.sin(n.a) * n.rad, r: n.r }; });
        for (let i = 0; i < pts.length; i++) for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i].x - pts[j].x, pts[i].y - pts[j].y);
          if (d < 46) { ctx.strokeStyle = MINT_LINE(0.28 * (1 - d / 46)); ctx.lineWidth = 1; ctx.beginPath(); ctx.moveTo(pts[i].x, pts[i].y); ctx.lineTo(pts[j].x, pts[j].y); ctx.stroke(); }
        }
        for (const p of pts) { ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.85); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill(); }
      }
      for (let i = 0; i < groups.length; i++) for (let j = i + 1; j < groups.length; j++) {
        ctx.strokeStyle = MINT_LINE(0.1); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(groups[i].c.x, groups[i].c.y); ctx.lineTo(groups[j].c.x, groups[j].c.y); ctx.stroke();
      }
    });
  }

  /* ── connect: peer-connect — one hub node connected to several others at
     once (1-to-many), each with its own slow travelling pulse, staggered
     so they don't all move in lockstep. ── */
  function connect(canvas) {
    const ctx = canvas.getContext('2d');
    const HUB = { x: 0.56, y: 0.5 };
    const SATS = [
      { x: 0.88, y: 0.18 },
      { x: 0.96, y: 0.42 },
      { x: 0.92, y: 0.68 },
      { x: 0.76, y: 0.86 },
      { x: 0.68, y: 0.14 }
    ];
    const PERIOD = 150; // slower than the old 1-to-1 pulse (was 60 frames)
    let frame = 0;
    const dims = sized(canvas, () => {});
    function bez(p0, p1, p2, s) {
      const x = (1 - s) * (1 - s) * p0.x + 2 * (1 - s) * s * p1.x + s * s * p2.x;
      const y = (1 - s) * (1 - s) * p0.y + 2 * (1 - s) * s * p1.y + s * s * p2.y;
      return { x, y };
    }
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      frame++;
      const C = { x: HUB.x * w, y: HUB.y * h };
      SATS.forEach((sf, i) => {
        const S = { x: sf.x * w, y: sf.y * h };
        const mid = { x: (C.x + S.x) / 2, y: (C.y + S.y) / 2 - 34 };
        ctx.strokeStyle = MINT_LINE(0.22); ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(C.x, C.y); ctx.quadraticCurveTo(mid.x, mid.y, S.x, S.y); ctx.stroke();
        const phase = i / SATS.length;
        const t = ((frame + phase * PERIOD) % PERIOD) / PERIOD;
        const p = bez(C, mid, S, t);
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.9 * (1 - Math.abs(t - 0.5) * 0.6)); ctx.arc(p.x, p.y, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.8); ctx.arc(S.x, S.y, 3.4, 0, Math.PI * 2); ctx.fill();
      });
      ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.95); ctx.arc(C.x, C.y, 5.5, 0, Math.PI * 2); ctx.fill();
    });
  }

  /* ── orbit: events — concentric rings, dots moving at their own pace (a schedule) ── */
  function orbit(canvas) {
    const ctx = canvas.getContext('2d');
    let cx, cy, rings;
    const dims = sized(canvas, (w, h) => {
      cx = w * 0.78; cy = h * 0.5;
      rings = [
        { r: 46, speed: 0.018, dots: [0] },
        { r: 82, speed: -0.012, dots: [0, Math.PI] },
        { r: 118, speed: 0.008, dots: [0, Math.PI * 0.66, Math.PI * 1.33] }
      ];
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      for (const ring of rings) {
        ctx.strokeStyle = MINT_LINE(0.16); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(cx, cy, ring.r, 0, Math.PI * 2); ctx.stroke();
        ring.dots = ring.dots.map(a => a + ring.speed);
        for (const a of ring.dots) {
          const x = cx + Math.cos(a) * ring.r, y = cy + Math.sin(a) * ring.r;
          ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.9); ctx.arc(x, y, 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.5); ctx.arc(cx, cy, 2, 0, Math.PI * 2); ctx.fill();
    });
  }

  /* ── grid: templates — blueprint grid, intersection dots quietly pulsing ── */
  function grid(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, cells, t = 0;
    const dims = sized(canvas, (ww, hh) => {
      w = ww; h = hh;
      cells = [];
      const step = 44, x0 = w * 0.4;
      for (let x = x0; x < w; x += step) for (let y = 0; y < h; y += step) {
        cells.push({ x, y, phase: Math.random() * Math.PI * 2 });
      }
    });
    loop(() => {
      const [ww, hh] = dims();
      ctx.clearRect(0, 0, ww, hh);
      const step = 44, x0 = ww * 0.4;
      ctx.strokeStyle = 'rgba(255,255,255,0.05)'; ctx.lineWidth = 1;
      for (let x = x0; x < ww; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, hh); ctx.stroke(); }
      for (let y = 0; y < hh; y += step) { ctx.beginPath(); ctx.moveTo(x0, y); ctx.lineTo(ww, y); ctx.stroke(); }
      t += 0.02;
      for (const c of cells) {
        const a = 0.15 + 0.35 * (0.5 + 0.5 * Math.sin(t + c.phase));
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(a); ctx.arc(c.x, c.y, 2, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  /* ── cards: articles — small article-card outlines drifting and gently
     stacking/overlapping as they cross, like a feed of pieces settling ── */
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function cards(canvas) {
    const ctx = canvas.getContext('2d');
    let list = [];
    function makeCard(w, h, anyY) {
      return {
        x: w * 0.52 + Math.random() * (w * 0.44),
        y: anyY ? Math.random() * h : -50,
        w: 46 + Math.random() * 30,
        h: 30 + Math.random() * 18,
        rot: (Math.random() - 0.5) * 0.22,
        vy: 0.13 + Math.random() * 0.16,
        vx: (Math.random() - 0.5) * 0.05,
        op: 0.14 + Math.random() * 0.16
      };
    }
    const dims = sized(canvas, (w, h) => {
      list = Array.from({ length: 8 }, () => makeCard(w, h, true));
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      const x0 = w * 0.5;
      for (const c of list) {
        c.y += c.vy; c.x += c.vx;
        if (c.y - c.h > h + 20) Object.assign(c, makeCard(w, h, false));
        if (c.x < x0) c.x = x0;
        ctx.save();
        ctx.translate(c.x, c.y);
        ctx.rotate(c.rot);
        ctx.strokeStyle = MINT_LINE(c.op); ctx.lineWidth = 1.4;
        roundRect(ctx, -c.w / 2, -c.h / 2, c.w, c.h, 6); ctx.stroke();
        ctx.strokeStyle = MINT_LINE(c.op * 1.4); ctx.lineWidth = 2; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(-c.w / 2 + 7, -c.h / 2 + 9); ctx.lineTo(-c.w / 2 + 7 + c.w * 0.42, -c.h / 2 + 9); ctx.stroke();
        ctx.strokeStyle = MINT_LINE(c.op * 0.85); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(-c.w / 2 + 7, -c.h / 2 + 18); ctx.lineTo(c.w / 2 - 7, -c.h / 2 + 18); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(-c.w / 2 + 7, -c.h / 2 + 25); ctx.lineTo(c.w / 2 - 20, -c.h / 2 + 25); ctx.stroke();
        ctx.restore();
      }
    });
  }

  /* ── rise: learnings — particles drifting upward (progress, growth) ── */
  function rise(canvas) {
    const ctx = canvas.getContext('2d');
    let parts = [];
    const dims = sized(canvas, (w, h) => {
      parts = Array.from({ length: 24 }, () => ({
        x: w * 0.4 + Math.random() * w * 0.58,
        y: Math.random() * h,
        r: 1.2 + Math.random() * 2.4,
        speed: 0.15 + Math.random() * 0.35,
        drift: (Math.random() - 0.5) * 0.15
      }));
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      const x0 = w * 0.38;
      for (const p of parts) {
        p.y -= p.speed; p.x += p.drift;
        if (p.y < -6) { p.y = h + 6; p.x = x0 + Math.random() * (w - x0); }
        if (p.x < x0) p.x = x0; if (p.x > w) p.x = w;
        const fade = Math.min(1, (h - p.y) / (h * 0.15));
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.7 * Math.min(fade, 1)); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  /* ── sparkle: perks — twinkling points, an occasional small flash ── */
  function sparkle(canvas) {
    const ctx = canvas.getContext('2d');
    let stars = [], t = 0;
    const dims = sized(canvas, (w, h) => {
      stars = Array.from({ length: 30 }, () => ({
        x: w * 0.4 + Math.random() * w * 0.58, y: Math.random() * h,
        r: 1 + Math.random() * 1.8, phase: Math.random() * Math.PI * 2, speed: 0.02 + Math.random() * 0.03,
        big: Math.random() < 0.12
      }));
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      t += 1;
      for (const s of stars) {
        const a = 0.25 + 0.55 * (0.5 + 0.5 * Math.sin(t * s.speed + s.phase));
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(a); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2); ctx.fill();
        if (s.big && a > 0.65) {
          ctx.strokeStyle = MINT_DOT(a * 0.6); ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(s.x - 6, s.y); ctx.lineTo(s.x + 6, s.y);
          ctx.moveTo(s.x, s.y - 6); ctx.lineTo(s.x, s.y + 6); ctx.stroke();
        }
      }
    });
  }

  /* ── pulse: consultations — paired nodes exchanging a travelling signal ── */
  function pulse(canvas) {
    const ctx = canvas.getContext('2d');
    let pairs = [];
    const dims = sized(canvas, (w, h) => {
      pairs = Array.from({ length: 5 }, () => {
        const y = Math.random() * h;
        const x1 = w * 0.42 + Math.random() * w * 0.4;
        return { x1, y1: y, x2: x1 + 50 + Math.random() * 60, y2: y + (Math.random() - 0.5) * 40, t: Math.random(), speed: 0.006 + Math.random() * 0.006, dir: 1 };
      });
    });
    loop(() => {
      const [w, h] = dims();
      ctx.clearRect(0, 0, w, h);
      for (const p of pairs) {
        ctx.strokeStyle = MINT_LINE(0.22); ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.stroke();
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.85); ctx.arc(p.x1, p.y1, 3, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(0.85); ctx.arc(p.x2, p.y2, 3, 0, Math.PI * 2); ctx.fill();
        p.t += p.speed * p.dir;
        if (p.t > 1 || p.t < 0) p.dir *= -1;
        const px = p.x1 + (p.x2 - p.x1) * p.t, py = p.y1 + (p.y2 - p.y1) * p.t;
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(1); ctx.arc(px, py, 2.4, 0, Math.PI * 2); ctx.fill();
      }
    });
  }

  /* ── scan: admin — a sweeping line brightening a data grid as it passes ── */
  function scan(canvas) {
    const ctx = canvas.getContext('2d');
    let w, h, dots, sweepY = 0;
    const dims = sized(canvas, (ww, hh) => {
      w = ww; h = hh; dots = [];
      const step = 30, x0 = w * 0.4;
      for (let x = x0; x < w; x += step) for (let y = 0; y < h; y += step) dots.push({ x, y });
    });
    loop(() => {
      const [ww, hh] = dims();
      ctx.clearRect(0, 0, ww, hh);
      sweepY = (sweepY + 0.9) % (hh + 60);
      for (const d of dots) {
        const dist = Math.abs(d.y - sweepY);
        const a = Math.max(0.08, 0.7 - dist / 60);
        ctx.beginPath(); ctx.fillStyle = MINT_DOT(a); ctx.arc(d.x, d.y, 1.6, 0, Math.PI * 2); ctx.fill();
      }
      const grad = ctx.createLinearGradient(0, sweepY - 18, 0, sweepY + 18);
      grad.addColorStop(0, 'rgba(0,201,158,0)'); grad.addColorStop(0.5, 'rgba(0,201,158,0.16)'); grad.addColorStop(1, 'rgba(0,201,158,0)');
      ctx.fillStyle = grad; ctx.fillRect(ww * 0.4, sweepY - 18, ww * 0.6, 36);
    });
  }

  const MOTIFS = { network, cluster, connect, orbit, grid, cards, rise, sparkle, pulse, scan };

  function init() {
    document.querySelectorAll('canvas.hero-mesh[data-motif]').forEach(canvas => {
      const fn = MOTIFS[canvas.dataset.motif];
      if (fn) fn(canvas);
    });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
