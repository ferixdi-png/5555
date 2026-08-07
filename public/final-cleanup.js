(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const tg='https://t.me/religantno?text='+encodeURIComponent('Хочу безлимит');

  function run(){
    // Remove legacy or redundant blocks completely.
    $('#why')?.remove();
    $('.nav-links a[href="#why"]')?.remove();
    $('.hero-tg')?.remove();
    $('.marquee')?.remove();
    $('.price-line')?.remove();
    $('.contact-or')?.remove();
    $('.zero-card.accent')?.remove();
    $('#contact')?.remove();

    const status=$('.status-pill');
    if(status) status.innerHTML='<i></i> 1 990 ₽ · ПОЛНЫЙ БЕЗЛИМИТ · 1 МЕСЯЦ';

    const discovery=$('.discovery-badge');
    if(discovery) discovery.textContent='ПОЛНЫЙ БЕЗЛИМИТ НА ГЕНЕРАЦИЮ AI-ВИДЕО';

    const lead=$('.hero-lead');
    if(lead) lead.innerHTML='<strong>1 990 ₽ — полный безлимит на генерацию AI-видео на месяц.</strong> Без кредитов и подсчёта каждой попытки. Генерируешь, переделываешь и тестируешь столько вариантов, сколько нужно в рамках доступа.';

    if(!$('.hero-price-chip')){
      const leadEl=$('.hero-lead');
      if(leadEl) leadEl.insertAdjacentHTML('afterend','<div class="hero-price-chip"><i></i><strong>1 990 ₽ / месяц</strong><span>полный безлимит без кредитов</span></div>');
    }

    const unlimitedH=$('#unlimited .section-head h2');
    const unlimitedP=$('#unlimited .section-head p');
    if(unlimitedH) unlimitedH.innerHTML='1 990 ₽ в месяц.<br><em>И просто генерируешь.</em>';
    if(unlimitedP) unlimitedP.textContent='Это именно полный безлимит на генерацию AI-видео в рамках месячного доступа: не пакет кредитов и не запас попыток. Не понравился дубль — делаешь следующий и не считаешь, сколько осталось.';

    const primary=$('.hero-actions .button-primary');
    if(primary){primary.href=tg;primary.target='_blank';primary.rel='noopener';primary.innerHTML='Забрать безлимит за 1 990 ₽ <span>↗</span>';}
    const secondary=$('.hero-actions .button-ghost');
    if(secondary){secondary.textContent='Смотреть реальные видео';secondary.href='#works';secondary.removeAttribute('target');}

    const trigger=$('.hero-trigger span');
    if(trigger) trigger.innerHTML='Хочешь забрать доступ или есть вопросы? <b>Просто напиши мне «Хочу безлимит»</b>. Я лично объясню подключение и покажу, как всё устроено.';

    const navCta=$('.nav-cta');
    if(navCta){navCta.href=tg;navCta.target='_blank';navCta.rel='noopener';navCta.textContent=innerWidth<520?'Забрать ↗':'Забрать за 1 990 ₽';}

    // Authoritative copy: this is a tool used in real work, not a one-off test.
    const lipTitle=$('#lipsync .voice-copy h2');
    const lipP=$('#lipsync .voice-copy p');
    if(lipTitle) lipTitle.innerHTML='Русский lip-sync — <em>рабочий инструмент.</em>';
    if(lipP) lipP.textContent='Русский lip-sync здесь работает уверенно для коротких реплик, UGC, мини-диалогов, объясняющих сцен и роликов с говорящими персонажами. Это один из сценариев, для которых я регулярно использую этот доступ.';

    const audienceTitle=$('#audience .section-head h2');
    const audienceP=$('#audience .section-head p');
    if(audienceTitle) audienceTitle.innerHTML='Доступ можно забрать с нуля.<br><em>И использовать под рабочие задачи.</em>';
    if(audienceP) audienceP.textContent='Если только начинаешь — можно сразу генерировать и разбираться на практике. Если уже работаешь с AI-видео — безлимит удобно использовать там, где нужны десятки итераций, дублей и быстрых вариантов.';

    const firstAudience=$('.audience-card:first-child .audience-label');
    if(firstAudience) firstAudience.textContent='ЕСЛИ НАЧИНАЕШЬ С НУЛЯ';
    const secondAudience=$('.audience-card:nth-child(2) .audience-label');
    if(secondAudience) secondAudience.textContent='ЕСЛИ УЖЕ РАБОТАЕШЬ С AI-ВИДЕО';

    const expertTrigger=$('.message-trigger strong');
    if(expertTrigger) expertTrigger.textContent='Просто напиши: «Хочу безлимит»';
    const expertButton=$('.expert-actions .button-primary');
    if(expertButton){expertButton.textContent='Забрать доступ у Ferixdi ↗';expertButton.href=tg;expertButton.target='_blank';expertButton.rel='noopener';}

    const audienceButton=$('.audience-bottom .button');
    if(audienceButton){audienceButton.textContent='Спросить про доступ →';audienceButton.href=tg;audienceButton.target='_blank';audienceButton.rel='noopener';}

    [navCta,primary,$('.telegram-float'),expertButton,audienceButton].filter(Boolean).forEach(a=>{
      a.href=tg;a.target='_blank';a.rel='noopener';
    });

    const floating=$('.telegram-float');
    if(floating) floating.innerHTML='<span>Хочу безлимит <small>написать Ferixdi в Telegram</small></span>';

    $$('.audience-photo,.expert-photo,.hero-author-card').forEach(box=>box.classList.add('full-art'));
  }

  run();
  document.addEventListener('DOMContentLoaded',run,{once:true});
  addEventListener('load',run,{once:true});
  setTimeout(run,80);
  setTimeout(run,500);
  addEventListener('resize',()=>{const a=$('.nav-cta');if(a)a.textContent=innerWidth<520?'Забрать ↗':'Забрать за 1 990 ₽';},{passive:true});
})();
