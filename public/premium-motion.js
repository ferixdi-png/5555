(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1) Insert a very visible kinetic statement between the unlimited promise and examples.
  const unlimited = $('#unlimited');
  const works = $('#works');
  if (unlimited && works && !$('#kineticBand')) {
    const k = document.createElement('section');
    k.id = 'kineticBand';
    k.className = 'kinetic-band';
    k.innerHTML = `
      <div class="kinetic-inner">
        <div class="kinetic-row">ПОЛНЫЙ <span class="accent">БЕЗЛИМИТ</span> • БЕЗ КРЕДИТОВ • ПОЛНЫЙ <span class="accent">БЕЗЛИМИТ</span> •</div>
        <div class="kinetic-row outline">AI VIDEO • NO CREDITS • NO COUNTER • GENERATE AGAIN • AI VIDEO • NO CREDITS •</div>
        <div class="kinetic-center">
          <small>Вот в чём вся идея</small>
          <strong>Не пакет генераций.<br>Не «много кредитов». Полный безлимит.</strong>
          <p>Не понравился дубль — запускаешь ещё. Хочешь проверить другую идею — проверяешь. Счётчик кредитов не решает за тебя, когда остановиться.</p>
        </div>
      </div>`;
    works.parentNode.insertBefore(k, works);
  }

  // 2) A velocity ticker: its direction and speed respond to scroll direction.
  const technology = $('#technology');
  if (technology && !$('.velocity-ticker')) {
    const ticker = document.createElement('div');
    ticker.className = 'velocity-ticker';
    ticker.innerHTML = `<div class="velocity-track">${Array.from({length:5},()=>'<b>FULL UNLIMITED</b><i>✦</i><span>1080P</span><i>✦</i><span>8 SEC</span><i>✦</i><span>RU LIP-SYNC</span><i>✦</i><span>NO CREDITS</span><i>✦</i>').join('')}</div>`;
    technology.parentNode.insertBefore(ticker, technology);
  }

  // 3) Visible frame counter for the scroll-scrub scene.
  const storyFrame = $('#storyFrame');
  if (storyFrame && !$('.story-frame-counter', storyFrame)) {
    const c = document.createElement('div');
    c.className = 'story-frame-counter';
    c.textContent = 'FRAME 000 / 240';
    storyFrame.appendChild(c);
  }

  const hero = $('.final-hero');
  const kinetic = $('#kineticBand');
  const story = $('#scrollStory');
  const storyCounter = $('.story-frame-counter');
  const tickerTrack = $('.velocity-track');
  const storyVideo = $('#storyVideo');
  const storySteps = $$('.story-step');
  const storyCaptionStrong = $('.story-caption strong');
  const storyTime = $('#storyTime');
  const storyProgress = $('#storyProgress');

  let lastY = scrollY, lastT = performance.now(), tickerX = 0, velocity = 0;
  let raf = 0;
  const clamp = (v,a=0,b=1)=>Math.max(a,Math.min(b,v));
  const progressIn = el => {
    if (!el) return 0;
    const r = el.getBoundingClientRect();
    const travel = Math.max(1, el.offsetHeight - innerHeight);
    return clamp(-r.top / travel);
  };

  function update() {
    raf = 0;
    const y = scrollY;
    const now = performance.now();
    const dt = Math.max(16, now-lastT);
    const dy = y-lastY;
    const instant = dy/dt;
    velocity += (instant-velocity)*.18;
    lastY=y; lastT=now;

    // hero parallax: only first viewport
    if (hero && !reduce) {
      const hp = clamp(y / Math.max(1, innerHeight*.95));
      hero.style.setProperty('--hero-p', hp.toFixed(4));
    }

    // kinetic typography follows its own scroll progress
    if (kinetic) {
      const kp = progressIn(kinetic);
      kinetic.style.setProperty('--kinetic-p', kp.toFixed(4));
      const range = Math.min(innerWidth*.48, 620);
      kinetic.style.setProperty('--kinetic-x', `${(-range*.52 + kp*range).toFixed(1)}px`);
      kinetic.style.setProperty('--kinetic-x2', `${(range*.28 - kp*range*.76).toFixed(1)}px`);
    }

    // premium story layer + video scrub (also works if earlier script already handles the video)
    if (story) {
      const p = progressIn(story);
      story.style.setProperty('--story-p', p.toFixed(4));
      const frame = Math.round(p*240);
      if (storyCounter) storyCounter.textContent = `FRAME ${String(frame).padStart(3,'0')} / 240`;
      if (storyProgress) storyProgress.style.transform = `scaleX(${p})`;
      if (storyTime) storyTime.textContent = `${(p*8).toFixed(2)} / 8.00s`;
      const idx = Math.min(3, Math.floor(p*4));
      storySteps.forEach((el,i)=>el.classList.toggle('is-active',i===idx));
      const captions = ['Идея → короткий промпт','1080p. 8 секунд. Смотрю результат.','Не нравится? Ещё один дубль. Без кредитов.','Следующая сцена → длинный ролик.'];
      if (storyCaptionStrong) storyCaptionStrong.textContent = captions[idx];
      if (storyVideo && Number.isFinite(storyVideo.duration) && storyVideo.duration>0 && !storyVideo.seeking) {
        const target = Math.min(storyVideo.duration-.035, p*storyVideo.duration);
        if (Math.abs(storyVideo.currentTime-target)>.025) storyVideo.currentTime = target;
      }
    }

    // ticker reacts to scroll velocity, then slowly coasts even at rest
    if (tickerTrack && !reduce) {
      tickerX += (-0.38 - velocity*32);
      const width = tickerTrack.scrollWidth/5 || 900;
      if (tickerX < -width) tickerX += width;
      if (tickerX > 0) tickerX -= width;
      tickerTrack.style.setProperty('--ticker-x', `${tickerX.toFixed(1)}px`);
    }
  }

  function requestUpdate(){ if(!raf) raf=requestAnimationFrame(update); }
  addEventListener('scroll', requestUpdate, {passive:true});
  addEventListener('resize', requestUpdate, {passive:true});
  requestUpdate();

  // keep ticker subtly moving if user pauses
  if (!reduce) setInterval(requestUpdate, 80);

  // 4) Cursor spotlight for cards and magnetic light for buttons.
  if (matchMedia('(pointer:fine)').matches) {
    const cards = $$('.zero-card,.why-card,.idea-card,.tech-flow article,.video-card,.truth-card,.contact-shell');
    cards.forEach(card => card.addEventListener('pointermove', e => {
      const r=card.getBoundingClientRect();
      card.style.setProperty('--cx', `${e.clientX-r.left}px`);
      card.style.setProperty('--cy', `${e.clientY-r.top}px`);
    }, {passive:true}));

    $$('.tg-main-cta,.telegram-float,.hero-tg,.button-primary').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r=btn.getBoundingClientRect();
        const x=e.clientX-r.left, y=e.clientY-r.top;
        btn.style.setProperty('--btn-x', `${x}px`); btn.style.setProperty('--btn-y', `${y}px`);
        if (!reduce) btn.style.transform = `translate(${((x/r.width)-.5)*5}px,${((y/r.height)-.5)*4}px)`;
      }, {passive:true});
      btn.addEventListener('pointerleave',()=>{btn.style.transform='';});
    });
  }

  // 5) Active nav follows the section the reader is currently in.
  const navLinks = $$('.nav-links a[href^="#"]');
  const sections = navLinks.map(a => document.querySelector(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(entries => {
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=>b.intersectionRatio-a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach(a=>a.classList.toggle('is-active',a.getAttribute('href')===`#${visible.target.id}`));
    }, {rootMargin:'-30% 0px -58% 0px',threshold:[0,.01,.15,.4]});
    sections.forEach(s=>io.observe(s));
  }

  // Video metadata can arrive after the first scroll.
  if (storyVideo) storyVideo.addEventListener('loadedmetadata', requestUpdate, {once:true});
})();
