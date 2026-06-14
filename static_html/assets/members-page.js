/**
 * Expertly Static Site Members Page Directory Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const members = window.EXPERTLY_MEMBERS || [];
  
  // Set up elements
  const searchInput = document.getElementById('dir-search-input');
  const practiceSelect = document.getElementById('filter-practice');
  const regionSelect = document.getElementById('filter-region');
  const sortSelect = document.getElementById('filter-sort');
  
  const countLabel = document.getElementById('dir-results-count');
  const gridContainer = document.getElementById('dir-members-grid');
  const emptyState = document.getElementById('dir-empty-state');
  const resetBtn = document.getElementById('dir-reset-filters-btn');
  const eyebrow = document.getElementById('members-eyebrow');

  if (eyebrow) {
    eyebrow.textContent = `Member directory · ${members.length} verified experts`;
  }

  // Region mappings
  const regionMap = {
    'Americas': ['US', 'BR', 'MX', 'CA'],
    'EMEA': ['GB', 'FR', 'DE', 'ES', 'IT', 'AE', 'EG', 'LB', 'GH', 'NG'],
    'APAC': ['IN', 'SG', 'JP', 'CN', 'AU', 'HK']
  };

  // 1. Populate Practice Dropdown dynamically
  const uniquePractices = ['All', ...new Set(members.map(m => m.practice))];
  if (practiceSelect) {
    practiceSelect.innerHTML = uniquePractices.map(p => `<option value="${p}">${p}</option>`).join('');
  }

  // 2. Read URL Query Parameters for navigation (e.g., ?practice=M%26A%20Tax)
  const urlParams = new URLSearchParams(window.location.search);
  const initialPractice = urlParams.get('practice');
  if (initialPractice && uniquePractices.includes(initialPractice) && practiceSelect) {
    practiceSelect.value = initialPractice;
  }

  const renderMembers = () => {
    const query = searchInput.value.trim().toLowerCase();
    const practice = practiceSelect.value;
    const region = regionSelect.value;
    const sort = sortSelect.value;

    // Filter
    let filtered = [...members];

    if (query) {
      filtered = filtered.filter(m => 
        m.name.toLowerCase().includes(query) ||
        m.practice.toLowerCase().includes(query) ||
        m.location.toLowerCase().includes(query) ||
        m.firm.toLowerCase().includes(query)
      );
    }

    if (practice !== 'All') {
      filtered = filtered.filter(m => m.practice === practice);
    }

    if (region !== 'All') {
      const allowedCountries = regionMap[region] || [];
      filtered = filtered.filter(m => allowedCountries.includes(m.country));
    }

    // Sort
    if (sort === 'rate-asc') {
      filtered.sort((a, b) => parseInt(a.rate.replace(/[^0-9]/g, '')) - parseInt(b.rate.replace(/[^0-9]/g, '')));
    } else if (sort === 'rate-desc') {
      filtered.sort((a, b) => parseInt(b.rate.replace(/[^0-9]/g, '')) - parseInt(a.rate.replace(/[^0-9]/g, '')));
    } else if (sort === 'tenure') {
      filtered.sort((a, b) => parseInt(b.tenure.replace(/[^0-9]/g, '')) - parseInt(a.tenure.replace(/[^0-9]/g, '')));
    }

    // Update count label
    countLabel.textContent = `${filtered.length} / ${members.length} EXPERTS`;

    if (filtered.length === 0) {
      gridContainer.style.display = 'none';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';
    gridContainer.style.display = 'grid';

    // Render cards
    gridContainer.innerHTML = filtered.map(m => {
      const verifiedBadge = m.verified ? `<span class="verified">${window.getCheckIconHtml()} Verified</span>` : '';
      const firmLabel = m.firm && m.firm !== 'Independent' ? ` · ${m.firm}` : '';
      return `
        <article class="dir-card" id="${m.id}" style="animation: riseIn 0.5s cubic-bezier(0.22,1,0.36,1) both;">
          <div class="dir-card-head">
            ${window.getAvatarHtml(m, 72)}
            <div class="dir-card-head-meta">
              <div class="dir-card-rate mono">${m.rate}</div>
              ${verifiedBadge}
            </div>
          </div>
          <h3 class="dir-card-name">${m.name}</h3>
          <div class="dir-card-title">${m.title}${firmLabel}</div>
          <div class="dir-card-chips">
            <span class="chip">${m.practice}</span>
          </div>
          <div class="dir-card-grid">
            <div><span class="mono">Location</span>${m.location}</div>
            <div><span class="mono">Tenure</span>${m.tenure}</div>
          </div>
          <div class="dir-card-actions">
            <button class="btn btn-primary" style="flex:1" onclick="alert('Consultation request sent to ${m.name}!')">Request consultation</button>
            <button class="btn btn-outline" onclick="window.location.hash = '${m.id}'">View profile</button>
          </div>
        </article>
      `;
    }).join('');
  };

  // Add event listeners
  searchInput.addEventListener('input', renderMembers);
  practiceSelect.addEventListener('change', renderMembers);
  regionSelect.addEventListener('change', renderMembers);
  sortSelect.addEventListener('change', renderMembers);

  resetBtn.addEventListener('click', () => {
    searchInput.value = '';
    practiceSelect.value = 'All';
    regionSelect.value = 'All';
    sortSelect.value = 'featured';
    renderMembers();
  });

  // Initial render
  renderMembers();
});
