const { useState, useMemo } = React;

function ArticlesPage() {
  const [cat, setCat] = useState('All');
  const [query, setQuery] = useState('');
  const cats = ['All', ...new Set(window.EXPERTLY_ARTICLES.map(a => a.category))];
  const authorOf = id => window.EXPERTLY_MEMBERS.find(m => m.id === id);

  const filtered = useMemo(() => {
    let arts = [...window.EXPERTLY_ARTICLES];
    if (cat !== 'All') arts = arts.filter(a => a.category === cat);
    if (query) {
      const q = query.toLowerCase();
      arts = arts.filter(a => a.title.toLowerCase().includes(q) || a.excerpt.toLowerCase().includes(q));
    }
    return arts;
  }, [cat, query]);

  const [featured, ...rest] = filtered;
  const sideArts = rest.slice(0, 4);
  const grid = rest.slice(4);

  return (
    <>
      <Nav active="articles" />
      <main>
        <section className="art-hero">
          <div className="container-wide">
            <span className="eyebrow">Knowledge base · {window.EXPERTLY_ARTICLES.length} published</span>
            <h1 className="headline" style={{marginTop:18, maxWidth:820}}>Insights from the people who actually practice.</h1>
            <p className="lede" style={{marginTop:20, maxWidth:640}}>
              Regulatory updates, technical analysis, and expert commentary from verified finance and legal professionals — peer-reviewed before publication.
            </p>
            <div className="dir-search" style={{marginTop:36}}>
              <div className="dir-search-icon">⌕</div>
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search articles by topic, keyword, or author…"/>
            </div>
            {featured && (
              <div className="art-feat-grid">
                <a href={`#${featured.id}`} className="art-feat-main">
                  <div className="article-img">
                    <span className="chip chip-ink" style={{position:'absolute',top:20,left:20}}>{featured.category}</span>
                    <img className="article-photo" src={featured.image} alt={featured.title} loading="lazy" />
                  </div>
                  <div className="mono" style={{fontSize:11,color:'var(--ink-3)',letterSpacing:'0.1em',marginTop:20}}>Featured · {featured.date} · {featured.readTime} Read</div>
                  <h2>{featured.title}</h2>
                  <p>{featured.excerpt}</p>
                  <div className="article-author">
                    <Avatar member={authorOf(featured.author)} size={40}/>
                    <div>
                      <div style={{fontSize:14, fontWeight:500}}>{authorOf(featured.author)?.name}</div>
                      <div className="mono" style={{fontSize:10,color:'var(--ink-3)'}}>{authorOf(featured.author)?.title}</div>
                    </div>
                  </div>
                </a>
                <div className="art-feat-side">
                  {sideArts.map((a, i) => (
                    <a key={a.id} href={`#${a.id}`} className="article-row">
                      <div className="article-row-num mono">0{i+2}</div>
                      <div className="article-row-body">
                        <div className="article-row-meta">
                          <span className="chip">{a.category}</span>
                          <span className="mono" style={{fontSize:10,color:'var(--ink-3)',letterSpacing:'0.08em'}}>{a.readTime} · {a.date}</span>
                        </div>
                        <h4>{a.title}</h4>
                        <div className="article-row-author">
                          <Avatar member={authorOf(a.author)} size={22}/>
                          <span>{authorOf(a.author)?.name}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>

        <section className="art-list">
          <div className="container-wide">
            <div className="art-cats-bar">
              {cats.map(c => (
                <button key={c} className={`art-cat ${cat===c?'active':''}`} onClick={()=>setCat(c)}>{c}</button>
              ))}
            </div>
            <div className="art-grid" style={{marginTop:40}}>
              {grid.map((a, i) => (
                <a href={`#${a.id}`} key={a.id} className="art-card">
                  <div className="article-img">
                    <span className="chip chip-ink" style={{position:'absolute',top:14,left:14}}>{a.category}</span>
                    <img className="article-photo" src={a.image} alt={a.title} loading="lazy" />
                  </div>
                  <div className="art-card-body">
                    <div className="art-card-meta mono" style={{fontSize:11,color:'var(--ink-3)',letterSpacing:'0.1em'}}>{a.date} · {a.readTime} READ</div>
                    <h3>{a.title}</h3>
                    <p>{a.excerpt}</p>
                    <div className="art-card-author">
                      <Avatar member={authorOf(a.author)} size={24}/>
                      <b>{authorOf(a.author)?.name}</b>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <TweaksPanel />
    </>
  );
}
window.ArticlesPage = ArticlesPage;
