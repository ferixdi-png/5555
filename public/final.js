(() => {
  const audio = document.getElementById('autoAudio');
  if (audio) {
    audio.volume = 0.9;
    const tryPlay = () => audio.play().catch(() => {});
    addEventListener('load', tryPlay, { once:true });
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tryPlay(); });
    ['pointerdown','touchstart','keydown','scroll'].forEach(evt => addEventListener(evt, tryPlay, { once:true, passive:true }));
  }

  const bar = document.createElement('div');
  bar.className = 'page-progress';
  document.body.appendChild(bar);
  const paintProgress = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  };
  addEventListener('scroll', paintProgress, { passive:true });
  addEventListener('resize', paintProgress, { passive:true });
  paintProgress();

  document.querySelectorAll('.video-card').forEach((card, i) => {
    const badge = document.createElement('div');
    badge.className = 'original-badge';
    badge.innerHTML = '<i></i>1080P <span>ORIGINAL</span>';
    card.appendChild(badge);
    card.setAttribute('aria-label', `Реальный пример ${i + 1}, исходное видео 1080p`);
  });

  const style = document.createElement('style');
  style.textContent = `
    .page-progress{position:fixed;z-index:100;left:0;right:0;top:0;height:2px;transform-origin:left center;background:linear-gradient(90deg,#dfff68,#68e8ff,#9d83ff);box-shadow:0 0 14px rgba(104,232,255,.45);pointer-events:none}
    .original-badge{position:absolute;z-index:4;right:14px;top:14px;display:flex;align-items:center;gap:5px;padding:6px 8px;border:1px solid rgba(255,255,255,.13);border-radius:999px;background:rgba(5,7,11,.56);backdrop-filter:blur(12px);font-size:8px;font-weight:900;letter-spacing:.08em;color:#fff;pointer-events:none}
    .original-badge i{width:5px;height:5px;border-radius:50%;background:#dfff68;box-shadow:0 0 10px #dfff68}.original-badge span{color:#7f8795}
  `;
  document.head.appendChild(style);

  const hero = document.querySelector('.final-hero');
  if (hero && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      const x = (e.clientX / innerWidth - .5) * 2;
      const y = (e.clientY / innerHeight - .5) * 2;
      hero.style.setProperty('--mx', x.toFixed(3));
      hero.style.setProperty('--my', y.toFixed(3));
    }, {passive:true});
  }
})();