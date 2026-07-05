/* Navigation Toggle */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    // Update ARIA attribute for accessibility
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  // Close nav when a link is clicked
  navLinks.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

/* Sticky Header */
const siteHeader = document.getElementById('site-header');

window.addEventListener('scroll', function () {
  if (window.scrollY > 10) {
    siteHeader.classList.add('scrolled');
  } else {
    siteHeader.classList.remove('scrolled');
  }
}, { passive: true });

//Back-to-Top Button 
const backToTopBtn = document.getElementById('back-to-top');

//Show the button only when the user has scrolled more than 300px down
 window.addEventListener('scroll', function () {
  if (window.scrollY > 300) {            
    backToTopBtn.classList.add('visible');
  } else {
    backToTopBtn.classList.remove('visible');
  }
}, { passive: true });

//On click smoothly scroll back to top
  backToTopBtn.addEventListener('click', function () {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// trigger on Enter/Space key
backToTopBtn.addEventListener('keydown', function (e) {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

/* Animated Stats Counter */

function animateCounter(el) {
  const target  = parseInt(el.dataset.target, 10);
  const suffix  = el.dataset.suffix || '';   
  const duration = 2000;                     // ms
  const start    = performance.now();

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased    = 1 - Math.pow(1 - progress, 3);
    const current  = Math.floor(eased * target);

    // Format large numbers with commas
    el.textContent = current.toLocaleString() + suffix;

    if (progress < 1) {
      requestAnimationFrame(step);
    } else {
      el.textContent = target.toLocaleString() + suffix;
    }
  }

  requestAnimationFrame(step);
}

const statsSection = document.querySelector('.stats-section');
if (statsSection) {
  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          // Animate every element that has data-target attribute
          statsSection.querySelectorAll('[data-target]').forEach(animateCounter);
          observer.disconnect(); // Only animate once
        }
      });
    },
    { threshold: 0.4 }
  );
  observer.observe(statsSection);
}

/* Load & Render Featured Campaigns from XML */
//Fetches campaigns.xml and injects the first 3 campaigns as cards 
 
function loadFeaturedCampaigns() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;

  fetch('xml/campaigns.xml')
    .then(function (response) {
      if (!response.ok) throw new Error('Could not load campaigns.xml');
      return response.text();
    })
    .then(function (xmlText) {
      // Parse the XML string
      const parser  = new DOMParser();
      const xmlDoc  = parser.parseFromString(xmlText, 'application/xml');
      const items   = xmlDoc.querySelectorAll('campaign');

      // Clear loading placeholder
      grid.innerHTML = '';

      // Render only the first 3 campaigns
      const featured = Array.from(items).slice(0, 3);

      featured.forEach(function (campaign) {
        const title    = campaign.querySelector('title').textContent;
        const category = campaign.querySelector('category').textContent;
        const desc     = campaign.querySelector('description').textContent;
        const goal     = parseFloat(campaign.querySelector('goal').textContent);
        const raised   = parseFloat(campaign.querySelector('raised').textContent);
        const image    = campaign.querySelector('image').textContent;
        const imageAlt = campaign.querySelector('imageAlt').textContent;
        const percent  = Math.round((raised / goal) * 100);

        // Format currency
        const fmtCurrency = function (val) {
          return '$' + val.toLocaleString();
        };

        // Build card HTML
        const card = document.createElement('article');
        card.className = 'campaign-card';
        card.setAttribute('role', 'listitem');
        card.setAttribute('aria-label', title + ' campaign');

        card.innerHTML =
          '<img class="campaign-card-img" src="' + image + '" alt="' + imageAlt + '" loading="lazy" />' +
          '<div class="campaign-card-body">' +
            '<span class="campaign-card-category">' + category + '</span>' +
            '<h3 class="campaign-card-title">' + title + '</h3>' +
            '<p class="campaign-card-desc">' + desc.substring(0, 110) + '…</p>' +
            '<div class="campaign-card-progress">' +
              '<div class="progress-bar-labels">' +
                '<span class="raised">' + fmtCurrency(raised) + ' raised</span>' +
                '<span class="goal">' + fmtCurrency(goal) + ' goal</span>' +
              '</div>' +
              '<div class="progress-track" role="progressbar" aria-valuenow="' + percent + '" aria-valuemin="0" aria-valuemax="100" aria-label="' + percent + '% funded">' +
                '<div class="progress-fill" style="width:0%" data-width="' + percent + '%"></div>' +
              '</div>' +
              '<p class="mt-sm" style="font-size:var(--fs-xs);color:var(--clr-text-muted);text-align:right">' + percent + '% funded</p>' +
            '</div>' +
            '<a href="campaigns.html" class="btn btn-teal btn-sm" aria-label="Learn more about ' + title + '">Learn More</a>' +
          '</div>';

        grid.appendChild(card);
      });

      // Animate progress bars after cards are in the DOM
      setTimeout(function () {
        grid.querySelectorAll('.progress-fill').forEach(function (bar) {
          bar.style.width = bar.dataset.width;
        });
      }, 150);
    })
    .catch(function (err) {
      // if XML cannot be loaded
      console.error('Campaign load error:', err);
      if (grid) {
        grid.innerHTML =
          '<p style="grid-column:1/-1;text-align:center;color:var(--clr-text-muted);padding:var(--sp-2xl)">' +
          '⚠️ Could not load campaigns. Please ensure campaigns.xml is in the same folder and served via a local server.</p>';
      }
    });
}

document.addEventListener('DOMContentLoaded', function () {
  loadFeaturedCampaigns();
});