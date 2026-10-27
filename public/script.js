/* ====== КУДИ ЙДУТЬ ЗАЯВКИ ======
   Перехідник у Google Cloud пересилає заявку в Telegram-групу «Заявки NovaSystem».
   Токен бота зберігається лише на сервері — у коді сайту його немає. */
const LEADS_URL = 'https://novasystem-leads-898072850183.us-central1.run.app';


const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const ic = id => `<svg class="ic"><use href="#${id}"/></svg>`;


function initPlaceholders(root = document) {
  $$('img[data-ph]', root).forEach(img => {
    const fallback = () => {
      if (img.dataset.done) return;
      img.dataset.done = 1;
      const d = document.createElement('div');
      d.className = 'ph';
      d.textContent = img.dataset.ph.includes('/') ? decodeURI(img.dataset.ph) : 'img/' + img.dataset.ph;
      img.replaceWith(d);
    };
    if (img.complete && img.naturalWidth === 0) fallback();
    else img.addEventListener('error', fallback);
  });
}


/* ====== ФОТО ПРОЕКТІВ ======
   Файли лежать у папці project/<назва папки з архіву>/<файл> — назви такі самі, як в архіві.
   Перше фото в списку = обкладинка картки на головній і головне фото на сторінці проекту. */
const projectPhotos = (folder, files) => files.map(f => encodeURI(`project/${folder}/${f}`));

const PHOTOS = {
  heating: projectPhotos('опалення та котельні', [
    '1c60b8cbf59d3cf01a787c7ab501b58b.jpg',
    '04846113eff295e3fd899190e6a15170.jpg',
    '5c491ff7dd17eb6ee5d5b2a40da1d2c7.jpg',
    '7444fa0ff808b2db636033a7b778e260.jpg',
    '9346e9395c76097790ad7fa68f8f50e4.jpg',
    'c08b2aefa6ed76144bfa6a6085db0cf2.jpg',
    'ef238ce8825029dde53b184116e90d66.jpg',
    'fef5cffe1d6a67c9e63eb12e60104297.jpg',
  ]),
  floor: projectPhotos('тепла підлога', [
    '1f6eff6a706fee2d2c7aa813de3fd072.jpg',
    '06170fc81d46373cf7314d924b5979dd.jpg',
    '194a9089ba313cbb437115456b7c0dbd.jpg',
    '2d0ac6d993b562fbc49f585cce153d86.jpg',
    '3f3088dcd8a4a70846a5ce32e501d7af.jpg',
    '44fed9167627b292caf920049c824e7f.jpg',
    '69bb88d2bb9df6e2d9284b652da8cb02.jpg',
    '6c0a796770622f051356680591f85e6e.jpg',
    '81124b2e21d896bea94f1b63a6857359.jpg',
    '8eda95d875d4398d92c5185026cb2fa4.jpg',
    'b029ebbb03bff2949ad51509de3d191a.jpg',
    'e31c8bfc220939ef6b3c0055b3cfbe42.jpg',
    'e649638b3d562396874f17b74604fbc3.jpg',
    'edb9ee93e01142e1590afc285975803c.jpg',
  ]),
  water: projectPhotos('водопостачання та каналізація', [
    '3a4bd24734d0abad2fd9705b3901cd4f.jpg',
    '6042959336e1bc5cca47c1b9846007e3.jpg',
    '8d6ce0ee2a7ac0dedadd8a7366f70f1f.jpg',
    'ac58272e0fbc9c1f0358972834a8b36c.jpg',
    'c6b1f9c2c3fdb3ac7cae41446ed16438.jpg',
    'd88c536f10a940240212f0e1c29d4ba5.jpg',
    'f515a7ab739f2fb0d47ef710aa2615ad.jpg',
  ]),
  vent: projectPhotos('Вентиляція', [
    '77170867469c6df2c5c2057203ce6517.jpg',
    '1c0de1c4aadf770f98b2d0ab70fbd128.jpg',
    '26cc7b1eb5fc00bd5f405e550201a43d.jpg',
    '34e390df01f418ea0127d36f0c6d96a6.jpg',
    '6e238472170fe3a36f5047dfffe15aac.jpg',
    'ae9b51d9d446f84bf6d285d4a4326860.jpg',
    'c874c35f3050fe5589bbd3208fe2c1b3.jpg',
    'efb345ecf4c0517c61dc9a1571462880.jpg',
  ]),
  ac: projectPhotos('Кондиціонери', [
    '2ffa32225029c4d80aad6ed6aa2b3280.jpg',
    '316cdd20354ef7859d0af28610213ecd.jpg',
    '374a2d27c2149b49deb03845bf8ca685.jpg',
    '375b3f1f6493e0609ca7c64a99adef9d.jpg',
    '3ef59c9f0717787ca706d2f735cba41c.jpg',
    '71b71328138ba681e2ef594577e156eb.jpg',
    '9cb4e50bc3c4f52cc8470de4ac954081.jpg',
    'a47c95132a03cff007f17a98d6ddd6c2.jpg',
    'b1e767f26d24f32678831ce17abb014a.jpg',
    'b2a54ee08ec27247fef6b9aca563d22e.jpg',
    'd2c3f6818afcd132f39a77fa5affe4a3.jpg',
    'd2d21bc72bd7b06529f3daba88f5747c.jpg',
    'fa5c952fa14e88ee53eddb68c2ac8155.jpg',
  ]),
  plumbing: projectPhotos('Сантехніка', [
    'ed61d3fece22d3c6d8f15cc4665f4d5d.jpg',
    '4204c6db434a54c34b7fd29f4a6a3665.jpg',
    '479cea3957bf6c39d801b2c93e4fd135.jpg',
    '4b9b46199092a3960896da75b0563107.jpg',
    '556504ed9efa91fb1ed279ccc57b4017.jpg',
    '578fc38b361f9d4b34d7b2cd1bde1eb3.jpg',
    '81a902d4d86f467a8ae839bb905dd5be.jpg',
    'bdc11628c05aafc7c4503acfd88d7bdf.jpg',
    'c4d5706fd760a7f0352ff6cb7193c5a6.jpg',
    'c4f1887d9e381abd8fa967421627204b.jpg',
    'c540244d20c9692a0c0ba017e5a4ef46.jpg',
    'f20f6a9e47fcfc9e71c6149e3cddc47b.jpg',
  ]),
  solid: projectPhotos('Твердопаливні котли', [
    'd747577b2f8ebc28ed0dcb1500f8ac7d.jpg',
    '0cfa0a8744347e8fad57e389c5d5e188.jpg',
    '6887a790c9c1b83d2f5c006216cf7f18.jpg',
    '7e5bb4a9bd7e79d1f81bac4e43932fea.jpg',
    '8c7bf0a804e9993bc869b8a9c6fb269c.jpg',
    'a4cfdda85a5ccc5e8a93c4ae11e0209b.jpg',
    'e44305e57d4bbaa9a8ac72c19159a739.jpg',
    'faf5ae5df2496c313c4889ec56c63edb.jpg',
  ]),
  pumps: projectPhotos('Теплові насоси', [
    'Тепловий насос.webp',
    '40c0120e214c43e02bb0127a45d9b8a3.jpg',
    'a69eb28a04c3263c8a07020e16d0b32d.jpg',
    'cc137234f0625f1568e63dc2c35fe9ed.jpg',
    'f77c1f00187211ba2b5d1915a53c2092.jpg',
    'ground_heat_pump_in_300.jpg.pagespeed.ce.JooBLBn4za.jpg',
    'img_20250119_115214-scaled-e1740601774163.jpg',
    'photo_2025-09-19_20-39-01.jpg',
    'photo_2026-06-23_14-44-53.webp',
    'photo_4_2025-10-30_14-19-41-e1761828975232.jpg',
    'teplovoj-nasos-dlya-otopleniya-doma.jpeg',
  ]),
};

/* [назва картки, заголовок сторінки, площа, [монтаж, матеріали] або null, опис, фото] */
const PROJECTS = [
["Опалення та котельні","Опалення та котельні","",null,`
**Котельні та системи опалення «під ключ»** — від підбору обладнання до запуску та налаштування. Робимо рішення для приватних будинків, квартир і комерційних приміщень з акцентом на надійність, економію газу та зручне керування.
## Котельня та джерело тепла
v Монтаж газових конденсаційних, електричних та твердопаливних котлів
v Встановлення бойлерів непрямого нагріву для стабільної гарячої води
v Збірка колекторних груп, насосних груп, груп безпеки та розширювальних баків
v Охайна обв'язка котельні мідними, поліпропіленовими та поліетиленовими трубами
## Розводка опалення
v Радіаторне опалення з прихованою розводкою по стяжці
v Поєднання радіаторів із теплою підлогою в одній системі
v Гідравлічне балансування та опресування кожного контуру перед запуском
## Автоматика та керування
- погодозалежне регулювання та позонне керування температурою
- керування з телефона через Wi-Fi з будь-якої точки світу
- статистика витрат на опалення в режимі реального часу
Працюємо по договору та надаємо гарантію на матеріали та монтаж.`, PHOTOS.heating],

["Тепла підлога","Тепла підлога","",null,`
**Тепла підлога** — основне або додаткове опалення, яке рівномірно прогріває приміщення знизу та створює комфортний мікроклімат без пересушування повітря.
## Що входить у монтаж
v Розрахунок контурів та кроку укладання труби під кожну кімнату
v Теплоізоляція основи, демпферна стрічка по периметру
v Укладання труби за схемами «равлик» та «змійка» на профільних матах або сітці з фольгованою ізоляцією
v Збірка колекторних шаф з витратомірами та сервоприводами
v Опресування системи перед заливкою стяжки та фотозвіт прихованих робіт
## Де застосовуємо
- приватні будинки на один та два поверхи
- квартири у новобудовах
- «теплі стіни» та «теплі підвіконники» біля панорамних вікон
- підготовка під тепловий насос або газовий котел
## Керування
Монтуємо покімнатні терморегулятори з датчиками температури підлоги й повітря, а також Wi-Fi автоматику для керування з телефона.`, PHOTOS.floor],

["Водопостачання та каналізація","Водопостачання та каналізація","",null,`
**Водопостачання та каналізація** — прихована та зовнішня розводка, інсталяції для санвузлів і фільтрація води. Виконуємо чисто, з перевіркою кожного з'єднання.
## Водопостачання
v Колекторна розводка холодної та гарячої води по будинку чи квартирі
v Труби PEX та поліпропілен, прокладання в стяжці та стінах з ізоляцією
v Рециркуляція гарячої води за потреби
v Підключення змішувачів прихованого монтажу
## Каналізація
v Внутрішня каналізація санвузлів і кухні
v Зовнішня каналізація в траншеї з потрібним ухилом
v Монтаж колодязів, ревізій і зворотних клапанів
## Сантехніка та очищення води
v Інсталяції для унітазів та біде Geberit та TECE
v Підключення радіаторів, зокрема дизайнерських вертикальних
v Механічний фільтр з редуктором тиску
v Системи пом'якшення води та очищення від заліза, зворотний осмос для питної води
Усі системи опресовуються перед закриттям, тож вода та каналізація працюють без протікань.`, PHOTOS.water],

["Вентиляція","Вентиляція","",null,`
**Вентиляція** для квартир, приватних будинків, ресторанів, магазинів та великих комерційних приміщень. Підбираємо систему під площу, кількість людей та тип приміщення.
## Що ми монтуємо
v Припливно-витяжні системи з рекуперацією тепла
v Повітроводи з оцинкованої сталі прямокутного та круглого перерізу
v Гнучкі та ізольовані повітроводи для складних трас
v Витяжки над кухонним обладнанням для закладів харчування
v Канальні вентилятори, решітки та анемостати, дифузори
## Чим ми зручні
- виготовлення та монтаж повітроводів під конкретний об'єкт
- теплоізоляція повітроводів для захисту від конденсату
- низький рівень шуму та правильний баланс повітря
- координація з іншими інженерними системами на об'єкті
Результат — свіже повітря, контроль вологості та комфортний мікроклімат цілий рік.`, PHOTOS.vent],

["Кондиціонери","Кондиціонери","",null,`
**Кондиціонування** — монтаж, запуск та сервіс систем для квартир, будинків, офісів і торгових приміщень.
## Типи систем
v Настінні спліт-системи, зокрема дизайнерські моделі
v Мультиспліт-системи на кілька кімнат з одним зовнішнім блоком
v Касетні та канальні кондиціонери для офісів і магазинів
v Зовнішні блоки на кронштейнах, фасадах та дахах
## Як ми працюємо
v Підбір потужності під площу, висоту стелі й теплові навантаження
v Охайна траса з мідних труб, дренаж та електроживлення без «сміття» на стінах
v Вакуумування траси, заправка фреоном та перевірка тиску манометрами
v Запуск, пояснення роботи пульта та режимів
## Сервіс
- чистка та діагностика
- заправка та ремонт
- демонтаж і перенесення техніки
Працюємо з обладнанням провідних виробників і надаємо гарантію на монтаж.`, PHOTOS.ac],

["Сантехніка","Сантехніка","",null,`
**Сантехніка під ключ** — від прихованих інсталяцій до готового санвузла. Виконуємо роботи у квартирах і приватних будинках разом із чорновою розводкою води та каналізації.
## Що ми монтуємо
v Інсталяції для підвісних унітазів та біде з кнопками змиву
v Душові системи прихованого монтажу, тропічні душі та термостатичні змішувачі
v Трапи й лінійні зливи в підлозі з правильним ухилом
v Ванни, умивальники, тумби з раковинами та змішувачі
v Бойлери, підключення пральної та посудомийної машин
v Гігієнічні душі, рушникосушарки та дизайнерські радіатори
## Як ми працюємо
- підготовка каркасів під інсталяції та ніші в стінах
- гідроізоляція зони душу і підлоги санвузла
- монтаж після плиточних робіт або узгодження з майстрами-плиточниками
- опресування та перевірка кожного з'єднання перед здачею
Працюємо по договору та надаємо гарантію на матеріали та монтаж.`, PHOTOS.plumbing],

["Твердопаливні котли","Твердопаливні котли","",null,`
**Твердопаливні котли** — надійне та автономне джерело тепла для приватних будинків, господарських і виробничих приміщень. Підбираємо котел під площу, тип палива та режим роботи.
## Що входить у монтаж
v Монтаж твердопаливних котлів на дровах, вугіллі, пелетах та з автоматичною подачею палива
v Встановлення буферних ємностей (теплоакумуляторів) і бойлерів
v Збірка насосних груп, груп безпеки та розширювальних баків
v Гільзування димоходів і правильне підключення до димоходу
v Обв'язка котельні та інтеграція з радіаторним опаленням і теплою підлогою
## Переваги
- незалежність від газу та стабільне опалення без перебоїв
- економія палива завдяки буферній ємності та автоматиці
- можливість поєднання з електрокотлом чи тепловим насосом
- запуск, налаштування та інструктаж по експлуатації
Працюємо по договору та надаємо гарантію на матеріали та монтаж.`, PHOTOS.solid],

["Теплові насоси","Теплові насоси","",null,`
**Теплові насоси** — сучасне економічне опалення та гаряче водопостачання, яке забирає тепло з повітря або ґрунту. Підходить для нових і реконструйованих будинків, у тому числі разом із теплою підлогою.
## Типи систем
v Повітряні теплові насоси «повітря — вода» із зовнішнім блоком
v Моноблоки й спліт-системи з внутрішнім гідромодулем
v Ґрунтові теплові насоси для максимальної ефективності
v Теплові насоси для опалення, ГВП та охолодження влітку
## Що входить у монтаж
v Підбір потужності під площу, утеплення та потреби будинку
v Встановлення зовнішнього блока на підставці, кронштейнах або фундаменті
v Підключення бака ГВП, буферної ємності, груп безпеки та розширювальних баків
v Обв'язка гідравлікою, налаштування автоматики та погодозалежного керування
## Переваги
- значно менші витрати на опалення порівняно з електрокотлом
- тихий режим роботи та мінімальне обслуговування
- керування з телефона через Wi-Fi
- можливість роботи разом із сонячними панелями
Працюємо по договору та надаємо гарантію на матеріали та монтаж.`, PHOTOS.pumps],
];

/* ---- Картки проектів на головній ---- */
const grid = $('#projects-grid'), moreBtn = $('#moreBtn');
let shown = 0;
const stepN = () => (innerWidth > 1024 ? 8 : 6);

function renderProjects(n) {
  const end = Math.min(shown + n, PROJECTS.length);
  for (let i = shown; i < end; i++) {
    const [c, , a] = PROJECTS[i];
    const el = document.createElement('div');
    el.className = 'proj';
    el.style.animationDelay = ((i - shown) * 0.07) + 's';
    el.innerHTML = `
      <div class="proj__img"><img src="${PROJECTS[i][5][0]}" data-ph="${PROJECTS[i][5][0]}" alt="${c}" loading="lazy"></div>
      <h5>${c}</h5><small>${a ? ic('i-area') + a : ''}</small>
      <a class="btn" href="#/project/${i + 1}">Детальніше</a>`;
    grid.appendChild(el);
    initPlaceholders(el);
  }
  shown = end;
  if (shown >= PROJECTS.length) moreBtn.style.display = 'none';
}
renderProjects(stepN());
moreBtn.addEventListener('click', () => renderProjects(stepN()));

/* ---- Слайдер (сертифікати + галерея проекту) ---- */
function makeSlider(track, prev, next, per, autoMs) {
  let pos = 0, timer, sx = 0;
  const n = () => track.children.length;
  const go = i => {
    const max = Math.max(0, n() - per());
    pos = i > max ? 0 : i < 0 ? max : i;
    track.style.transform = `translateX(-${pos * 100 / n()}%)`;
  };
  const layout = () => {
    track.style.width = (n() / per() * 100) + '%';
    [...track.children].forEach(s => s.style.flex = `0 0 ${100 / n()}%`);
    go(pos);
  };
  const restart = () => { clearInterval(timer); if (autoMs) timer = setInterval(() => go(pos + 1), autoMs); };
  next.onclick = () => { go(pos + 1); restart(); };
  prev.onclick = () => { go(pos - 1); restart(); };
  track.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
  track.addEventListener('touchend', e => {
    const dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 40) { go(pos + (dx < 0 ? 1 : -1)); restart(); }
  });
  layout(); restart();
  return { layout, go };
}
const certs = makeSlider($('#track'), $('#prev'), $('#next'), () => innerWidth > 1024 ? 3 : innerWidth > 560 ? 2 : 1, 5000);
const gal   = makeSlider($('#gTrack'), $('#gPrev'), $('#gNext'), () => innerWidth > 1024 ? 4 : innerWidth > 560 ? 2 : 1, 0);

/* ---- Сторінка проекту (SPA) ---- */
function renderBody(txt) {
  const b = t => t.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');
  const icons = { v: 'i-check', w: 'i-drop', f: 'i-flame' };
  return txt.trim().split('\n').map(l => {
    l = l.trim();
    if (!l) return '';
    if (l.startsWith('##')) {
      const m = l.match(/^##([vwf]?)\s*(.*)/);
      return `<h3>${icons[m[1]] ? ic(icons[m[1]]) : ''}${m[2]}</h3>`;
    }
    if (l.startsWith('v ')) return `<p class="li li--v">${ic('i-check')}<span>${b(l.slice(2))}</span></p>`;
    if (l.startsWith('- ')) return `<p class="li li--d"><span>${b(l.slice(2))}</span></p>`;
    return `<p>${b(l)}</p>`;
  }).join('');
}
const money = n => n.toLocaleString('uk-UA') + ' грн';

function showProject(i) {
  const [, t, a, p, body, imgs] = PROJECTS[i];
  $('#pj').innerHTML = `
    <div class="pj__img"><img src="${imgs[0]}" data-ph="${imgs[0]}" alt="${t}"></div>
    <div class="pj__txt">
      <h1>${t}</h1>${a ? `<p class="pj__area">${a}</p>` : ''}
      <div class="pj__body">${renderBody(body)}</div>
      ${p ? `<div class="pj__price"><div><span>Монтаж</span><b>${money(p[0])}</b></div><div><span>Матеріали</span><b>${money(p[1])}</b></div></div>` : ''}
      <button class="btn" data-modal="callback" data-src="Проект: ${t}">Замовити схожий проект</button>
    </div>`;
  $('#gTrack').innerHTML = imgs.map(src =>
    `<div class="gal__slide"><img src="${src}" data-ph="${src}" alt="${t}" loading="lazy"></div>`).join('');
  initPlaceholders($('#project'));
  gal.go(0); gal.layout();
  document.title = `${t} — NS`;
}

const HOME_TITLE = document.title;
let view = 'home';   // home | project | thanks
function route() {
  const hash = location.hash;
  const m = hash.match(/^#\/project\/(\d+)$/);
  const id = hash.slice(1);
  const cl = document.body.classList;

  /* сторінка подяки */
  if (hash === '#/thanks') {
    view = 'thanks';
    cl.remove('is-project'); cl.add('is-thanks');
    document.title = 'Дякуємо за заявку — NS';
    closeAll();
    scrollTo({ top: 0, behavior: 'instant' });
    layoutAll();
    return;
  }
  /* сторінка проекту */
  if (m && PROJECTS[m[1] - 1]) {
    cl.remove('is-thanks');
    showProject(+m[1] - 1);
    view = 'project';
    cl.add('is-project');
    scrollTo({ top: 0, behavior: 'instant' });
    layoutAll();
    return;
  }
  /* назад на головну */
  if (view !== 'home') {
    if (view === 'project' && (id === 'reviews' || id === 'contacts')) return;   // ці блоки є і на сторінці проекту
    cl.remove('is-project', 'is-thanks');
    view = 'home';
    document.title = HOME_TITLE;
    layoutAll();
    const el = document.getElementById(id);
    scrollTo({ top: el ? el.getBoundingClientRect().top + scrollY - 70 : 0, behavior: 'instant' });
  }
}
addEventListener('hashchange', route);

/* ---- Модалка ---- */
const modal = $('#modal');
let modalSource = '';
const TEXTS = {
  timer:    ["Залишилися запитання?", "Залиште свій номер — ми передзвонимо, проконсультуємо та зробимо <b>безкоштовний прорахунок</b>"],
  consult:  ["Зателефонувати вам?", "Залиште контактні дані та отримайте консультацію спеціаліста"],
  callback: ["Зворотній зв'язок", "Залиште контактні дані та отримайте бонус <i><b>“Безкоштовний прорахунок вартості опалення”</b></i>"],
};
function openModal(type, src, noFocus) {
  $('#mTitle').textContent = TEXTS[type][0];
  $('#mText').innerHTML = TEXTS[type][1];
  modalSource = src || '';
  modal.classList.add('open');
  document.body.style.overflow = 'hidden';
  if (!noFocus) setTimeout(() => $('input', modal).focus(), 350);
}
function closeAll() { modal.classList.remove('open'); document.body.style.overflow = ''; }
document.addEventListener('click', e => {
  const m = e.target.closest('[data-modal]');
  if (m) openModal(m.dataset.modal, m.dataset.src);
});
$('#modalX').onclick = closeAll;
modal.addEventListener('click', e => { if (e.target === modal) closeAll(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeAll(); closeDrawer(); } });

/* ---- Меню ---- */
const drawer = $('#drawer'), overlay = $('#overlay');
$('#burger').onclick = () => { drawer.classList.add('open'); overlay.classList.add('open'); };
function closeDrawer() { drawer.classList.remove('open'); overlay.classList.remove('open'); }
$('#drawerClose').onclick = closeDrawer;
overlay.onclick = closeDrawer;
$$('#drawer a').forEach(a => a.addEventListener('click', closeDrawer));

const header = $('#header');
addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 20), { passive: true });

/* ---- Поява блоків при скролі ---- */
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('show'); io.unobserve(e.target); }
}), { threshold: .12 });
$$('.reveal').forEach((el, i) => { el.style.transitionDelay = (i % 3) * 0.1 + 's'; io.observe(el); });

/* ---- «Як відбувається співпраця»: пунктирна лінія 1→2→3→4 ---- */
const stepsBox = $('#steps');
function buildLine() {
  const W = stepsBox.offsetWidth, H = stepsBox.offsetHeight;
  if (!W) return;
  const pts = $$('.step', stepsBox).map(st => {
    const i = $('.step__ico', st);
    return [st.offsetLeft + i.offsetLeft + i.offsetWidth / 2, st.offsetTop + i.offsetTop + i.offsetHeight / 2];
  });
  let h = '';
  for (let k = 0; k < 3; k++) {
    const [x1, y1] = pts[k], [x2, y2] = pts[k + 1], dx = x2 - x1, dy = y2 - y1;
    const d = Math.abs(dx) > Math.abs(dy) * .6
      ? `M${x1},${y1} C${x1 + dx / 2},${y1} ${x2 - dx / 2},${y2} ${x2},${y2}`
      : `M${x1},${y1} C${x1},${y1 + dy / 2} ${x2},${y2 - dy / 2} ${x2},${y2}`;
    h += `<mask id="sm${k}" maskUnits="userSpaceOnUse" x="0" y="0" width="${W}" height="${H}">
            <path class="sm" pathLength="1" d="${d}" style="transition-delay:${(k * 1.2 + .5).toFixed(1)}s"/></mask>
          <path class="sl" d="${d}" mask="url(#sm${k})"/>`;
  }
  const svg = $('#stepsLine');
  svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
  svg.innerHTML = h;
}
new IntersectionObserver((es, o) => es.forEach(e => {
  if (e.isIntersecting) { stepsBox.classList.add('go'); o.disconnect(); }
}), { threshold: .3 }).observe(stepsBox);

function layoutAll() { certs.layout(); gal.layout(); buildLine(); }
let rt;
addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(layoutAll, 120); });
addEventListener('load', layoutAll);
document.fonts && document.fonts.ready.then(buildLine);

/* ---- Тости ---- */
const toast = $('#toast');
function showToast(msg, bad) {
  toast.textContent = msg;
  toast.classList.toggle('bad', !!bad);
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ---- Прапорці візиту (sessionStorage) ---- */
const store = {
  get: k => { try { return sessionStorage.getItem(k); } catch (_) { return null; } },
  set: k => { try { sessionStorage.setItem(k, '1'); } catch (_) {} },
};

/* ---- Відправка в Telegram ---- */
function fmtPhone(v) {
  let d = v.replace(/\D/g, '');
  if (d.startsWith('380')) d = d.slice(2);
  else if (!d.startsWith('0') && d.length) d = '0' + d;
  d = d.slice(0, 10);
  let r = '+38 ';
  if (d.length) r += '(' + d.slice(0, 3);
  if (d.length >= 3) r += ') ' + d.slice(3, 6);
  if (d.length >= 6) r += '-' + d.slice(6, 8);
  if (d.length >= 8) r += '-' + d.slice(8, 10);
  return d.length ? r : '';
}
document.addEventListener('input', e => {
  if (e.target.matches('input[type=tel]')) e.target.value = fmtPhone(e.target.value);
  e.target.classList?.remove('err');
});

async function sendToTelegram(name, phone, source) {
  const fd = new FormData();
  fd.append('name', name);
  fd.append('phone', phone);
  fd.append('source', source);
  const r = await fetch(LEADS_URL, { method: 'POST', body: fd });
  const res = await r.json().catch(() => ({}));
  if (!r.ok || !res.ok) throw new Error('send error ' + r.status);
}

$$('.lead-form').forEach(form => {
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const name = form.name.value.trim(), phone = form.phone.value.trim();
    if (name.length < 2) { form.name.classList.add('err'); return showToast("Введіть ім'я", true); }
    if (phone.replace(/\D/g, '').length < 12) { form.phone.classList.add('err'); return showToast('Введіть коректний номер телефону', true); }
    const btn = $('button[type=submit]', form), old = btn.textContent;
    btn.disabled = true; btn.textContent = 'Надсилаємо...';
    const source = form.id === 'mForm' ? (modalSource || 'Модальне вікно') : (form.dataset.source || 'Сайт');
    try {
      await sendToTelegram(name, phone, source);
      form.reset(); closeAll();
      store.set('ns_lead_sent');
      location.hash = '#/thanks';
    } catch (err) {
      console.error(err);
      showToast('Помилка відправки. Зателефонуйте нам: +38 (067) 448-81-78', true);
    } finally { btn.disabled = false; btn.textContent = old; }
  });
});

/* ---- Спливаюче вікно з формою через 2 хвилини ---- */
const POPUP_DELAY = 2 * 60 * 1000;   // 2 хвилини
function popupTick() {
  if (store.get('ns_popup_done') || store.get('ns_lead_sent') || view === 'thanks') return;
  const a = document.activeElement;
  const busy = modal.classList.contains('open') || drawer.classList.contains('open') || (a && a.matches && a.matches('input'));
  if (busy) return setTimeout(popupTick, 15000);   // не заважаємо, якщо людина щось робить — спробуємо трохи згодом
  store.set('ns_popup_done');                      // показуємо лише один раз за візит
  openModal('timer', 'Спливаюче вікно (2 хв)', true);
}
if (!store.get('ns_popup_done') && !store.get('ns_lead_sent')) setTimeout(popupTick, POPUP_DELAY);

initPlaceholders();
route();
