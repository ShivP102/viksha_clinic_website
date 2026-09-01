(function () {
  const WA_ICON = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  document.querySelectorAll('.whatsapp-float').forEach(function (el) {
    el.innerHTML = WA_ICON;
    if (!el.getAttribute('aria-label')) {
      el.setAttribute('aria-label', 'Chat on WhatsApp');
    }
  });

  if (!document.querySelector('.skip-link')) {
    const skip = document.createElement('a');
    skip.className = 'skip-link';
    skip.href = '#main';
    skip.textContent = 'Skip to main content';
    document.body.insertBefore(skip, document.body.firstChild);
  }

  const header = document.querySelector('.header');
  let main = document.getElementById('main');
  if (!main) {
    const candidate = document.querySelector('.hero, .page-hero, .section');
    if (candidate) {
      candidate.id = candidate.id || 'main';
      candidate.setAttribute('tabindex', '-1');
      main = candidate;
    }
  }

  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.nav');
  const dropdowns = document.querySelectorAll('.nav__dropdown');

  if (nav) nav.id = nav.id || 'site-nav';
  if (toggle && nav) {
    toggle.setAttribute('aria-controls', nav.id);
    toggle.addEventListener('click', function () {
      const open = nav.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }

  dropdowns.forEach(function (drop) {
    const trigger = drop.querySelector('.nav__link');
    if (!trigger) return;
    trigger.setAttribute('aria-haspopup', 'true');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', function (e) {
      if (window.innerWidth <= 900) {
        e.preventDefault();
        const open = drop.classList.toggle('is-open');
        trigger.setAttribute('aria-expanded', open ? 'true' : 'false');
      }
    });
  });

  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    if (nav && nav.classList.contains('is-open')) {
      nav.classList.remove('is-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
        toggle.setAttribute('aria-label', 'Open menu');
        toggle.focus();
      }
      document.body.style.overflow = '';
    }
    document.querySelectorAll('.faq-item.is-open').forEach(function (item) {
      item.classList.remove('is-open');
      const btn = item.querySelector('.faq-item__question');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });
  });

  document.querySelectorAll('.faq-item').forEach(function (item, index) {
    const btn = item.querySelector('.faq-item__question');
    let answer = item.querySelector('.faq-item__answer');
    if (!btn || !answer) return;

    if (!answer.classList.contains('faq-item__panel') && !answer.parentElement.classList.contains('faq-item__panel')) {
      const panel = document.createElement('div');
      panel.className = 'faq-item__panel';
      const inner = document.createElement('div');
      inner.className = 'faq-item__answer-inner';
      inner.innerHTML = answer.innerHTML;
      answer.innerHTML = '';
      answer.appendChild(inner);
      answer.classList.add('faq-item__answer');
      item.insertBefore(panel, answer);
      panel.appendChild(answer);
    }

    const panelId = 'faq-panel-' + index;
    const panel = item.querySelector('.faq-item__panel');
    if (panel && !panel.id) panel.id = panelId;
    btn.setAttribute('aria-controls', panel ? panel.id : panelId);
    if (!btn.getAttribute('aria-expanded')) btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', function () {
      const wasOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq-item.is-open').forEach(function (openItem) {
        openItem.classList.remove('is-open');
        const openBtn = openItem.querySelector('.faq-item__question');
        if (openBtn) openBtn.setAttribute('aria-expanded', 'false');
      });
      if (!wasOpen) {
        item.classList.add('is-open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  document.querySelectorAll('.fade-up').forEach(function (el) {
    observer.observe(el);
  });

  const yearEl = document.getElementById('copyright-year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const supportsViewTransition = typeof document.startViewTransition === 'function';

  document.addEventListener('click', function (e) {
    if (reduceMotion || supportsViewTransition) return;
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a[href]');
    if (!a || a.hasAttribute('download') || a.getAttribute('target') === '_blank') return;
    const raw = a.getAttribute('href');
    if (!raw || raw.startsWith('#') || raw.startsWith('mailto:') || raw.startsWith('tel:') || raw.indexOf('wa.me') !== -1) return;
    let url;
    try {
      url = new URL(a.href, window.location.href);
    } catch (err) {
      return;
    }
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search) return;
    e.preventDefault();
    document.documentElement.classList.add('is-leaving');
    window.setTimeout(function () {
      window.location.href = url.href;
    }, 280);
  });
})();
