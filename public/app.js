(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const nav = $('#nav');
  const onScroll = () => nav?.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  // Small one-time entrances only. The continuous motion belongs to journey.js.
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, {threshold:.08, rootMargin:'0px 0px -4% 0px'});
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('visible'));
  }

  // Static voice visualization: no separate looping animation.
  const wave = $('#waveform');
  if (wave && !wave.children.length) {
    const heights=[20,31,18,43,29,54,34,22,48,64,35,26,57,39,23,45,68,42,31,55,36,24,49,61,37,27,52,41,22,46,65,38,29,56,34,25,48,59,35,23,50,40,27,44,32,21];
    heights.forEach(h => {
      const b=document.createElement('i');
      b.style.height=h+'px';
      b.style.animation='none';
      wave.appendChild(b);
    });
  }

  const labels = [
    ['CINEMATIC','Киношная сцена'],['UGC','Живой персонаж'],['PRODUCT','Реклама продукта'],
    ['VIRAL','Вирусная идея'],['RU VOICE','Русская речь'],['POV','POV / смартфон'],
    ['STORY','Сторителлинг'],['FOOD','Предметная сцена'],['ANIMAL','Животные'],
    ['CITY','Город / атмосфера'],['MEME','Абсурд'],['ADS','Рекламный креатив'],
    ['REALISM','Фотореализм'],['CAMERA','Движение камеры'],['DIALOGUE','Диалог'],
    ['NATURE','Природа'],['FASHION','Fashion'],['MACRO','Macro'],
    ['EXPERIMENT','Эксперимент'],['FAVORITE','Ещё один результат']
  ];

  const wall=$('#videoWall'), countEl=$('#videoCount'), empty=$('#emptyState');
  const modal=$('#videoModal'), modalVideo=$('#modalVideo'), modalCaption=$('#modalCaption'), modalClose=$('#modalClose');
  let loaded=0, checked=0;

  function updateVideoState(){
    if(countEl) countEl.textContent=loaded;
    if(empty) empty.style.display = checked>=20 && loaded===0 ? 'block' : 'none';
    const worksP=$('#works .section-head.split>p');
    if(worksP && loaded>0 && checked>=loaded) {
      worksP.textContent=`Здесь ${loaded} моих реальных генераций из этого доступа. Не демо платформы и не мокапы сайта — обычные тесты, которые я сам запускал. Наведи на ролик, чтобы посмотреть его, или открой крупно.`;
    }
  }

  function previewPlay(card, v){
    if(!card.dataset.ready) return;
    $$('.video-card video').forEach(other=>{if(other!==v) other.pause();});
    v.play().catch(()=>{});
  }
  function previewPause(v){v.pause();}

  if (wall) {
    for(let i=1;i<=20;i++){
      const num=String(i).padStart(2,'0');
      const [tag,title]=labels[i-1];
      const card=document.createElement('article');
      card.className='video-card';
      card.innerHTML=`
        <video src="/videos/video-${num}.mp4" muted loop playsinline preload="metadata"></video>
        <div class="video-play"><i></i></div>
        <div class="video-label"><b>${title}</b><span>${tag}</span></div>`;
      const v=$('video',card);
      v.addEventListener('loadedmetadata',()=>{
        loaded++;checked++;card.dataset.ready='1';
        try { if (v.duration > .05) v.currentTime=.04; } catch {}
        updateVideoState();
      },{once:true});
      v.addEventListener('error',()=>{checked++;card.remove();updateVideoState();},{once:true});
      card.addEventListener('mouseenter',()=>previewPlay(card,v));
      card.addEventListener('mouseleave',()=>previewPause(v));
      card.addEventListener('focusin',()=>previewPlay(card,v));
      card.addEventListener('focusout',()=>previewPause(v));
      card.addEventListener('click',()=>{
        if(!card.dataset.ready || !modal?.showModal) return;
        v.pause();
        modalVideo.src=v.currentSrc || v.src;
        modalCaption.textContent=`Пример ${num} / ${title}`;
        modal.showModal();
        modalVideo.play().catch(()=>{});
      });
      wall.appendChild(card);
    }
  }

  function closeModal(){
    if(modal?.open) modal.close();
    if(modalVideo){modalVideo.pause();modalVideo.removeAttribute('src');modalVideo.load();}
  }
  modalClose?.addEventListener('click',closeModal);
  modal?.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});

  // Lead form remains functional and intentionally has no decorative motion.
  const form=$('#leadForm'), status=$('#formStatus');
  form?.addEventListener('submit', async e=>{
    e.preventDefault();
    status.className='form-status';
    status.textContent='';
    const data=Object.fromEntries(new FormData(form).entries());
    if(data.website) return;
    if(!data.phone || !form.elements.consent.checked){
      status.classList.add('err');
      status.textContent='Укажи номер телефона и поставь согласие на связь.';
      return;
    }
    form.classList.add('loading');
    form.querySelector('button').disabled=true;
    try{
      const res=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name||'',phone:data.phone,consent:true,website:''})});
      const json=await res.json().catch(()=>({}));
      if(!res.ok) throw new Error(json.error||'Не удалось отправить');
      form.reset();
      status.classList.add('ok');
      status.textContent='Готово. Заявка отправлена — я свяжусь с тобой.';
    }catch(err){
      status.classList.add('err');
      status.innerHTML='Не получилось отправить автоматически. Напиши напрямую в Telegram: <a href="https://t.me/ferixdiii" target="_blank">@ferixdiii</a>';
    }finally{
      form.classList.remove('loading');
      form.querySelector('button').disabled=false;
    }
  });
})();
