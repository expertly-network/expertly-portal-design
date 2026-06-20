/**
 * Expertly Static Site Auth, Pricing, and Application Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Pricing Billing Toggle
  initPricingToggle();

  // 2. Login / Signup Form Switcher
  initLoginTabs();

  // 3. Application Form Wizard Stepper
  initApplicationWizard();
});

/* ==========================================================================
   1. PRICING PAGE
   ========================================================================== */
function initPricingToggle() {
  const monthlyBtn = document.getElementById('billing-monthly-btn');
  const annualBtn = document.getElementById('billing-annual-btn');
  
  if (!monthlyBtn || !annualBtn) return;

  const priceBudding = document.getElementById('price-budding');
  const priceSeasoned = document.getElementById('price-seasoned');
  const unitBudding = document.getElementById('unit-budding');
  const unitSeasoned = document.getElementById('unit-seasoned');
  const noteBudding = document.getElementById('note-budding');
  const noteSeasoned = document.getElementById('note-seasoned');

  const compBudding = document.getElementById('comp-price-budding');
  const compSeasoned = document.getElementById('comp-price-seasoned');

  const setBilling = (mode) => {
    if (mode === 'monthly') {
      monthlyBtn.classList.add('active');
      annualBtn.classList.remove('active');

      if (priceBudding) priceBudding.textContent = '49';
      if (priceSeasoned) priceSeasoned.textContent = '69';
      if (unitBudding) unitBudding.textContent = '/month';
      if (unitSeasoned) unitSeasoned.textContent = '/month';
      if (noteBudding) noteBudding.textContent = 'Billed monthly · Cancel anytime';
      if (noteSeasoned) noteSeasoned.textContent = 'Billed monthly · Cancel anytime';

      if (compBudding) compBudding.textContent = '5–12 Yrs · $49/month';
      if (compSeasoned) compSeasoned.textContent = '12+ Yrs · $69/month';
    } else {
      annualBtn.classList.add('active');
      monthlyBtn.classList.remove('active');

      if (priceBudding) priceBudding.textContent = '499';
      if (priceSeasoned) priceSeasoned.textContent = '699';
      if (unitBudding) unitBudding.textContent = '/year';
      if (unitSeasoned) unitSeasoned.textContent = '/year';
      if (noteBudding) noteBudding.textContent = 'Billed annually · Best value';
      if (noteSeasoned) noteSeasoned.textContent = 'Billed annually · Best value';

      if (compBudding) compBudding.textContent = '5–12 Yrs · $499/year';
      if (compSeasoned) compSeasoned.textContent = '12+ Yrs · $699/year';
    }
  };

  monthlyBtn.addEventListener('click', () => setBilling('monthly'));
  annualBtn.addEventListener('click', () => setBilling('annual'));
}

/* ==========================================================================
   2. LOGIN & SIGNUP
   ========================================================================== */
function initLoginTabs() {
  const userTab = document.getElementById('auth-tab-user');
  const memberTab = document.getElementById('auth-tab-member');

  if (!userTab || !memberTab) return;

  const cardTitle = document.getElementById('auth-card-title');
  const cardSub = document.getElementById('auth-card-sub');
  
  const googleBtn = document.getElementById('sso-google');
  const linkedinBtn = document.getElementById('sso-linkedin');
  const divider = document.getElementById('auth-divider');
  const authForm = document.getElementById('auth-form-submit');
  const submitBtn = document.getElementById('auth-submit-btn');
  const footText = document.getElementById('auth-foot-text');
  const memberInfo = document.getElementById('auth-member-info');

  const setAuthMode = (mode) => {
    if (mode === 'member') {
      memberTab.classList.add('active');
      userTab.classList.remove('active');
      
      cardTitle.textContent = 'Welcome, Member.';
      cardSub.textContent = 'Sign in or connect your LinkedIn account to access the verified network.';
      
      if (googleBtn) googleBtn.style.display = 'none';
      if (linkedinBtn) linkedinBtn.style.display = 'flex';
      if (divider) divider.style.display = 'none';
      if (authForm) authForm.style.display = 'none';
      if (memberInfo) memberInfo.style.display = 'block';
      
      if (footText) footText.textContent = "LinkedIn authentication is required to access member-only profile editing.";
    } else {
      userTab.classList.add('active');
      memberTab.classList.remove('active');
      
      cardTitle.textContent = 'Get started with Expertly.';
      cardSub.textContent = 'Sign in or create a client account to search experts and book consultations.';
      
      if (googleBtn) googleBtn.style.display = 'none'; // Google option removed in User
      if (linkedinBtn) linkedinBtn.style.display = 'flex';
      if (divider) divider.style.display = 'flex';
      if (authForm) authForm.style.display = 'flex';
      if (memberInfo) memberInfo.style.display = 'none';
      if (submitBtn) {
        submitBtn.innerHTML = `Continue <span class="arr">→</span>`;
      }
      
      if (footText) footText.textContent = "By continuing, you agree to Expertly's Terms of Service.";
    }
  };

  userTab.addEventListener('click', () => setAuthMode('user'));
  memberTab.addEventListener('click', () => setAuthMode('member'));

  // Initialize with 'user' view by default
  setAuthMode('user');

  // Submit form trigger
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }

  // LinkedIn button action
  if (linkedinBtn) {
    linkedinBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = 'index.html';
    });
  }
}

/* ==========================================================================
   3. APPLICATION FORM WIZARD
   ========================================================================== */
function initApplicationWizard() {
  const form = document.getElementById('apply-form-wizard');
  if (!form) return;

  // Populate service select dropdowns with explicit sample data as fallback
  const serviceAreas = (window.EXPERTLY_PRACTICE_AREAS && window.EXPERTLY_PRACTICE_AREAS.length > 0)
    ? window.EXPERTLY_PRACTICE_AREAS 
    : [
        { name: 'M&A Tax' },
        { name: 'Transfer Pricing' },
        { name: 'Corporate Law' },
        { name: 'Capital Markets' },
        { name: 'IP & Technology' },
        { name: 'Banking & Finance' },
        { name: 'Dispute Resolution' },
        { name: 'Private Equity' },
        { name: 'Antitrust' },
        { name: 'Restructuring' },
        { name: 'Indirect Tax' },
        { name: 'Compliance' }
      ];
  const optionsHtml = '<option value="">Select service…</option>' + 
    serviceAreas.map(p => `<option value="${p.name}">${p.name}</option>`).join('');

  ['apply-service-1', 'apply-service-2', 'apply-service-3'].forEach(id => {
    const selectEl = document.getElementById(id);
    if (selectEl) {
      selectEl.innerHTML = optionsHtml;
    }
  });

  let currentStep = 1;
  let selectedTier = 'seasoned'; // seasoned or budding
  let linkedinConnected = false;

  const sections = {
    1: document.getElementById('apply-sec-1'),
    2: document.getElementById('apply-sec-2'),
    3: document.getElementById('apply-sec-3'),
    4: document.getElementById('apply-sec-4'),
    5: document.getElementById('apply-sec-5')
  };

  const stepsList = document.getElementById('apply-steps-list');
  const progressBar = document.getElementById('apply-progress-bar');
  const stepIndicator = document.getElementById('apply-step-indicator');

  // Connect check-current employer for the first work entry
  const initCurrentEmployerCheck = (entry) => {
    const currentCheck = entry.querySelector('.work-current');
    const endMonth = entry.querySelector('.work-end-month');
    const endYear = entry.querySelector('.work-end-year');
    if (currentCheck && endMonth && endYear) {
      currentCheck.addEventListener('change', () => {
        const isCurrent = currentCheck.checked;
        endMonth.disabled = isCurrent;
        endYear.disabled = isCurrent;
        if (isCurrent) {
          endMonth.value = '';
          endYear.value = '';
        }
      });
    }
  };

  const firstWorkEntry = document.querySelector('#apply-work-entries .apply-work-entry');
  if (firstWorkEntry) {
    initCurrentEmployerCheck(firstWorkEntry);
  }

  // Work Experience Dynamic Addition / Removal
  const addWorkBtn = document.getElementById('apply-add-work');
  const workEntriesContainer = document.getElementById('apply-work-entries');
  if (addWorkBtn && workEntriesContainer) {
    addWorkBtn.addEventListener('click', () => {
      const currentEntries = workEntriesContainer.querySelectorAll('.apply-work-entry');
      if (currentEntries.length >= 5) {
        return;
      }
      const newIndex = currentEntries.length + 1;
      const newEntry = document.createElement('div');
      newEntry.className = 'apply-ref apply-work-entry';
      newEntry.setAttribute('data-entry', newIndex);
      newEntry.style.marginTop = '16px';
      newEntry.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <div class="apply-ref-label mono">Experience 0${newIndex}</div>
          <button type="button" class="work-remove-btn" style="color: #e53935; font-size: 12px; cursor: pointer; background: none; border: none; font-family: 'Archivo', sans-serif; font-weight: 500;">Remove</button>
        </div>
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Job title</label>
            <input type="text" class="work-title" placeholder="Partner" />
          </div>
          <div class="apply-field">
            <label>Company</label>
            <input type="text" class="work-company" placeholder="Firm name" />
          </div>
        </div>
        <div class="apply-field-row">
          <div class="apply-field">
            <label>City</label>
            <input type="text" class="work-city" placeholder="e.g. London" />
          </div>
          <div class="apply-field">
            <label>Firm size</label>
            <select class="work-size">
              <option value="">Select…</option>
              <option>Solo</option>
              <option>2–10</option>
              <option>11–50</option>
              <option>51–200</option>
              <option>200+</option>
            </select>
          </div>
        </div>
        <div class="apply-field">
          <label>Company website <span class="apply-hint-inline">(optional)</span></label>
          <input type="url" class="work-url" placeholder="https://example.com" />
        </div>
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Start date</label>
            <div style="display:flex;gap:8px;">
              <select class="work-start-month" style="flex:1;width:auto;">
                <option value="">Month</option>
                <option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>Jun</option><option>Jul</option><option>Aug</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option>
              </select>
              <select class="work-start-year" style="flex:1;width:auto;">
                <option value="">Year</option>
                ${Array.from({length: 67}, (_, i) => 2026 - i).map(y => `<option>${y}</option>`).join('')}
              </select>
            </div>
          </div>
          <div class="apply-field">
            <label>End date</label>
            <div style="display:flex;gap:8px;">
              <select class="work-end-month" style="flex:1;width:auto;">
                <option value="">Month</option>
                <option>Jan</option><option>Feb</option><option>Mar</option><option>Apr</option><option>May</option><option>Jun</option><option>Jul</option><option>Aug</option><option>Sep</option><option>Oct</option><option>Nov</option><option>Dec</option>
              </select>
              <select class="work-end-year" style="flex:1;width:auto;">
                <option value="">Year</option>
                ${Array.from({length: 67}, (_, i) => 2026 - i).map(y => `<option>${y}</option>`).join('')}
              </select>
            </div>
          </div>
        </div>
        <label class="apply-check" style="margin:0;">
          <input type="checkbox" class="work-current" />
          <span>I currently work here</span>
        </label>
      `;

      initCurrentEmployerCheck(newEntry);

      newEntry.querySelector('.work-remove-btn').addEventListener('click', () => {
        newEntry.remove();
        const remaining = workEntriesContainer.querySelectorAll('.apply-work-entry');
        remaining.forEach((rem, idx) => {
          rem.setAttribute('data-entry', idx + 1);
          rem.querySelector('.apply-ref-label').textContent = `Experience 0${idx + 1}`;
        });
      });

      workEntriesContainer.appendChild(newEntry);
    });
  }

  // Education Dynamic Addition / Removal
  const addEduBtn = document.getElementById('apply-add-edu');
  const eduEntriesContainer = document.getElementById('apply-edu-entries');
  if (addEduBtn && eduEntriesContainer) {
    addEduBtn.addEventListener('click', () => {
      const currentEntries = eduEntriesContainer.querySelectorAll('.apply-edu-entry');
      if (currentEntries.length >= 3) {
        return;
      }
      const newIndex = currentEntries.length + 1;
      const newEntry = document.createElement('div');
      newEntry.className = 'apply-ref apply-edu-entry';
      newEntry.setAttribute('data-entry', newIndex);
      newEntry.style.marginTop = '16px';
      newEntry.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 12px;">
          <div class="apply-ref-label mono">Education 0${newIndex}</div>
          <button type="button" class="edu-remove-btn" style="color: #e53935; font-size: 12px; cursor: pointer; background: none; border: none; font-family: 'Archivo', sans-serif; font-weight: 500;">Remove</button>
        </div>
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Institution</label>
            <input type="text" class="edu-institution" placeholder="University name" />
          </div>
          <div class="apply-field">
            <label>Degree</label>
            <input type="text" class="edu-degree" placeholder="LLB, MBA…" />
          </div>
        </div>
        <div class="apply-field">
          <label>Field of study</label>
          <input type="text" class="edu-field" placeholder="e.g. Corporate Law" />
        </div>
        <div class="apply-field-row">
          <div class="apply-field">
            <label>Start year</label>
            <input type="number" class="edu-start" placeholder="2010" min="1950" max="2030" />
          </div>
          <div class="apply-field">
            <label>End year</label>
            <input type="number" class="edu-end" placeholder="2014" min="1950" max="2030" />
          </div>
        </div>
      `;

      newEntry.querySelector('.edu-remove-btn').addEventListener('click', () => {
        newEntry.remove();
        const remaining = eduEntriesContainer.querySelectorAll('.apply-edu-entry');
        remaining.forEach((rem, idx) => {
          rem.setAttribute('data-entry', idx + 1);
          rem.querySelector('.apply-ref-label').textContent = `Education 0${idx + 1}`;
        });
      });

      eduEntriesContainer.appendChild(newEntry);
    });
  }

  // Stepper helper
  const navigateToStep = (targetStep) => {
    // If navigating back to step 1, restore content visibility and hide the loading state
    if (targetStep === 1) {
      const applySec1Content = document.getElementById('apply-sec-1-content');
      const applySec1Loading = document.getElementById('apply-sec-1-loading');
      if (applySec1Content) applySec1Content.style.display = 'block';
      if (applySec1Loading) applySec1Loading.style.display = 'none';
    }

    // Hide current section, show target section
    sections[currentStep].style.display = 'none';
    sections[targetStep].style.display = 'block';

    currentStep = targetStep;

    // Expand form on step 5, restore on other steps
    const applyGrid = document.querySelector('.apply-grid');
    if (applyGrid) {
      if (currentStep === 5) applyGrid.classList.add('step-5-mode');
      else applyGrid.classList.remove('step-5-mode');
    }

    // Update progress bar & label
    const pct = (currentStep / 5) * 100;
    progressBar.style.width = `${pct}%`;
    stepIndicator.textContent = `Step ${currentStep} of 5`;

    // Update sidebar steps indicators
    const stepEls = stepsList.querySelectorAll('.apply-step');
    stepEls.forEach((el, index) => {
      const stepNum = index + 1;
      el.classList.remove('active', 'done');
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

    // If step 5 (Review), compile data
    if (currentStep === 5) {
      compileReviewData();
    }

    // Scroll to top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Sidebar steps click listeners to navigate back
  if (stepsList) {
    const stepEls = stepsList.querySelectorAll('.apply-step');
    stepEls.forEach(el => {
      el.addEventListener('click', () => {
        const targetStep = parseInt(el.getAttribute('data-step'));
        if (targetStep < currentStep) {
          navigateToStep(targetStep);
        }
      });
    });
  }

  // Field validation helper for specific step
  const validateStep = (step) => {
    if (step === 1) {
      if (!linkedinConnected) {
        const importSection = document.getElementById('apply-sec-1-content');
        if (importSection) {
          importSection.style.outline = '2px solid #e53935';
          importSection.style.borderRadius = '12px';
          importSection.animate?.([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], {duration:300, easing:'ease-out'});
          setTimeout(() => { importSection.style.outline = ''; }, 1500);
        }
        return false;
      }
    }
    return true; 
  };

  const compileReviewData = () => {
    const getValue = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const setReviewText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    };

    // 1. Photo Avatar
    const reviewPhoto = document.getElementById('review-photo');
    const applyPhotoAvatar = document.getElementById('apply-photo-avatar');
    if (reviewPhoto && applyPhotoAvatar) {
      reviewPhoto.innerHTML = applyPhotoAvatar.innerHTML;
      const img = reviewPhoto.querySelector('img');
      if (img) { img.style.width = '100%'; img.style.height = '100%'; img.style.objectFit = 'cover'; }
    }

    // 2. Identity info
    const fName = getValue('apply-first-name');
    const lName = getValue('apply-last-name');
    setReviewText('review-name', `${fName} ${lName}`.trim() || '—');
    setReviewText('review-email', getValue('apply-email'));
    
    const phoneExt = getValue('apply-phone-ext');
    const phoneNum = getValue('apply-phone');
    setReviewText('review-phone', phoneNum ? `${phoneExt} ${phoneNum}` : '—');

    const city = getValue('apply-city');
    const state = getValue('apply-state');
    const country = getValue('apply-country');
    const locParts = [city, state, country].filter(Boolean);
    setReviewText('review-location', locParts.join(', ') || '—');

    setReviewText('review-linkedin', getValue('apply-linkedin'));
    setReviewText('review-bio', getValue('apply-bio'));

    // 3. Experience info
    const years = getValue('apply-years');
    setReviewText('review-years', years ? `${years} years` : '—');

    // Work History Entries
    const reviewWork = document.getElementById('review-work');
    if (reviewWork) {
      const workEntries = document.querySelectorAll('#apply-work-entries .apply-work-entry');
      if (workEntries.length === 0) {
        reviewWork.innerHTML = '<b style="font-weight: 450; color: var(--ink-3);">—</b>';
      } else {
        let workHtml = '';
        workEntries.forEach(entry => {
          const title = entry.querySelector('.work-title')?.value.trim() || '';
          const company = entry.querySelector('.work-company')?.value.trim() || '';
          const wCity = entry.querySelector('.work-city')?.value.trim() || '';
          const wSize = entry.querySelector('.work-size')?.value || '';
          const wUrl = entry.querySelector('.work-url')?.value.trim() || '';
          
          const startMonth = entry.querySelector('.work-start-month')?.value || '';
          const startYear = entry.querySelector('.work-start-year')?.value || '';
          const isCurrent = entry.querySelector('.work-current')?.checked;
          const endMonth = entry.querySelector('.work-end-month')?.value || '';
          const endYear = entry.querySelector('.work-end-year')?.value || '';

          if (title || company) {
            const dateStr = `${startMonth} ${startYear} – ` + (isCurrent ? 'Present' : `${endMonth} ${endYear}`);
            const metaParts = [wCity, wSize ? `${wSize} employees` : '', wUrl].filter(Boolean);
            workHtml += `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: 500; color: var(--ink);">${title || 'Role'} at ${company || 'Company'}</div>
                <div style="font-size: 12px; color: var(--ink-3); margin-top: 2px;">${dateStr}</div>
                ${metaParts.length > 0 ? `<div style="font-size: 12px; color: var(--ink-4); margin-top: 1px;">${metaParts.join(' · ')}</div>` : ''}
              </div>
            `;
          }
        });
        reviewWork.innerHTML = workHtml || '<b style="font-weight: 450; color: var(--ink-3);">—</b>';
      }
    }

    // Education Entries
    const reviewEdu = document.getElementById('review-education');
    if (reviewEdu) {
      const eduEntries = document.querySelectorAll('#apply-edu-entries .apply-edu-entry');
      if (eduEntries.length === 0) {
        reviewEdu.innerHTML = '<b style="font-weight: 450; color: var(--ink-3);">—</b>';
      } else {
        let eduHtml = '';
        eduEntries.forEach(entry => {
          const inst = entry.querySelector('.edu-institution')?.value.trim() || '';
          const deg = entry.querySelector('.edu-degree')?.value.trim() || '';
          const field = entry.querySelector('.edu-field')?.value.trim() || '';
          const start = entry.querySelector('.edu-start')?.value || '';
          const end = entry.querySelector('.edu-end')?.value || '';

          if (inst || deg) {
            eduHtml += `
              <div style="margin-bottom: 8px;">
                <div style="font-weight: 500; color: var(--ink);">${deg || 'Degree'} in ${field || 'Field'}</div>
                <div style="font-size: 12px; color: var(--ink-3); margin-top: 2px;">${inst} ${start || end ? `(${start} – ${end})` : ''}</div>
              </div>
            `;
          }
        });
        reviewEdu.innerHTML = eduHtml || '<b style="font-weight: 450; color: var(--ink-3);">—</b>';
      }
    }

    // 4. Services info
    const service1 = getValue('apply-service-1');
    const service2 = getValue('apply-service-2');
    const service3 = getValue('apply-service-3');
    const services = [
      service1 ? `${service1} (Primary)` : '',
      service2 ? `${service2}` : '',
      service3 ? `${service3}` : ''
    ].filter(Boolean);
    setReviewText('review-services', services.join(' · ') || '—');

    const rateMin = getValue('apply-rate-min');
    const rateMax = getValue('apply-rate-max');
    setReviewText('review-rate', rateMin || rateMax ? `$${rateMin || '0'} – $${rateMax || '0'} / hour` : '—');
  };

  // LinkedIn Import Step 1 Listeners & Logic
  const urlInput = document.getElementById('apply-linkedin-import-url');
  const consentCheck = document.getElementById('apply-import-consent');
  const importGoBtn = document.getElementById('apply-btn-import-go');

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
        urlInput.style.borderColor = '#e53935';
        urlInput.animate?.([{transform:'translateX(-4px)'},{transform:'translateX(4px)'},{transform:'translateX(0)'}], {duration:300, easing:'ease-out'});
        setTimeout(() => { urlInput.style.borderColor = ''; }, 1500);
        return;
      }

      // Hide Step 1 Content, Show Loading
      const applySec1Content = document.getElementById('apply-sec-1-content');
      const applySec1Loading = document.getElementById('apply-sec-1-loading');
      if (applySec1Content) applySec1Content.style.display = 'none';
      if (applySec1Loading) applySec1Loading.style.display = 'block';

      // 10-second transition duration
      setTimeout(() => {
        // Pre-populate fields
        document.getElementById('apply-first-name').value = 'Jane';
        document.getElementById('apply-last-name').value = 'Smith';
        document.getElementById('apply-email').value = 'jane.smith@example.com';
        document.getElementById('apply-region').value = 'asia_pacific';
        document.getElementById('apply-country').value = 'Singapore';
        document.getElementById('apply-linkedin').value = val;
        document.getElementById('apply-bio').value = 'Experienced tax advisor specializing in cross-border structuring, international compliance, and M&A tax strategies. Previously managed global accounts at leading advisory firms.';
        
        // Step 3 background fields
        const yearsEl = document.getElementById('apply-years');
        if (yearsEl) yearsEl.value = '12';

        // Set service preference
        const service1El = document.getElementById('apply-service-1');
        if (service1El) {
          service1El.value = 'M&A Tax';
        }

        // Populate some mock entries in Experience 01
        const workEntries = document.getElementById('apply-work-entries');
        if (workEntries) {
          const titleInput = workEntries.querySelector('.work-title');
          const companyInput = workEntries.querySelector('.work-company');
          const cityInput = workEntries.querySelector('.work-city');
          const sizeSelect = workEntries.querySelector('.work-size');
          const urlInput = workEntries.querySelector('.work-url');
          
          if (titleInput) titleInput.value = 'Senior Tax Director';
          if (companyInput) companyInput.value = 'Chen Advisory';
          if (cityInput) cityInput.value = 'Singapore';
          if (sizeSelect) sizeSelect.value = '11–50';
          if (urlInput) urlInput.value = 'https://chenadvisory.com';
        }

        // Populate mock Education 01
        const eduEntries = document.getElementById('apply-edu-entries');
        if (eduEntries) {
          const instInput = eduEntries.querySelector('.edu-institution');
          const degInput = eduEntries.querySelector('.edu-degree');
          const fieldInput = eduEntries.querySelector('.edu-field');
          const startInput = eduEntries.querySelector('.edu-start');
          const endInput = eduEntries.querySelector('.edu-end');

          if (instInput) instInput.value = 'National University of Singapore';
          if (degInput) degInput.value = 'Master of Laws (LLM)';
          if (fieldInput) fieldInput.value = 'International Tax';
          if (startInput) startInput.value = '2010';
          if (endInput) endInput.value = '2012';
        }

        // Step 4 rates fields
        const rateMin = document.getElementById('apply-rate-min');
        const rateMax = document.getElementById('apply-rate-max');
        if (rateMin) rateMin.value = '450';
        if (rateMax) rateMax.value = '800';

        // Mock photo upload preview
        const photoAvatar = document.getElementById('apply-photo-avatar');
        const photoLabel = document.getElementById('apply-photo-label');
        const photoZone = document.getElementById('apply-photo-zone');
        if (photoAvatar && photoLabel && photoZone) {
          photoAvatar.innerHTML = '<div style="width:100%;height:100%;background:#0077B5;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:600;">JS</div>';
          photoLabel.textContent = 'Change photo';
          photoZone.style.borderColor = 'var(--accent)';
        }

        linkedinConnected = true;
        navigateToStep(2);
      }, 10000);
    });
  }

  const skipImportBtn = document.getElementById('apply-btn-skip-import');
  if (skipImportBtn) {
    skipImportBtn.addEventListener('click', () => {
      linkedinConnected = true;
      navigateToStep(2);
    });
  }

  // Next / Back buttons listeners
  document.getElementById('apply-btn-next-2').addEventListener('click', () => {
    if (validateStep(2)) navigateToStep(3);
  });

  document.getElementById('apply-btn-next-3').addEventListener('click', () => {
    if (validateStep(3)) navigateToStep(4);
  });

  document.getElementById('apply-btn-next-4').addEventListener('click', () => {
    if (validateStep(4)) navigateToStep(5);
  });

  document.getElementById('apply-btn-back-2').addEventListener('click', () => navigateToStep(1));
  document.getElementById('apply-btn-back-3').addEventListener('click', () => navigateToStep(2));
  document.getElementById('apply-btn-back-4').addEventListener('click', () => navigateToStep(3));
  document.getElementById('apply-btn-back-5').addEventListener('click', () => navigateToStep(4));

  // Agreement Checkbox / Submit Button
  const submitBtn = document.getElementById('apply-btn-submit');
  const allConsentsCheck = document.getElementById('apply-agree-all-consents');
  
  const validateSubmitBtn = () => {
    if (submitBtn && allConsentsCheck) {
      submitBtn.disabled = !allConsentsCheck.checked;
    }
  };

  if (allConsentsCheck) {
    allConsentsCheck.addEventListener('change', validateSubmitBtn);
  }

  if (submitBtn) {
    validateSubmitBtn(); // Set initial state
    submitBtn.addEventListener('click', () => {
      // Serialize all form details to save in localStorage for review.html
      const getVal = (id) => document.getElementById(id)?.value.trim() || '';
      
      const workData = [];
      document.querySelectorAll('#apply-work-entries .apply-work-entry').forEach(entry => {
        const title = entry.querySelector('.work-title')?.value.trim() || '';
        const company = entry.querySelector('.work-company')?.value.trim() || '';
        const wCity = entry.querySelector('.work-city')?.value.trim() || '';
        const wSize = entry.querySelector('.work-size')?.value || '';
        const wUrl = entry.querySelector('.work-url')?.value.trim() || '';
        const startMonth = entry.querySelector('.work-start-month')?.value || '';
        const startYear = entry.querySelector('.work-start-year')?.value || '';
        const isCurrent = entry.querySelector('.work-current')?.checked;
        const endMonth = entry.querySelector('.work-end-month')?.value || '';
        const endYear = entry.querySelector('.work-end-year')?.value || '';
        
        if (title || company) {
          workData.push({ title, company, city: wCity, size: wSize, url: wUrl, startMonth, startYear, isCurrent, endMonth, endYear });
        }
      });

      const eduData = [];
      document.querySelectorAll('#apply-edu-entries .apply-edu-entry').forEach(entry => {
        const institution = entry.querySelector('.edu-institution')?.value.trim() || '';
        const degree = entry.querySelector('.edu-degree')?.value.trim() || '';
        const field = entry.querySelector('.edu-field')?.value.trim() || '';
        const start = entry.querySelector('.edu-start')?.value || '';
        const end = entry.querySelector('.edu-end')?.value || '';
        
        if (institution || degree) {
          eduData.push({ institution, degree, field, start, end });
        }
      });

      const appData = {
        photoHtml: document.getElementById('apply-photo-avatar')?.innerHTML || '',
        firstName: getVal('apply-first-name'),
        lastName: getVal('apply-last-name'),
        email: getVal('apply-email'),
        phoneExt: getVal('apply-phone-ext'),
        phone: getVal('apply-phone'),
        region: getVal('apply-region'),
        country: getVal('apply-country'),
        state: getVal('apply-state'),
        city: getVal('apply-city'),
        linkedin: getVal('apply-linkedin'),
        bio: getVal('apply-bio'),
        yearsExp: getVal('apply-years'),
        workHistory: workData,
        education: eduData,
        service1: getVal('apply-service-1'),
        service2: getVal('apply-service-2'),
        service3: getVal('apply-service-3'),
        rateMin: getVal('apply-rate-min'),
        rateMax: getVal('apply-rate-max')
      };

      localStorage.setItem('expertly_application_data', JSON.stringify(appData));
      window.location.href = 'review.html';
    });
  }
}
