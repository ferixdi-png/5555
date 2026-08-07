(() => {
  const loadCss = href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l = document.createElement('link'); l.rel = 'stylesheet'; l.href = href; document.head.appendChild(l);
  };
  loadCss('/why.css');
  loadCss('/compact.css');
  loadCss('/scroll-story.css');

  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const tg = 'https://t.me/ferixdiii';

  const discovery = $('.discovery-badge');
  if (discovery) discovery.textContent = 'НАШЁЛ ВАРИАНТ С РЕАЛЬНЫМ ПОЛНЫМ БЕЗЛИМИТОМ ↓';
  const heroLead = $('.hero-lead');
  if (heroLead) heroLead.innerHTML = 'Главное здесь не скидка на генерации и не большой пакет кредитов. <strong>Это полный безлимит на AI-видео в рамках месячного доступа: без кредитов, без пакетов попыток и без счётчика генераций.</strong> Я пользуюсь этим сам и ниже показываю, что реально получается.';
  const heroNote = $('.hero-note');
  if (heroNote) heroNote.textContent = 'Одна генерация — 8 секунд в 1080p. Сколько генераций делать в рамках доступа — не приходится считать по кредитам. Название платформы здесь специально не раскрываю.';

  const unlimitedHead = $('#unlimited .section-head');
  if (unlimitedHead) {
    const h2 = unlimitedHead.querySelector('h2');
    const p = unlimitedHead.querySelector('p');
    if (h2) h2.innerHTML = 'Полный безлимит.<br><em>Не «много кредитов».</em>';
    if (p) p.textContent = 'Для меня это самое важное отличие. Не надо открывать баланс перед каждой идеей и решать, жалко ли тратить ещё одну попытку. Не нравится дубль — делаешь следующий. Хочется проверить другую подачу — проверяешь. Весь смысл в свободе нормально экспериментировать.';
    if (!unlimitedHead.querySelector('.unlimited-emphasis')) unlimitedHead.insertAdjacentHTML('beforeend', '<div class="unlimited-emphasis"><b>ПОЛНЫЙ БЕЗЛИМИТ</b><b>БЕЗ КРЕДИТОВ</b><b>БЕЗ ПАКЕТОВ ПОПЫТОК</b><b>БЕЗ СЧЁТЧИКА ГЕНЕРАЦИЙ</b></div>');
  }

  const worksCopy = $('#works .section-head.split > p');
  if (worksCopy) worksCopy.textContent = 'Здесь только мои реальные тесты из этого доступа — не рекламные демо платформы. Я специально собираю разные задачи: люди, UGC, предметка, русский lip-sync, странные идеи и красивые сцены. Открой любой ролик крупно и оцени сам.';
  const techP = $('#technology .section-head p');
  if (techP) techP.textContent = 'Я делюсь не только самим вариантом доступа. Показываю свой рабочий процесс: как придумать сцену, как упростить промпт, когда перегенерировать дубль и как собрать несколько восьмисекундных сцен в один длинный ролик.';
  const longP = $('#longform .section-head p');
  if (longP) longP.textContent = 'Один клип — 8 секунд. Но история на этом не заканчивается: разбиваешь идею на сцены и склеиваешь их в CapCut, Premiere, DaVinci или любом редакторе. Шесть сцен — уже 48 секунд, дальше можно продолжать.';
  const lipP = $('#lipsync .voice-copy p');
  if (lipP) lipP.textContent = 'Русский язык я проверял отдельно, потому что для моих задач это критично. На коротких репликах lip-sync получается достаточно уверенно для UGC, мини-диалогов, объясняющих сцен и контента с говорящими персонажами.';

  const navLinks = $('.nav-links');
  if (navLinks && !navLinks.querySelector('a[href="#why"]')) navLinks.insertAdjacentHTML('beforeend','<a href="#why">Зачем</a>');
  const navCta = $('.nav-cta');
  if (navCta) { navCta.textContent = 'Напиши мне — дам гайд'; navCta.href = tg; navCta.target = '_blank'; navCta.rel = 'noopener'; navCta.classList.add('tg-main-cta'); }
  const heroActions = $('.hero-actions');
  if (heroActions && !heroActions.querySelector('.hero-tg')) heroActions.insertAdjacentHTML('beforeend', `<a class="button button-ghost hero-tg" href="${tg}" target="_blank" rel="noopener">Напиши мне — всё расскажу ↗</a>`);
  const contactText = $('#contact .contact-copy > p');
  if (contactText) contactText.textContent = 'Хочешь разобраться без догадок — просто напиши мне. Отправлю гайд, объясню, как устроен доступ, покажу нюансы и скажу, для каких задач я бы его использовал. Никакой обязательной оплаты после сообщения.';
  if (!$('.telegram-float')) {
    const a = document.createElement('a');
    a.className = 'telegram-float'; a.href = tg; a.target = '_blank'; a.rel = 'noopener';
    a.innerHTML = '<span>Напиши мне в Telegram <small>дам гайд и всё расскажу</small></span>';
    document.body.appendChild(a);
  }

  const works = $('#works');
  if (works && !$('#scrollStory')) {
    const section = document.createElement('section');
    section.id = 'scrollStory'; section.className = 'scroll-story';
    section.innerHTML = `
      <div class="story-sticky">
        <div class="story-copy">
          <div class="story-kicker">SCROLL STORY / КАК Я ЭТО ИСПОЛЬЗУЮ</div>
          <h2>Листай страницу.<br><em>Ролик идёт вместе с тобой.</em></h2>
          <p class="story-intro">Это один реальный 8-секундный исходник. Скролл двигает его по кадрам вперёд и назад, а рядом — весь мой рабочий путь от идеи до длинного видео.</p>
          <div class="story-steps">
            <div class="story-step is-active" data-index="01"><strong>Придумал сцену</strong><span>Одна понятная идея вместо огромного технического промпта.</span></div>
            <div class="story-step" data-index="02"><strong>Получил 1080p / 8 сек</strong><span>Смотрю кадр, движение, лицо, речь и общую живость результата.</span></div>
            <div class="story-step" data-index="03"><strong>Не устроило — ещё дубль</strong><span>Вот здесь и чувствуется полный безлимит: кредиты не диктуют, когда остановиться.</span></div>
            <div class="story-step" data-index="04"><strong>Склеил историю</strong><span>Следующая сцена + следующая сцена → длинный ролик в обычном редакторе.</span></div>
          </div>
        </div>
        <div class="story-visual">
          <div class="story-frame" id="storyFrame">
            <div class="story-fallback"><div><strong>Загрузи video-01.mp4</strong><span>Он станет интерактивной scroll-сценой</span></div></div>
            <video class="story-video" id="storyVideo" src="/videos/video-01.mp4" muted playsinline preload="auto"></video>
            <div class="story-hud"><div><span class="hud-pill"><i></i>1080P ORIGINAL</span><span class="hud-pill">8 SEC</span></div><div><span class="hud-time" id="storyTime">00.00 / 08.00</span></div></div>
            <div class="story-caption"><small id="storyEyebrow">01 / ИДЕЯ</small><strong id="storyCaption">Одна понятная сцена.</strong></div>
            <div class="story-progress"><i id="storyProgress"></i></div>
          </div>
          <div class="story-scrollhint">СКРОЛЛ = ТАЙМЛАЙН</div>
        </div>
      </div>`;
    works.insertAdjacentElement('afterend', section);
  }

  const story = $('#scrollStory'), video = $('#storyVideo'), frame = $('#storyFrame'), prog = $('#storyProgress'), time = $('#storyTime');
  const caption = $('#storyCaption'), eyebrow = $('#storyEyebrow'), steps = $$('.story-step');
  const scenes = [['01 / ИДЕЯ','Одна понятная сцена.'],['02 / РЕЗУЛЬТАТ','1080p. Восемь секунд.'],['03 / БЕЗЛИМИТ','Не понравилось? Делаю ещё.'],['04 / МОНТАЖ','Несколько сцен → один ролик.']];
  let duration = 8, target = 0, raf = 0;
  if (video) {
    video.addEventListener('loadedmetadata', () => { duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : 8; frame?.classList.add('story-live'); });
    video.addEventListener('error', () => { video.style.display = 'none'; });
  }
  const clamp = (v,a,b) => Math.max(a,Math.min(b,v));
  const paintStory = () => {
    raf = 0; if (!story) return;
    const span = Math.max(1, story.offsetHeight - innerHeight);
    const p = clamp((scrollY - story.offsetTop) / span, 0, 1);
    target = p * duration;
    if (video && video.readyState >= 1 && Math.abs(video.currentTime - target) > .025) { try { video.currentTime = target; } catch {} }
    if (prog) prog.style.transform = `scaleX(${p})`;
    if (time) time.textContent = `${target.toFixed(2).padStart(5,'0')} / ${duration.toFixed(2).padStart(5,'0')}`;
    const idx = Math.min(3, Math.floor(p * 4));
    steps.forEach((el,i) => el.classList.toggle('is-active', i === idx));
    if (caption) caption.textContent = scenes[idx][1];
    if (eyebrow) eyebrow.textContent = scenes[idx][0];
    if (frame) frame.style.transform = `rotateX(${(p-.5)*1.8}deg) rotateY(${(.5-p)*2.5}deg) scale(${.985 + Math.sin(p*Math.PI)*.015})`;
  };
  const requestStory = () => { if (!raf) raf = requestAnimationFrame(paintStory); };
  addEventListener('scroll', requestStory, {passive:true}); addEventListener('resize', requestStory, {passive:true}); requestStory();

  const community = $('.community') || $('#contact');
  if (community && !$('#why')) {
    const why = document.createElement('section'); why.id='why'; why.className='why section';
    why.innerHTML = `<div class="section-head reveal visible"><div class="kicker">ЗАЧЕМ ТЕБЕ ЭТО</div><h2>Не ради кнопки Generate.<br><em>Ради количества сильных идей.</em></h2><p>Безлимит меняет не только расход. Он даёт возможность нормально перебирать варианты — а именно из вариантов обычно и рождается кадр, который хочется оставить.</p></div><div class="why-grid"><article class="why-card reveal visible tilt why-creative"><span class="why-index">01</span><div class="why-icon">✦</div><h3>Творчество</h3><p>Проверять необычных персонажей, сцены, стили и визуальные идеи, которые раньше было жалко тестировать.</p><div class="why-tags"><b>идеи</b><b>визуал</b><b>эксперименты</b></div></article><article class="why-card reveal visible tilt why-sales"><span class="why-index">02</span><div class="why-icon">↗</div><h3>Продающие видео</h3><p>UGC, товарные кадры, хуки, разные подачи одного оффера и пачка вариантов под рекламу.</p><div class="why-tags"><b>UGC</b><b>ads</b><b>product</b></div></article><article class="why-card reveal visible tilt why-speed"><span class="why-index">03</span><div class="why-icon">∞</div><h3>Работа с клиентами</h3><p>Не защищать единственный дубль, а быстро показать несколько направлений и выбрать лучшее вместе.</p><div class="why-tags"><b>варианты</b><b>клиенты</b><b>скорость</b></div></article><article class="why-card reveal visible tilt why-skill"><span class="why-index">04</span><div class="why-icon">◉</div><h3>Насмотренность</h3><p>Чем больше реальных генераций ты делаешь, тем быстрее начинаешь понимать камеру, свет, движение и формулировку промпта.</p><div class="why-tags"><b>практика</b><b>prompting</b><b>рост</b></div></article></div><div class="why-bottom reveal visible"><div class="why-bottom-mark">∞</div><div><strong>Полный безлимит ценен не числом на тарифе.</strong><p>Он ценен тем, что между идеей и удачным результатом больше не стоит мысль «жалко тратить ещё одну генерацию».</p></div></div>`;
    community.parentNode.insertBefore(why, community);
  }

  const audio = $('#autoAudio');
  if (audio) { audio.volume=.9; const play=()=>audio.play().catch(()=>{}); addEventListener('load',play,{once:true}); document.addEventListener('visibilitychange',()=>{if(!document.hidden)play()}); ['pointerdown','touchstart','keydown','scroll'].forEach(e=>addEventListener(e,play,{once:true,passive:true})); }

  let pageBar = $('.page-progress'); if (!pageBar) { pageBar=document.createElement('div'); pageBar.className='page-progress'; document.body.appendChild(pageBar); }
  const pageProgress=()=>{const m=document.documentElement.scrollHeight-innerHeight;pageBar.style.transform=`scaleX(${m>0?scrollY/m:0})`}; addEventListener('scroll',pageProgress,{passive:true}); addEventListener('resize',pageProgress,{passive:true}); pageProgress();
  const badgeCards=()=>$$('.video-card').forEach((card,i)=>{if(card.querySelector('.original-badge'))return; const b=document.createElement('div');b.className='original-badge';b.innerHTML='<i></i>1080P <span>ORIGINAL</span>';card.appendChild(b);card.setAttribute('aria-label',`Реальный пример ${i+1}, исходное видео 1080p`)});
  badgeCards(); new MutationObserver(badgeCards).observe(document.body,{childList:true,subtree:true});

  const style=document.createElement('style');style.textContent='.page-progress{position:fixed;z-index:100;left:0;right:0;top:0;height:2px;transform-origin:left;background:linear-gradient(90deg,#dfff68,#68e8ff,#9d83ff);box-shadow:0 0 14px rgba(104,232,255,.45);pointer-events:none}.original-badge{position:absolute;z-index:4;right:12px;top:12px;display:flex;align-items:center;gap:5px;padding:5px 7px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(5,7,11,.56);backdrop-filter:blur(12px);font-size:8px;font-weight:900;letter-spacing:.07em;color:#fff;pointer-events:none}.original-badge i{width:5px;height:5px;border-radius:50%;background:#dfff68;box-shadow:0 0 10px #dfff68}.original-badge span{color:#7f8795}';document.head.appendChild(style);
})();