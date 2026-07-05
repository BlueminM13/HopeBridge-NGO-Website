/* Navigation Toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Sticky Header Shadow */
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  if (siteHeader) siteHeader.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

/* Validation Helpers */

/**
 * Shows an error message and marks the input field as invalid.
 * @param {string} errorId   — ID of the <span role="alert"> element
 * @param {string|null} inputId — ID of the <input> element (or null)
 * @param {string} message   — Error message to display
 */
function showError(errorId, inputId, message) {
  var errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('visible');
  }
  if (inputId) {
    var inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.classList.add('input-error');
      inputEl.setAttribute('aria-invalid', 'true');
    }
  }
}

/**
 * Clears an error message and restores the input to a valid state.
 * @param {string} errorId
 * @param {string|null} inputId
 */
function clearError(errorId, inputId) {
  var errorEl = document.getElementById(errorId);
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('visible');
  }
  if (inputId) {
    var inputEl = document.getElementById(inputId);
    if (inputEl) {
      inputEl.classList.remove('input-error');
      inputEl.setAttribute('aria-invalid', 'false');
    }
  }
}

/* Full Form Validation */
/**
 * Validates all mandatory fields in the volunteer form.
 * Returns true only when every mandatory field is valid.
 * @returns {boolean}
 */
function validateVolunteerForm() {
  var formValid = true;

  /* Validation Full Name */
  var nameVal = document.getElementById('vol-name').value.trim();
  clearError('vol-name-error', 'vol-name');

  if (nameVal === '') {
    showError('vol-name-error', 'vol-name', 'Full name is required. Please enter your name.');
    formValid = false;
  } else if (nameVal.length < 2) {
    showError('vol-name-error', 'vol-name', 'Name must be at least 2 characters long.');
    formValid = false;
  } else if (/\d/.test(nameVal)) {
    showError('vol-name-error', 'vol-name', 'Name should not contain numbers.');
    formValid = false;
  }

  /* Validation Email Address */
  var emailVal = document.getElementById('vol-email').value.trim();
  clearError('vol-email-error', 'vol-email');

  if (emailVal === '') {
    showError('vol-email-error', 'vol-email', 'Email address is required.');
    formValid = false;
  } else {
    // Regular expression checks for basic email format: x@x.x
    var emailPattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(emailVal)) {
      showError('vol-email-error', 'vol-email', 'Please enter a valid email address (e.g. name@example.com).');
      formValid = false;
    }
  }

  /* Validation Phone Number */
  var phoneVal = document.getElementById('vol-phone').value.trim();
  clearError('vol-phone-error', 'vol-phone');

  if (phoneVal === '') {
    showError('vol-phone-error', 'vol-phone', 'Phone number is required.');
    formValid = false;
  } else {
    // Remove spaces only (allow user to type 077 765 8956 style)
    var digitsOnly = phoneVal.replace(/\s/g, '');
    // Must be exactly 10 digits starting with 07
    if (!/^\d+$/.test(digitsOnly)) {
      showError('vol-phone-error', 'vol-phone', 'Please enter a valid phone number of 10 digits. Starting from 07.');
      formValid = false;
    } else if (digitsOnly.length !== 10 || !digitsOnly.startsWith('07')) {
      showError('vol-phone-error', 'vol-phone', 'Please enter a valid phone number of 10 digits. Starting from 07.');
      formValid = false;
    }
  }

  return formValid;
}

/* Field Validation on blur */

var volNameInput  = document.getElementById('vol-name');
var volEmailInput = document.getElementById('vol-email');
var volPhoneInput = document.getElementById('vol-phone');

if (volNameInput) {
  volNameInput.addEventListener('blur', function () {
    var val = volNameInput.value.trim();
    clearError('vol-name-error', 'vol-name');
    if (val === '') {
      showError('vol-name-error', 'vol-name', 'Full name is required.');
    } else if (val.length < 2) {
      showError('vol-name-error', 'vol-name', 'Name must be at least 2 characters.');
    }
  });
  volNameInput.addEventListener('input', function () {
    if (volNameInput.value.trim().length >= 2 && !/\d/.test(volNameInput.value)) {
      clearError('vol-name-error', 'vol-name');
    }
  });
}

if (volEmailInput) {
  volEmailInput.addEventListener('blur', function () {
    var val = volEmailInput.value.trim();
    var pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    clearError('vol-email-error', 'vol-email');
    if (val === '') {
      showError('vol-email-error', 'vol-email', 'Email address is required.');
    } else if (!pattern.test(val)) {
      showError('vol-email-error', 'vol-email', 'Please enter a valid email address.');
    }
  });
  volEmailInput.addEventListener('input', function () {
    var pattern = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
    if (pattern.test(volEmailInput.value.trim())) clearError('vol-email-error', 'vol-email');
  });
}

if (volPhoneInput) {
  volPhoneInput.addEventListener('blur', function () {
    var val = volPhoneInput.value.trim();
    var digits = val.replace(/\s/g, '');
    clearError('vol-phone-error', 'vol-phone');
    if (val === '') {
      showError('vol-phone-error', 'vol-phone', 'Phone number is required.');
    } else if (!/^\d+$/.test(digits) || digits.length !== 10 || !digits.startsWith('07')) {
      showError('vol-phone-error', 'vol-phone', 'Please enter a valid phone number of 10 digits. Starting from 07.');
    }
  });
  volPhoneInput.addEventListener('input', function () {
    var digits = volPhoneInput.value.replace(/\s/g, '');
    if (/^\d+$/.test(digits) && digits.length === 10 && digits.startsWith('07')) {
      clearError('vol-phone-error', 'vol-phone');
    }
  });
}

/* Submission Handler */
var volForm = document.getElementById('volunteer-form');

if (volForm) {
  volForm.addEventListener('submit', function (e) {
    // Prevent any default browser submission behaviour
    e.preventDefault();

    var isValid = validateVolunteerForm();

    if (isValid) {
      // All mandatory fields passed
      showSuccessModal();
    } else {
      // Scroll to first error message 
      var firstError = document.querySelector('.field-error.visible');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  });
}

/* Success Modal Logic */
var successOverlay  = document.getElementById('success-overlay');
var closeSuccessBtn = document.getElementById('close-success');

function showSuccessModal() {
  if (successOverlay) {
    successOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden'; // Prevent background scroll
    if (closeSuccessBtn) closeSuccessBtn.focus();
  }
}

function closeSuccessModal() {
  if (successOverlay) {
    successOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }
  // Reset form
  if (volForm) volForm.reset();

  // Clear all error states
  document.querySelectorAll('.input-error').forEach(function (el) {
    el.classList.remove('input-error');
    el.removeAttribute('aria-invalid');
  });
  document.querySelectorAll('.field-error.visible').forEach(function (el) {
    el.classList.remove('visible');
    el.textContent = '';
  });
}

if (closeSuccessBtn) {
  closeSuccessBtn.addEventListener('click', closeSuccessModal);
}

// Close on backdrop click
if (successOverlay) {
  successOverlay.addEventListener('click', function (e) {
    if (e.target === successOverlay) closeSuccessModal();
  });
}

// Close on Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && successOverlay && successOverlay.classList.contains('visible')) {
    closeSuccessModal();
  }
});