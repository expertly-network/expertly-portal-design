const { useState: uS } = React;

// ============ LOGIN PAGE ============
function LoginPage() {
  const [mode, setMode] = uS('login');
  const [role, setRole] = uS('member');

  return (
    <>
      <Nav />
      <main className="auth-main">
        <div className="auth-grid">
          <div className="auth-left">
            <a href="index.html" className="auth-logo">
              Expertly<span style={{width:9,height:9,background:'var(--accent)',borderRadius:'50%',display:'inline-block'}}></span>
            </a>

            <div className="auth-tabs">
              <button className={mode==='login'?'active':''} onClick={()=>setMode('login')}>Log in</button>
              <button className={mode==='signup'?'active':''} onClick={()=>setMode('signup')}>Create account</button>
            </div>

            <div className="auth-card">
              <h1 className="auth-title">
                {mode==='login' ? 'Welcome back.' : 'Create your Expertly account.'}
              </h1>
              <p className="auth-sub">
                {mode==='login'
                  ? 'Sign in to access the directory, send consultation requests, and manage your profile.'
                  : 'Free. Takes 30 seconds. No credit card required.'}
              </p>

              {mode==='signup' && (
                <div className="auth-role">
                  <label className="mono">I Am A</label>
                  <div className="auth-role-grid">
                    <button className={role==='client'?'active':''} onClick={()=>setRole('client')}>
                      <span className="mono">01</span>
                      <b>Client / Business</b>
                      <em>Looking to hire an expert</em>
                    </button>
                    <button className={role==='member'?'active':''} onClick={()=>setRole('member')}>
                      <span className="mono">02</span>
                      <b>Finance / Legal Pro</b>
                      <em>Joining the network</em>
                    </button>
                  </div>
                </div>
              )}

              <button className="auth-sso">
                <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.64-.06-1.25-.17-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92c1.7-1.57 2.68-3.88 2.68-6.62z"/><path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.84.86-3.04.86-2.35 0-4.33-1.58-5.04-3.7H.92v2.33A9 9 0 009 18z"/><path fill="#FBBC05" d="M3.96 10.72A5.4 5.4 0 013.68 9c0-.6.1-1.18.28-1.72V4.95H.92A9 9 0 000 9c0 1.45.35 2.82.92 4.05l3.04-2.33z"/><path fill="#EA4335" d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58A9 9 0 009 0 9 9 0 00.92 4.95L3.96 7.28C4.67 5.16 6.65 3.58 9 3.58z"/></svg>
                Continue with Google
              </button>
              <button className="auth-sso">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="#0077B5"><path d="M20.5 2h-17A1.5 1.5 0 002 3.5v17A1.5 1.5 0 003.5 22h17a1.5 1.5 0 001.5-1.5v-17A1.5 1.5 0 0020.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 118.3 6.5a1.78 1.78 0 01-1.8 1.75zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0013 14.2V19h-3v-9h2.9v1.3a3.11 3.11 0 012.7-1.4c1.55 0 3.36.86 3.36 3.66z"/></svg>
                Continue with LinkedIn
              </button>

              <div className="auth-divider"><span>or</span></div>

              <form className="auth-form" onSubmit={e=>e.preventDefault()}>
                {mode==='signup' && (
                  <div className="auth-field">
                    <label>Full name</label>
                    <input type="text" placeholder="Your name"/>
                  </div>
                )}
                <div className="auth-field">
                  <label>Work email</label>
                  <input type="email" placeholder="you@firm.com"/>
                </div>
                <div className="auth-field">
                  <label>Password {mode==='login' && <a href="#" className="auth-forgot">Forgot?</a>}</label>
                  <input type="password" placeholder="••••••••"/>
                </div>
                {mode==='login' && (
                  <label className="auth-check">
                    <input type="checkbox" /> <span>Keep me signed in for 30 days</span>
                  </label>
                )}
                <button className="btn btn-primary btn-lg" type="submit" style={{width:'100%'}}>
                  {mode==='login' ? 'Sign in' : 'Create account'} <span className="arr">→</span>
                </button>
              </form>

              <p className="auth-foot">
                {mode==='login' ? "Don't have an account? " : "Already registered? "}
                <a href="#" onClick={e=>{e.preventDefault();setMode(mode==='login'?'signup':'login');}}>
                  {mode==='login' ? 'Create one' : 'Sign in'}
                </a>
              </p>

              {mode==='signup' && role==='member' && (
                <div className="auth-note">
                  <span className="mono">Note</span>
                  A free account lets you browse and hire. To list your profile as a verified expert, you must also <a href="apply.html">apply for membership →</a>
                </div>
              )}
            </div>
          </div>

          <aside className="auth-right">
            <div className="auth-right-inner">
              <span className="eyebrow" style={{color:'rgba(255,255,255,0.6)'}}>Trusted by professionals in</span>
              <div className="auth-logos">
                {['London','New York','Singapore','Dubai','Chennai','Frankfurt','Tokyo','Paris','Lagos','Madrid','Milan','Mumbai'].map(c=>(
                  <div key={c} className="mono">{c}</div>
                ))}
              </div>
              <div className="auth-quote">
                <blockquote>"The right clients finally found me. Expertly tripled my inbound in 60 days."</blockquote>
                <figcaption>
                  <Avatar member={window.EXPERTLY_MEMBERS.find(m=>m.id==='marcus-chen')} size={40}/>
                  <div>
                    <div style={{fontWeight:500, color:'#fff'}}>Marcus Chen</div>
                    <div className="mono" style={{fontSize:10, color:'rgba(255,255,255,0.55)'}}>Senior Tax Advisor · Singapore</div>
                  </div>
                </figcaption>
              </div>
              <div className="auth-stats">
                <div><b>{window.EXPERTLY_MEMBERS.length}+</b><span>Verified experts</span></div>
                <div><b>20+</b><span>Countries</span></div>
                <div><b>100+</b><span>Consultations</span></div>
              </div>
            </div>
          </aside>
        </div>
      </main>
      <TweaksPanel />
    </>
  );
}

// ============ PRICING PAGE ============
function PricingPage() {
  const [billing, setBilling] = uS('annual');
  const plans = [
    {
      name: 'Budding Professional',
      tag: '5–12 years experience',
      price: billing==='annual' ? 499 : 49,
      unit: billing==='annual' ? '/year' : '/month',
      note: billing==='annual' ? 'Billed annually · Best value' : 'Billed monthly · Cancel anytime',
      features: [
        'Listed in verified member directory',
        'Publish unlimited articles',
        'Receive consultation requests',
        'Access member-only events',
        'Set your own rates & availability',
        'Keep 100% of client fees',
      ],
    },
    {
      name: 'Seasoned Professional',
      tag: '12+ years experience',
      price: billing==='annual' ? 699 : 69,
      unit: billing==='annual' ? '/year' : '/month',
      note: billing==='annual' ? 'Billed annually · Best value' : 'Billed monthly · Cancel anytime',
      featured: true,
      features: [
        'Everything in Budding, plus:',
        'Priority placement in AI search',
        'Featured member spotlight rotation',
        'Private cohort: "Senior Counsel Circle"',
        'Dedicated account manager',
        'Co-branded publishing opportunities',
        'Early access to new clients',
      ],
    },
  ];
  const compare = [
    { f: 'Verified profile in directory', b: true, s: true },
    { f: 'Unlimited article publishing', b: true, s: true },
    { f: 'Consultation requests', b: true, s: true },
    { f: 'Member-only events access', b: true, s: true },
    { f: 'Keep 100% of consultation fees', b: true, s: true },
    { f: 'AI-search priority ranking', b: false, s: true },
    { f: 'Featured spotlight rotation', b: false, s: true },
    { f: 'Senior Counsel Circle (private)', b: false, s: true },
    { f: 'Dedicated account manager', b: false, s: true },
    { f: 'Co-branded publishing', b: false, s: true },
  ];
  return (
    <>
      <Nav />
      <main>
        <section className="pricing-hero">
          <div className="container-wide">
            <span className="eyebrow">Pricing · No commission. No middlemen.</span>
            <h1 className="display" style={{marginTop:20, maxWidth:900}}>
              Membership that <em className="accent-text" style={{fontFamily:"'Instrument Serif', Georgia, serif", fontStyle:'italic', fontWeight:400}}>pays for itself</em> in a single consultation.
            </h1>
            <p className="lede" style={{marginTop:24, maxWidth:620}}>
              A flat annual fee. We never take a cut of your fees. Your clients and relationships are yours — forever.
            </p>

            <div className="billing-toggle">
              <button className={billing==='monthly'?'active':''} onClick={()=>setBilling('monthly')}>Monthly</button>
              <button className={billing==='annual'?'active':''} onClick={()=>setBilling('annual')}>
                Annual <span className="save">Save 17%</span>
              </button>
            </div>

            <div className="pricing-grid">
              {plans.map(p => (
                <div key={p.name} className={`pricing-card ${p.featured?'featured':''}`}>
                  {p.featured && <div className="pricing-ribbon mono">Most Popular</div>}
                  <div className="pricing-tag mono">{p.tag}</div>
                  <h3>{p.name}</h3>
                  <div className="pricing-amount">
                    <span className="currency">$</span>
                    <span className="num">{p.price}</span>
                    <span className="unit">{p.unit}</span>
                  </div>
                  <div className="pricing-note">{p.note}</div>
                  <ul>
                    {p.features.map((f,i) => (
                      <li key={i}><CheckIcon /> {f}</li>
                    ))}
                  </ul>
                  <a href="apply.html" className={`btn ${p.featured?'btn-primary':'btn-outline'} btn-lg`} style={{width:'100%', justifyContent:'center'}}>
                    Apply to join <span className="arr">→</span>
                  </a>
                </div>
              ))}
            </div>

            <div className="pricing-trust mono">
              <span>✓ NO COMMISSION ON FEES</span>
              <span>✓ 100% OF CLIENT PAYMENTS</span>
              <span>✓ CANCEL ANYTIME</span>
              <span>✓ OWN YOUR RELATIONSHIPS</span>
            </div>
          </div>
        </section>

        <section className="section compare">
          <div className="container-wide">
            <div className="section-head">
              <span className="eyebrow">Compare plans</span>
              <h2 className="section-title" style={{marginTop:16}}>What's included.</h2>
            </div>
            <div className="compare-table">
              <div className="compare-head">
                <div></div>
                <div>
                  <b>Budding</b>
                  <span className="mono">5–12 Yrs · ${billing==='annual'?499:49}{plans[0].unit}</span>
                </div>
                <div className="featured">
                  <b>Seasoned</b>
                  <span className="mono">12+ Yrs · ${billing==='annual'?699:69}{plans[1].unit}</span>
                </div>
              </div>
              {compare.map((row, i) => (
                <div key={i} className="compare-row">
                  <div>{row.f}</div>
                  <div>{row.b ? <CheckIcon /> : <span className="mono">—</span>}</div>
                  <div className="featured">{row.s ? <CheckIcon /> : <span className="mono">—</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section pricing-faq">
          <div className="container-wide">
            <div className="faq-grid">
              <div className="faq-left">
                <span className="eyebrow">Pricing FAQ</span>
                <h2 className="section-title" style={{marginTop:16}}>Straight answers.</h2>
              </div>
              <div className="faq-right">
                {[
                  { q: 'Does Expertly take a cut of my consultation fees?', a: "No. Ever. We're a membership platform, not a marketplace. You pay a flat annual fee; every dollar a client pays you, you keep. We don't mark up rates or take commission." },
                  { q: 'Can I try it before committing to a year?', a: 'Yes. Monthly billing is available ($49/mo Budding, $69/mo Seasoned) and you can cancel anytime. Annual billing saves 17%.' },
                  { q: 'What if I upgrade from Budding to Seasoned mid-year?', a: "We pro-rate the difference. If you cross 12 years of experience mid-membership or want the premium features, you only pay for the time remaining — no double-charging." },
                  { q: 'Are there any hidden fees?', a: "None. No listing fees, no featured-placement upsells, no per-consultation charges. The annual or monthly fee is it." },
                  { q: "What's the refund policy?", a: 'Full refund within 14 days of purchase, no questions asked. After that, we refund on a pro-rated basis at our discretion.' },
                ].map((it, i) => (
                  <details key={i} className="faq-item" open={i===0}>
                    <summary className="faq-q">{it.q}<span className="faq-toggle">+</span></summary>
                    <div className="faq-a"><p>{it.a}</p></div>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel />
    </>
  );
}

// ============ HOW IT WORKS ============
function HowItWorksPage() {
  const steps = [
    {
      n: '01',
      label: 'Apply',
      title: 'Submit your application.',
      desc: "Tell us about your practice, credentials, and specialisations. We review every single application — no bots, no auto-filters. Takes about 10 minutes.",
      bullets: ['Basic credentials & qualifications','Practice areas & jurisdictions','Two peer references (existing members or trusted counsel)'],
    },
    {
      n: '02',
      label: 'Verify',
      title: 'Get verified.',
      desc: "Our team manually reviews every credential: bar admissions, professional registrations, firm history, and published work. Peer references are contacted personally.",
      bullets: ['Credentials cross-checked with issuing bodies','Peer references contacted directly','Review of public work & track record','Typical turnaround: 5 business days'],
    },
    {
      n: '03',
      label: 'Onboard',
      title: 'Build your presence.',
      desc: "Once approved, you'll get access to publish your profile, set rates, list availability, and start publishing articles. Our onboarding team is on call.",
      bullets: ['Custom profile page on expertly.network','Set rates, minimums & availability','Publish articles to establish authority','Access to member events & Slack community'],
    },
    {
      n: '04',
      label: 'Match',
      title: 'Get discovered.',
      desc: "Clients find you via AI-powered search, direct browsing, or article discovery. Every enquiry routes directly to you — we never sit in the middle.",
      bullets: ['AI search surfaces your expertise','Direct consultation requests in your inbox','You set terms, you control the conversation','Zero commission on any engagement'],
    },
  ];

  return (
    <>
      <Nav />
      <main>
        <section className="hiw-hero">
          <div className="container-wide">
            <span className="eyebrow">How it works · From application to first client</span>
            <h1 className="display" style={{marginTop:20, maxWidth:900}}>
              Four steps.<br/><span className="accent-text" style={{fontFamily:"'Instrument Serif', Georgia, serif", fontStyle:'italic', fontWeight:400}}>Roughly two weeks.</span>
            </h1>
            <p className="lede" style={{marginTop:24, maxWidth:620}}>
              We built Expertly as the antithesis of legal marketplaces: no race-to-the-bottom pricing, no commission on fees, no faceless middlemen. Here's exactly what happens from the moment you apply.
            </p>
          </div>
        </section>

        <section className="hiw-steps">
          <div className="container-wide">
            <div className="hiw-timeline">
              <div className="hiw-track" />
              {steps.map((s, i) => (
                <div key={s.n} className="hiw-step reveal" style={{'--i': i}}>
                  <div className="hiw-step-marker">
                    <span className="mono">{s.n}</span>
                  </div>
                  <div className="hiw-step-body">
                    <div className="hiw-step-label mono">{s.label}</div>
                    <h3>{s.title}</h3>
                    <p>{s.desc}</p>
                    <ul>
                      {s.bullets.map((b, j) => (
                        <li key={j}><CheckIcon />{b}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="section hiw-compare">
          <div className="container-wide">
            <div className="section-head">
              <span className="eyebrow">Why this approach</span>
              <h2 className="section-title" style={{marginTop:16, maxWidth:760}}>We're not a marketplace. And we don't want to be.</h2>
            </div>
            <div className="compare-vs">
              <div className="compare-col compare-col-bad">
                <div className="mono">Traditional Legal Marketplace</div>
                <ul>
                  <li>✕ Race-to-the-bottom pricing wars</li>
                  <li>✕ 15–30% commission on every engagement</li>
                  <li>✕ Anonymous profiles, no vetting</li>
                  <li>✕ Platform sits between you and client</li>
                  <li>✕ Your work feeds their brand, not yours</li>
                  <li>✕ Clients churn to cheapest bidder</li>
                </ul>
              </div>
              <div className="compare-vs-divider">
                <span className="mono">vs</span>
              </div>
              <div className="compare-col compare-col-good">
                <div className="mono">Expertly Membership</div>
                <ul>
                  <li><CheckIcon /> Transparent, self-set rates</li>
                  <li><CheckIcon /> Zero commission — ever</li>
                  <li><CheckIcon /> Manually verified credentials</li>
                  <li><CheckIcon /> Direct relationship with client</li>
                  <li><CheckIcon /> Your profile, your brand, your IP</li>
                  <li><CheckIcon /> Clients stay because of you</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <TrustExplainer />

        <section className="section hiw-cta">
          <div className="container-wide">
            <div className="hiw-cta-card">
              <div>
                <span className="eyebrow" style={{color:'rgba(255,255,255,0.6)'}}>Ready to join?</span>
                <h2 className="section-title" style={{color:'var(--bg)', marginTop:16}}>
                  Applications reviewed in 5 business days.
                </h2>
              </div>
              <div style={{display:'flex',gap:10}}>
                <a href="apply.html" className="btn btn-lg" style={{background:'var(--bg)', color:'var(--ink)'}}>Apply now <span className="arr">→</span></a>
                <a href="pricing.html" className="btn btn-outline btn-lg" style={{borderColor:'rgba(255,255,255,0.25)', color:'var(--bg)'}}>See pricing</a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel />
    </>
  );
}

// ============ APPLY / BECOME A MEMBER ============
function ApplyPage() {
  const [step, setStep] = uS(1);
  const [form, setForm] = uS({
    firstName:'', lastName:'', email:'', country:'',
    tier: 'seasoned', practice:'', years:'',
    firm:'', linkedin:'', website:'',
    ref1Name:'', ref1Email:'', ref2Name:'', ref2Email:'',
    bio:'', rate:'', agree: false
  });
  const update = (k, v) => setForm(f => ({...f, [k]: v}));
  const next = () => setStep(s => Math.min(4, s+1));
  const back = () => setStep(s => Math.max(1, s-1));
  const pct = (step/4)*100;

  return (
    <>
      <Nav />
      <main className="apply-main">
        <div className="apply-grid">
          <aside className="apply-aside">
            <a href="index.html" className="auth-logo">
              Expertly<span style={{width:9,height:9,background:'var(--accent)',borderRadius:'50%',display:'inline-block'}}></span>
            </a>
            <span className="eyebrow" style={{marginTop:48}}>Membership application</span>
            <h1 className="headline" style={{marginTop:16, fontSize:'clamp(32px,3vw,44px)'}}>
              Join a network of <em className="accent-text" style={{fontFamily:"'Instrument Serif',serif",fontStyle:'italic',fontWeight:400}}>{window.EXPERTLY_MEMBERS.length}+</em> verified experts.
            </h1>
            <p className="lede" style={{marginTop:20, fontSize:16}}>
              Applications are reviewed manually — typically within 5 business days. No bots, no filters.
            </p>

            <div className="apply-steps">
              {[
                {n:1, t:'Your details'},
                {n:2, t:'Your practice'},
                {n:3, t:'References'},
                {n:4, t:'Review & submit'},
              ].map(s => (
                <div key={s.n} className={`apply-step ${step===s.n?'active':''} ${step>s.n?'done':''}`}>
                  <div className="apply-step-num mono">{step>s.n ? '✓' : s.n}</div>
                  <div>{s.t}</div>
                </div>
              ))}
            </div>

            <div className="apply-aside-foot">
              <div className="verified" style={{color:'var(--ok)'}}><CheckIcon/> Your Data Is Private</div>
              <p style={{fontSize:13,color:'var(--ink-3)',marginTop:12,lineHeight:1.5}}>
                We never share your application with third parties. References are contacted personally only after you submit.
              </p>
            </div>
          </aside>

          <section className="apply-form-wrap">
            <div className="apply-progress">
              <div className="apply-progress-bar" style={{width:`${pct}%`}}/>
              <div className="apply-progress-label mono">Step {step} of 4</div>
            </div>

            {step===1 && (
              <div className="apply-form">
                <h2>Let's start with the basics.</h2>
                <p className="apply-form-sub">Tell us who you are and where you practice.</p>

                <div className="apply-field-row">
                  <div className="apply-field">
                    <label>First name</label>
                    <input type="text" value={form.firstName} onChange={e=>update('firstName',e.target.value)} placeholder="Priya"/>
                  </div>
                  <div className="apply-field">
                    <label>Last name</label>
                    <input type="text" value={form.lastName} onChange={e=>update('lastName',e.target.value)} placeholder="Venkatesh"/>
                  </div>
                </div>
                <div className="apply-field">
                  <label>Work email</label>
                  <input type="email" value={form.email} onChange={e=>update('email',e.target.value)} placeholder="you@firm.com"/>
                  <span className="apply-hint">We'll verify this address before approval.</span>
                </div>
                <div className="apply-field">
                  <label>Country of practice</label>
                  <select value={form.country} onChange={e=>update('country',e.target.value)}>
                    <option value="">Select…</option>
                    {['India','Singapore','UK','USA','UAE','Germany','France','Italy','Spain','Japan','Ghana','Nigeria','Egypt','Other'].map(c => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="apply-tier">
                  <label className="apply-tier-label">Membership tier</label>
                  <div className="apply-tier-grid">
                    <button className={form.tier==='budding'?'active':''} onClick={()=>update('tier','budding')}>
                      <span className="mono">01</span>
                      <b>Budding Professional</b>
                      <em>5–12 years of experience</em>
                      <div className="apply-tier-price">$499/yr</div>
                    </button>
                    <button className={form.tier==='seasoned'?'active':''} onClick={()=>update('tier','seasoned')}>
                      <span className="mono">02</span>
                      <b>Seasoned Professional</b>
                      <em>12+ years of experience</em>
                      <div className="apply-tier-price">$699/yr</div>
                    </button>
                  </div>
                </div>

                <div className="apply-actions">
                  <div></div>
                  <button className="btn btn-primary btn-lg" onClick={next}>Continue <span className="arr">→</span></button>
                </div>
              </div>
            )}

            {step===2 && (
              <div className="apply-form">
                <h2>Your practice.</h2>
                <p className="apply-form-sub">Help us understand where you specialise and what you charge.</p>

                <div className="apply-field-row">
                  <div className="apply-field">
                    <label>Primary practice area</label>
                    <select value={form.practice} onChange={e=>update('practice',e.target.value)}>
                      <option value="">Select…</option>
                      {window.EXPERTLY_PRACTICE_AREAS.map(p => <option key={p.name}>{p.name}</option>)}
                    </select>
                  </div>
                  <div className="apply-field">
                    <label>Years of experience</label>
                    <input type="number" value={form.years} onChange={e=>update('years',e.target.value)} placeholder="e.g. 14"/>
                  </div>
                </div>
                <div className="apply-field">
                  <label>Current firm or practice</label>
                  <input type="text" value={form.firm} onChange={e=>update('firm',e.target.value)} placeholder="M2K Advisors, or 'Independent'"/>
                </div>
                <div className="apply-field-row">
                  <div className="apply-field">
                    <label>LinkedIn URL</label>
                    <input type="url" value={form.linkedin} onChange={e=>update('linkedin',e.target.value)} placeholder="linkedin.com/in/…"/>
                  </div>
                  <div className="apply-field">
                    <label>Firm website (optional)</label>
                    <input type="url" value={form.website} onChange={e=>update('website',e.target.value)} placeholder="https://…"/>
                  </div>
                </div>
                <div className="apply-field">
                  <label>Typical consultation rate (USD / hour)</label>
                  <input type="text" value={form.rate} onChange={e=>update('rate',e.target.value)} placeholder="e.g. 350"/>
                  <span className="apply-hint">You can change this anytime. Members typically charge $200–$650/hr.</span>
                </div>
                <div className="apply-field">
                  <label>Short bio <span className="apply-hint-inline">(150 words max — what makes you distinctive)</span></label>
                  <textarea value={form.bio} onChange={e=>update('bio',e.target.value)} rows={5} placeholder="I focus on cross-border M&A tax for Indian and Southeast Asian corporates…"/>
                </div>

                <div className="apply-actions">
                  <button className="btn btn-outline btn-lg" onClick={back}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={next}>Continue <span className="arr">→</span></button>
                </div>
              </div>
            )}

            {step===3 && (
              <div className="apply-form">
                <h2>Two peer references.</h2>
                <p className="apply-form-sub">Existing members or well-known professionals who can vouch for your work. We'll contact them personally — never publicly.</p>

                <div className="apply-ref">
                  <div className="apply-ref-label mono">Reference 01</div>
                  <div className="apply-field-row">
                    <div className="apply-field">
                      <label>Full name</label>
                      <input type="text" value={form.ref1Name} onChange={e=>update('ref1Name',e.target.value)}/>
                    </div>
                    <div className="apply-field">
                      <label>Email</label>
                      <input type="email" value={form.ref1Email} onChange={e=>update('ref1Email',e.target.value)}/>
                    </div>
                  </div>
                </div>
                <div className="apply-ref">
                  <div className="apply-ref-label mono">Reference 02</div>
                  <div className="apply-field-row">
                    <div className="apply-field">
                      <label>Full name</label>
                      <input type="text" value={form.ref2Name} onChange={e=>update('ref2Name',e.target.value)}/>
                    </div>
                    <div className="apply-field">
                      <label>Email</label>
                      <input type="email" value={form.ref2Email} onChange={e=>update('ref2Email',e.target.value)}/>
                    </div>
                  </div>
                </div>

                <div className="apply-note">
                  <span className="mono">Why References?</span>
                  <p>We verify every member with two independent referrals before granting membership. This is how we keep the network's signal-to-noise high — and why every member on Expertly is actually worth hiring.</p>
                </div>

                <div className="apply-actions">
                  <button className="btn btn-outline btn-lg" onClick={back}>← Back</button>
                  <button className="btn btn-primary btn-lg" onClick={next}>Continue <span className="arr">→</span></button>
                </div>
              </div>
            )}

            {step===4 && (
              <div className="apply-form">
                <h2>Ready to submit.</h2>
                <p className="apply-form-sub">Double-check your details. You'll hear back within 5 business days.</p>

                <div className="apply-review">
                  <div className="apply-review-row">
                    <span className="mono">Name</span>
                    <b>{form.firstName || '—'} {form.lastName || ''}</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Email</span>
                    <b>{form.email || '—'}</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Country</span>
                    <b>{form.country || '—'}</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Tier</span>
                    <b>{form.tier==='budding' ? 'Budding Professional · $499/yr' : 'Seasoned Professional · $699/yr'}</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Practice</span>
                    <b>{form.practice || '—'} · {form.years || '—'} yrs</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Firm</span>
                    <b>{form.firm || '—'}</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">Rate</span>
                    <b>${form.rate || '—'}/hr</b>
                  </div>
                  <div className="apply-review-row">
                    <span className="mono">References</span>
                    <b>{[form.ref1Name, form.ref2Name].filter(Boolean).join(' · ') || '—'}</b>
                  </div>
                </div>

                <label className="apply-check">
                  <input type="checkbox" checked={form.agree} onChange={e=>update('agree',e.target.checked)}/>
                  <span>I confirm the information above is accurate and authorise Expertly to verify my credentials and contact my references.</span>
                </label>

                <div className="apply-actions">
                  <button className="btn btn-outline btn-lg" onClick={back}>← Back</button>
                  <button className="btn btn-primary btn-lg" disabled={!form.agree}>
                    Submit application <span className="arr">→</span>
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      </main>
      <TweaksPanel />
    </>
  );
}

Object.assign(window, { LoginPage, PricingPage, HowItWorksPage, ApplyPage });
