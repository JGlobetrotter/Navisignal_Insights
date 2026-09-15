// Navbar scroll behaviour
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// Mobile nav toggle
const navToggle  = document.getElementById('navToggle');
const navOverlay = document.getElementById('navOverlay');
if (navToggle && navOverlay) {
  navToggle.addEventListener('click', () => {
    const open = navOverlay.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('.nav-overlay a').forEach(link => {
    link.addEventListener('click', () => {
      navOverlay.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

// Desktop dropdown (click-based for accessibility)
document.querySelectorAll('.nav-item').forEach(item => {
  const toggle = item.querySelector('.dropdown-toggle');
  if (!toggle) return;
  toggle.addEventListener('click', e => {
    e.preventDefault();
    const isOpen = item.classList.toggle('dropdown-open');
    toggle.setAttribute('aria-expanded', isOpen);
  });
  // Close when clicking outside
  document.addEventListener('click', e => {
    if (!item.contains(e.target)) {
      item.classList.remove('dropdown-open');
      toggle.setAttribute('aria-expanded', 'false');
    }
  });
});

// Lead magnet / newsletter form
function setupEmailForm(formId, successId) {
  const form    = document.getElementById(formId);
  const success = document.getElementById(successId);
  if (!form) return;
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn  = form.querySelector('button[type="submit"], input[type="submit"]');
    const orig = btn ? btn.textContent || btn.value : '';
    if (btn) { btn.disabled = true; if (btn.tagName === 'BUTTON') btn.textContent = 'Sending…'; else btn.value = 'Sending…'; }
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      });
      if (res.ok) {
        form.style.display = 'none';
        if (success) success.style.display = 'block';
      } else {
        throw new Error('non-ok');
      }
    } catch {
      alert('Something went wrong — please try again or email us directly.');
      if (btn) { btn.disabled = false; if (btn.tagName === 'BUTTON') btn.textContent = orig; else btn.value = orig; }
    }
  });
}

setupEmailForm('leadMagnetForm',  'leadMagnetSuccess');
setupEmailForm('freeStuffForm',   'freeStuffSuccess');
setupEmailForm('contactForm',     'contactSuccess');
setupEmailForm('aiFreebieForm',   'aiFreebieSuccess');

// Pillar collapse/expand (services page)
(function() {
  var sections = document.querySelectorAll('.pillar-section');
  if (!sections.length) return;

  function expandPillar(section) {
    section.classList.add('expanded');
    var h = section.querySelector('.pillar-header');
    if (h) h.setAttribute('aria-expanded', 'true');
  }
  function collapsePillar(section) {
    section.classList.remove('expanded');
    var h = section.querySelector('.pillar-header');
    if (h) h.setAttribute('aria-expanded', 'false');
  }
  function collapseAll() { sections.forEach(collapsePillar); }

  sections.forEach(function(section) {
    var header = section.querySelector('.pillar-header');
    if (!header) return;
    header.addEventListener('click', function() {
      section.classList.contains('expanded') ? collapsePillar(section) : expandPillar(section);
    });
    header.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); header.click(); }
    });
  });

  window._expandPillar   = expandPillar;
  window._collapsePillar = collapsePillar;
  window._collapseAllPillars = collapseAll;
})();

// Buyer filter (services page)
(function() {
  var buyerCards  = document.querySelectorAll('.buyer-card');
  var pillarCards = document.querySelectorAll('.pillar-card');
  var resetBtn    = document.getElementById('buyer-reset');
  var stayCta     = document.getElementById('buyer-stay-cta');
  var scrollHint  = document.getElementById('buyer-scroll-hint');
  if (!buyerCards.length) return;

  function clearFilter() {
    buyerCards.forEach(function(c) { c.classList.remove('active','dimmed'); c.setAttribute('aria-pressed','false'); });
    pillarCards.forEach(function(c) { c.classList.remove('highlighted','dimmed'); });
    if (stayCta) stayCta.classList.remove('visible');
    if (resetBtn) resetBtn.classList.remove('visible');
    if (scrollHint) scrollHint.classList.remove('visible');
    if (window._collapseAllPillars) window._collapseAllPillars();
  }

  buyerCards.forEach(function(card) {
    card.addEventListener('click', function() {
      var filter   = card.dataset.filter;
      var isActive = card.classList.contains('active');
      clearFilter();
      if (isActive) return;

      card.classList.add('active');
      card.setAttribute('aria-pressed','true');
      buyerCards.forEach(function(c) { if (c !== card) c.classList.add('dimmed'); });
      if (resetBtn) resetBtn.classList.add('visible');

      if (window.gtag) gtag('event', 'buyer_type_selected', { buyer_type: filter });

      if (filter === 'explore') {
        pillarCards.forEach(function(c) { c.classList.add('dimmed'); });
        if (stayCta) stayCta.classList.add('visible');
      } else {
        if (stayCta) stayCta.classList.remove('visible');
        if (scrollHint) scrollHint.classList.add('visible');
        pillarCards.forEach(function(pc) {
          var audiences = (pc.dataset.audience || '').split(' ');
          pc.classList.add(audiences.indexOf(filter) !== -1 ? 'highlighted' : 'dimmed');
        });
        document.querySelectorAll('.pillar-section').forEach(function(s) {
          if (s.querySelector('.pillar-card.highlighted') && window._expandPillar) window._expandPillar(s);
        });
      }
    });

    card.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); card.click(); }
    });
  });

  if (resetBtn) resetBtn.addEventListener('click', clearFilter);
})();

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
