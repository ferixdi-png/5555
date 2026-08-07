(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(pointer:fine)').matches;
  const saveData = Boolean(navigator.connection?.saveData);

  const nav = $('#nav');
  const onScroll = () => nav?.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
    }, {threshold:.08, rootMargin:'0px 0px -4% 0px'});
    $$('.reveal').forEach(el => io.observe(el));
  } else $$('.reveal').forEach(el => el.classList.add('visible'));

  const wave = $('#waveform');
  if (wave && !wave.children.length) {
    const heights=[20,31,18,43,29,54,34,22,48,64,35,26,57,39,23,45,68,42,31,55,36,24,49,61,37,27,52,41,22,46,65,38,29,56,34,25,48,59,35,23,50,40,27,44,32,21];
    heights.forEach(h => { const b=document.createElement('i'); b.style.height=h+'px'; b.style.animation='none'; wave.appendChild(b); });
  }

  const labels = [
    ['REALISM','Космонавт на рынке'],['CHARACTER','Героиня в автобусе'],['COMEDY','Клоун во дворе'],
    ['UGC','Бабушка снимает UGC'],['STREET','Мужчина и голуби'],['CHARACTER','Персонаж у киоска'],
    ['DIALOGUE','Диалог в офисе'],['COMEDY','Ковбой в прачечной'],['ABSURD','Невеста на заправке'],
    ['CHARACTER','Рыцарь у цветочного'],['REALISM','Бытовая сцена во дворе'],['LIP-SYNC','Мим выбирает щётку']
  ];

  const wall=$('#videoWall'), countEl=$('#videoCount'), empty=$('#emptyState');
  const modal=$('#videoModal'), modalVideo=$('#modalVideo'), modalCaption=$('#modalCaption'), modalClose=$('#modalClose');
  const bgAudio=$('#autoAudio');
  let expected=0;

  function updateVideoState(){
    if(countEl) countEl.textContent=expected;
    if(empty) empty.style.display = expected===0 ? 'block' : 'none';
    const worksP=$('#works .section-head.split>p');
    if(worksP && expected>0) worksP.textContent=`Здесь ${expected} моих реальных генераций из этого доступа. Все ролики — 1080p по 8 секунд. На компьютере наведи на карточку для превью, на телефоне просто нажми на ролик.`;
  }

  function setCardSource(card, video, mode='metadata'){
    if(video.dataset.sourceAttached) return;
    const src=card.dataset.src;
    if(!src) return;
    video.dataset.sourceAttached='1';
    video.preload=mode;
    video.src=src;
    video.load();
  }

  const mediaIO = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(e => {
      if(!e.isIntersecting) return;
      const card=e.target;
      const v=$('video',card);
      if(v && !saveData) setCardSource(card,v,'metadata');
      mediaIO.unobserve(card);
    });
  },{rootMargin:fine?'360px 0px':'180px 0px',threshold:.01}) : null;

  function primeFrame(v){
    if(v.dataset.framePrimed) return;
    v.dataset.framePrimed='1';
    try{
      const seek=()=>{
        try{ if(Number.isFinite(v.duration) && v.duration>.1) v.currentTime=Math.min(.35,v.duration*.06); }catch{}
      };
      if(v.readyState>=1) seek(); else v.addEventListener('loadedmetadata',seek,{once:true});
    }catch{}
  }

  function previewPlay(card,v){
    if(!fine) return;
    setCardSource(card,v,'auto');
    primeFrame(v);
    $$('.video-card video').forEach(other=>{if(other!==v) other.pause();});
    v.play().catch(()=>{});
  }
  function previewPause(v){ if(fine) v.pause(); }

  function modalIsOpen(){ return Boolean(modal?.open || modal?.hasAttribute('data-fallback-open')); }
  function showModalSafe(){
    if(!modal) return false;
    if(typeof modal.showModal==='function') modal.showModal();
    else { modal.setAttribute('open',''); modal.setAttribute('data-fallback-open','1'); document.documentElement.classList.add('modal-open'); }
    return true;
  }
  function closeModal(){
    if(!modal) return;
    if(typeof modal.close==='function' && modal.open) modal.close();
    else { modal.removeAttribute('open'); modal.removeAttribute('data-fallback-open'); document.documentElement.classList.remove('modal-open'); }
    if(modalVideo){ modalVideo.pause(); modalVideo.removeAttribute('src'); modalVideo.load(); }
    modal?.classList.remove('is-loading','is-error');
    if(bgAudio?.dataset.resumeAfterModal==='1'){
      delete bgAudio.dataset.resumeAfterModal;
      bgAudio.play().catch(()=>{});
    }
  }
  modalClose?.addEventListener('click',closeModal);
  modal?.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  addEventListener('keydown',e=>{if(e.key==='Escape' && modalIsOpen()) closeModal();});

  if(modalVideo){
    modalVideo.addEventListener('loadstart',()=>modal?.classList.add('is-loading'));
    modalVideo.addEventListener('canplay',()=>modal?.classList.remove('is-loading','is-error'));
    modalVideo.addEventListener('playing',()=>modal?.classList.remove('is-loading','is-error'));
    modalVideo.addEventListener('error',()=>{ modal?.classList.remove('is-loading'); modal?.classList.add('is-error'); });
  }

  const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
  async function discoverVideos(){
    for(let attempt=0;attempt<3;attempt++){
      try{
        const res=await fetch('/api/videos',{cache:'no-store'});
        if(!res.ok) throw new Error('discovery failed');
        const data=await res.json();
        if(Array.isArray(data.videos)){
          const list=data.videos.filter(x=>/^video-\d{2}\.mp4$/i.test(x));
          if(list.length) return list;
        }
      }catch(err){
        if(attempt===2) console.warn('Video discovery failed',err);
      }
      await wait(250*(attempt+1));
    }
    // The current project contains 12 numbered videos. This fallback keeps the
    // gallery usable if the discovery request is briefly interrupted on mobile.
    return Array.from({length:12},(_,i)=>`video-${String(i+1).padStart(2,'0')}.mp4`);
  }

  async function buildGallery(){
    if(!wall) return;
    wall.innerHTML='';
    const files=await discoverVideos();
    expected=files.length; updateVideoState();

    files.forEach((file,index)=>{
      const m=/video-(\d{2})\.mp4/i.exec(file),num=m?m[1]:String(index+1).padStart(2,'0');
      const n=Math.max(1,Number(num));
      const [tag,title]=labels[n-1]||['EXAMPLE',`Реальный пример ${num}`];
      const src=`/videos/${file}`;
      const card=document.createElement('article');
      card.className='video-card'; card.tabIndex=0; card.dataset.src=src;
      card.setAttribute('aria-label',`${title}, исходное видео 1080p, 8 секунд`);
      card.innerHTML=`
        <video muted loop playsinline webkit-playsinline preload="none"></video>
        <div class="original-badge"><i></i>1080P <span>ORIGINAL</span></div>
        <div class="video-play"><i></i></div>
        <div class="video-label"><b>${title}</b><span>${tag} · 1080P · 8 SEC</span></div>`;
      const v=$('video',card);

      v.addEventListener('loadedmetadata',()=>{ card.dataset.ready='1'; primeFrame(v); },{once:true});
      v.addEventListener('loadeddata',()=>card.classList.add('has-frame'),{once:true});
      v.addEventListener('error',()=>card.classList.add('media-error'));

      if(mediaIO) mediaIO.observe(card);
      else if(!saveData) setCardSource(card,v,'metadata');

      if(fine){
        card.addEventListener('mouseenter',()=>previewPlay(card,v));
        card.addEventListener('mouseleave',()=>previewPause(v));
        card.addEventListener('focusin',()=>previewPlay(card,v));
        card.addEventListener('focusout',()=>previewPause(v));
      }

      const open=()=>{
        if(!modal || !modalVideo) return;
        v.pause();
        if(bgAudio && !bgAudio.paused){
          bgAudio.dataset.resumeAfterModal='1';
          bgAudio.pause();
        }
        modalCaption.textContent=`${num} / ${title} · 1080P · 8 SEC`;
        if(!showModalSafe()) return;
        modal.classList.add('is-loading');
        modalVideo.src=src;
        modalVideo.preload='auto';
        modalVideo.load();
        const p=modalVideo.play();
        if(p?.catch) p.catch(()=>{});
      };
      card.addEventListener('click',open);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      wall.appendChild(card);
    });
  }
  buildGallery();

  const form=$('#leadForm'), status=$('#formStatus');
  form?.addEventListener('submit', async e=>{
    e.preventDefault(); status.className='form-status'; status.textContent='';
    const data=Object.fromEntries(new FormData(form).entries());
    if(data.website) return;
    if(!data.phone || !form.elements.consent.checked){status.classList.add('err');status.textContent='Укажи номер телефона и поставь согласие на связь.';return;}
    form.classList.add('loading'); form.querySelector('button').disabled=true;
    try{
      const res=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:data.name||'',phone:data.phone,consent:true,website:''})});
      const body=await res.json().catch(()=>({})); if(!res.ok) throw new Error(body.error||'Не удалось отправить');
      form.reset();status.classList.add('ok');status.textContent='Готово. Заявка отправлена — я свяжусь с тобой.';
    }catch(err){
      status.classList.add('err');status.innerHTML='Не получилось отправить автоматически. Напиши напрямую в Telegram: <a href="https://t.me/ferixdiii" target="_blank">@ferixdiii</a>';
    }finally{form.classList.remove('loading');form.querySelector('button').disabled=false;}
  });
})();
