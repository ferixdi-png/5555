(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const fineHover = matchMedia('(hover:hover) and (pointer:fine)').matches;
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
  const bgAudio=$('#autoAudio');
  let expected=0;

  /* One cross-browser player for desktop and mobile. No <dialog>, no autoplay. */
  const legacyModal=$('#videoModal');
  if(legacyModal) legacyModal.remove();

  const player=document.createElement('div');
  player.className='safe-player';
  player.setAttribute('aria-hidden','true');
  player.innerHTML=`
    <div class="safe-player-backdrop" data-close-player></div>
    <div class="safe-player-shell" role="dialog" aria-modal="true" aria-label="Просмотр видео">
      <button class="safe-player-close" type="button" data-close-player aria-label="Закрыть видео">×</button>
      <div class="safe-player-stage">
        <video class="safe-player-video" controls playsinline webkit-playsinline preload="metadata" disablepictureinpicture></video>
        <button class="safe-player-play" type="button" aria-label="Воспроизвести видео"><span></span></button>
        <div class="safe-player-loading">Загружаю видео…</div>
        <div class="safe-player-error">
          <strong>Не удалось загрузить видео</strong>
          <a class="safe-player-direct" href="#" target="_blank" rel="noopener">Открыть видео отдельно ↗</a>
        </div>
      </div>
      <div class="safe-player-caption"></div>
    </div>`;
  document.body.appendChild(player);

  const playerVideo=$('.safe-player-video',player);
  const playerPlay=$('.safe-player-play',player);
  const playerCaption=$('.safe-player-caption',player);
  const playerDirect=$('.safe-player-direct',player);
  let currentSrc='';
  let historyArmed=false;

  function stopBgAudio(){
    if(bgAudio && !bgAudio.paused){ bgAudio.dataset.resumeAfterVideo='1'; bgAudio.pause(); }
  }
  function resumeBgAudio(){
    if(bgAudio?.dataset.resumeAfterVideo==='1'){
      delete bgAudio.dataset.resumeAfterVideo;
      bgAudio.play().catch(()=>{});
    }
  }
  function resetPlayerMedia(){
    playerVideo.pause();
    playerVideo.removeAttribute('src');
    playerVideo.load();
    currentSrc='';
    player.classList.remove('is-loading','is-ready','is-playing','is-error');
  }
  function closePlayer(fromPopState=false){
    if(!player.classList.contains('is-open')) return;
    player.classList.remove('is-open');
    player.setAttribute('aria-hidden','true');
    document.documentElement.classList.remove('video-player-open');
    resetPlayerMedia();
    resumeBgAudio();
    if(historyArmed && !fromPopState){
      historyArmed=false;
      if(history.state?.videoPlayer) history.back();
    } else historyArmed=false;
  }
  function openPlayer(src,caption){
    if(!src) return;
    stopBgAudio();
    currentSrc=src;
    playerCaption.textContent=caption;
    playerDirect.href=src;
    player.classList.add('is-open','is-loading');
    player.classList.remove('is-ready','is-playing','is-error');
    player.setAttribute('aria-hidden','false');
    document.documentElement.classList.add('video-player-open');
    playerVideo.src=src;
    playerVideo.preload='metadata';
    playerVideo.load();
    if(!historyArmed){
      try{ history.pushState({videoPlayer:true},''); historyArmed=true; }catch{}
    }
    setTimeout(()=>playerPlay?.focus({preventScroll:true}),40);
  }

  $$('[data-close-player]',player).forEach(el=>el.addEventListener('click',()=>closePlayer()));
  addEventListener('keydown',e=>{if(e.key==='Escape'&&player.classList.contains('is-open')) closePlayer();});
  addEventListener('popstate',()=>{if(player.classList.contains('is-open')) closePlayer(true);});

  playerPlay.addEventListener('click',()=>{
    if(!currentSrc) return;
    stopBgAudio();
    const p=playerVideo.play();
    if(p?.catch) p.catch(()=>{ player.classList.add('is-error'); });
  });
  playerVideo.addEventListener('loadstart',()=>player.classList.add('is-loading'));
  playerVideo.addEventListener('loadedmetadata',()=>player.classList.add('is-ready'));
  playerVideo.addEventListener('canplay',()=>player.classList.remove('is-loading','is-error'));
  playerVideo.addEventListener('playing',()=>player.classList.add('is-playing'));
  playerVideo.addEventListener('pause',()=>player.classList.remove('is-playing'));
  playerVideo.addEventListener('ended',()=>player.classList.remove('is-playing'));
  playerVideo.addEventListener('error',()=>{player.classList.remove('is-loading');player.classList.add('is-error');});

  function updateVideoState(){
    if(countEl) countEl.textContent=expected;
    if(empty) empty.style.display = expected===0 ? 'block' : 'none';
    const worksP=$('#works .section-head.split>p');
    if(worksP && expected>0) worksP.textContent=`Здесь ${expected} моих реальных генераций. Все ролики — 1080p по 8 секунд. Нажми на карточку, затем на Play — плеер работает одинаково на телефоне и компьютере.`;
  }

  function attachPreviewSource(card,video,mode='metadata'){
    if(video.dataset.sourceAttached) return;
    const src=card.dataset.src;
    if(!src) return;
    video.dataset.sourceAttached='1';
    video.preload=mode;
    video.src=src;
    video.load();
  }

  const mediaIO='IntersectionObserver' in window ? new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const card=e.target, v=$('video',card);
      if(v && !saveData) attachPreviewSource(card,v,'metadata');
      mediaIO.unobserve(card);
    });
  },{rootMargin:fineHover?'320px 0px':'100px 0px',threshold:.01}) : null;

  function previewPlay(card,v){
    if(!fineHover) return;
    attachPreviewSource(card,v,'metadata');
    $$('.video-card video').forEach(other=>{if(other!==v) other.pause();});
    const p=v.play(); if(p?.catch) p.catch(()=>{});
  }
  function previewPause(v){ if(fineHover) v.pause(); }

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
      }catch(err){ if(attempt===2) console.warn('Video discovery failed',err); }
      await wait(250*(attempt+1));
    }
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
      card.setAttribute('role','button');
      card.setAttribute('aria-label',`${title}. Открыть видео 1080p, 8 секунд`);
      card.innerHTML=`
        <video muted loop playsinline webkit-playsinline preload="none"></video>
        <div class="original-badge"><i></i>1080P <span>ORIGINAL</span></div>
        <div class="video-play"><i></i></div>
        <div class="video-label"><b>${title}</b><span>${tag} · 1080P · 8 SEC</span></div>`;
      const v=$('video',card);
      v.addEventListener('loadeddata',()=>card.classList.add('has-frame'),{once:true});
      v.addEventListener('error',()=>card.classList.add('media-error'));
      if(mediaIO) mediaIO.observe(card); else if(!saveData) attachPreviewSource(card,v,'metadata');
      if(fineHover){
        card.addEventListener('mouseenter',()=>previewPlay(card,v));
        card.addEventListener('mouseleave',()=>previewPause(v));
        card.addEventListener('focusin',()=>previewPlay(card,v));
        card.addEventListener('focusout',()=>previewPause(v));
      }
      const open=()=>{ v.pause(); openPlayer(src,`${num} / ${title} · 1080P · 8 SEC`); };
      card.addEventListener('click',open);
      card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();open();}});
      wall.appendChild(card);
    });
  }
  buildGallery();
})();
