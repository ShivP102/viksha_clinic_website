(function () {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  const CHEVRON = '<svg class="select__chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M4 6l4 4 4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const CAL_ICON = '<svg class="date-field__icon" viewBox="0 0 16 16" fill="none" aria-hidden="true"><rect x="2" y="3.5" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5"/><path d="M2 7h12M5.5 2v3M10.5 2v3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/></svg>';

  function isKn() {
    return document.documentElement.lang === 'kn';
  }

  function closeAll(except) {
    form.querySelectorAll('.select.is-open, .date-field.is-open').forEach(function (el) {
      if (el === except) return;
      el.classList.remove('is-open');
      const menu = el.querySelector('.select__menu, .calendar');
      const trigger = el.querySelector('.select__trigger, .date-field__trigger');
      if (menu) menu.hidden = true;
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function enhanceSelect(select) {
    if (select.closest('.select')) return;

    const wrap = document.createElement('div');
    wrap.className = 'select';
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    select.classList.add('select__native');
    select.tabIndex = -1;
    select.setAttribute('aria-hidden', 'true');

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'select__trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.id = select.id ? select.id + '-trigger' : '';
    trigger.innerHTML = '<span class="select__trigger-label"></span>' + CHEVRON;

    const menu = document.createElement('div');
    menu.className = 'select__menu';
    menu.setAttribute('role', 'listbox');
    menu.hidden = true;
    if (select.id) menu.setAttribute('aria-labelledby', trigger.id);

    wrap.appendChild(trigger);
    wrap.appendChild(menu);

    const label = trigger.querySelector('.select__trigger-label');

    function selectedOption() {
      return select.options[select.selectedIndex] || select.options[0];
    }

    function syncFromNative() {
      menu.innerHTML = '';
      Array.prototype.forEach.call(select.options, function (opt, index) {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'select__option';
        btn.setAttribute('role', 'option');
        btn.dataset.index = String(index);
        btn.textContent = opt.textContent.trim();
        if (opt.selected) btn.classList.add('is-selected');
        btn.setAttribute('aria-selected', opt.selected ? 'true' : 'false');
        btn.addEventListener('click', function () {
          select.selectedIndex = index;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          syncFromNative();
          closeAll();
        });
        menu.appendChild(btn);
      });
      const current = selectedOption();
      label.textContent = current ? current.textContent.trim() : '';
    }

    trigger.addEventListener('click', function () {
      const open = wrap.classList.contains('is-open');
      closeAll();
      if (open) return;
      syncFromNative();
      wrap.classList.add('is-open');
      menu.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    });

    syncFromNative();
    select.addEventListener('change', syncFromNative);
  }

  function pad(n) {
    return n < 10 ? '0' + n : String(n);
  }

  function toISO(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  function startOfDay(d) {
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  function formatDisplay(iso) {
    if (!iso) return '';
    const d = new Date(iso + 'T12:00:00');
    return d.toLocaleDateString(isKn() ? 'kn-IN' : 'en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }

  function weekdayLabels() {
    return isKn()
      ? ['ಮಂ', 'ಬು', 'ಗು', 'ಶು', 'ಶನಿ', 'ಭಾ', 'ರವಿ']
      : ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
  }

  function enhanceDate(input) {
    if (input.closest('.date-field')) return;

    const wrap = document.createElement('div');
    wrap.className = 'date-field';
    input.parentNode.insertBefore(wrap, input);
    wrap.appendChild(input);
    input.classList.add('date-field__native');
    input.tabIndex = -1;
    input.setAttribute('aria-hidden', 'true');

    const today = startOfDay(new Date());
    if (!input.min) input.min = toISO(today);

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'date-field__trigger';
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.innerHTML = '<span class="date-field__label is-placeholder"></span>' + CAL_ICON;

    const cal = document.createElement('div');
    cal.className = 'calendar';
    cal.setAttribute('role', 'dialog');
    cal.setAttribute('aria-label', 'Choose a date');
    cal.hidden = true;

    wrap.appendChild(trigger);
    wrap.appendChild(cal);

    const label = trigger.querySelector('.date-field__label');
    let view = startOfDay(input.value ? new Date(input.value + 'T12:00:00') : today);

    function placeholder() {
      return isKn() ? 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ' : 'Select a date';
    }

    function syncLabel() {
      if (input.value) {
        label.textContent = formatDisplay(input.value);
        label.classList.remove('is-placeholder');
      } else {
        label.textContent = placeholder();
        label.classList.add('is-placeholder');
      }
    }

    function render() {
      const selected = input.value;
      const year = view.getFullYear();
      const month = view.getMonth();
      const title = view.toLocaleDateString(isKn() ? 'kn-IN' : 'en-IN', { month: 'long', year: 'numeric' });
      const first = new Date(year, month, 1);
      const startOffset = (first.getDay() + 6) % 7;
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      const weekdays = weekdayLabels().map(function (d) {
        return '<span>' + d + '</span>';
      }).join('');

      let days = '';
      for (var i = 0; i < startOffset; i++) {
        days += '<button type="button" class="calendar__day is-outside" disabled></button>';
      }
      for (var day = 1; day <= daysInMonth; day++) {
        const iso = year + '-' + pad(month + 1) + '-' + pad(day);
        const dateObj = new Date(year, month, day);
        const disabled = dateObj < today;
        const classes = ['calendar__day'];
        if (iso === toISO(today)) classes.push('is-today');
        if (iso === selected) classes.push('is-selected');
        days += '<button type="button" class="' + classes.join(' ') + '" data-iso="' + iso + '"' + (disabled ? ' disabled' : '') + '>' + day + '</button>';
      }

      cal.innerHTML =
        '<div class="calendar__header">' +
          '<button type="button" class="calendar__nav" data-cal="prev" aria-label="Previous month">‹</button>' +
          '<div class="calendar__title">' + title + '</div>' +
          '<button type="button" class="calendar__nav" data-cal="next" aria-label="Next month">›</button>' +
        '</div>' +
        '<div class="calendar__weekdays">' + weekdays + '</div>' +
        '<div class="calendar__grid">' + days + '</div>' +
        '<div class="calendar__footer">' +
          '<button type="button" data-cal="today">' + (isKn() ? 'ಇಂದು' : 'Today') + '</button>' +
          '<button type="button" data-cal="clear">' + (isKn() ? 'ತೆರವುಗೊಳಿಸಿ' : 'Clear') + '</button>' +
        '</div>';
    }

    function open() {
      closeAll();
      view = startOfDay(input.value ? new Date(input.value + 'T12:00:00') : today);
      render();
      wrap.classList.add('is-open');
      cal.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
    }

    trigger.addEventListener('click', function () {
      if (wrap.classList.contains('is-open')) closeAll();
      else open();
    });

    cal.addEventListener('click', function (e) {
      const btn = e.target.closest('button');
      if (!btn) return;
      const action = btn.getAttribute('data-cal');
      if (action === 'prev') {
        view = new Date(view.getFullYear(), view.getMonth() - 1, 1);
        render();
        return;
      }
      if (action === 'next') {
        view = new Date(view.getFullYear(), view.getMonth() + 1, 1);
        render();
        return;
      }
      if (action === 'today') {
        input.value = toISO(today);
        syncLabel();
        closeAll();
        return;
      }
      if (action === 'clear') {
        input.value = '';
        syncLabel();
        closeAll();
        return;
      }
      const iso = btn.getAttribute('data-iso');
      if (iso) {
        input.value = iso;
        syncLabel();
        closeAll();
      }
    });

    syncLabel();
  }

  form.querySelectorAll('select').forEach(enhanceSelect);
  form.querySelectorAll('input[type="date"]').forEach(enhanceDate);

  document.addEventListener('click', function (e) {
    if (!form.contains(e.target)) closeAll();
    else if (!e.target.closest('.select, .date-field')) closeAll();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAll();
  });

  document.querySelectorAll('[data-lang-toggle]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      window.setTimeout(function () {
        form.querySelectorAll('select').forEach(function (select) {
          select.dispatchEvent(new Event('change', { bubbles: true }));
        });
        form.querySelectorAll('input[type="date"]').forEach(function (input) {
          const label = input.closest('.date-field') && input.closest('.date-field').querySelector('.date-field__label');
          if (!label) return;
          if (input.value) {
            label.textContent = formatDisplay(input.value);
            label.classList.remove('is-placeholder');
          } else {
            label.textContent = isKn() ? 'ದಿನಾಂಕ ಆಯ್ಕೆಮಾಡಿ' : 'Select a date';
            label.classList.add('is-placeholder');
          }
        });
      }, 0);
    });
  });

  if (typeof SITE_CONFIG === 'undefined') return;

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
