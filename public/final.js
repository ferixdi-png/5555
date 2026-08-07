(() => {
  const loadCss = href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;document.head.appendChild(l);
  };
  loadCss('/why.css');
  loadCss('/compact.css');

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const tg='https://t.me/ferixdiii';

  // Remove legacy sections from previous experiments if they ever appear.
  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail'].forEach(sel=>$$(sel).forEach(el=>el.remove()));

  const discovery=$('.discovery-badge');
  if(discovery) discovery.textContent='НАШЁЛ ВАРИАНТ С РЕАЛЬНЫМ ПОЛНЫМ БЕЗЛИМИТОМ ↓';
  const heroLead=$('.hero-lead');
  if(heroLead) heroLead.innerHTML='Это не большой пакет кредитов и не тариф, где приходится считать каждую попытку. <strong>В рамках месячного доступа — полный безлимит на генерацию AI-видео.</strong> Я пользуюсь этим сам и ниже показываю реальные результаты.';
  const heroNote=$('.hero-note');
  if(heroNote) heroNote.textContent='Одна генерация — 8 секунд в 1080p. Русский lip-sync работает достойно. Длинные ролики собираются из нескольких сцен в CapCut или любом редакторе.';

  const unlimitedHead=$('#unlimited .section-head');
  if(unlimitedHead){
    const h2=$('h2',unlimitedHead),p=$('p',unlimitedHead);
    if(h2) h2.innerHTML='Полный безлимит.<br><em>Не «много кредитов».</em>';
    if(p) p.textContent='Самое ценное для меня — перестаёшь экономить на идеях. Не понравился дубль — запускаешь следующий. Хочется проверить другой ракурс, героя или подачу — проверяешь. Баланс больше не диктует, когда остановиться.';
    if(!$('.unlimited-emphasis',unlimitedHead)) unlimitedHead.insertAdjacentHTML('beforeend','<div class="unlimited-emphasis"><b>ПОЛНЫЙ БЕЗЛИМИТ</b><b>БЕЗ КРЕДИТОВ</b><b>1080P</b><b>8 СЕКУНД</b><b>RU LIP-SYNC</b></div>');
  }

  const techP=$('#technology .section-head p');
  if(techP) techP.textContent='Я делюсь не только самим доступом. Показываю свой рабочий процесс: как придумать сцену, как не перегружать промпт, когда перегенерировать дубль и как собрать несколько восьмисекундных сцен в один длинный ролик.';
  const longP=$('#longform .section-head p');
  if(longP) longP.textContent='Один клип — 8 секунд. Но итоговый ролик может быть любой длины: разбиваешь идею на сцены и соединяешь их в CapCut, Premiere, DaVinci или любом другом редакторе.';
  const lipP=$('#lipsync .voice-copy p');
  if(lipP) lipP.textContent='Русский язык я проверял отдельно. На коротких репликах lip-sync получается достаточно уверенно для UGC, мини-диалогов, объясняющих сцен и роликов с говорящими персонажами.';

  const truthParas=$$('#truth .truth-copy p');
  if(truthParas[0]) truthParas[0].textContent='Сразу скажу как есть: в тяжёлой физике, сложных сценах и стабильности мелких деталей топовые модели вроде Seedance могут быть сильнее. Я не пытаюсь выдать этот вариант за абсолютный максимум качества.';
  if(truthParas[1]) truthParas[1].innerHTML='Но для UGC, рекламных креативов, красивых перебивок, мемных сцен, тестов идей и контента с русской речью связка <strong>1080p + 8 секунд + полный безлимит</strong> даёт очень много свободы.';

  const navLinks=$('.nav-links');
  if(navLinks && !navLinks.querySelector('a[href="#why"]')) navLinks.insertAdjacentHTML('beforeend','<a href="#why">Зачем</a>');
  const navCta=$('.nav-cta');
  if(navCta){navCta.textContent='Напиши мне — дам гайд';navCta.href=tg;navCta.target='_blank';navCta.rel='noopener';}
  const heroActions=$('.hero-actions');
  if(heroActions && !$('.hero-tg',heroActions)) heroActions.insertAdjacentHTML('beforeend',`<a class="button button-ghost hero-tg" href="${tg}" target="_blank" rel="noopener">Напиши мне — всё расскажу ↗</a>`);

  const community=$('.community') || $('#contact');
  if(community && !$('#why')){
    const why=document.createElement('section');
    why.id='why';why.className='why section';
    why.innerHTML=`
      <div class="section-head reveal visible">
        <div class="kicker">ЗАЧЕМ ТЕБЕ ЭТО</div>
        <h2>Не ради кнопки Generate.<br><em>Ради свободы пробовать.</em></h2>
        <p>Когда каждая новая попытка не ощущается как расход, нейросеть становится нормальным рабочим инструментом: можно искать идеи, делать варианты и спокойно выбирать лучшее.</p>
      </div>
      <div class="why-grid">
        <article class="why-card reveal visible why-creative"><span class="why-index">01</span><div class="why-icon">✦</div><h3>Творчество</h3><p>Проверять необычных персонажей, сцены, стили и визуальные идеи без мысли «жалко ещё одну генерацию».</p><div class="why-tags"><b>идеи</b><b>визуал</b><b>эксперименты</b></div></article>
        <article class="why-card reveal visible why-sales"><span class="why-index">02</span><div class="why-icon">↗</div><h3>Продающие видео</h3><p>UGC, товарные кадры, хуки, разные подачи одного оффера и серии вариантов под рекламу.</p><div class="why-tags"><b>UGC</b><b>ads</b><b>product</b></div></article>
        <article class="why-card reveal visible why-speed"><span class="why-index">03</span><div class="why-icon">∞</div><h3>Работа с клиентами</h3><p>Показывать не один случайный дубль, а несколько направлений и вместе выбирать сильнейшее.</p><div class="why-tags"><b>варианты</b><b>клиенты</b><b>скорость</b></div></article>
        <article class="why-card reveal visible why-skill"><span class="why-index">04</span><div class="why-icon">◉</div><h3>Практика</h3><p>Чем больше реальных генераций, тем быстрее начинаешь понимать камеру, свет, движение и формулировку промпта.</p><div class="why-tags"><b>prompting</b><b>насмотренность</b><b>рост</b></div></article>
      </div>
      <div class="why-bottom reveal visible"><div class="why-bottom-mark">∞</div><div><strong>Ценность безлимита — в количестве попыток между идеей и сильным результатом.</strong><p>Можно спокойно перебрать десятки решений и оставить то, что реально хочется публиковать, показывать клиенту или использовать в рекламе.</p></div></div>`;
    community.parentNode.insertBefore(why,community);
  }

  // Telegram is the primary conversation path. The phone form remains optional.
  const contactText=$('#contact .contact-copy>p');
  if(contactText) contactText.textContent='Просто напиши мне в Telegram — отправлю гайд, объясню, как всё устроено, и расскажу, как я сделал ролики на этой странице. Если удобнее голосом — можешь оставить номер справа.';
  const tgBtn=$('.button-telegram');
  if(tgBtn){tgBtn.href=tg;tgBtn.innerHTML='<span class="tg-icon">↗</span>Напиши мне — дам гайд<small>@ferixdiii</small>';}
  const formLabel=$('#contact .form-label');
  if(formLabel) formLabel.textContent='ИЛИ ОСТАВЬ НОМЕР — Я ПЕРЕЗВОНЮ';

  if(!$('.telegram-float')){
    const a=document.createElement('a');
    a.className='telegram-float';a.href=tg;a.target='_blank';a.rel='noopener';
    a.innerHTML='<span>Напиши мне в Telegram <small>дам гайд и всё расскажу</small></span>';
    document.body.appendChild(a);
  }

  // Small quality badge on real videos. No animation.
  requestAnimationFrame(()=>{
    $$('.video-card').forEach((card,i)=>{
      if($('.original-badge',card)) return;
      const badge=document.createElement('div');
      badge.className='original-badge';badge.innerHTML='<i></i>1080P <span>ORIGINAL</span>';
      card.appendChild(badge);
      card.setAttribute('aria-label',`Реальный пример ${i+1}, исходное видео 1080p`);
    });
  });

  // Keep the previously requested audio behavior without adding visual controls.
  const audio=$('#autoAudio');
  if(audio){
    audio.volume=.9;
    const tryPlay=()=>audio.play().catch(()=>{});
    addEventListener('load',tryPlay,{once:true});
    ['pointerdown','touchstart','keydown','scroll'].forEach(evt=>addEventListener(evt,tryPlay,{once:true,passive:true}));
  }
})();
