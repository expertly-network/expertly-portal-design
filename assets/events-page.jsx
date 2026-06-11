const { useState } = React;

function EventsPage() {
  const [format, setFormat] = useState('All');
  const formats = ['All','In Person','Hybrid','Tax','M&A','Legal','Networking','International Law'];

  let evs = [...window.EXPERTLY_EVENTS];
  if (format !== 'All') evs = evs.filter(e => e.format === format || e.category === format);

  // Group by month
  const groups = {};
  evs.forEach(e => {
    const m = e.start.split(' ')[0];
    (groups[m] = groups[m] || []).push(e);
  });

  return (
    <>
      <Nav active="events" />
      <main>
        <section className="ev-hero">
          <div className="container-wide">
            <span className="eyebrow">Global events · Curated calendar</span>
            <h1 className="headline" style={{marginTop:18, maxWidth:820}}>Be part of what's next.</h1>
            <p className="lede" style={{marginTop:20, maxWidth:640}}>
              Conferences, summits, and professional meetings hand-picked for the Expertly network. Network wherever you go — in person, hybrid, or on-demand.
            </p>
            <div className="ev-hero-stats">
              <div><b><Counter value={window.EXPERTLY_EVENTS.length} suffix="+"/></b><span>Upcoming events</span></div>
              <div><b><Counter value={24}/></b><span>Cities</span></div>
              <div><b><Counter value={15}/></b><span>Partner orgs</span></div>
              <div><b><Counter value={12}/></b><span>Member-only</span></div>
            </div>
            <div className="ev-filter-tabs">
              {formats.map(f => (
                <button key={f} className={format===f?'active':''} onClick={()=>setFormat(f)}>{f}</button>
              ))}
            </div>
          </div>
        </section>

        <section className="ev-timeline">
          <div className="container-wide">
            {Object.entries(groups).map(([month, items]) => (
              <div className="ev-month-group" key={month}>
                <div className="ev-month-header">
                  <h2>{ {APR:'April', MAY:'May', JUN:'June'}[month] || month } 2026</h2>
                  <span className="mono">{items.length} EVENT{items.length>1?'S':''}</span>
                </div>
                <div className="ev-list">
                  {items.map(e => (
                    <a href="#" key={e.id} className="ev-row" id={e.id}>
                      <div className="ev-row-date">
                        <div className="mono">STARTS</div>
                        <b>{e.start}{e.end ? ` → ${e.end}` : ''}</b>
                      </div>
                      <div className="ev-row-title">
                        <div style={{display:'flex',gap:6,marginBottom:8}}>
                          <span className="chip">{e.category}</span>
                          <span className="chip chip-dot" style={{color:e.format==='In Person'?'var(--ok)':'var(--accent)'}}>{e.format}</span>
                        </div>
                        <h3>{e.title}</h3>
                        <p>{e.desc}</p>
                      </div>
                      <div className="ev-row-loc">
                        <span className="mono">LOCATION</span>
                        <span>{e.city}<br/>{e.country}</span>
                      </div>
                      <div className="ev-row-actions">
                        <button className="btn btn-outline">Register →</button>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel />
    </>
  );
}
window.EventsPage = EventsPage;
