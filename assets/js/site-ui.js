(function () {
  function ensureWhatsApp() {
    var el = document.querySelector('.whatsapp-float');
    if (!el) {
      el = document.createElement('a');
      el.className = 'whatsapp-float';
      el.setAttribute('data-whatsapp-href', '');
      el.setAttribute('aria-label', 'Chat on WhatsApp');
      el.href = '#';
      document.body.appendChild(el);
    }
    return el;
  }

  var wa = ensureWhatsApp();
  if (typeof SITE_CONFIG === 'undefined') return;
  const c = SITE_CONFIG;

  document.querySelectorAll('[data-phone-href]').forEach(function (el) {
    el.setAttribute('href', 'tel:' + c.contact.phone);
  });
  document.querySelectorAll('[data-phone-text]').forEach(function (el) {
    el.textContent = c.contact.phoneDisplay;
  });
  document.querySelectorAll('[data-email-href]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + c.contact.email);
  });
  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    el.textContent = c.contact.email;
  });
  document.querySelectorAll('[data-whatsapp-href]').forEach(function (el) {
    const msg = el.getAttribute('data-whatsapp-msg') || 'Hello, I would like to book an appointment with Dr. Chethan Kumar.';
    el.setAttribute('href', 'https://wa.me/' + c.contact.whatsapp + '?text=' + encodeURIComponent(msg));
  });
  if (wa && (!wa.getAttribute('href') || wa.getAttribute('href') === '#')) {
    wa.setAttribute('href', 'https://wa.me/' + c.contact.whatsapp + '?text=' + encodeURIComponent('Hello, I would like to book an appointment with Dr. Chethan Kumar.'));
  }
})();
