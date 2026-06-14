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

  const sections = {
    1: document.getElementById('apply-sec-1'),
    2: document.getElementById('apply-sec-2'),
    3: document.getElementById('apply-sec-3'),
    4: document.getElementById('apply-sec-4')
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
    // Hide current section, show target section
    sections[currentStep].style.display = 'none';
    sections[targetStep].style.display = 'block';

    currentStep = targetStep;

    // Update progress bar & label
    const pct = (currentStep / 4) * 100;
    progressBar.style.width = `${pct}%`;
    stepIndicator.textContent = `Step ${currentStep} of 4`;

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

    // If step 4 (Review), compile data
    if (currentStep === 4) {
      compileReviewData();
    }

    // Scroll to top of window
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Field validation helper for specific step
  const validateStep = (step) => {
    let isValid = true;
    const clearErrors = (sec) => {
      sec.querySelectorAll('.apply-field').forEach(field => {
        field.classList.remove('field-error');
        const err = field.querySelector('.error-text');
        if (err) err.remove();
      });
    };

    const addError = (inputEl, message) => {
      isValid = false;
      const field = inputEl.closest('.apply-field');
      if (field) {
        field.classList.add('field-error');
        if (!field.querySelector('.error-text')) {
          const errSpan = document.createElement('span');
          errSpan.className = 'error-text';
          errSpan.textContent = message;
          field.appendChild(errSpan);
        }
      }
    };

    if (step === 1) {
      const sec = sections[1];
      clearErrors(sec);

      const fName = document.getElementById('apply-first-name');
      const lName = document.getElementById('apply-last-name');
      const email = document.getElementById('apply-email');
      const country = document.getElementById('apply-country');

      if (!fName.value.trim()) addError(fName, 'First name is required');
      if (!lName.value.trim()) addError(lName, 'Last name is required');
      
      const emailVal = email.value.trim();
      if (!emailVal) {
        addError(email, 'Email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailVal)) {
        addError(email, 'Enter a valid email address');
      }

      if (!country.value) addError(country, 'Country of practice is required');

    } else if (step === 2) {
      const sec = sections[2];
      clearErrors(sec);

      const practice = document.getElementById('apply-practice');
      const years = document.getElementById('apply-years');
      const firm = document.getElementById('apply-firm');
      const linkedin = document.getElementById('apply-linkedin');
      const rate = document.getElementById('apply-rate');
      const bio = document.getElementById('apply-bio');

      if (!practice.value) addError(practice, 'Primary practice area is required');
      
      const yearsVal = parseInt(years.value, 10);
      if (isNaN(yearsVal) || yearsVal < 0 || yearsVal > 60) {
        addError(years, 'Years of experience must be between 0 and 60');
      }

      if (!firm.value.trim()) addError(firm, 'Current firm name is required');
      
      const linkedinVal = linkedin.value.trim();
      if (!linkedinVal) {
        addError(linkedin, 'LinkedIn URL is required');
      } else if (!/^https?:\/\/(www\.)?linkedin\.com\/in\/.+/.test(linkedinVal)) {
        addError(linkedin, 'Enter a valid LinkedIn profile URL');
      }

      const rateVal = parseInt(rate.value, 10);
      if (isNaN(rateVal) || rateVal < 0) {
        addError(rate, 'Typical rate must be a positive number');
      }

      if (!bio.value.trim()) addError(bio, 'Short bio is required');
      
    } else if (step === 3) {
      const sec = sections[3];
      clearErrors(sec);

      const ref1Name = document.getElementById('apply-ref1-name');
      const ref1Email = document.getElementById('apply-ref1-email');
      const ref2Name = document.getElementById('apply-ref2-name');
      const ref2Email = document.getElementById('apply-ref2-email');

      if (!ref1Name.value.trim()) addError(ref1Name, 'Reference 01 name is required');
      if (!ref2Name.value.trim()) addError(ref2Name, 'Reference 02 name is required');

      const email1 = ref1Email.value.trim();
      if (!email1) {
        addError(ref1Email, 'Reference 01 email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email1)) {
        addError(ref1Email, 'Enter a valid email address');
      }

      const email2 = ref2Email.value.trim();
      if (!email2) {
        addError(ref2Email, 'Reference 02 email is required');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email2)) {
        addError(ref2Email, 'Enter a valid email address');
      }
    }

    return isValid;
  };

  const compileReviewData = () => {
    const fName = document.getElementById('apply-first-name').value.trim();
    const lName = document.getElementById('apply-last-name').value.trim();
    const email = document.getElementById('apply-email').value.trim();
    const country = document.getElementById('apply-country').value;
    const practice = document.getElementById('apply-practice').value;
    const years = document.getElementById('apply-years').value;
    const firm = document.getElementById('apply-firm').value.trim();
    const rate = document.getElementById('apply-rate').value;
    const ref1Name = document.getElementById('apply-ref1-name').value.trim();
    const ref2Name = document.getElementById('apply-ref2-name').value.trim();

    document.getElementById('review-name').textContent = `${fName} ${lName}`;
    document.getElementById('review-email').textContent = email;
    document.getElementById('review-country').textContent = country;
    document.getElementById('review-tier').textContent = selectedTier === 'budding' ? 'Budding Professional · $499/yr' : 'Seasoned Professional · $699/yr';
    document.getElementById('review-practice').textContent = `${practice} · ${years} yrs`;
    document.getElementById('review-firm').textContent = firm;
    document.getElementById('review-rate').textContent = `$${rate}/hr`;
    document.getElementById('review-references').textContent = `${ref1Name} · ${ref2Name}`;
  };

  // Next / Back buttons listeners
  document.getElementById('apply-btn-next-1').addEventListener('click', () => {
    if (validateStep(1)) navigateToStep(2);
  });
  
  document.getElementById('apply-btn-next-2').addEventListener('click', () => {
    if (validateStep(2)) navigateToStep(3);
  });

  document.getElementById('apply-btn-next-3').addEventListener('click', () => {
    if (validateStep(3)) navigateToStep(4);
  });

  document.getElementById('apply-btn-back-2').addEventListener('click', () => navigateToStep(1));
  document.getElementById('apply-btn-back-3').addEventListener('click', () => navigateToStep(2));
  document.getElementById('apply-btn-back-4').addEventListener('click', () => navigateToStep(3));

  // Agreement Checkbox
  const consentCheckbox = document.getElementById('apply-agree-checkbox');
  const submitBtn = document.getElementById('apply-btn-submit');
  if (consentCheckbox && submitBtn) {
    consentCheckbox.addEventListener('change', () => {
      submitBtn.disabled = !consentCheckbox.checked;
    });
  }

  // Final Submit
  submitBtn.addEventListener('click', () => {
    alert('Thank you! Your membership application has been submitted successfully.');
    window.location.href = 'index.html';
  });
}
