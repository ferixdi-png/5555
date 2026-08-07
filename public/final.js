(() => {
  const loadCss = href => {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const l=document.createElement('link');
    l.rel='stylesheet';l.href=href;document.head.appendChild(l);
  };
  loadCss('/compact.css');
  loadCss('/final-tight.css?v=20260807-clean-final');
  loadCss('/mobile-video-fix.css?v=20260807-safe-player');
  loadCss('/browser-compat.css?v=20260807-pointer-compat');
  loadCss('/final-center.css?v=20260807-center-final');

  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const tg='https://t.me/ferixdiii?text='+encodeURIComponent('Хочу безлимит');

  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail','#why'].forEach(sel=>$$(sel).forEach(el=>el.remove()));
  $('.nav-links a[href="#why"]')?.remove();

  const techP=$('#technology .section-head p');
  if(techP) techP.textContent='Вместе с доступом показываю рабочий процесс: как придумать сцену, не перегрузить промпт, сделать нужное количество дублей и собрать несколько восьмисекундных сцен в один длинный ролик.';
  const longP=$('#longform .section-head p');
  if(longP) longP.textContent='Один клип — 8 секунд. Итоговый ролик может быть любой длины: разбиваешь идею на сцены и соединяешь их в CapCut, Premiere, DaVinci или любом другом редакторе.';

  const truthTitle=$('#truth .truth-copy h2');
  const truthParas=$$('#truth .truth-copy p');
  if(truthTitle) truthTitle.innerHTML='Seedance может быть сильнее.<br><em>Но экономика — боль.</em>';
  if(truthParas[0]) truthParas[0].textContent='Да, в тяжёлой физике, сложных сценах и мелких деталях Seedance часто выглядит сильнее. Но там снова считаешь кредиты и думаешь, стоит ли запускать ещё один дубль. В некоторых сервисах несколько попыток ради одного удачного ролика легко подбираются к цене целого месяца этого безлимита.';
  if(truthParas[1]) truthParas[1].innerHTML='И с русской речью Seedance далеко не идеален: lip-sync и короткие русские реплики заметно менее предсказуемы. Здесь ставка другая — <strong>1080p, рабочий русский lip-sync и полный безлимит на месяц</strong>. Не понравилось — переделал. Нужен ещё дубль — сделал. И не смотришь каждый раз на остаток кредитов.';

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
    const desktopMedia=matchMedia('(hover:hover) and (pointer:fine)').matches;
    if(desktopMedia){
      const tryPlay=()=>audio.play().catch(()=>{});
      addEventListener('load',tryPlay,{once:true});
      ['pointerdown','keydown','scroll'].forEach(evt=>addEventListener(evt,tryPlay,{once:true,passive:true}));
    }else{
      audio.pause();
      audio.autoplay=false;
    }
  }

  if(!document.querySelector('script[data-final-cleanup]')){
    const s=document.createElement('script');
    s.src='/final-cleanup.js?v=20260807-center-final';
    s.async=false;
    s.dataset.finalCleanup='1';
    document.body.appendChild(s);
  }
})();
