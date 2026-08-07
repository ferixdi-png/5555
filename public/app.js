(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const fine = matchMedia('(pointer:fine)').matches;

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
  let loaded=0, checked=0, expected=0;

  function updateVideoState(){
    if(countEl) countEl.textContent=loaded;
    if(empty) empty.style.display = expected===0 || (checked>=expected&&loaded===0) ? 'block' : 'none';
    const worksP=$('#works .section-head.split>p');
    if(worksP && loaded>0 && checked>=expected) worksP.textContent=`Здесь ${loaded} моих реальных генераций из этого доступа. Все ролики — 1080p по 8 секунд. На компьютере наведи на карточку для превью, на телефоне просто открой её крупно.`;
  }

  function previewPlay(card,v){
    if(!fine||!card.dataset.ready) return;
    $$('.video-card video').forEach(other=>{if(other!==v) other.pause();});
    v.play().catch(()=>{});
  }
  function previewPause(v){ if(fine) v.pause(); }

  function closeModal(){
    if(modal?.open) modal.close();
    if(modalVideo){modalVideo.pause();modalVideo.removeAttribute('src');modalVideo.load();}
  }
  modalClose?.addEventListener('click',closeModal);
  modal?.addEventListener('click',e=>{if(e.target===modal) closeModal();});
  addEventListener('keydown',e=>{if(e.key==='Escape') closeModal();});

  async function discoverVideos(){
    try{
      const res=await fetch('/api/videos',{cache:'no-store'});
      if(!res.ok) throw new Error('discovery failed');
      const data=await res.json();
      if(Array.isArray(data.videos)) return data.videos.filter(x=>/^video-\d{2}\.mp4$/i.test(x));
    }catch{}
    return Array.from({length:20},(_,i)=>`video-${String(i+1).padStart(2,'0')}.mp4`);
  }

  async function buildGallery(){
    if(!wall) return;
    wall.innerHTML=''; loaded=0; checked=0;
    const files=await discoverVideos(); expected=files.length; updateVideoState();

    files.forEach((file,index)=>{
      const m=/video-(\d{2})\.mp4/i.exec(file),num=m?m[1]:String(index+1).padStart(2,'0');
      const n=Math.max(1,Number(num));
      const [tag,title]=labels[n-1]||['EXAMPLE',`Реальный пример ${num}`];
      const card=document.createElement('article');
      card.className='video-card'; card.tabIndex=0;
      card.setAttribute('aria-label',`${title}, исходное видео 1080p, 8 секунд`);
      card.innerHTML=`
        <video src="/videos/${file}" muted loop playsinline preload="metadata"></video>
        <div class="original-badge"><i></i>1080P <span>ORIGINAL</span></div>
        <div class="video-play"><i></i></div>
        <div class="video-label"><b>${title}</b><span>${tag} · 1080P · 8 SEC</span></div>`;
      const v=$('video',card);
      v.addEventListener('loadedmetadata',()=>{
        loaded++;checked++;card.dataset.ready='1';
        try { if(v.duration>.05) v.currentTime=Math.min(1.15,v.duration*.16); } catch {}
        updateVideoState();
      },{once:true});
      v.addEventListener('error',()=>{checked++;card.remove();updateVideoState();},{once:true});
      if(fine){
        card.addEventListener('mouseenter',()=>previewPlay(card,v));
        card.addEventListener('mouseleave',()=>previewPause(v));
        card.addEventListener('focusin',()=>previewPlay(card,v));
        card.addEventListener('focusout',()=>previewPause(v));
      }
      const open=()=>{
        if(!card.dataset.ready||!modal?.showModal) return;
        v.pause(); modalVideo.src=v.currentSrc||v.src; modalCaption.textContent=`${num} / ${title} · 1080P · 8 SEC`;
        modal.showModal(); modalVideo.currentTime=0; modalVideo.play().catch(()=>{});
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
