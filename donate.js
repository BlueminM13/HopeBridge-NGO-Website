/* Navigation Toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/* Sticky Header */
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* Quick Amount Presets */
const presetBtns    = document.querySelectorAll('.preset-btn');
const amountInput   = document.getElementById('donation-amount');

presetBtns.forEach(function (btn) {
  btn.addEventListener('click', function () {
    if (amountInput) {
      amountInput.value = btn.dataset.amount;
    }
    // Toggle selected styling
    presetBtns.forEach(function (b) { b.classList.remove('selected'); });
    btn.classList.add('selected');
    // Clear any existing amount error
    clearError('amount-error', 'donation-amount');
  });
});

// clear preset selection if user types manually
if (amountInput) {
  amountInput.addEventListener('input', function () {
    presetBtns.forEach(function (b) { b.classList.remove('selected'); });
  });
}

/* Password Show/Hide Toggle */
const togglePasswordBtn = document.getElementById('toggle-password');
const passwordInput     = document.getElementById('donor-password');

if (togglePasswordBtn && passwordInput) {
  togglePasswordBtn.addEventListener('click', function () {
    const isHidden = passwordInput.type === 'password';
    passwordInput.type = isHidden ? 'text' : 'password';
    togglePasswordBtn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
  });
}

/**
 * Displays an error message for a field.
 * Adds .input-error class to the input and shows the error span.
 * @param {string} errorId   — ID of the error <span>
 * @param {string} inputId   — ID of the input element (optional)
 * @param {string} message   — Error text to display
 */
function showError(errorId, inputId, message) {
  var errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
  if (inputId) {
    var inputEl = document.getElementById(inputId);
    if (inputEl) inputEl.classList.add('input-error');
  }
}

/**
 * Clears an error message for a field.
 * @param {string} errorId
 * @param {string} inputId 
 */
function clearError(errorId, inputId) {
  var errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
  if (inputId) {
    var inputEl = document.getElementById(inputId);
    if (inputEl) inputEl.classList.remove('input-error');
  }
}

/**
 * Validates the entire donation form.
 * Returns true only if ALL mandatory fields pass.
 * @returns {boolean}
 */
function validateDonateForm() {
  var isValid = true;

  //Full Name validation
  var nameVal = document.getElementById('donor-name').value.trim();
  clearError('name-error', 'donor-name');

  if (nameVal === '') {
    showError('name-error', 'donor-name', 'Full name is required.');
    isValid = false;
  } else if (nameVal.length < 2) {
    showError('name-error', 'donor-name', 'Please enter your full name (at least 2 characters).');
    isValid = false;
  }

  /* Email Address */
  var emailVal = document.getElementById('donor-email').value.trim();
  clearError('email-error', 'donor-email');

  if (emailVal === '') {
    showError('email-error', 'donor-email', 'Email address is required.');
    isValid = false;
  } else {
    // Custom email format validation using Regular Expression
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailVal)) {
      showError('email-error', 'donor-email', 'Please enter a valid email address (e.g. name@example.com).');
      isValid = false;
    }
  }

  /* Donation Amount validate*/
  var amountVal = document.getElementById('donation-amount').value.trim();
  clearError('amount-error', 'donation-amount');

  if (amountVal === '') {
    showError('amount-error', 'donation-amount', 'Please enter a donation amount.');
    isValid = false;
  } else if (isNaN(amountVal) || parseFloat(amountVal) <= 0) {
    showError('amount-error', 'donation-amount', 'Please enter a valid positive donation amount.');
    isValid = false;
  } else if (parseFloat(amountVal) < 1) {
    showError('amount-error', 'donation-amount', 'Minimum donation amount is $1.00.');
    isValid = false;
  }

  /* Donation Type validate */
  var donationTypeInputs = document.querySelectorAll('input[name="donation-type"]');
  var typeSelected = false;
  clearError('dtype-error', null);

  donationTypeInputs.forEach(function (radio) {
    if (radio.checked) typeSelected = true;
  });

  if (!typeSelected) {
    showError('dtype-error', null, 'Please select a donation type (One-time or Monthly).');
    isValid = false;
  }

  /* Terms & Conditions Checkbox */
  var termsChecked = document.getElementById('agree-terms').checked;
  clearError('terms-error', null);

  if (!termsChecked) {
    showError('terms-error', null, 'You must agree to the terms and conditions before donating.');
    isValid = false;
  }

  return isValid;
}

var donateForm = document.getElementById('donate-form');

if (donateForm) {
  donateForm.addEventListener('submit', function (e) {
    // Always prevent default browser submission
    e.preventDefault();

    var valid = validateDonateForm();

    if (valid) {
      // All fields passed - show success modal
      showSuccessModal();
    } else {
      // Focus the first field with an error for accessibility
      var firstError = donateForm.querySelector('.input-error, [aria-invalid="true"]');
      if (!firstError) {
        firstError = donateForm.querySelector('.field-error.visible');
      }
      if (firstError) {
        firstError.focus();
      } else {
        // Scroll to first visible error message
        var firstErrorMsg = donateForm.querySelector('.field-error.visible');
        if (firstErrorMsg) {
          firstErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  });
}

/* Validation field blur */

var nameInput  = document.getElementById('donor-name');
var emailInput = document.getElementById('donor-email');

if (nameInput) {
  nameInput.addEventListener('blur', function () {
    var val = nameInput.value.trim();
    clearError('name-error', 'donor-name');
    if (val === '') {
      showError('name-error', 'donor-name', 'Full name is required.');
    } else if (val.length < 2) {
      showError('name-error', 'donor-name', 'Please enter at least 2 characters.');
    }
  });
  
  nameInput.addEventListener('input', function () {
    if (nameInput.value.trim().length >= 2) clearError('name-error', 'donor-name');
  });
}

if (emailInput) {
  emailInput.addEventListener('blur', function () {
    var val = emailInput.value.trim();
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    clearError('email-error', 'donor-email');
    if (val === '') {
      showError('email-error', 'donor-email', 'Email address is required.');
    } else if (!regex.test(val)) {
      showError('email-error', 'donor-email', 'Please enter a valid email address.');
    }
  });
  emailInput.addEventListener('input', function () {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (regex.test(emailInput.value.trim())) clearError('email-error', 'donor-email');
  });
}

if (amountInput) {
  amountInput.addEventListener('blur', function () {
    var val = amountInput.value.trim();
    clearError('amount-error', 'donation-amount');
    if (val && (isNaN(val) || parseFloat(val) <= 0)) {
      showError('amount-error', 'donation-amount', 'Please enter a valid positive amount.');
    }
  });
}

/* Success Modal */
var successOverlay = document.getElementById('success-overlay');
var closeSuccessBtn = document.getElementById('close-success');

function showSuccessModal() {
  if (successOverlay) {
    successOverlay.classList.add('visible');
    // Focus the close button for keyboard users
    if (closeSuccessBtn) closeSuccessBtn.focus();
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }
}

//Hide success modal 
 function closeSuccessModal() {
  if (successOverlay) {
    successOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  // Reset the form
  if (donateForm) donateForm.reset();
  // Remove all error states
  document.querySelectorAll('.input-error').forEach(function (el) {
    el.classList.remove('input-error');
  });
  document.querySelectorAll('.field-error.visible').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });
  // Clear preset selection
  presetBtns.forEach(function (b) { b.classList.remove('selected'); });
}

if (closeSuccessBtn) {
  closeSuccessBtn.addEventListener('click', closeSuccessModal);
}

// Close modal when clicking outside the box
if (successOverlay) {
  successOverlay.addEventListener('click', function (e) {
    if (e.target === successOverlay) closeSuccessModal();
  });
}

// Close modal with Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && successOverlay && successOverlay.classList.contains('visible')) {
    closeSuccessModal();
  }
});