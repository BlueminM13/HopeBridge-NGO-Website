/*  Navigation Toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

/*  Sticky Header Shadow */
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', function () {
  if (siteHeader) {
    siteHeader.classList.toggle('scrolled', window.scrollY > 10);
  }
}, { passive: true });

/**
 * Formats a number as a USD currency string.
 * @param {number} val
 * @returns {string}  
 */
function formatCurrency(val) {
  return '$' + Number(val).toLocaleString();
}

/**
 * Returns a category colour code based on the category name.
 * Used to lightly colour-code the category badge.
 * @param {string} cat
 * @returns {string}  
 */
function getCategoryStyle(cat) {
  var map = {
    'Education':              'background:rgba(26,128,128,0.12);color:#146464',
    'Community Development':  'background:rgba(242,130,74,0.15);color:#A05010',
    'Environment':            'background:rgba(34,139,34,0.12);color:#1A6020',
    'Disaster Relief':        'background:rgba(220,50,47,0.12);color:#9A1010',
    'Animal Welfare':         'background:rgba(180,80,180,0.12);color:#7A207A',
    'Youth Development':      'background:rgba(212,160,74,0.15);color:#8A5C00',
    'Health':                 'background:rgba(66,133,244,0.12);color:#1A4AA0',
    'Arts & Culture':         'background:rgba(200,90,58,0.12);color:#7A2A10',
  };
  return map[cat] || 'background:var(--clr-teal-light);color:var(--clr-teal-dark)';
}

/*  Return Campaign Card */
/**
 * Creates and returns a campaign card DOM element
 * @param {Element} campaign  
 * @param {number}  index     
 * @returns {HTMLElement}
 */
function renderCard(campaign, index) {
  var title    = campaign.querySelector('title').textContent;
  var category = campaign.querySelector('category').textContent;
  var desc     = campaign.querySelector('description').textContent;
  var goal     = parseFloat(campaign.querySelector('goal').textContent);
  var raised   = parseFloat(campaign.querySelector('raised').textContent);
  var image    = campaign.querySelector('image').textContent;
  var imageAlt = campaign.querySelector('imageAlt').textContent;
  var percent  = Math.round((raised / goal) * 100);

  var article = document.createElement('article');
  article.className = 'campaign-card animate-in';
  article.setAttribute('role', 'listitem');
  article.setAttribute('data-category', category);
  article.setAttribute('aria-label', title);
  // Stagger entrance animation
  article.style.animationDelay = (index * 0.07) + 's';

  article.innerHTML =
    '<div class="campaign-card-img-wrap">' +
      '<img class="campaign-card-img" src="' + image + '" alt="' + imageAlt + '" loading="lazy" />' +
    '</div>' +
    '<div class="campaign-card-body">' +
      '<span class="campaign-card-category" style="' + getCategoryStyle(category) + '">' + category + '</span>' +
      '<h2 class="campaign-card-title">' + title + '</h2>' +
      '<p class="campaign-card-desc">' + desc + '</p>' +
      '<div class="campaign-card-progress">' +
        '<div class="progress-stat-row">' +
          '<span class="progress-label">Progress</span>' +
          '<span class="progress-pct">' + percent + '%</span>' +
        '</div>' +
        '<div class="progress-track" role="progressbar" ' +
             'aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" ' +
             'aria-label="' + percent + '% of goal reached">' +
          '<div class="progress-fill" style="width:0%" data-width="' + percent + '%"></div>' +
        '</div>' +
        '<div class="progress-amounts">' +
          '<span class="progress-raised">' + formatCurrency(raised) + ' raised</span>' +
          '<span class="progress-goal">' + formatCurrency(goal) + ' goal</span>' +
        '</div>' +
      '</div>' +
      '<a href="donate.html" class="campaign-learn-more" aria-label="Learn more about ' + title + '">' +
        'Learn More ' +
        '<svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 8l4 4-4 4M8 12h8"/></svg>' +
      '</a>' +
    '</div>';

  return article;
}

var allCards = []; // holds every rendered card element

function loadCampaigns() {
  var grid = document.getElementById('campaigns-grid');
  if (!grid) return;

  fetch('xml/campaigns.xml')
    .then(function (response) {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(function (xmlText) {
      var parser  = new DOMParser();
      var xmlDoc  = parser.parseFromString(xmlText, 'application/xml');
      var items   = xmlDoc.querySelectorAll('campaign');

      // Clear loading indicator
      grid.innerHTML = '';
      allCards = [];

      // Return each campaign
      items.forEach(function (campaign, index) {
        var card = renderCard(campaign, index);
        allCards.push(card);
        grid.appendChild(card);
      });

      // Animate progress bars after delay
      setTimeout(function () {
        grid.querySelectorAll('.progress-fill').forEach(function (bar) {
          bar.style.width = bar.dataset.width;
        });
      }, 200);

      // Update results count
      updateCount(allCards.length, 'All');

      // Bind filter buttons now that cards exist
      initFilters();
    })
    .catch(function (err) {
      console.error('Failed to load campaigns:', err);
      grid.innerHTML =
        '<p style="grid-column:1/-1;text-align:center;padding:var(--sp-3xl);color:var(--clr-text-muted)">' +
        '⚠️ Campaigns could not be loaded. Run this project through a local server (e.g. VS Code Live Server).</p>';
    });
}

function initFilters() {
  var filterBtns = document.querySelectorAll('.filter-btn');
  var noResults  = document.getElementById('no-results');
  var resetBtn   = document.getElementById('reset-filter');

  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var category = btn.dataset.category;

      // Update active button state + ARIA
      filterBtns.forEach(function (b) {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');

      // Filter cards
      var visibleCount = 0;

      allCards.forEach(function (card) {
        var cardCat = card.dataset.category;
        var show    = (category === 'All' || cardCat === category);

        if (show) {
          card.classList.remove('hidden');
          card.classList.remove('animate-in');
          void card.offsetWidth;
          card.classList.add('animate-in');

          // Re-animate progress bar for newly visible card
          var bar = card.querySelector('.progress-fill');
          if (bar) {
            bar.style.width = '0%';
            setTimeout(function () {
              bar.style.width = bar.dataset.width;
            }, 100);
          }

          visibleCount++;
        } else {
          card.classList.add('hidden');
        }
      });

      // Show/hide "no results" message
      if (visibleCount === 0) {
        noResults.removeAttribute('hidden');
      } else {
        noResults.setAttribute('hidden', '');
      }

      updateCount(visibleCount, category);
    });
  });

  // Reset button inside no results message
  if (resetBtn) {
    resetBtn.addEventListener('click', function () {
      var allBtn = document.querySelector('.filter-btn[data-category="All"]');
      if (allBtn) allBtn.click();
    });
  }
}

/**
 * Updates the accessible results count paragraph.
 * @param {number} count
 * @param {string} category
 */
function updateCount(count, category) {
  var el = document.getElementById('results-count');
  if (!el) return;
  var label = category === 'All' ? 'all categories' : '"' + category + '"';
  el.textContent = 'Showing ' + count + ' campaign' + (count !== 1 ? 's' : '') + ' in ' + label + '.';
}

document.addEventListener('DOMContentLoaded', function () {
  loadCampaigns();
});