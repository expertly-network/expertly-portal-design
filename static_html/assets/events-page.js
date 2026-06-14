/**
 * Expertly Static Site Events Page Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  const events = window.EXPERTLY_EVENTS || [];
  
  const filterTabsContainer = document.getElementById('events-filter-tabs');
  const timelineContainer = document.getElementById('events-timeline-container');

  const filterOptions = ['All', 'In Person', 'Hybrid', 'Tax', 'M&A', 'Legal', 'Networking', 'International Law'];
  let activeFilter = 'All';

  // Month code map
  const monthMap = {
    'APR': 'April',
    'MAY': 'May',
    'JUN': 'June'
  };

  // 1. Render filter tabs
  filterTabsContainer.innerHTML = filterOptions.map(f => `
    <button class="ev-filter-btn ${f === activeFilter ? 'active' : ''}" data-filter="${f}">${f}</button>
  `).join('');

  filterTabsContainer.addEventListener('click', (e) => {
    const btn = e.target.closest('.ev-filter-btn');
    if (btn) {
      filterTabsContainer.querySelectorAll('.ev-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilter = btn.getAttribute('data-filter');
      renderEvents();
    }
  });

  const renderEvents = () => {
    // Filter
    let filtered = [...events];
    if (activeFilter !== 'All') {
      filtered = filtered.filter(e => e.format === activeFilter || e.category === activeFilter);
    }

    if (filtered.length === 0) {
      timelineContainer.innerHTML = `
        <div class="dir-empty" style="text-align: center; padding: 48px 0; width: 100%;">
          <div class="mono">No Events</div>
          <h3>No conferences or meetings match this filter.</h3>
        </div>
      `;
      return;
    }

    // Group by month
    const groups = {};
    filtered.forEach(e => {
      const monthCode = e.start.split(' ')[0];
      const monthHuman = monthMap[monthCode] || monthCode;
      
      if (!groups[monthHuman]) {
        groups[monthHuman] = [];
      }
      groups[monthHuman].push(e);
    });

    // Render grouped monthly list
    timelineContainer.innerHTML = Object.entries(groups).map(([month, items]) => {
      const eventCountText = `${items.length} Event${items.length > 1 ? 's' : ''}`;
      
      const rowsHtml = items.map(e => {
        const dotColor = e.format === 'In Person' ? 'var(--ok)' : 'var(--accent)';
        
        const startParts = e.start.split(' ');
        const monthCode = startParts[0];
        const startDay = parseInt(startParts[1], 10);
        const monthName = monthMap[monthCode] || monthCode;
        
        let dateText = '';
        if (e.end) {
          const endParts = e.end.split(' ');
          const endDay = parseInt(endParts[1], 10);
          dateText = `${monthName} ${startDay}–${endDay}`;
        } else {
          dateText = `${monthName} ${startDay}`;
        }

        return `
          <a href="#" class="ev-row" id="${e.id}" onclick="event.preventDefault(); alert('Registration details for ${e.title} will be sent to your account email.')">
            <div class="ev-row-date">
              <div class="mono">Date</div>
              <b>${dateText}</b>
            </div>
            <div class="ev-row-title">
              <div style="display:flex; gap:6px; margin-bottom:8px">
                <span class="chip">${e.category}</span>
                <span class="chip chip-dot" style="color: ${dotColor}">${e.format}</span>
              </div>
              <h3>${e.title}</h3>
              <p>${e.desc}</p>
            </div>
            <div class="ev-row-loc">
              <span class="mono">Location</span>
              <span>${e.city}<br>${e.country}</span>
            </div>
            <div class="ev-row-actions">
              <button class="btn btn-outline">Register →</button>
            </div>
          </a>
        `;
      }).join('');

      return `
        <div class="ev-month-group" style="animation: riseIn 0.5s ease-out both;">
          <div class="ev-month-header">
            <h2>${month} 2026</h2>
            <span class="mono">${eventCountText}</span>
          </div>
          <div class="ev-list">
            ${rowsHtml}
          </div>
        </div>
      `;
    }).join('');
  };

  // Initial render
  renderEvents();
});
