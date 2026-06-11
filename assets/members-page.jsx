// Members directory page
const { useState, useEffect, useMemo } = React;

function MembersPage() {
  const [query, setQuery] = useState('');
  const [practice, setPractice] = useState('All');
  const [region, setRegion] = useState('All');
  const [sort, setSort] = useState('featured');

  const practices = ['All', ...new Set(window.EXPERTLY_MEMBERS.map(m => m.practice))];
  const regions = ['All', 'Americas', 'EMEA', 'APAC'];
  const regionMap = {
    'Americas': ['US','BR','MX','CA'],
    'EMEA': ['GB','FR','DE','ES','IT','AE','EG','LB','GH','NG'],
    'APAC': ['IN','SG','JP','CN','AU','HK'],
  };

  const filtered = useMemo(() => {
    let m = [...window.EXPERTLY_MEMBERS];
    if (query) {
      const q = query.toLowerCase();
      m = m.filter(x =>
        x.name.toLowerCase().includes(q) ||
        x.practice.toLowerCase().includes(q) ||
        x.location.toLowerCase().includes(q) ||
        x.firm.toLowerCase().includes(q)
      );
    }
    if (practice !== 'All') m = m.filter(x => x.practice === practice);
    if (region !== 'All') m = m.filter(x => regionMap[region].includes(x.country));
    if (sort === 'rate-asc') m.sort((a,b) => parseInt(a.rate) - parseInt(b.rate));
    if (sort === 'rate-desc') m.sort((a,b) => parseInt(b.rate) - parseInt(a.rate));
    if (sort === 'tenure') m.sort((a,b) => parseInt(b.tenure) - parseInt(a.tenure));
    return m;
  }, [query, practice, region, sort]);

  return (
    <>
      <Nav active="members" />
      <main>
        <section className="dir-hero">
          <div className="container-wide">
            <span className="eyebrow">Member directory · {window.EXPERTLY_MEMBERS.length} verified experts</span>
            <h1 className="headline" style={{marginTop:18, maxWidth:820}}>Find counsel you can actually trust.</h1>
            <p className="lede" style={{marginTop:20, maxWidth:640}}>
              Every member has been credential-verified, peer-reviewed, and admitted individually. Search by practice, jurisdiction, or just ask in plain English.
            </p>
            <div className="dir-search">
              <div className="dir-search-icon">⌕</div>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search name, practice, firm, or location…"
              />
              <button className="btn btn-primary">
                <span className="ai-pulse small" style={{marginRight:6}}/>
                AI search
              </button>
            </div>
          </div>
        </section>

        <section className="dir-toolbar-wrap">
          <div className="container-wide">
            <div className="dir-toolbar">
              <div className="dir-filters">
                <div className="dir-filter-group">
                  <label className="mono">PRACTICE</label>
                  <select value={practice} onChange={e=>setPractice(e.target.value)}>
                    {practices.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div className="dir-filter-group">
                  <label className="mono">REGION</label>
                  <select value={region} onChange={e=>setRegion(e.target.value)}>
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>
                <div className="dir-filter-group">
                  <label className="mono">SORT BY</label>
                  <select value={sort} onChange={e=>setSort(e.target.value)}>
                    <option value="featured">Featured</option>
                    <option value="tenure">Most experienced</option>
                    <option value="rate-asc">Rate: low → high</option>
                    <option value="rate-desc">Rate: high → low</option>
                  </select>
                </div>
              </div>
              <div className="dir-count mono">{filtered.length} / {window.EXPERTLY_MEMBERS.length} EXPERTS</div>
            </div>
          </div>
        </section>

        <section className="dir-results">
          <div className="container-wide">
            {filtered.length === 0 ? (
              <div className="dir-empty">
                <div className="mono">NO RESULTS</div>
                <h3>No members match those filters.</h3>
                <button className="btn btn-outline" onClick={()=>{setQuery('');setPractice('All');setRegion('All');}}>Reset filters</button>
              </div>
            ) : (
              <div className="dir-grid">
                {filtered.map(m => (
                  <article className="dir-card" key={m.id} id={m.id}>
                    <div className="dir-card-head">
                      <Avatar member={m} size={72} />
                      <div className="dir-card-head-meta">
                        <div className="dir-card-rate mono">{m.rate}</div>
                        {m.verified && <span className="verified"><CheckIcon /> VERIFIED</span>}
                      </div>
                    </div>
                    <h3 className="dir-card-name">{m.name}</h3>
                    <div className="dir-card-title">{m.title}{m.firm && m.firm !== 'Independent' ? ` · ${m.firm}` : ''}</div>
                    <div className="dir-card-chips">
                      <span className="chip">{m.practice}</span>
                    </div>
                    <div className="dir-card-grid">
                      <div><span className="mono">LOCATION</span>{m.location}</div>
                      <div><span className="mono">TENURE</span>{m.tenure}</div>
                    </div>
                    <div className="dir-card-actions">
                      <button className="btn btn-primary" style={{flex:1}}>Request consultation</button>
                      <button className="btn btn-outline">View profile</button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel />
    </>
  );
}

window.MembersPage = MembersPage;
