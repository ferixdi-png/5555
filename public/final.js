(() => {
  const whyCss = document.createElement('link');
  whyCss.rel = 'stylesheet';
  whyCss.href = '/why.css';
  document.head.appendChild(whyCss);

  const $ = (s, r=document) => r.querySelector(s);
  const navLinks = $('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="#why"]')) navLinks.insertAdjacentHTML('beforeend','<a href="#why">Зачем</a>');

  const discovery = $('.discovery-badge');
  if (discovery) discovery.textContent = 'НАШЁЛ ВАРИАНТ, КОТОРЫМ САМ ПОЛЬЗУЮСЬ ↓';

  const heroLead = $('.hero-lead');
  if (heroLead) heroLead.innerHTML = 'Я искал не очередной сервис с красивой витриной, а вариант, где можно <strong>реально много генерировать и не смотреть каждые пять минут на остаток кредитов</strong>. Нашёл рабочий доступ и собрал эту страницу, чтобы показать результат без лишней теории.';

  const heroNote = $('.hero-note');
  if (heroNote) heroNote.textContent = 'Платформу на странице специально не называю. Здесь важнее показать, что получается на практике, в каком качестве и как я использую этот доступ в работе.';

  const unlimitedHead = $('#unlimited .section-head');
  if (unlimitedHead) {
    const h2 = unlimitedHead.querySelector('h2');
    const p = unlimitedHead.querySelector('p');
    if (h2) h2.innerHTML = 'Безлимит нужен не ради красивого <em>значка ∞.</em>';
    if (p) p.textContent = 'Главное меняется в самом подходе. Когда каждая попытка не ощущается как расход, можно спокойно искать лучший кадр: сделать десять вариантов, поменять свет, ракурс, героя, темп — и оставить только действительно удачное.';
  }

  const worksCopy = $('#works .section-head.split > p');
  if (worksCopy) worksCopy.textContent = 'Здесь я собираю реальные ролики из этого доступа. Не отборные демо самой платформы, а обычные мои тесты: люди, предметка, реклама, русский lip-sync, странные идеи и просто красивые сцены. Можно открыть любой пример крупно и самому оценить результат.';

  const techHead = $('#technology .section-head');
  if (techHead) {
    const p = techHead.querySelector('p');
    if (p) p.textContent = 'Я не хочу просто дать доступ и оставить человека один на один с пустым полем промпта. Показываю свой рабочий процесс: как придумать сцену, что написать модели, когда лучше перегенерировать и как потом собрать несколько клипов в один нормальный ролик.';
  }

  const lipCopy = $('#lipsync .voice-copy p');
  if (lipCopy) lipCopy.textContent = 'Отдельно проверял русский язык, потому что для меня это один из главных практических тестов. На коротких репликах lip-sync получается достаточно уверенно, чтобы делать UGC, мини-диалоги, объясняющие ролики и сценки, а не только немые красивые кадры.';

  const longCopy = $('#longform .section-head p');
  if (longCopy) longCopy.textContent = 'Один клип — 8 секунд. Но никто не заставляет заканчивать историю на восьмой секунде. Я просто разбиваю идею на сцены и склеиваю их в CapCut или любом другом редакторе. Так из коротких генераций получается длинный ролик.';

  const truthParas = document.querySelectorAll('#truth .truth-copy p');
  if (truthParas[0]) truthParas[0].textContent = 'Сразу скажу как есть: по сложной физике, стабильности деталей и тяжёлым сценам Seedance и другие топовые модели могут быть сильнее. Поэтому сравнивать их один в один было бы странно.';
  if (truthParas[1]) truthParas[1].innerHTML = 'Но здесь другая экономика и другой сценарий использования. <strong>1080p, 8 секунд, нормальный русский lip-sync и возможность делать много попыток</strong> — для UGC, креативов, рекламы, мемных роликов, B-roll и тестов идей этого уже более чем достаточно во многих задачах.';

  const contactText = $('#contact .contact-copy > p');
  if (contactText) contactText.textContent = 'Если интересно — оставь номер или напиши мне в Telegram. Я сам объясню, как всё устроено, покажу нюансы и скажу, подойдёт ли тебе такой вариант под твои задачи. Без менеджеров и длинной переписки.';

  const community = $('.community');
  if (community && !$('#why')) {
    const why = document.createElement('section');
    why.id = 'why';
    why.className = 'why section';
    why.innerHTML = `
      <div class="section-head reveal visible">
        <div class="kicker">08 — ЗАЧЕМ ТЕБЕ ЭТО</div>
        <h2>Не просто «поиграться с нейронкой».<br><em>Это рабочая творческая среда.</em></h2>
        <p>Я бы смотрел на такой безлимит не как на одну конкретную модель, а как на возможность постоянно что-то пробовать. Чем больше вариантов ты можешь сделать без страха потратить кредиты, тем быстрее находишь идеи, которые реально цепляют.</p>
      </div>
      <div class="why-grid">
        <article class="why-card reveal visible tilt why-creative"><span class="why-index">01</span><div class="why-icon">✦</div><h3>Для творчества</h3><p>Можно проверять странные идеи, визуальные образы, необычных персонажей и сцены, которые ты бы не стал тестировать, если бы каждая попытка стоила денег.</p><div class="why-tags"><b>идеи</b><b>визуал</b><b>эксперименты</b></div></article>
        <article class="why-card reveal visible tilt why-sales"><span class="why-index">02</span><div class="why-icon">↗</div><h3>Для продающих видео</h3><p>Делать UGC, товарные сцены, первые три секунды рекламного креатива, разные офферы и несколько визуальных вариантов под один продукт — а потом оставлять тот, который выглядит сильнее.</p><div class="why-tags"><b>UGC</b><b>ads</b><b>product</b></div></article>
        <article class="why-card reveal visible tilt why-speed"><span class="why-index">03</span><div class="why-icon">∞</div><h3>Для скорости работы</h3><p>Когда клиенту нужны варианты, не приходится долго защищать один-единственный дубль. Можно быстро сделать серию направлений, показать выбор и двигаться дальше.</p><div class="why-tags"><b>варианты</b><b>клиенты</b><b>быстрее</b></div></article>
        <article class="why-card reveal visible tilt why-skill"><span class="why-index">04</span><div class="why-icon">◉</div><h3>Для собственного роста</h3><p>Насмотренность и навык промптинга растут только через практику. Сто генераций дают больше понимания камеры, света и композиции, чем десять сохранённых туториалов.</p><div class="why-tags"><b>насмотренность</b><b>prompting</b><b>практика</b></div></article>
      </div>
      <div class="why-bottom reveal visible"><div class="why-bottom-mark">100×</div><div><strong>Главная ценность — не в том, что можно нажать «Generate» бесконечно.</strong><p>Ценность в том, что ты можешь перебрать десятки решений и найти одно, которое действительно стоит публиковать, показывать клиенту или использовать в рекламе.</p></div></div>
    `;
    community.parentNode.insertBefore(why, community);
  }

  const audio = document.getElementById('autoAudio');
  if (audio) {
    audio.volume = 0.9;
    const tryPlay = () => audio.play().catch(() => {});
    addEventListener('load', tryPlay, { once:true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    ['pointerdown','touchstart','keydown','scroll'].forEach(evt => addEventListener(evt, tryPlay, { once:true, passive:true }));
  }

  const bar = document.createElement('div');
  bar.className = 'page-progress';
  document.body.appendChild(bar);
  const paintProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', paintProgress, { passive:true });
  addEventListener('resize', paintProgress, { passive:true });
  paintProgress();

  document.querySelectorAll('.video-card').forEach((card, i) => {
    const badge = document.createElement('div');
    badge.className = 'original-badge';
    badge.innerHTML = '<i></i>1080P <span>ORIGINAL</span>';
    card.appendChild(badge);
    card.setAttribute('aria-label', `Реальный пример ${i + 1}, исходное видео 1080p`);
  });

  const style = document.createElement('style');
  style.textContent = `
    .page-progress{position:fixed;z-index:100;left:0;right:0;top:0;height:2px;transform-origin:left center;background:linear-gradient(90deg,#dfff68,#68e8ff,#9d83ff);box-shadow:0 0 14px rgba(104,232,255,.45);pointer-events:none}
    .original-badge{position:absolute;z-index:4;right:14px;top:14px;display:flex;align-items:center;gap:5px;padding:6px 8px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(5,7,11,.56);backdrop-filter:blur(12px);font-size:8px;font-weight:900;letter-spacing:.08em;color:#fff;pointer-events:none}
    .original-badge i{width:5px;height:5px;border-radius:50%;background:#dfff68;box-shadow:0 0 10px #dfff68}.original-badge span{color:#7f8795}
  `;
  document.head.appendChild(style);
})();