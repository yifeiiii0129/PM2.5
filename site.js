(() => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('#siteNav');
  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && toggle?.getAttribute('aria-expanded') === 'true') {
      toggle.setAttribute('aria-expanded', 'false');
      nav.classList.remove('is-open');
      toggle.focus();
    }
  });
  // Keep the last selected location when returning from a static page.
  try {
    const saved = sessionStorage.getItem('pm25-health-explore-url');
    if (saved && /^\.\/index\.html(?:\?|$)/.test(saved)) {
      document.querySelectorAll('a[href="./index.html"]').forEach((link) => { link.href = saved; });
    }
  } catch { /* A normal link remains usable when storage is unavailable. */ }
})();
