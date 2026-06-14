/**
 * Expertly Static Site Articles Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const articles = window.EXPERTLY_ARTICLES || [];
  const members = window.EXPERTLY_MEMBERS || [];

  const searchInput = document.getElementById('art-search-input');
  const categoriesBar = document.getElementById('articles-categories-bar');
  const featuredContainer = document.getElementById('featured-article-container');
  const remainingGrid = document.getElementById('articles-remaining-grid');
  const eyebrow = document.getElementById('articles-eyebrow');

  if (eyebrow) {
    eyebrow.textContent = `Knowledge base · ${articles.length} published`;
  }

  let currentCategory = 'All';

  // Helper: Find author profile
  const getAuthor = (authorId) => members.find(m => m.id === authorId) || { name: 'Expertly Counsel', title: 'Advisor', initials: 'EX' };

  // 1. Render Categories Tabs
  const uniqueCategories = ['All', ...new Set(articles.map(a => a.category))];
  categoriesBar.innerHTML = uniqueCategories.map(c => `
    <button class="art-cat ${c === currentCategory ? 'active' : ''}" data-category="${c}">${c}</button>
  `).join('');

  // Handle category clicks
  categoriesBar.addEventListener('click', (e) => {
    const btn = e.target.closest('.art-cat');
    if (btn) {
      categoriesBar.querySelectorAll('.art-cat').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderArticles();
    }
  });

  const renderArticles = () => {
    const query = searchInput.value.trim().toLowerCase();

    // Filter
    let filtered = [...articles];

    if (currentCategory !== 'All') {
      filtered = filtered.filter(a => a.category === currentCategory);
    }

    if (query) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(query) ||
        a.excerpt.toLowerCase().includes(query)
      );
    }

    if (filtered.length === 0) {
      featuredContainer.style.display = 'none';
      featuredContainer.innerHTML = '';
      remainingGrid.innerHTML = `
        <div class="dir-empty" style="grid-column: 1 / -1; text-align: center; padding: 48px 0; width: 100%;">
          <div class="mono">No Articles</div>
          <h3>No insights match your search query.</h3>
        </div>
      `;
      return;
    }

    featuredContainer.style.display = 'grid';

    const featuredArt = filtered[0];
    const sideArts = filtered.slice(1, 5);
    const gridArts = filtered.slice(5);

    // Render Featured Container (Main + 4 Side articles)
    let featuredHtml = '';
    if (featuredArt) {
      const author = getAuthor(featuredArt.author);
      featuredHtml += `
        <!-- Main Featured Card -->
        <a href="#${featuredArt.id}" class="art-feat-main" style="animation: riseIn 0.5s ease-out both;">
          <div class="article-img">
            <span class="chip chip-ink" style="position:absolute;top:20px;left:20px">${featuredArt.category}</span>
            <img class="article-photo" src="${featuredArt.image}" alt="${featuredArt.title}" loading="lazy" />
          </div>
          <div class="mono" style="font-size:11px;color:var(--ink-3);letter-spacing:0.1em;margin-top:20px">Featured · ${featuredArt.date} · ${featuredArt.readTime} Read</div>
          <h2>${featuredArt.title}</h2>
          <p>${featuredArt.excerpt}</p>
          <div class="article-author">
            ${window.getAvatarHtml(author, 40)}
            <div>
              <div style="font-size:14px; fontWeight:500">${author.name}</div>
              <div class="mono" style="font-size:10px;color:var(--ink-3)">${author.title}</div>
            </div>
          </div>
        </a>
      `;
    }

    if (sideArts.length > 0) {
      featuredHtml += `
        <!-- Side Articles Column -->
        <div class="art-feat-side">
      `;
      sideArts.forEach((a, idx) => {
        const author = getAuthor(a.author);
        featuredHtml += `
          <a href="#${a.id}" class="article-row" style="animation: riseIn 0.5s ease-out both; animation-delay: ${idx * 0.1}s;">
            <div class="article-row-num mono">0${idx + 2}</div>
            <div class="article-row-body">
              <div class="article-row-meta">
                <span class="chip">${a.category}</span>
                <span class="mono" style="font-size:10px;color:var(--ink-3);letter-spacing:0.08em">${a.readTime} · ${a.date}</span>
              </div>
              <h4>${a.title}</h4>
              <div class="article-row-author">
                ${window.getAvatarHtml(author, 22)}
                <span>${author.name}</span>
              </div>
            </div>
          </a>
        `;
      });
      featuredHtml += `</div>`;
    } else {
      // Empty container to keep split styling clean if there are no side articles
      featuredHtml += `<div class="art-feat-side"></div>`;
    }

    featuredContainer.innerHTML = featuredHtml;

    // Render remaining articles in grid
    remainingGrid.innerHTML = gridArts.map((a, idx) => {
      const author = getAuthor(a.author);
      return `
        <a href="#${a.id}" class="art-card" style="animation: riseIn 0.5s ease-out both; animation-delay: ${idx * 0.05}s;">
          <div class="article-img">
            <span class="chip chip-ink" style="position:absolute;top:14px;left:14px">${a.category}</span>
            <img class="article-photo" src="${a.image}" alt="${a.title}" loading="lazy" />
          </div>
          <div class="art-card-body">
            <div class="art-card-meta mono" style="font-size:11px;color:var(--ink-3);letter-spacing:0.1em">${a.date} · ${a.readTime} READ</div>
            <h3>${a.title}</h3>
            <p>${a.excerpt}</p>
            <div class="art-card-author">
              ${window.getAvatarHtml(author, 24)}
              <b>${author.name}</b>
            </div>
          </div>
        </a>
      `;
    }).join('');
  };

  // Listen to search typing
  searchInput.addEventListener('input', renderArticles);

  // Initial render
  renderArticles();
});
