(() => {
  const loadCss = href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;document.head.appendChild(l);
  };
  loadCss('/compact.css');
  loadCss('/final-tight.css?v=20260807-clean-final');

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const tg='https://t.me/ferixdiii?text='+encodeURIComponent('Хочу безлимит');

  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail','#why'].forEach(sel=>$$(sel).forEach(el=>el.remove()));
  $('.nav-links a[href="#why"]')?.remove();

  const techP=$('#technology .section-head p');
  if(techP) techP.textContent='Вместе с доступом показываю рабочий процесс: как придумать сцену, не перегрузить промпт, сделать нужное количество дублей и собрать несколько восьмисекундных сцен в один длинный ролик.';
  const longP=$('#longform .section-head p');
  if(longP) longP.textContent='Один клип — 8 секунд. Итоговый ролик может быть любой длины: разбиваешь идею на сцены и соединяешь их в CapCut, Premiere, DaVinci или любом другом редакторе.';

  const truthParas=$$('#truth .truth-copy p');
  if(truthParas[0]) truthParas[0].textContent='Сразу скажу как есть: в тяжёлой физике, сложных сценах и стабильности мелких деталей топовые модели вроде Seedance могут быть сильнее. Этот доступ не пытается заменить вообще все модели.';
  if(truthParas[1]) truthParas[1].innerHTML='Но для UGC, рекламных креативов, красивых перебивок, мемных сцен, тестов идей и контента с русской речью связка <strong>1080p + 8 секунд + полный безлимит</strong> даёт очень много свободы.';

  if(!$('.telegram-float')){
    const a=document.createElement('a');
    a.className='telegram-float';a.href=tg;a.target='_blank';a.rel='noopener';
    a.innerHTML='<span>Хочу безлимит <small>написать Ferixdi в Telegram</small></span>';
    document.body.appendChild(a);
  }

  requestAnimationFrame(()=>{
    $$('.video-card').forEach((card,i)=>{
      if($('.original-badge',card)) return;
      const badge=document.createElement('div');
      badge.className='original-badge';badge.innerHTML='<i></i>1080P <span>ORIGINAL</span>';
      card.appendChild(badge);
      card.setAttribute('aria-label',`Реальный пример ${i+1}, исходное видео 1080p`);
    });
  });

  const audio=$('#autoAudio');
  if(audio){
    audio.volume=.9;
    const tryPlay=()=>audio.play().catch(()=>{});
    addEventListener('load',tryPlay,{once:true});
    ['pointerdown','touchstart','keydown','scroll'].forEach(evt=>addEventListener(evt,tryPlay,{once:true,passive:true}));
  }

  if(!document.querySelector('script[data-final-cleanup]')){
    const s=document.createElement('script');
    s.src='/final-cleanup.js?v=20260807-clean-final';
    s.async=false;
    s.dataset.finalCleanup='1';
    document.body.appendChild(s);
  }
})();
