/**
 * Expertly Onboarding Form Wizard Script
 * Vanilla JS logic matching the original dynamic React onboarding application.
 */

// Initial states and data structures
const PHONE_CODES = [
  { code: '+1', name: 'US/Canada' },
  { code: '+44', name: 'United Kingdom' },
  { code: '+91', name: 'India' },
  { code: '+65', name: 'Singapore' },
  { code: '+971', name: 'UAE' },
  { code: '+49', name: 'Germany' },
  { code: '+33', name: 'France' },
  { code: '+81', name: 'Japan' },
  { code: '+234', name: 'Nigeria' },
  { code: '+233', name: 'Ghana' },
  { code: '+20', name: 'Egypt' }
];

const REGIONS = [
  { id: 'asia_pacific', name: 'Asia Pacific' },
  { id: 'europe', name: 'Europe' },
  { id: 'latin_america', name: 'Latin America' },
  { id: 'middle_east', name: 'Middle East' },
  { id: 'north_america', name: 'North America' },
  { id: 'south_asia', name: 'South Asia' },
  { id: 'africa', name: 'Africa' }
];

const COUNTRIES_BY_REGION = {
  asia_pacific: ['Australia', 'New Zealand', 'Singapore', 'Japan', 'South Korea', 'China', 'Malaysia', 'Thailand', 'Vietnam', 'Indonesia', 'Philippines'],
  europe: ['United Kingdom', 'Germany', 'France', 'Italy', 'Spain', 'Netherlands', 'Switzerland', 'Belgium', 'Sweden', 'Poland', 'Austria', 'Ireland'],
  latin_america: ['Brazil', 'Mexico', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Costa Rica', 'Uruguay'],
  middle_east: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Israel', 'Egypt', 'Turkey', 'Kuwait', 'Oman', 'Bahrain'],
  north_america: ['United States', 'Canada'],
  south_asia: ['India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal'],
  africa: ['Nigeria', 'South Africa', 'Kenya', 'Ghana', 'Egypt', 'Morocco', 'Ethiopia', 'Uganda']
};

const COUNTRY_NAMES = Object.values(COUNTRIES_BY_REGION).flat();

const GEOGRAPHY_DATABASE = {
  'United States': {
    'California': ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose'],
    'New York': ['New York City', 'Buffalo', 'Rochester'],
    'Texas': ['Austin', 'Houston', 'Dallas'],
    'Washington': ['Seattle', 'Bellevue', 'Tacoma'],
    'Illinois': ['Chicago', 'Springfield']
  },
  'India': {
    'Tamil Nadu': ['Chennai', 'Coimbatore', 'Madurai'],
    'Maharashtra': ['Mumbai', 'Pune', 'Nagpur'],
    'Delhi': ['New Delhi', 'Noida', 'Gurgaon'],
    'Karnataka': ['Bangalore', 'Mysore'],
    'Telangana': ['Hyderabad', 'Warangal']
  },
  'United Kingdom': {
    'England': ['London', 'Manchester', 'Birmingham', 'Leeds'],
    'Scotland': ['Edinburgh', 'Glasgow']
  },
  'Singapore': {
    'Central Region': ['Singapore Central', 'Bukit Merah'],
    'East Region': ['Tampines', 'Bedok']
  }
};

const SERVICE_TAXONOMY = [
  { category: 'Taxation', name: 'M&A Tax', id: 'ma_tax' },
  { category: 'Taxation', name: 'Transfer Pricing', id: 'tp' },
  { category: 'Taxation', name: 'Indirect Tax', id: 'indirect_tax' },
  { category: 'Legal', name: 'Corporate Law', id: 'corp_law' },
  { category: 'Legal', name: 'IP & Technology', id: 'ip_tech' },
  { category: 'Legal', name: 'Banking & Finance', id: 'banking_finance' },
  { category: 'Legal', name: 'Dispute Resolution', id: 'dispute_res' },
  { category: 'Finance & Advisory', name: 'Capital Markets', id: 'capital_markets' },
  { category: 'Finance & Advisory', name: 'Private Equity', id: 'pe' },
  { category: 'Finance & Advisory', name: 'Restructuring', id: 'restructuring' },
  { category: 'Finance & Advisory', name: 'Compliance', id: 'compliance' },
  { category: 'Finance & Advisory', name: 'Antitrust', id: 'antitrust' }
];

// Local state representation
let linkedinConnected = false;
let currentStep = 1;

let formData = {
  profilePhoto: '',
  firstName: '',
  lastName: '',
  phoneExtension: '+1',
  phone: '',
  contactEmail: 'you@example.com',
  region: '',
  country: '',
  state: '',
  city: '',
  linkedinUrl: '',
  bio: '',
  yearsOfExperience: '',
  workExperience: [
    { jobTitle: '', company: '', companyWebsite: '', city: '', firmSize: '', startMonth: 'Jan', startYear: '2020', endMonth: 'Dec', endYear: '2024', isCurrent: false }
  ],
  education: [
    { institution: '', degree: '', fieldOfStudy: '', startYear: '2010', endYear: '2014' }
  ],
  firstPref: '',
  secondPref: '',
  thirdPref: '',
  minFee: '',
  maxFee: '',
  consentTerms: false,
  consentPrivacy: false,
  consentVerify: false
};

document.addEventListener('DOMContentLoaded', () => {
  // Check session storage
  const savedForm = sessionStorage.getItem('expertly_onboarding_form');
  if (savedForm) {
    formData = JSON.parse(savedForm);
  }

  const savedStep = sessionStorage.getItem('expertly_onboarding_step');
  if (savedStep) {
    currentStep = parseInt(savedStep, 10);
  }

  const savedConn = sessionStorage.getItem('expertly_linkedin_connected');
  if (savedConn === 'true') {
    linkedinConnected = true;
  }

  // Set up elements
  initIdentityFormElements();
  initExperienceRepeatingCards();
  initServicesDropdowns();
  initNavigationStepper();
  initLinkedInImportStep1();

  // Evaluate gate view
  updateGateVisibility();
});

const saveSession = () => {
  sessionStorage.setItem('expertly_onboarding_form', JSON.stringify(formData));
  sessionStorage.setItem('expertly_onboarding_step', currentStep.toString());
  sessionStorage.setItem('expertly_linkedin_connected', linkedinConnected.toString());
};

function updateGateVisibility() {
  const wizard = document.getElementById('onboarding-main-wizard');
  const nav = document.getElementById('onboarding-nav');
  const successView = document.getElementById('onboarding-success-view');

  if (wizard) wizard.style.display = 'grid';
  if (nav) nav.style.display = 'block';
  if (successView) successView.style.display = 'none';
  navigateToStep(currentStep);
}

// Show toast alert
function showToast(message) {
  const toast = document.getElementById('onboarding-toast');
  if (!toast) return;
  toast.innerHTML = `${window.getCheckIconHtml()} ${message}`;
  toast.style.display = 'flex';
  setTimeout(() => {
    toast.style.display = 'none';
  }, 3000);
}

/* ==========================================================================
   IDENTITY FORM DETAILS (STEP 1)
   ========================================================================== */
function initIdentityFormElements() {
  // Profile Photo Upload
  const photoInput = document.getElementById('onboarding-photo-input');
  const previewBox = document.getElementById('photo-preview-box');
  const placeholder = document.getElementById('photo-placeholder');
  const removeBtn = document.getElementById('onboarding-photo-remove');

  const updatePhotoDisplay = () => {
    if (formData.profilePhoto) {
      previewBox.innerHTML = `<img src="${formData.profilePhoto}" alt="Preview" />`;
      removeBtn.style.display = 'inline-block';
    } else {
      previewBox.innerHTML = `<span id="photo-placeholder">👤</span>`;
      removeBtn.style.display = 'none';
    }
  };

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      if (file.size > 5 * 1024 * 1024) {
        showToast('File size exceeds 5 MB limit.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        formData.profilePhoto = event.target.result;
        updatePhotoDisplay();
        saveSession();
      };
      reader.readAsDataURL(file);
    });

    removeBtn.addEventListener('click', () => {
      formData.profilePhoto = '';
      updatePhotoDisplay();
      saveSession();
    });
  }

  // Load WhatsApp Extensions
  const extSelect = document.getElementById('onboarding-phone-extension');
  if (extSelect) {
    extSelect.innerHTML = PHONE_CODES.map(p => `
      <option value="${p.code}" ${p.code === formData.phoneExtension ? 'selected' : ''}>${p.code} (${p.name})</option>
    `).join('');
    extSelect.addEventListener('change', () => {
      formData.phoneExtension = extSelect.value;
      saveSession();
    });
  }

  // Sync Input Fields
  const fields = {
    'onboarding-first-name': 'firstName',
    'onboarding-last-name': 'lastName',
    'onboarding-phone': 'phone',
    'onboarding-email': 'contactEmail',
    'onboarding-linkedin-url': 'linkedinUrl',
    'onboarding-bio': 'bio'
  };

  Object.entries(fields).forEach(([elId, key]) => {
    const el = document.getElementById(elId);
    if (el) {
      el.value = formData[key] || '';
      el.addEventListener('input', () => {
        formData[key] = el.value;
        if (key === 'bio') {
          updateBioCounter();
        }
        saveSession();
      });
    }
  });

  const updateBioCounter = () => {
    const bioText = document.getElementById('onboarding-bio');
    const counter = document.getElementById('onboarding-bio-counter');
    const wrapper = document.getElementById('onboarding-bio-counter-wrapper');

    if (bioText && counter) {
      const len = bioText.value.length;
      counter.textContent = `${len} / 500 characters`;
      
      if (len >= 460) {
        wrapper.classList.add('limit-near');
      } else {
        wrapper.classList.remove('limit-near');
      }
    }
  };

  // Geography cascades
  const regionSelect = document.getElementById('onboarding-region');
  const countrySelect = document.getElementById('onboarding-country');

  if (regionSelect && countrySelect) {
    // Populate regions
    regionSelect.innerHTML = '<option value="">Select region...</option>' + 
      REGIONS.map(r => `<option value="${r.id}">${r.name}</option>`).join('');

    regionSelect.value = formData.region || '';

    const populateCountries = () => {
      const activeReg = regionSelect.value;
      const countries = activeReg ? COUNTRIES_BY_REGION[activeReg] : COUNTRY_NAMES;
      countrySelect.innerHTML = '<option value="">Select country...</option>' + 
        countries.map(c => `<option value="${c}">${c}</option>`).join('');
      countrySelect.value = formData.country || '';
    };

    populateCountries();

    regionSelect.addEventListener('change', () => {
      formData.region = regionSelect.value;
      formData.country = '';
      formData.state = '';
      formData.city = '';
      populateCountries();
      updateGeographyCascade();
      saveSession();
    });

    countrySelect.addEventListener('change', () => {
      formData.country = countrySelect.value;
      // Auto-detect region if empty
      if (!formData.region && formData.country) {
        const regEntry = Object.entries(COUNTRIES_BY_REGION).find(([r, list]) => list.includes(formData.country));
        if (regEntry) {
          formData.region = regEntry[0];
          regionSelect.value = formData.region;
        }
      }
      formData.state = '';
      formData.city = '';
      updateGeographyCascade();
      saveSession();
    });
  }

  updatePhotoDisplay();
  updateBioCounter();
  updateGeographyCascade();
}

function updateGeographyCascade() {
  const country = formData.country;
  const stateSelect = document.getElementById('onboarding-state-select');
  const stateText = document.getElementById('onboarding-state-text');
  const citySelect = document.getElementById('onboarding-city-select');
  const cityText = document.getElementById('onboarding-city-text');

  if (!stateSelect || !stateText || !citySelect || !cityText) return;

  const states = country ? Object.keys(GEOGRAPHY_DATABASE[country] || {}) : [];

  // Toggle State element type
  if (states.length > 0) {
    stateSelect.style.display = 'block';
    stateText.style.display = 'none';
    stateSelect.innerHTML = '<option value="">Select state...</option>' + 
      states.map(s => `<option value="${s}">${s}</option>`).join('');
    stateSelect.value = formData.state || '';
  } else {
    stateSelect.style.display = 'none';
    stateText.style.display = 'block';
    stateText.value = formData.state || '';
  }

  const populateCities = () => {
    const stateVal = states.length > 0 ? stateSelect.value : stateText.value;
    const cities = (country && stateVal) ? (GEOGRAPHY_DATABASE[country][stateVal] || []) : [];

    if (cities.length > 0) {
      citySelect.style.display = 'block';
      cityText.style.display = 'none';
      citySelect.innerHTML = '<option value="">Select city...</option>' + 
        cities.map(c => `<option value="${c}">${c}</option>`).join('');
      citySelect.value = formData.city || '';
    } else {
      citySelect.style.display = 'none';
      cityText.style.display = 'block';
      cityText.value = formData.city || '';
    }
  };

  populateCities();

  // Attach dynamic listener
  stateSelect.addEventListener('change', () => {
    formData.state = stateSelect.value;
    formData.city = '';
    populateCities();
    saveSession();
  });

  stateText.addEventListener('input', () => {
    formData.state = stateText.value;
    formData.city = '';
    populateCities();
    saveSession();
  });

  citySelect.addEventListener('change', () => {
    formData.city = citySelect.value;
    saveSession();
  });

  cityText.addEventListener('input', () => {
    formData.city = cityText.value;
    saveSession();
  });
}

/* ==========================================================================
   EXPERIENCE REPEATING CARDS (STEP 2)
   ========================================================================== */
function initExperienceRepeatingCards() {
  const yearsInput = document.getElementById('onboarding-years');
  if (yearsInput) {
    yearsInput.value = formData.yearsOfExperience || '';
    yearsInput.addEventListener('input', () => {
      formData.yearsOfExperience = yearsInput.value;
      saveSession();
    });
  }

  // Work experience cards list
  const workList = document.getElementById('onboarding-work-list');
  const addWorkBtn = document.getElementById('onboarding-add-work-btn');

  const renderWorkCards = () => {
    workList.innerHTML = '';
    formData.workExperience.forEach((we, idx) => {
      const card = document.createElement('div');
      card.className = 'repeating-card';
      
      const removeBtnHtml = formData.workExperience.length > 1 ? `
        <span class="card-remove-btn" onclick="removeWorkCard(${idx})">✕ Remove</span>
      ` : '';

      const startMonthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        .map(m => `<option value="${m}" ${we.startMonth === m ? 'selected' : ''}>${m}</option>`).join('');

      const endMonthOptions = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        .map(m => `<option value="${m}" ${we.endMonth === m ? 'selected' : ''}>${m}</option>`).join('');

      const sizes = ['Solo', '2–10', '11–50', '51–200', '200+'];
      const sizeOptions = sizes.map(s => `<option value="${s}" ${we.firmSize === s ? 'selected' : ''}>${s}</option>`).join('');

      card.innerHTML = `
        ${removeBtnHtml}
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Job title</label>
            <input type="text" class="work-title" data-idx="${idx}" value="${we.jobTitle || ''}" placeholder="Partner" required />
          </div>
          <div class="apply-field">
            <label>Company</label>
            <input type="text" class="work-company" data-idx="${idx}" value="${we.company || ''}" placeholder="Firm name" required />
          </div>
        </div>

        <div class="apply-field-row">
          <div class="apply-field">
            <label>Company website <span class="apply-hint-inline">(Optional)</span></label>
            <input type="url" class="work-website" data-idx="${idx}" value="${we.companyWebsite || ''}" placeholder="https://example.com" />
          </div>
          <div class="apply-field">
            <label>City <span class="apply-hint-inline">(Optional)</span></label>
            <input type="text" class="work-city" data-idx="${idx}" value="${we.city || ''}" placeholder="e.g. London" />
          </div>
        </div>

        <div class="apply-field-row">
          <div class="apply-field">
            <label>Firm size <span class="apply-hint-inline">(Optional)</span></label>
            <select class="work-size" data-idx="${idx}">
              <option value="">Select size...</option>
              ${sizeOptions}
            </select>
          </div>
          <div class="apply-field">
            <label style="display: flex; align-items: center; gap: 6px; cursor: pointer; marginTop: 32px; height: 100%;">
              <input type="checkbox" class="work-current" data-idx="${idx}" ${we.isCurrent ? 'checked' : ''} />
              <span>I currently work here</span>
            </label>
          </div>
        </div>

        <div class="apply-field-row">
          <div class="apply-field">
            <label>Start date</label>
            <div style="display: flex; gap: 8px;">
              <select class="work-start-month" data-idx="${idx}">
                ${startMonthOptions}
              </select>
              <input type="number" class="work-start-year" data-idx="${idx}" value="${we.startYear || '2020'}" placeholder="YYYY" min="1960" max="2026" />
            </div>
          </div>
          <div class="apply-field">
            <label>End date</label>
            <div style="display: flex; gap: 8px;">
              <select class="work-end-month" data-idx="${idx}" ${we.isCurrent ? 'disabled' : ''}>
                ${endMonthOptions}
              </select>
              <input type="number" class="work-end-year" data-idx="${idx}" value="${we.endYear || '2024'}" placeholder="YYYY" min="1960" max="2026" ${we.isCurrent ? 'disabled' : ''} />
            </div>
          </div>
        </div>
        <div class="work-error-box" style="margin-top: 10px;"></div>
      `;

      workList.appendChild(card);
    });

    // Toggle button visibility
    addWorkBtn.style.display = formData.workExperience.length >= 5 ? 'none' : 'inline-flex';

    // Hook listeners
    workList.querySelectorAll('input, select').forEach(input => {
      input.addEventListener('change', updateWorkState);
      input.addEventListener('input', updateWorkState);
    });
  };

  const updateWorkState = (e) => {
    const el = e.target;
    const idx = parseInt(el.getAttribute('data-idx'), 10);
    const item = formData.workExperience[idx];

    if (el.classList.contains('work-title')) item.jobTitle = el.value;
    else if (el.classList.contains('work-company')) item.company = el.value;
    else if (el.classList.contains('work-website')) item.companyWebsite = el.value;
    else if (el.classList.contains('work-city')) item.city = el.value;
    else if (el.classList.contains('work-size')) item.firmSize = el.value;
    else if (el.classList.contains('work-start-month')) item.startMonth = el.value;
    else if (el.classList.contains('work-start-year')) item.startYear = el.value;
    else if (el.classList.contains('work-end-month')) item.endMonth = el.value;
    else if (el.classList.contains('work-end-year')) item.endYear = el.value;
    else if (el.classList.contains('work-current')) {
      item.isCurrent = el.checked;
      renderWorkCards(); // Re-render to toggle disabled elements
    }
    saveSession();
  };

  window.removeWorkCard = (index) => {
    if (formData.workExperience.length <= 1) return;
    formData.workExperience.splice(index, 1);
    renderWorkCards();
    saveSession();
  };

  addWorkBtn.addEventListener('click', () => {
    if (formData.workExperience.length >= 5) return;
    formData.workExperience.push({
      jobTitle: '', company: '', companyWebsite: '', city: '', firmSize: '', startMonth: 'Jan', startYear: '2020', endMonth: 'Dec', endYear: '2024', isCurrent: false
    });
    renderWorkCards();
    saveSession();
  });

  // Education list
  const eduList = document.getElementById('onboarding-edu-list');
  const addEduBtn = document.getElementById('onboarding-add-edu-btn');

  const renderEduCards = () => {
    eduList.innerHTML = '';
    formData.education.forEach((edu, idx) => {
      const card = document.createElement('div');
      card.className = 'repeating-card';
      
      const removeBtnHtml = formData.education.length > 1 ? `
        <span class="card-remove-btn" onclick="removeEduCard(${idx})">✕ Remove</span>
      ` : '';

      card.innerHTML = `
        ${removeBtnHtml}
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Institution</label>
            <input type="text" class="edu-institution" data-idx="${idx}" value="${edu.institution || ''}" placeholder="University name" required />
          </div>
          <div class="apply-field">
            <label>Degree</label>
            <input type="text" class="edu-degree" data-idx="${idx}" value="${edu.degree || ''}" placeholder="LLB, MBA..." required />
          </div>
        </div>

        <div class="apply-field-row">
          <div class="apply-field">
            <label>Field of study</label>
            <input type="text" class="edu-field" data-idx="${idx}" value="${edu.fieldOfStudy || ''}" placeholder="e.g. Corporate Law" />
          </div>
          <div class="apply-field">
            <label>Enrollment years</label>
            <div style="display: flex; gap: 8px;">
              <input type="number" class="edu-start-year" data-idx="${idx}" value="${edu.startYear || '2010'}" placeholder="Start YYYY" min="1960" max="2026" />
              <input type="number" class="edu-end-year" data-idx="${idx}" value="${edu.endYear || '2014'}" placeholder="End YYYY" min="1960" max="2035" />
            </div>
          </div>
        </div>
        <div class="edu-error-box" style="margin-top: 10px;"></div>
      `;

      eduList.appendChild(card);
    });

    addEduBtn.style.display = formData.education.length >= 3 ? 'none' : 'inline-flex';

    // Hook listeners
    eduList.querySelectorAll('input').forEach(input => {
      input.addEventListener('change', updateEduState);
      input.addEventListener('input', updateEduState);
    });
  };

  const updateEduState = (e) => {
    const el = e.target;
    const idx = parseInt(el.getAttribute('data-idx'), 10);
    const item = formData.education[idx];

    if (el.classList.contains('edu-institution')) item.institution = el.value;
    else if (el.classList.contains('edu-degree')) item.degree = el.value;
    else if (el.classList.contains('edu-field')) item.fieldOfStudy = el.value;
    else if (el.classList.contains('edu-start-year')) item.startYear = el.value;
    else if (el.classList.contains('edu-end-year')) item.endYear = el.value;
    saveSession();
  };

  window.removeEduCard = (index) => {
    if (formData.education.length <= 1) return;
    formData.education.splice(index, 1);
    renderEduCards();
    saveSession();
  };

  addEduBtn.addEventListener('click', () => {
    if (formData.education.length >= 3) return;
    formData.education.push({
      institution: '', degree: '', fieldOfStudy: '', startYear: '2010', endYear: '2014'
    });
    renderEduCards();
    saveSession();
  });

  // Render initial cards
  renderWorkCards();
  renderEduCards();
}

/* ==========================================================================
   SERVICES & RATES (STEP 3)
   ========================================================================== */
function initServicesDropdowns() {
  const catPills = document.querySelectorAll('#onboarding-service-cats button');
  const pref1 = document.getElementById('onboarding-pref-1');
  const pref2 = document.getElementById('onboarding-pref-2');
  const pref3 = document.getElementById('onboarding-pref-3');

  const minFee = document.getElementById('onboarding-rate-min');
  const maxFee = document.getElementById('onboarding-rate-max');

  if (!pref1 || !pref2 || !pref3) return;

  // Rate range sync
  minFee.value = formData.minFee || '';
  maxFee.value = formData.maxFee || '';

  minFee.addEventListener('input', () => {
    formData.minFee = minFee.value;
    saveSession();
  });
  maxFee.addEventListener('input', () => {
    formData.maxFee = maxFee.value;
    saveSession();
  });

  let activeCat = 'All';

  const populateServices = () => {
    const list = SERVICE_TAXONOMY.filter(s => activeCat === 'All' || s.category === activeCat);
    
    const getOptionsHtml = (selectedVal, otherSelections) => {
      const filtered = list.filter(s => !otherSelections.includes(s.name) || s.name === selectedVal);
      return `<option value="">Select service...</option>` + 
        filtered.map(s => `<option value="${s.name}" ${s.name === selectedVal ? 'selected' : ''}>${s.name}</option>`).join('');
    };

    const sel1 = formData.firstPref || '';
    const sel2 = formData.secondPref || '';
    const sel3 = formData.thirdPref || '';

    pref1.innerHTML = getOptionsHtml(sel1, [sel2, sel3]);
    pref2.innerHTML = getOptionsHtml(sel2, [sel1, sel3]);
    pref3.innerHTML = getOptionsHtml(sel3, [sel1, sel2]);
  };

  // Category filter click
  catPills.forEach(pill => {
    pill.addEventListener('click', () => {
      catPills.forEach(b => b.classList.remove('active'));
      pill.classList.add('active');
      activeCat = pill.getAttribute('data-cat');
      populateServices();
    });
  });

  // Dropdown change updates
  pref1.addEventListener('change', () => {
    formData.firstPref = pref1.value;
    populateServices();
    saveSession();
  });
  pref2.addEventListener('change', () => {
    formData.secondPref = pref2.value;
    populateServices();
    saveSession();
  });
  pref3.addEventListener('change', () => {
    formData.thirdPref = pref3.value;
    populateServices();
    saveSession();
  });

  // Initial load
  populateServices();
}

/* ==========================================================================
   NAVIGATION STEPPER CONTROL
   ========================================================================== */
function initNavigationStepper() {
  const stepsList = document.getElementById('onboarding-steps-list');
  const progressBar = document.getElementById('onboarding-progress-bar');
  const stepLabel = document.getElementById('onboarding-step-label');

  const sections = {
    1: document.getElementById('onboarding-sec-1'),
    2: document.getElementById('onboarding-sec-2'),
    3: document.getElementById('onboarding-sec-3'),
    4: document.getElementById('onboarding-sec-4'),
    5: document.getElementById('onboarding-sec-5')
  };

  window.navigateToStep = (targetStep) => {
    // If navigating back to step 1, restore content visibility and hide the loading state
    if (targetStep === 1) {
      const contentEl = document.getElementById('onboarding-sec-1-content');
      const loadingEl = document.getElementById('onboarding-sec-1-loading');
      if (contentEl) contentEl.style.display = 'block';
      if (loadingEl) loadingEl.style.display = 'none';
    }

    // Hide current sections, show target
    Object.values(sections).forEach(sec => {
      if (sec) sec.style.display = 'none';
    });
    if (sections[targetStep]) sections[targetStep].style.display = 'block';

    currentStep = targetStep;
    saveSession();

    // Update progress elements
    const progressPct = (currentStep / 5) * 100;
    progressBar.style.width = `${progressPct}%`;
    stepLabel.textContent = `STEP ${currentStep} OF 5`;

    // Sidebar indicators
    stepsList.querySelectorAll('.apply-step').forEach((el, index) => {
      const stepNum = index + 1;
      el.className = 'apply-step';
      const numContainer = el.querySelector('.apply-step-num');

      if (stepNum === currentStep) {
        el.classList.add('active');
        numContainer.textContent = stepNum;
        el.style.cursor = 'default';
      } else if (stepNum < currentStep) {
        el.classList.add('done');
        numContainer.textContent = '✓';
        el.style.cursor = 'pointer';
      } else {
        numContainer.textContent = stepNum;
        el.style.cursor = 'default';
      }
    });

    if (currentStep === 5) {
      compileReviewData();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar steps click listeners to navigate back
  if (stepsList) {
    const stepEls = stepsList.querySelectorAll('.apply-step');
    stepEls.forEach(el => {
      el.addEventListener('click', () => {
        const targetStep = parseInt(el.getAttribute('data-step'));
        if (targetStep < currentStep) {
          window.navigateToStep(targetStep);
        }
      });
    });
  }

  const validateStep = (step) => {
    if (step === 1) {
      if (!linkedinConnected) {
        showToast('Please import your LinkedIn details first to proceed.');
        return false;
      }
    }
    return true; // Logic-wise, remove all other mandatory validation blocks
  };

  const compileReviewData = () => {
    // Identity Review Mapping
    const reviewAvatar = document.getElementById('review-avatar-container');
    if (formData.profilePhoto) {
      reviewAvatar.innerHTML = `<img src="${formData.profilePhoto}" alt="" class="loaded" />`;
    } else {
      reviewAvatar.innerHTML = '👤';
    }

    document.getElementById('onboarding-review-name').textContent = `${formData.firstName} ${formData.lastName}`;
    document.getElementById('onboarding-review-email').textContent = formData.contactEmail;

    const locArr = [formData.city, formData.state, formData.country].filter(Boolean);
    document.getElementById('onboarding-review-location').textContent = locArr.join(', ') || '-';
    document.getElementById('onboarding-review-phone').textContent = formData.phone ? `${formData.phoneExtension} ${formData.phone}` : '-';
    document.getElementById('onboarding-review-bio').textContent = formData.bio || '-';

    const lnk = document.getElementById('onboarding-review-linkedin');
    lnk.textContent = formData.linkedinUrl || '-';
    lnk.href = formData.linkedinUrl || '#';

    // Experience
    document.getElementById('onboarding-review-years').textContent = `${formData.yearsOfExperience || '0'} Years`;

    // Work list
    const reviewWork = document.getElementById('onboarding-review-work-section');
    reviewWork.innerHTML = formData.workExperience.map(we => `
      <div class="apply-review-row" style="grid-template-columns: 140px 1fr;">
        <span class="mono">WORK HISTORY</span>
        <div>
          <b>${we.jobTitle} at ${we.company}</b>
          <div style="font-size: 12px; color: var(--ink-3); margin-top: 2px;">
            ${we.city ? `${we.city} · ` : ''} ${we.firmSize ? `Firm: ${we.firmSize} · ` : ''} ${we.startMonth} ${we.startYear} – ${we.isCurrent ? 'Present' : `${we.endMonth} ${we.endYear}`}
          </div>
        </div>
      </div>
    `).join('');

    // Edu list
    const reviewEdu = document.getElementById('onboarding-review-edu-section');
    reviewEdu.innerHTML = formData.education.map(edu => `
      <div class="apply-review-row" style="grid-template-columns: 140px 1fr;">
        <span class="mono">EDUCATION</span>
        <div>
          <b>${edu.degree} in ${edu.fieldOfStudy}</b>
          <div style="font-size: 12px; color: var(--ink-3); margin-top: 2px;">
            ${edu.institution} (${edu.startYear} – ${edu.endYear})
          </div>
        </div>
      </div>
    `).join('');

    // Services
    const srvArr = [formData.firstPref, formData.secondPref, formData.thirdPref].filter(Boolean);
    document.getElementById('onboarding-review-services').textContent = srvArr.join(' · ') || '-';
    document.getElementById('onboarding-review-rates').textContent = `$${formData.minFee} – $${formData.maxFee} USD / Hour`;
  };

  // Nav buttons clicks
  document.getElementById('onboarding-next-2').addEventListener('click', () => {
    if (validateStep(2)) navigateToStep(3);
  });
  document.getElementById('onboarding-next-3').addEventListener('click', () => {
    if (validateStep(3)) navigateToStep(4);
  });
  document.getElementById('onboarding-next-4').addEventListener('click', () => {
    if (validateStep(4)) navigateToStep(5);
  });

  document.getElementById('onboarding-back-2').addEventListener('click', () => navigateToStep(1));
  document.getElementById('onboarding-back-3').addEventListener('click', () => navigateToStep(2));
  document.getElementById('onboarding-back-4').addEventListener('click', () => navigateToStep(3));
  document.getElementById('onboarding-back-5').addEventListener('click', () => navigateToStep(4));

  // Stepper sidebar click verification
  stepsList.querySelectorAll('.apply-step').forEach((el, index) => {
    el.addEventListener('click', () => {
      const targetStep = index + 1;
      if (targetStep < currentStep) {
        navigateToStep(targetStep);
      } else if (targetStep > currentStep) {
        // Validate intermediate steps
        let valid = true;
        for (let i = currentStep; i < targetStep; i++) {
          if (!validateStep(i)) {
            valid = false;
            break;
          }
        }
        if (valid) navigateToStep(targetStep);
      }
    });
  });

  // Final Form submit
  const wizardForm = document.getElementById('onboarding-form');
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Vouch declaration boxes - bypass validation blocks to allow submitting
    sessionStorage.removeItem('expertly_onboarding_form');
    sessionStorage.removeItem('expertly_onboarding_step');
    sessionStorage.removeItem('expertly_linkedin_connected');

    document.getElementById('onboarding-main-wizard').style.display = 'none';
    document.getElementById('onboarding-nav').style.display = 'block';
    document.getElementById('onboarding-success-view').style.display = 'flex';
  });
}

/* ==========================================================================
   LINKEDIN IMPORT STEP 1 & DATA PRE-POPULATION
   ========================================================================== */
function initLinkedInImportStep1() {
  const urlInput = document.getElementById('onboarding-linkedin-import-url');
  const consentCheck = document.getElementById('onboarding-import-consent');
  const importGoBtn = document.getElementById('onboarding-btn-import-go');

  const checkStep1Status = () => {
    if (urlInput && consentCheck && importGoBtn) {
      const urlValue = urlInput.value.trim();
      const isConsentChecked = consentCheck.checked;
      const isValidUrl = urlValue.toLowerCase().includes('linkedin');
      importGoBtn.disabled = !(isValidUrl && isConsentChecked);
    }
  };

  if (urlInput && consentCheck) {
    urlInput.addEventListener('input', checkStep1Status);
    consentCheck.addEventListener('change', checkStep1Status);
  }

  if (importGoBtn) {
    importGoBtn.addEventListener('click', () => {
      const val = urlInput.value.trim();
      if (!val || !val.toLowerCase().includes('linkedin')) {
        showToast('Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username).');
        urlInput.style.borderColor = '#e53935';
        setTimeout(() => { urlInput.style.borderColor = ''; }, 1500);
        return;
      }

      // Hide Step 1 Content, Show Loading
      const contentEl = document.getElementById('onboarding-sec-1-content');
      const loadingEl = document.getElementById('onboarding-sec-1-loading');
      if (contentEl) contentEl.style.display = 'none';
      if (loadingEl) loadingEl.style.display = 'block';

      // 10-second transition duration
      setTimeout(() => {
        // Mock LinkedIn profile data pre-population
        formData.firstName = formData.firstName || 'Jane';
        formData.lastName = formData.lastName || 'Smith';
        formData.linkedinUrl = formData.linkedinUrl || val;
        formData.bio = formData.bio || 'Experienced finance expert specializing in international tax advisory and corporate structuring. Previously managed global accounts at leading firms.';
        formData.yearsOfExperience = formData.yearsOfExperience || '12';
        
        formData.region = formData.region || 'asia_pacific';
        formData.country = formData.country || 'Singapore';
        formData.state = formData.state || 'Central Region';
        formData.city = formData.city || 'Singapore Central';

        // Populate work experience list if empty or default
        if (formData.workExperience.length === 1 && !formData.workExperience[0].jobTitle) {
          formData.workExperience = [
            { jobTitle: 'Senior Tax Advisor', company: 'Chen Advisory', companyWebsite: 'https://chenadvisory.com', city: 'Singapore', firmSize: '11–50', startMonth: 'Jan', startYear: '2020', endMonth: 'Dec', endYear: '2024', isCurrent: true }
          ];
        }

        // Reload Step 2 Input Elements (formerly Step 1)
        const firstNameEl = document.getElementById('onboarding-first-name');
        const lastNameEl = document.getElementById('onboarding-last-name');
        const linkedinUrlEl = document.getElementById('onboarding-linkedin-url');
        const bioEl = document.getElementById('onboarding-bio');

        if (firstNameEl) firstNameEl.value = formData.firstName;
        if (lastNameEl) lastNameEl.value = formData.lastName;
        if (linkedinUrlEl) linkedinUrlEl.value = formData.linkedinUrl;
        if (bioEl) bioEl.value = formData.bio;

        // Trigger state Cascades
        const regSelect = document.getElementById('onboarding-region');
        const countrySelect = document.getElementById('onboarding-country');

        if (regSelect) regSelect.value = formData.region;
        
        // Trigger region change list refresh
        if (countrySelect && formData.region) {
          const countries = COUNTRIES_BY_REGION[formData.region];
          countrySelect.innerHTML = '<option value="">Select country...</option>' + 
            countries.map(c => `<option value="${c}">${c}</option>`).join('');
          countrySelect.value = formData.country;
        }

        updateGeographyCascade();
        
        // Set WhatsApp extension defaults
        formData.phoneExtension = '+65';
        const phoneExtEl = document.getElementById('onboarding-phone-extension');
        if (phoneExtEl) phoneExtEl.value = '+65';

        // Refresh experience repeating items in background
        initExperienceRepeatingCards();

        // Refresh values visually
        initIdentityFormElements();

        linkedinConnected = true;
        saveSession();
        showToast('LinkedIn profile data imported successfully.');
        navigateToStep(2);
      }, 10000);
    });
  }
}
