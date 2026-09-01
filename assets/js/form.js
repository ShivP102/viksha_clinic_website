(function () {
  const form = document.getElementById('appointment-form');
  if (!form || typeof SITE_CONFIG === 'undefined') return;

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get('name') || '').toString().trim();
    const phone = (data.get('phone') || '').toString().trim();
    const email = (data.get('email') || '').toString().trim();
    const location = (data.get('location') || '').toString().trim();
    const service = (data.get('service') || '').toString().trim();
    const date = (data.get('date') || '').toString().trim();
    const message = (data.get('message') || '').toString().trim();

    if (!name || !phone) {
      alert('Please enter your name and phone number.');
      return;
    }

    const lines = [
      'Hello Dr. Chethan Kumar, I would like to book an appointment.',
      '',
      'Name: ' + name,
      'Phone: ' + phone,
      email ? 'Email: ' + email : '',
      location ? 'Preferred clinic: ' + location : '',
      service ? 'Service: ' + service : '',
      date ? 'Preferred date: ' + date : '',
      message ? 'Message: ' + message : ''
    ].filter(Boolean);

    const text = encodeURIComponent(lines.join('\n'));
    const url = 'https://wa.me/' + SITE_CONFIG.contact.whatsapp + '?text=' + text;
    window.open(url, '_blank', 'noopener');
  });
})();
