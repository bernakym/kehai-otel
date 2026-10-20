/* KEHAİ — etkileşim: tema, menü, görünürlük, rezervasyon formu */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---- gündüz / gece ---- */
  var toggle = document.getElementById('themeToggle');
  var label = document.querySelector('[data-theme-label]');
  var STORE = 'kehai-theme';

  function applyTheme(mode) {
    root.setAttribute('data-theme', mode);
    var dark = mode === 'dark';
    if (label) label.textContent = dark ? 'Gündüz' : 'Gece';
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(dark));
      toggle.setAttribute('aria-label', dark ? 'Gündüz moduna geç' : 'Gece moduna geç');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORE); } catch (e) {}
  if (saved === 'dark' || saved === 'light') {
    applyTheme(saved);
  } else {
    applyTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try { localStorage.setItem(STORE, next); } catch (e) {}
    });
  }

  /* ---- üst bar: kaydırma durumu ---- */
  var topbar = document.getElementById('topbar');
  function onScroll() {
    if (topbar) topbar.classList.toggle('is-stuck', window.scrollY > 24);
  }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---- mobil menü ---- */
  var burger = document.getElementById('burger');
  var nav = document.getElementById('nav');

  function closeNav() {
    if (!nav) return;
    nav.classList.remove('is-open');
    if (burger) {
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Menüyü aç');
    }
  }

  if (burger && nav) {
    burger.addEventListener('click', function () {
      var open = nav.classList.toggle('is-open');
      burger.setAttribute('aria-expanded', String(open));
      burger.setAttribute('aria-label', open ? 'Menüyü kapat' : 'Menüyü aç');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---- bölümler göründükçe açılsın ---- */
  var targets = document.querySelectorAll(
    '.reveal, .section__head, .steps li, .sense, .glossary > div, .room,' +
    '.floor, .timeline li, .place__text, .place__map, .form, .contact'
  );

  if (!('IntersectionObserver' in window)) {
    Array.prototype.forEach.call(targets, function (el) { el.classList.add('is-in'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        // kardeşler arasında kademeli gecikme — Alexander'ın "ritim"i
        var sibs = el.parentElement ? el.parentElement.children : [];
        var i = Array.prototype.indexOf.call(sibs, el);
        el.style.transitionDelay = Math.min(i, 6) * 70 + 'ms';
        el.classList.add('is-in');
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- menüde etkin bölümü işaretle ---- */
  var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('is-active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---- rezervasyon formu ----
     Statik barındırma olduğu için sunucu yok; talep, girilen bilgilerle
     hazırlanmış bir e-postaya dönüştürülüp kullanıcının posta uygulamasında
     açılır. ---- */
  var form = document.getElementById('bookForm');
  var hint = document.getElementById('formHint');

  function say(msg, isError) {
    if (!hint) return;
    hint.textContent = msg;
    hint.classList.toggle('err', !!isError);
  }

  if (form) {
    var today = new Date().toISOString().slice(0, 10);
    var dIn = form.elements['in'];
    var dOut = form.elements['out'];
    if (dIn) dIn.min = today;
    if (dOut) dOut.min = today;
    if (dIn && dOut) {
      dIn.addEventListener('change', function () {
        dOut.min = dIn.value || today;
        if (dOut.value && dOut.value <= dIn.value) dOut.value = '';
      });
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var f = form.elements;
      var missing = ['name', 'mail', 'in', 'out'].filter(function (k) {
        var el = f[k];
        var bad = !el.value || (k === 'mail' && !el.checkValidity());
        el.classList.toggle('invalid', bad);
        return bad;
      });

      if (missing.length) {
        say('Ad, e-posta ve tarihleri doldurun.', true);
        var first = f[missing[0]];
        if (first && first.focus) first.focus();
        return;
      }

      if (f['out'].value <= f['in'].value) {
        f['out'].classList.add('invalid');
        say('Çıkış tarihi girişten sonra olmalı.', true);
        return;
      }

      var nights = Math.round(
        (new Date(f['out'].value) - new Date(f['in'].value)) / 86400000
      );

      var body = [
        'Ad, soyad: ' + f['name'].value,
        'E-posta: ' + f['mail'].value,
        'Giriş: ' + f['in'].value,
        'Çıkış: ' + f['out'].value,
        'Gece: ' + nights,
        'Oda: ' + f['room'].value,
        'Kişi: ' + f['guests'].value,
        '',
        'Not:',
        f['note'].value || '—'
      ].join('\n');

      var href = 'mailto:rezervasyon@kehai.jp'
        + '?subject=' + encodeURIComponent('Rezervasyon talebi — ' + f['name'].value)
        + '&body=' + encodeURIComponent(body);

      window.location.href = href;
      say(nights + ' gecelik talebiniz e-posta olarak hazırlandı; göndermeniz yeterli.');
    });
  }
})();
