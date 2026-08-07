(() => {
  const $=(s,r=document)=>r.querySelector(s);
  const $$=(s,r=document)=>[...r.querySelectorAll(s)];
  const tg='https://t.me/ferixdiii?text='+encodeURIComponent('Хочу безлимит');

  function run(){
    $('#why')?.remove();
    $('.hero-tg')?.remove();
    $('.marquee')?.remove();
    $('.price-line')?.remove();
    $('.contact-or')?.remove();

    const status=$('.status-pill');
    if(status) status.innerHTML='<i></i> 1 000 ₽ · ПОЛНЫЙ БЕЗЛИМИТ · 1 МЕСЯЦ';

    const discovery=$('.discovery-badge');
    if(discovery) discovery.textContent='ПОЛНЫЙ БЕЗЛИМИТ НА ГЕНЕРАЦИЮ AI-ВИДЕО';

    const lead=$('.hero-lead');
    if(lead) lead.innerHTML='<strong>1 000 ₽ — и на месяц получаешь полный безлимит на генерацию AI-видео.</strong> Без кредитов и подсчёта каждой попытки. Генерируешь, переделываешь и тестируешь столько вариантов, сколько нужно в рамках доступа.';

    if(!$('.hero-price-chip')){
      const leadEl=$('.hero-lead');
      if(leadEl) leadEl.insertAdjacentHTML('afterend','<div class="hero-price-chip"><i></i><strong>1 000 ₽ / месяц</strong><span>полный безлимит без кредитов</span></div>');
    }

    const unlimitedH=$('#unlimited .section-head h2');
    const unlimitedP=$('#unlimited .section-head p');
    if(unlimitedH) unlimitedH.innerHTML='1 000 ₽ в месяц.<br><em>И просто генерируешь.</em>';
    if(unlimitedP) unlimitedP.textContent='Это именно полный безлимит на генерацию AI-видео в рамках месячного доступа: не пакет кредитов и не запас попыток. Не понравился дубль — делаешь следующий и не считаешь, сколько осталось.';

    const primary=$('.hero-actions .button-primary');
    if(primary){primary.href=tg;primary.target='_blank';primary.rel='noopener';primary.innerHTML='Подключить безлимит за 1 000 ₽ <span>↗</span>';}
    const secondary=$('.hero-actions .button-ghost');
    if(secondary){secondary.textContent='Смотреть реальные видео';secondary.href='#works';secondary.removeAttribute('target');}

    const trigger=$('.hero-trigger span');
    if(trigger) trigger.innerHTML='Есть вопросы? <b>Просто напиши мне «Хочу безлимит»</b>. Я лично объясню, что к чему, покажу подключение и помогу начать.';

    const navCta=$('.nav-cta');
    if(navCta){navCta.href=tg;navCta.target='_blank';navCta.rel='noopener';navCta.textContent=innerWidth<520?'Подключить ↗':'Подключить за 1 000 ₽';}

    const expertTrigger=$('.message-trigger strong');
    if(expertTrigger) expertTrigger.textContent='Просто напиши: «Хочу безлимит»';

    const contactTitle=$('#contact .contact-copy h2');
    if(contactTitle) contactTitle.innerHTML='1 000 ₽ — <em>безлимит на месяц.</em>';
    const contactCopy=$('#contact .contact-main-copy') || $('#contact .contact-copy>p');
    if(contactCopy) contactCopy.textContent='Хочешь подключить — просто напиши мне «Хочу безлимит». Я лично расскажу, как всё устроено, покажу подключение и отвечу на вопросы. Можно сначала просто спросить — это ни к чему не обязывает.';
    const contactTrigger=$('.contact-trigger strong');
    if(contactTrigger) contactTrigger.textContent='«Хочу безлимит»';

    [navCta,primary,$('.button-telegram'),$('.telegram-float'),$('.expert-actions .button-primary'),$('.audience-bottom .button')].filter(Boolean).forEach(a=>{
      a.href=tg;a.target='_blank';a.rel='noopener';
    });
    const tgButton=$('.button-telegram');
    if(tgButton) tgButton.innerHTML='<span class="tg-icon">↗</span><span class="telegram-copy"><strong>Написать Ferixdi: «Хочу безлимит»</strong><span>откроется Telegram с готовым сообщением</span></span><small>@ferixdiii</small>';
    const floating=$('.telegram-float');
    if(floating) floating.innerHTML='<span>Хочу безлимит <small>написать Ferixdi в Telegram</small></span>';

    $$('.audience-photo,.expert-photo,.hero-author-card').forEach(box=>box.classList.add('full-art'));
  }

  run();
  document.addEventListener('DOMContentLoaded',run,{once:true});
  addEventListener('load',run,{once:true});
  setTimeout(run,80);
  setTimeout(run,500);
  addEventListener('resize',()=>{const a=$('.nav-cta');if(a)a.textContent=innerWidth<520?'Подключить ↗':'Подключить за 1 000 ₽';},{passive:true});
})();
