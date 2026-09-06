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

  function clinicById(id) {
    if (!SITE_CONFIG.clinics) return null;
    return SITE_CONFIG.clinics.find(function (clinic) {
      return clinic.id === id;
    }) || null;
  }

  var wa = ensureWhatsApp();
  if (typeof SITE_CONFIG === 'undefined') return;
  const c = SITE_CONFIG;

  document.querySelectorAll('[data-phone-href]').forEach(function (el) {
    var clinicId = el.getAttribute('data-clinic-id');
    var clinic = clinicId ? clinicById(clinicId) : null;
    el.setAttribute('href', 'tel:' + (clinic ? clinic.phone : c.contact.phone));
  });
  document.querySelectorAll('[data-phone-text]').forEach(function (el) {
    var clinicId = el.getAttribute('data-clinic-id');
    var clinic = clinicId ? clinicById(clinicId) : null;
    el.textContent = clinic ? clinic.phoneDisplay : c.contact.phoneDisplay;
  });
  document.querySelectorAll('[data-email-href]').forEach(function (el) {
    el.setAttribute('href', 'mailto:' + c.contact.email);
  });
  document.querySelectorAll('[data-email-text]').forEach(function (el) {
    el.textContent = c.contact.email;
  });

  function whatsappHref(number, msg) {
    return 'https://wa.me/' + number + '?text=' + encodeURIComponent(msg);
  }

  var defaultMsg = 'Hello, I would like to book an appointment with Dr. Chethan Kumar.';
  document.querySelectorAll('[data-whatsapp-href]').forEach(function (el) {
    var clinicId = el.getAttribute('data-clinic-id');
    var clinic = clinicId ? clinicById(clinicId) : null;
    var number = clinic ? clinic.whatsapp : c.contact.whatsapp;
    var msg = el.getAttribute('data-whatsapp-msg') || defaultMsg;
    el.setAttribute('href', whatsappHref(number, msg));
  });
  if (wa && (!wa.getAttribute('href') || wa.getAttribute('href') === '#')) {
    wa.setAttribute('href', whatsappHref(c.contact.whatsapp, defaultMsg));
  }

  document.querySelectorAll('[data-doctor-photo]').forEach(function (el) {
    if (c.doctor.photo) el.setAttribute('src', c.doctor.photo);
    if (c.doctor.photoAlt) el.setAttribute('alt', c.doctor.photoAlt);
  });

  var socialMap = {
    facebook: c.social.facebook,
    instagram: c.social.instagram,
    linkedin: c.social.linkedin,
    youtube: c.social.youtube
  };
  var socialByLabel = {
    Facebook: c.social.facebook,
    Instagram: c.social.instagram,
    LinkedIn: c.social.linkedin,
    YouTube: c.social.youtube
  };
  document.querySelectorAll('.footer__social a[aria-label]').forEach(function (el) {
    var label = el.getAttribute('aria-label');
    var url = socialByLabel[label];
    if (url) {
      el.setAttribute('href', url);
    } else if (label === 'YouTube') {
      el.style.display = 'none';
    }
  });
  document.querySelectorAll('[data-social]').forEach(function (el) {
    var key = el.getAttribute('data-social');
    if (socialMap[key]) {
      el.setAttribute('href', socialMap[key]);
    }
  });

  if (c.clinics && c.clinics.length) {
    c.clinics.forEach(function (clinic) {
      document.querySelectorAll('[data-clinic-address="' + clinic.id + '"]').forEach(function (el) {
        el.innerHTML = clinic.address + '<br>' + clinic.timings + (clinic.areaNote ? '<br>' + clinic.areaNote : '');
      });
      document.querySelectorAll('[data-clinic-map="' + clinic.id + '"]').forEach(function (el) {
        if (clinic.mapEmbed) el.setAttribute('src', clinic.mapEmbed);
      });
      document.querySelectorAll('[data-clinic-map-link="' + clinic.id + '"]').forEach(function (el) {
        if (clinic.mapUrl) {
          el.setAttribute('href', clinic.mapUrl);
          el.setAttribute('target', '_blank');
          el.setAttribute('rel', 'noopener');
        }
      });
      document.querySelectorAll('[data-clinic-phone="' + clinic.id + '"]').forEach(function (el) {
        el.setAttribute('href', 'tel:' + clinic.phone);
        el.textContent = clinic.phoneDisplay;
      });
      document.querySelectorAll('[data-clinic-whatsapp="' + clinic.id + '"]').forEach(function (el) {
        el.setAttribute('href', whatsappHref(clinic.whatsapp, defaultMsg));
      });
    });
  }
})();
