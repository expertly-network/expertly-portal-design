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
  const loginTab = document.getElementById('auth-tab-login');
  const signupTab = document.getElementById('auth-tab-signup');
  const toggleLink = document.getElementById('auth-toggle-mode-link');

  if (!loginTab || !signupTab) return;

  const cardTitle = document.getElementById('auth-card-title');
  const cardSub = document.getElementById('auth-card-sub');
  
  const roleSelectArea = document.getElementById('auth-role-select');
  const nameField = document.getElementById('auth-field-name');
  const keepSignedField = document.getElementById('auth-keep-signed');
  const submitBtn = document.getElementById('auth-submit-btn');
  const footText = document.getElementById('auth-foot-text');
  const memberNote = document.getElementById('auth-member-note');

  // Role buttons
  const clientRoleBtn = document.getElementById('role-btn-client');
  const memberRoleBtn = document.getElementById('role-btn-member');
  let currentRole = 'member';

  const setAuthMode = (mode) => {
    if (mode === 'signup') {
      loginTab.classList.remove('active');
      signupTab.classList.add('active');
      
      cardTitle.textContent = 'Create your Expertly account.';
      cardSub.textContent = 'Free. Takes 30 seconds. No credit card required.';
      
      roleSelectArea.style.display = 'block';
      nameField.style.display = 'block';
      nameField.querySelector('input').setAttribute('required', 'true');
      keepSignedField.style.display = 'none';
      
      submitBtn.innerHTML = `Create account <span class="arr">→</span>`;
      footText.textContent = 'Already registered? ';
      toggleLink.textContent = 'Sign in';

      if (currentRole === 'member') {
        memberNote.style.display = 'block';
      }
    } else {
      loginTab.classList.add('active');
      signupTab.classList.remove('active');
      
      cardTitle.textContent = 'Welcome back.';
      cardSub.textContent = 'Sign in to access the directory, send consultation requests, and manage your profile.';
      
      roleSelectArea.style.display = 'none';
      nameField.style.display = 'none';
      nameField.querySelector('input').removeAttribute('required');
      keepSignedField.style.display = 'block';
      
      submitBtn.innerHTML = `Sign in <span class="arr">→</span>`;
      footText.textContent = "Don't have an account? ";
      toggleLink.textContent = 'Create one';
      memberNote.style.display = 'none';
    }
  };

  loginTab.addEventListener('click', () => setAuthMode('login'));
  signupTab.addEventListener('click', () => setAuthMode('signup'));
  toggleLink.addEventListener('click', (e) => {
    e.preventDefault();
    const isLogin = loginTab.classList.contains('active');
    setAuthMode(isLogin ? 'signup' : 'login');
  });

  // Role selections
  if (clientRoleBtn && memberRoleBtn) {
    clientRoleBtn.addEventListener('click', () => {
      clientRoleBtn.classList.add('active');
      memberRoleBtn.classList.remove('active');
      currentRole = 'client';
      memberNote.style.display = 'none';
    });

    memberRoleBtn.addEventListener('click', () => {
      memberRoleBtn.classList.add('active');
      clientRoleBtn.classList.remove('active');
      currentRole = 'member';
      memberNote.style.display = 'block';
    });
  }

  // Submit form trigger
  const authForm = document.getElementById('auth-form-submit');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      alert(loginTab.classList.contains('active') ? 'Logged in successfully!' : 'Account created successfully!');
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

  // Practice Dropdown Populate
  const practiceSelect = document.getElementById('apply-practice');
  if (practiceSelect && window.EXPERTLY_PRACTICE_AREAS) {
    practiceSelect.innerHTML = '<option value="">Select…</option>' + 
      window.EXPERTLY_PRACTICE_AREAS.map(p => `<option value="${p.name}">${p.name}</option>`).join('');
  }

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

  // Tier buttons selection
  const buddingTierBtn = document.getElementById('apply-tier-budding');
  const seasonedTierBtn = document.getElementById('apply-tier-seasoned');

  if (buddingTierBtn && seasonedTierBtn) {
    buddingTierBtn.addEventListener('click', () => {
      buddingTierBtn.classList.add('active');
      seasonedTierBtn.classList.remove('active');
      selectedTier = 'budding';
    });
    seasonedTierBtn.addEventListener('click', () => {
      seasonedTierBtn.classList.add('active');
      buddingTierBtn.classList.remove('active');
      selectedTier = 'seasoned';
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
      } else if (stepNum < currentStep) {
        el.classList.add('done');
        numContainer.textContent = '✓';
      } else {
        numContainer.textContent = stepNum;
      }
    });

    // If step 5 (Review), compile data
    if (currentStep === 5) {
      compileReviewData();
    }

    // Scroll to top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Field validation helper for specific step
  const validateStep = (step) => {
    if (step === 1) {
      if (!linkedinConnected) {
        alert('Please import your LinkedIn details first to proceed.');
        return false;
      }
    }
    return true; // Logic-wise, remove all other mandatory validation blocks
  };

  const compileReviewData = () => {
    const getValue = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };

    const fName = getValue('apply-first-name');
    const lName = getValue('apply-last-name');
    const email = getValue('apply-email');
    const country = getValue('apply-country');
    const practice = getValue('apply-practice');
    const years = getValue('apply-years');
    const firm = getValue('apply-firm');
    const rateMin = getValue('apply-rate-min');
    const rateMax = getValue('apply-rate-max');
    const ref1Name = getValue('apply-ref1-name');
    const ref2Name = getValue('apply-ref2-name');

    const setReviewText = (id, val) => {
      const el = document.getElementById(id);
      if (el) el.textContent = val || '—';
    };

    setReviewText('review-name', `${fName} ${lName}`.trim() || '—');
    setReviewText('review-email', email);
    setReviewText('review-country', country);
    setReviewText('review-tier', selectedTier === 'budding' ? 'Budding Professional · $499/yr' : 'Seasoned Professional · $699/yr');
    setReviewText('review-practice', practice ? `${practice} · ${years} yrs` : '—');
    setReviewText('review-firm', firm);
    setReviewText('review-rate', rateMin || rateMax ? `$${rateMin} – $${rateMax}/hr` : '—');
    setReviewText('review-references', ref1Name || ref2Name ? `${ref1Name} · ${ref2Name}` : '—');
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
        alert('Please enter a valid LinkedIn URL (e.g. https://linkedin.com/in/username).');
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

        // Set practice area
        const practiceEl = document.getElementById('apply-practice');
        if (practiceEl) {
          practiceEl.value = 'Taxation';
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
  if (submitBtn) {
    submitBtn.disabled = false; // Enabled by default to allow testing/submission
    submitBtn.addEventListener('click', () => {
      alert('Thank you! Your membership application has been submitted successfully.');
      window.location.href = 'index.html';
    });
  }
}
