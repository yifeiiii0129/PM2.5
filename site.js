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
  // Move the same controls so their values, listeners and IDs stay intact.
  const picker = document.querySelector('.picker-panel');
  const mobileSearch = document.querySelector('#mobileLocationSearch');
  if (picker && mobileSearch) {
    const home = document.createComment('Location controls return here on desktop');
    picker.before(home);
    const compact = window.matchMedia('(max-width: 980px)');
    const placeSearch = () => {
      const focused = picker.contains(document.activeElement) ? document.activeElement : null;
      if (compact.matches) {
        mobileSearch.hidden = false;
        mobileSearch.append(picker);
      } else {
        home.after(picker);
        mobileSearch.hidden = true;
      }
      focused?.focus({ preventScroll: true });
    };
    placeSearch();
    compact.addEventListener('change', placeSearch);
  }
  // Keep the last selected location when returning from a static page.
  try {
    const saved = sessionStorage.getItem('pm25-health-explore-url');
    if (saved && /^\.\/index\.html(?:\?|$)/.test(saved)) {
      document.querySelectorAll('a[href="./index.html"]').forEach((link) => { link.href = saved; });
    }
  } catch { /* A normal link remains usable when storage is unavailable. */ }
})();
