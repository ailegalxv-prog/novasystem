/* =========================================================
   NS — квіз «Вентиляція»
   Питання, знижка і ціна налаштовуються в CONFIG нижче.
   ========================================================= */
(function () {
  'use strict';

  var CONFIG = {
    quizName: "NS — квіз «Вентиляція»",
    endpoint: 'https://novasystem-leads-898072850183.us-central1.run.app',
    thanksPage: 'thanks.html',
    maxDiscount: 5,          // % знижки після проходження всіх питань
    floorPrice: 280,         // грн/м² — акційна ціна монтажу теплої підлоги
    autoNextDelay: 380,      // мс — авто-перехід після вибору одного варіанту
    managerName: 'Інженер NS',
    managerRole: 'онлайн'
  };

  /* ---------- Іконки (stroke, 24×24) ---------- */
  var I = {
    floor: '<path d="M3 5h15a3 3 0 0 1 0 6H6a3 3 0 0 0 0 6h15"/><path d="M3 21h18" opacity=".45"/>',
    heating: '<rect x="3.5" y="6" width="17" height="11" rx="2"/><path d="M8 6v11M12 6v11M16 6v11M6.5 17v2.5M17.5 17v2.5"/>',
    water: '<path d="M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z"/><path d="M9.5 14.5a2.5 2.5 0 0 0 2.5 2.5"/>',
    vent: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="1.5"/><path d="M12 10.5c0-4 1.6-5.8 3.6-5.2s1.4 3.6-2.1 5.6M13.5 12c4 0 5.8 1.6 5.2 3.6s-3.6 1.4-5.6-2.1M12 13.5c0 4-1.6 5.8-3.6 5.2s-1.4-3.6 2.1-5.6M10.5 12c-4 0-5.8-1.6-5.2-3.6s3.6-1.4 5.6 2.1"/>',
    ac: '<rect x="2.5" y="5" width="19" height="8" rx="2"/><path d="M6 10h12M7.5 16.5l-1 3M12 16.5v3M16.5 16.5l1 3"/>',
    turnkey: '<circle cx="8" cy="15" r="4"/><path d="M11 12l8-8M16 7l2 2M14 9l2 2"/>',
    house: '<path d="M3 11l9-7 9 7"/><path d="M5 10v10h14V10"/><path d="M10 20v-6h4v6"/>',
    flat: '<path d="M5 21V4h10v17M15 9h4v12M3 21h18"/><path d="M8 7.5h1.5M11 7.5h1.5M8 11.5h1.5M11 11.5h1.5M8 15.5h1.5M11 15.5h1.5"/>',
    shop: '<path d="M3.5 9 5 4h14l1.5 5M3.5 9h17"/><path d="M3.5 9a2.8 2.8 0 0 0 5.7 0 2.8 2.8 0 0 0 5.6 0 2.8 2.8 0 0 0 5.7 0"/><path d="M5 12v9h14v-9M10 21v-5h4v5"/>',
    other: '<circle cx="12" cy="12" r="9"/><path d="M8 12h.01M12 12h.01M16 12h.01" stroke-width="3"/>',
    brick: '<rect x="3" y="5" width="18" height="14" rx="1"/><path d="M3 12h18M9 5v7M15 12v7"/>',
    trowel: '<path d="M14 3l7 7-4 4-7-7z"/><path d="M12 9l-8.5 8.5 3 3L15 12"/>',
    swap: '<path d="M4 12a8 8 0 0 1 13.7-5.6L20 9"/><path d="M20 4v5h-5"/><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15"/><path d="M4 20v-5h5"/>',
    plan: '<path d="M6 3h9l4 4v14H6z"/><path d="M14 3v5h5M9 13h7M9 17h5"/>',
    box: '<path d="M3 7l9-4 9 4-9 4z"/><path d="M3 7v10l9 4 9-4V7M12 11v10"/>',
    wrench: '<path d="M14.7 6.3a4 4 0 0 0-5.4 5.4L3 18l3 3 6.3-6.3a4 4 0 0 0 5.4-5.4l-2.6 2.6-2.4-.6-.6-2.4z"/>',
    chat: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12.5h5"/>',
    boiler: "<rect x=\"6\" y=\"3\" width=\"12\" height=\"18\" rx=\"2\"/><path d=\"M10 7h4M12 17c-1.5 0-2.5-1-2.5-2.3 0-1.5 2.5-3.7 2.5-3.7s2.5 2.2 2.5 3.7c0 1.3-1 2.3-2.5 2.3z\"/>",
    drain: "<path d=\"M4 4h6v6a4 4 0 0 0 4 4h6\"/><path d=\"M20 10v8\"/><path d=\"M8 19h.01M12 19h.01\" stroke-width=\"3\"/>",
    pump: "<path d=\"M12 3v6\"/><circle cx=\"12\" cy=\"14\" r=\"5\"/><path d=\"M12 14l3-2M3 21h18\"/>",
    filter: "<path d=\"M4 4h16l-6 8v6l-4 2v-8z\"/>",
    recup: "<rect x=\"3\" y=\"7\" width=\"18\" height=\"10\" rx=\"2\"/><path d=\"M7 10l3 2-3 2M17 10l-3 2 3 2\"/>",
    wallvent: "<rect x=\"4\" y=\"4\" width=\"16\" height=\"16\" rx=\"2\"/><path d=\"M8 9h8M8 12h8M8 15h8\"/>",
    duct: "<path d=\"M3 8h18v6H3z\"/><path d=\"M7 14v3M12 14v3M17 14v3\"/>",
    multi: "<rect x=\"2.5\" y=\"4\" width=\"8.5\" height=\"5\" rx=\"1.5\"/><rect x=\"13\" y=\"4\" width=\"8.5\" height=\"5\" rx=\"1.5\"/><rect x=\"7\" y=\"15\" width=\"10\" height=\"6\" rx=\"1.5\"/><path d=\"M6.7 9v3h10.6V9M12 12v3\"/>",
    spark: "<path d=\"M12 3l2 6 6 2-6 2-2 6-2-6-6-2 6-2z\"/>"
  };

  /* ---------- Питання ----------
     type: cards (картки з іконками), list (список), slider (повзунок), location (список + поле)
     multi: true — можна обрати кілька варіантів */
  var STEPS = [
    {
      "id": "system",
      "type": "cards",
      "multi": true,
      "q": "Яка вентиляція потрібна?",
      "hint": "Не знаєте, що обрати? Інженер підбере систему під ваш об'єкт",
      "options": [
        {
          "v": "Припливно-витяжна з рекуперацією",
          "icon": "recup"
        },
        {
          "v": "Рекуператори в стіну",
          "icon": "wallvent"
        },
        {
          "v": "Витяжка: кухня / санвузол",
          "icon": "vent"
        },
        {
          "v": "Не знаю — потрібна консультація",
          "icon": "chat"
        }
      ]
    },
    {
      "id": "object",
      "type": "cards",
      "q": "Який у вас об'єкт?",
      "hint": "Від типу об'єкта залежить схема розведення і потужність обладнання",
      "options": [
        {
          "v": "Приватний будинок",
          "icon": "house"
        },
        {
          "v": "Квартира",
          "icon": "flat"
        },
        {
          "v": "Комерційне приміщення",
          "icon": "shop"
        },
        {
          "v": "Інше",
          "icon": "other"
        }
      ]
    },
    {
      "id": "area",
      "type": "slider",
      "q": "Вкажіть орієнтовну площу приміщення",
      "hint": "Достатньо приблизної цифри — точну площу інженер уточнить на замірі",
      "min": 20,
      "max": 500,
      "step": 5,
      "value": 120,
      "unit": "м²",
      "presets": [
        50,
        100,
        150,
        200,
        300
      ]
    },
    {
      "id": "stage",
      "type": "cards",
      "q": "На якому етапі зараз об'єкт?",
      "hint": "Найкраще закладати інженерні системи до чистового ремонту",
      "options": [
        {
          "v": "Коробка / новобудова",
          "icon": "brick"
        },
        {
          "v": "Чорновий ремонт",
          "icon": "trowel"
        },
        {
          "v": "Заміна старої системи",
          "icon": "swap"
        },
        {
          "v": "Поки що потрібен проєкт",
          "icon": "plan"
        }
      ]
    },
    {
      "id": "materials",
      "type": "cards",
      "q": "Що потрібно від нас?",
      "hint": "Гарантію надаємо і на матеріали, і на монтаж",
      "options": [
        {
          "v": "Під ключ — з нашими матеріалами",
          "icon": "box"
        },
        {
          "v": "Тільки монтаж — матеріали мої",
          "icon": "wrench"
        },
        {
          "v": "Потрібна консультація",
          "icon": "chat"
        }
      ]
    },
    {
      "id": "timing",
      "type": "list",
      "q": "Коли плануєте монтаж?",
      "hint": "Щоб зробити точний прорахунок, нам потрібно знати терміни",
      "options": [
        {
          "v": "Якнайшвидше"
        },
        {
          "v": "Протягом місяця"
        },
        {
          "v": "За 1–3 місяці"
        },
        {
          "v": "Ще визначаюсь"
        }
      ]
    },
    {
      "id": "location",
      "type": "location",
      "q": "Де знаходиться об'єкт?",
      "hint": "Працюємо у Львові та по всій Львівській області",
      "options": [
        {
          "v": "Львів"
        },
        {
          "v": "Львівська область",
          "input": "Населений пункт (необов'язково)"
        },
        {
          "v": "Інша область",
          "input": "Яка область / місто?"
        }
      ]
    }
  ];

  /* ---------- Стан ---------- */
  var state = { step: 0, answers: {}, extra: {}, discount: 0, started: false };
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  var quiz = $('#quiz');
  var body = $('[data-steps-body]');
  var btnNext = $('[data-action="next"]');
  var btnPrev = $('[data-action="prev"]');
  var autoTimer = null;

  window.dataLayer = window.dataLayer || [];
  function track(event, params) {
    var data = { event: event };
    for (var k in params) { if (Object.prototype.hasOwnProperty.call(params, k)) data[k] = params[k]; }
    window.dataLayer.push(data);
    if (typeof window.fbq === 'function') window.fbq('trackCustom', event, params || {});
  }

  /* ---------- UTM: зберігаємо з першого заходу ---------- */
  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term'];
  (function saveUtm() {
    try {
      var p = new URLSearchParams(location.search);
      var found = {};
      UTM_KEYS.forEach(function (k) { if (p.get(k)) found[k] = p.get(k); });
      if (Object.keys(found).length) sessionStorage.setItem('ns_utm', JSON.stringify(found));
      if (!sessionStorage.getItem('ns_ref')) sessionStorage.setItem('ns_ref', document.referrer || '');
    } catch (e) { /* sessionStorage недоступний — не критично */ }
  })();

  function getUtm() {
    try { return JSON.parse(sessionStorage.getItem('ns_utm') || '{}'); } catch (e) { return {}; }
  }

  /* ---------- Екрани ---------- */
  function show(name) {
    $$('.screen', quiz).forEach(function (s) { s.classList.toggle('is-active', s.getAttribute('data-screen') === name); });
    quiz.setAttribute('data-view', name);
    var top = quiz.getBoundingClientRect().top + window.pageYOffset - 12;
    if (window.pageYOffset > top) window.scrollTo({ top: top, behavior: 'smooth' });
  }

  /* ---------- Розмітка кроку ---------- */
  function icon(name) {
    return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + I[name] + '</svg>';
  }

  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }

  function managerHtml(hint) {
    return '<div class="manager is-open">' +
      '<span class="manager__ava" aria-hidden="true"><img src="assets/logo.png" alt=""></span>' +
      '<span class="manager__meta"><b>' + esc(CONFIG.managerName) + '</b> <i class="manager__dot"></i><small>' + esc(CONFIG.managerRole) + '</small>' +
      '<span class="manager__hint">' + esc(hint) + '</span></span>' +
      '<button type="button" class="manager__toggle" aria-label="Згорнути підказку"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 10l5 5 5-5z"/></svg></button>' +
      '</div>';
  }

  function render() {
    var s = STEPS[state.step];
    var html = '<div class="step" data-step="' + s.id + '">';
    html += '<h2 class="step__q">' + esc(s.q) + (s.multi ? ' <span class="step__multi">можна кілька</span>' : '') + '</h2>';
    html += managerHtml(s.hint);

    if (s.type === 'cards') {
      html += '<div class="cards cards--' + s.options.length + '">';
      s.options.forEach(function (o, i) {
        html += '<label class="card" style="--i:' + i + '">' +
          '<input type="' + (s.multi ? 'checkbox' : 'radio') + '" name="' + s.id + '" value="' + esc(o.v) + '">' +
          '<span class="card__media">' + icon(o.icon) + (o.tag ? '<em class="card__tag">' + esc(o.tag) + '</em>' : '') +
          '<span class="card__check" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4z"/></svg></span></span>' +
          '<span class="card__label">' + esc(o.v) + '</span></label>';
      });
      html += '</div>';
    }

    if (s.type === 'list' || s.type === 'location') {
      html += '<div class="list">';
      s.options.forEach(function (o, i) {
        html += '<label class="row" style="--i:' + i + '"><input type="radio" name="' + s.id + '" value="' + esc(o.v) + '"' + (o.input ? ' data-has-input="1"' : '') + '>' +
          '<span class="row__dot" aria-hidden="true"></span><span class="row__label">' + esc(o.v) + '</span></label>';
        if (o.input) {
          html += '<input type="text" class="row__input" data-for="' + esc(o.v) + '" placeholder="' + esc(o.input) + '" maxlength="80" hidden>';
        }
      });
      html += '</div>';
    }

    if (s.type === 'slider') {
      var val = state.answers[s.id] || s.value;
      html += '<div class="slider">' +
        '<div class="slider__value"><input type="number" inputmode="numeric" min="' + s.min + '" max="' + s.max + '" value="' + val + '" aria-label="Площа"><span>' + esc(s.unit) + '</span></div>' +
        '<input type="range" min="' + s.min + '" max="' + s.max + '" step="' + s.step + '" value="' + val + '" aria-label="Площа, повзунок">' +
        '<div class="slider__scale"><span>' + s.min + '</span><span>' + s.max + '+</span></div>' +
        '<div class="slider__presets">' + s.presets.map(function (p) { return '<button type="button" data-preset="' + p + '">' + p + ' ' + esc(s.unit) + '</button>'; }).join('') + '</div>' +
        '<div class="estimate" data-estimate hidden></div>' +
        '</div>';
    }

    html += '</div>';
    body.innerHTML = html;
    restore(s);
    bind(s);
    updateUi();
  }

  /* Відновлення відповіді при поверненні назад */
  function restore(s) {
    var a = state.answers[s.id];
    if (a == null || s.type === 'slider') { if (s.type === 'slider') { state.answers[s.id] = state.answers[s.id] || s.value; updateEstimate(); } return; }
    var vals = Array.isArray(a) ? a : [a];
    $$('input[name="' + s.id + '"]', body).forEach(function (inp) {
      if (vals.indexOf(inp.value) > -1) inp.checked = true;
    });
    if (s.type === 'location') toggleLocationInput(s);
  }

  function bind(s) {
    var mgr = $('.manager', body);
    $('.manager__toggle', mgr).addEventListener('click', function () { mgr.classList.toggle('is-open'); });

    if (s.type === 'cards' || s.type === 'list' || s.type === 'location') {
      $$('input[name="' + s.id + '"]', body).forEach(function (inp) {
        inp.addEventListener('change', function () {
          if (s.multi) {
            state.answers[s.id] = $$('input[name="' + s.id + '"]:checked', body).map(function (x) { return x.value; });
            if (!state.answers[s.id].length) delete state.answers[s.id];
          } else {
            state.answers[s.id] = inp.value;
          }
          if (s.type === 'location') toggleLocationInput(s);
          updateUi();
          // Авто-перехід для одиночного вибору (крім варіантів з додатковим полем)
          clearTimeout(autoTimer);
          if (!s.multi && !inp.hasAttribute('data-has-input')) {
            autoTimer = setTimeout(next, CONFIG.autoNextDelay);
          }
        });
      });
      $$('.row__input', body).forEach(function (field) {
        field.addEventListener('input', function () { state.extra[s.id] = field.value.trim(); });
        field.addEventListener('keydown', function (e) { if (e.key === 'Enter') { e.preventDefault(); next(); } });
      });
    }

    if (s.type === 'slider') {
      var range = $('input[type="range"]', body);
      var num = $('.slider__value input', body);
      var set = function (v, from) {
        v = Math.round(Number(v) || s.min);
        var clamped = Math.min(s.max, Math.max(s.min, v));
        state.answers[s.id] = clamped;
        if (from !== 'range') range.value = clamped;
        if (from !== 'num') num.value = clamped;
        paintRange(range);
        $$('[data-preset]', body).forEach(function (b) { b.classList.toggle('is-active', Number(b.getAttribute('data-preset')) === clamped); });
        updateEstimate();
      };
      range.addEventListener('input', function () { set(range.value, 'range'); });
      num.addEventListener('input', function () { if (num.value !== '') set(num.value, 'num'); });
      num.addEventListener('blur', function () { set(num.value, 'blur'); });
      $$('[data-preset]', body).forEach(function (b) {
        b.addEventListener('click', function () { set(b.getAttribute('data-preset')); });
      });
      set(state.answers[s.id]);
    }
  }

  function toggleLocationInput(s) {
    var chosen = state.answers[s.id];
    $$('.row__input', body).forEach(function (f) {
      var on = f.getAttribute('data-for') === chosen;
      f.hidden = !on;
      if (on) {
        f.value = state.extra[s.id] || '';
        setTimeout(function () { f.focus(); }, 50);
      }
    });
    if (!$$('.row__input', body).some(function (f) { return !f.hidden; })) state.extra[s.id] = '';
  }

  function paintRange(range) {
    var p = (range.value - range.min) / (range.max - range.min) * 100;
    range.style.setProperty('--p', p + '%');
  }

  /* Орієнтовна вартість теплої підлоги, якщо її обрано на 1-му кроці */
  function updateEstimate() {
    var box = $('[data-estimate]', body);
    if (!box) return;
    var sys = state.answers.system || [];
    if (sys.indexOf('Тепла підлога') === -1) { box.hidden = true; return; }
    var area = state.answers.area;
    box.hidden = false;
    box.innerHTML = '<span>Монтаж теплої підлоги за акцією</span><b>≈ ' + format(area * CONFIG.floorPrice) + ' грн</b>' +
      '<small>' + area + ' м² × ' + CONFIG.floorPrice + ' грн/м². Точну вартість з матеріалами прорахує інженер</small>';
  }

  function format(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ' '); }

  /* ---------- Прогрес і знижка ---------- */
  function answered(s) {
    var a = state.answers[s.id];
    return Array.isArray(a) ? a.length > 0 : a != null && a !== '';
  }

  function updateUi() {
    var s = STEPS[state.step];
    var total = STEPS.length;
    $('[data-step-num]').textContent = state.step + 1;
    $('[data-step-total]').textContent = total;
    var pct = Math.round(state.step / total * 100);
    $('.progress__bar').style.width = pct + '%';
    $('.progress').setAttribute('aria-valuenow', pct);
    btnNext.disabled = !answered(s);
    btnPrev.disabled = false;
    var last = state.step === total - 1;
    btnNext.firstChild.nodeValue = last ? 'Готово ' : 'Далі ';
    setDiscount(Math.round(CONFIG.maxDiscount * state.step / total));
  }

  function setDiscount(d) {
    if (d === state.discount) return;
    var grew = d > state.discount;
    state.discount = d;
    $$('[data-discount]').forEach(function (el) { el.textContent = d; });
    if (grew) {
      var box = $('[data-discount-box]');
      box.classList.remove('is-bump');
      void box.offsetWidth;
      box.classList.add('is-bump');
    }
  }

  /* ---------- Навігація ---------- */
  function next() {
    clearTimeout(autoTimer);
    var s = STEPS[state.step];
    if (!answered(s)) return;
    track('quiz_step', { step: state.step + 1, question: s.q });
    if (state.step < STEPS.length - 1) {
      state.step++;
      render();
    } else {
      setDiscount(CONFIG.maxDiscount);
      buildSummary();
      show('form');
      track('quiz_complete', { discount: state.discount });
      setTimeout(function () { var n = $('#leadForm input[name="name"]'); if (n && window.innerWidth > 760) n.focus(); }, 300);
    }
  }

  function prev() {
    clearTimeout(autoTimer);
    if (state.step === 0) { show('start'); return; }
    state.step--;
    render();
  }

  function answerPairs() {
    return STEPS.map(function (s) {
      var a = state.answers[s.id];
      if (a == null) return null;
      var text = Array.isArray(a) ? a.join(', ') : String(a);
      if (s.type === 'slider') text += ' ' + s.unit;
      if (state.extra[s.id]) text += ' — ' + state.extra[s.id];
      return [s.q, text];
    }).filter(Boolean);
  }

  function buildSummary() {
    var labels = { system: "Вентиляція", object: 'Об\'єкт', area: 'Площа', stage: 'Етап', materials: 'Формат', timing: 'Терміни', location: 'Локація' };
    var html = '<ul>';
    STEPS.forEach(function (s) {
      var a = state.answers[s.id];
      if (a == null) return;
      var t = Array.isArray(a) ? a.join(', ') : String(a);
      if (s.type === 'slider') t += ' ' + s.unit;
      if (state.extra[s.id]) t += ' — ' + state.extra[s.id];
      html += '<li><span>' + esc(labels[s.id] || s.q) + '</span><b>' + esc(t) + '</b></li>';
    });
    html += '</ul>';
    $('[data-summary]').innerHTML = html;
  }

  /* ---------- Маска телефону: (XX) XXX-XX-XX після +380 ---------- */
  var phone = $('#leadForm input[name="phone"]');
  function phoneDigits(v) {
    var d = String(v).replace(/\D/g, '');
    if (d.indexOf('380') === 0) d = d.slice(3);
    if (d.indexOf('0') === 0) d = d.slice(1);
    return d.slice(0, 9);
  }
  function maskPhone(d) {
    var out = '';
    if (d.length > 0) out = '(' + d.slice(0, 2);
    if (d.length >= 2) out += ') ';
    if (d.length > 2) out += d.slice(2, 5);
    if (d.length > 5) out += '-' + d.slice(5, 7);
    if (d.length > 7) out += '-' + d.slice(7, 9);
    return out;
  }
  phone.addEventListener('input', function () {
    phone.value = maskPhone(phoneDigits(phone.value));
    phone.closest('.field').classList.remove('has-error');
  });

  /* ---------- Відправка ---------- */
  var form = $('#leadForm');
  var sending = false;
  form.name.addEventListener('input', function () { form.name.closest('.field').classList.remove('has-error'); });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var name = form.name.value.trim();
    var digits = phoneDigits(phone.value);
    var ok = true;
    if (name.length < 2) { form.name.closest('.field').classList.add('has-error'); ok = false; }
    if (digits.length !== 9) { phone.closest('.field').classList.add('has-error'); ok = false; }
    if (!form.consent.checked) { form.consent.closest('.consent').classList.add('has-error'); ok = false; }
    if (!ok) { var bad = $('.has-error input', form); if (bad) bad.focus(); return; }

    sending = true;
    var btn = $('button[type="submit"]', form);
    var btnText = $('[data-submit-text]', form);
    btn.disabled = true;
    btn.classList.add('is-loading');
    btnText.textContent = 'Надсилаємо…';
    $('[data-form-error]').hidden = true;

    var channel = $('input[name="channel"]:checked', form);
    var fd = new FormData();
    fd.append('quiz', CONFIG.quizName);
    fd.append('name', name);
    fd.append('phone', '+380' + digits);
    fd.append('channel', channel ? channel.value : '');
    fd.append('discount', state.discount + '%');
    fd.append('answers', JSON.stringify(answerPairs()));
    fd.append('website', form.website.value);
    fd.append('page', location.href.split('#')[0]);
    var ref = '';
    try { ref = sessionStorage.getItem('ns_ref') || ''; } catch (err) { /* ignore */ }
    fd.append('referrer', ref);
    var utm = getUtm();
    UTM_KEYS.forEach(function (k) { fd.append(k, utm[k] || ''); });

    fetch(CONFIG.endpoint, { method: 'POST', body: fd, credentials: 'omit' })
      .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
      .then(function (res) {
        if (!res || !res.ok) throw new Error(res && res.error ? res.error : 'send');
        try {
          sessionStorage.setItem('ns_lead', JSON.stringify({ name: name, discount: state.discount, channel: channel ? channel.value : '', quiz: CONFIG.quizName }));
        } catch (err) { /* ignore */ }
        location.href = CONFIG.thanksPage;
      })
      .catch(function (err) {
        sending = false;
        btn.disabled = false;
        btn.classList.remove('is-loading');
        btnText.textContent = 'Отримати прорахунок';
        if (err && err.message === 'phone') { phone.closest('.field').classList.add('has-error'); return; }
        if (err && err.message === 'name') { form.name.closest('.field').classList.add('has-error'); return; }
        $('[data-form-error]').hidden = false;
      });
  });
  form.consent.addEventListener('change', function () { form.consent.closest('.consent').classList.remove('has-error'); });

  /* ---------- Кнопки ---------- */
  $('[data-action="start"]').addEventListener('click', function () {
    if (!state.started) { state.started = true; track('quiz_start', {}); }
    state.step = 0;
    render();
    show('steps');
  });
  btnNext.addEventListener('click', next);
  btnPrev.addEventListener('click', prev);
  $('[data-action="back-to-steps"]').addEventListener('click', function () {
    state.step = STEPS.length - 1;
    render();
    show('steps');
  });

  $$('[data-max-discount]').forEach(function (el) { el.textContent = CONFIG.maxDiscount; });
  $('[data-step-total]').textContent = STEPS.length;
})();
