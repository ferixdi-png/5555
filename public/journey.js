(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  // Remove legacy one-off scroll spectacles if an older script created them.
  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail'].forEach(sel=> $$(sel).forEach(el=>el.remove()));

  // Calm down old interactive classes so the entire page has one motion language.
  $$('.tilt,.magnet').forEach(el=>{el.classList.remove('tilt','magnet');el.style.transform='';});

  // Content polish that belongs to the final UX, not another animation system.
  const tg='https://t.me/ferixdiii';
  const navCta=$('.nav-cta');
  if(navCta){navCta.textContent='Напиши мне — дам гайд';navCta.href=tg;navCta.target='_blank';navCta.rel='noopener';}
  const contactTg=$('.button-telegram');
  if(contactTg){contactTg.innerHTML='<span class="tg-icon">↗</span>Напиши мне — дам гайд<small>@ferixdiii</small>';contactTg.href=tg;}
  const contactText=$('#contact .contact-copy>p');
  if(contactText) contactText.textContent='Если интересно — просто напиши мне. Я отправлю гайд, объясню, как устроен доступ, покажу нюансы и расскажу, как я делал ролики на этой странице.';
  const contactTitle=$('#contact .contact-copy h2');
  if(contactTitle) contactTitle.innerHTML='Хочешь разобраться<br><em>без догадок?</em>';
  const formLabel=$('#contact .form-label');
  if(formLabel) formLabel.textContent='ИЛИ ОСТАВЬ НОМЕР — Я ПЕРЕЗВОНЮ';

  // Gallery copy reflects the fact that the page is now about real proof.
  const worksP=$('#works .section-head.split>p');
  if(worksP) worksP.textContent='Здесь мои реальные генерации из этого доступа. Не демо платформы и не постановочные мокапы сайта — обычные тесты, которые я сам запускал. Открой любой ролик крупно и оцени качество без лишней рекламы.';

  // One persistent light signal across the entire site.
  if(reduce) return;
  const canvas=document.createElement('canvas');
  canvas.id='journeyCanvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true});
  if(!ctx) return;

  let dpr=1,w=0,h=0;
  const resize=()=>{
    dpr=Math.min(devicePixelRatio||1,1.5);
    w=innerWidth;h=innerHeight;
    canvas.width=Math.max(1,Math.floor(w*dpr));
    canvas.height=Math.max(1,Math.floor(h*dpr));
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  };
  addEventListener('resize',resize,{passive:true});resize();

  let pointerX=.82;
  if(matchMedia('(pointer:fine)').matches){
    addEventListener('pointermove',e=>{pointerX=e.clientX/Math.max(innerWidth,1);},{passive:true});
  }

  let p=0,targetP=0,lastY=scrollY,lastNow=performance.now(),velocity=0;
  const trail=[];
  const maxTrail=46;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  const updateTarget=()=>{
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    targetP=clamp(scrollY/max);
  };
  addEventListener('scroll',updateTarget,{passive:true});
  updateTarget();p=targetP;

  function position(progress){
    const desktop=w>760;
    const base=desktop?.80:.91;
    const wave=desktop?.085:.035;
    const x=w*(base + Math.sin(progress*Math.PI*4.6)*wave + Math.sin(progress*Math.PI*11.2)*wave*.28);
    const pxInfluence=desktop?(pointerX-.5)*w*.018:0;
    const eased=.5-.5*Math.cos(progress*Math.PI);
    const y=h*(.16 + eased*.68);
    return {x:x+pxInfluence,y};
  }

  function drawTrail(head,speed){
    if(trail.length<2) return;
    ctx.save();
    ctx.globalCompositeOperation='lighter';
    ctx.lineCap='round';ctx.lineJoin='round';

    // soft outer trail
    ctx.beginPath();
    trail.forEach((pt,i)=>{if(i===0)ctx.moveTo(pt.x,pt.y);else ctx.lineTo(pt.x,pt.y);});
    const g=ctx.createLinearGradient(trail[0].x,trail[0].y,head.x,head.y);
    g.addColorStop(0,'rgba(104,232,255,0)');
    g.addColorStop(.52,'rgba(104,232,255,.08)');
    g.addColorStop(1,`rgba(223,255,104,${.18+speed*.16})`);
    ctx.strokeStyle=g;ctx.lineWidth=10+speed*9;ctx.shadowBlur=18+speed*18;ctx.shadowColor='rgba(104,232,255,.20)';ctx.stroke();

    // crisp inner filament
    ctx.beginPath();
    trail.forEach((pt,i)=>{if(i===0)ctx.moveTo(pt.x,pt.y);else ctx.lineTo(pt.x,pt.y);});
    const g2=ctx.createLinearGradient(trail[0].x,trail[0].y,head.x,head.y);
    g2.addColorStop(0,'rgba(104,232,255,0)');
    g2.addColorStop(.7,'rgba(104,232,255,.20)');
    g2.addColorStop(1,'rgba(223,255,104,.86)');
    ctx.strokeStyle=g2;ctx.lineWidth=1.4+speed*1.3;ctx.shadowBlur=9;ctx.shadowColor='rgba(223,255,104,.42)';ctx.stroke();
    ctx.restore();
  }

  function drawHead(head,speed){
    ctx.save();ctx.globalCompositeOperation='lighter';
    const halo=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,34+speed*20);
    halo.addColorStop(0,'rgba(255,255,255,.96)');
    halo.addColorStop(.08,'rgba(223,255,104,.92)');
    halo.addColorStop(.28,'rgba(104,232,255,.34)');
    halo.addColorStop(1,'rgba(104,232,255,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(head.x,head.y,34+speed*20,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#f7ffd8';ctx.shadowBlur=18;ctx.shadowColor='#dfff68';ctx.beginPath();ctx.arc(head.x,head.y,2.7+speed*1.8,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  function frame(now){
    const dt=Math.min(34,Math.max(8,now-lastNow));lastNow=now;
    const dy=scrollY-lastY;lastY=scrollY;
    const inst=Math.min(1,Math.abs(dy)/Math.max(dt,1)/2.2);
    velocity+=(inst-velocity)*.12;

    // spring-like lag: the signal visibly catches up after a fast scroll.
    const stiffness=.048 + velocity*.018;
    p+=(targetP-p)*stiffness;
    if(Math.abs(targetP-p)<.00003)p=targetP;

    const head=position(p);
    const prev=trail[trail.length-1];
    if(!prev || Math.hypot(head.x-prev.x,head.y-prev.y)>.8){trail.push({x:head.x,y:head.y});}
    const wanted=Math.round(maxTrail + velocity*20);
    while(trail.length>wanted)trail.shift();

    ctx.clearRect(0,0,w,h);
    drawTrail(head,velocity);
    drawHead(head,velocity);

    document.documentElement.style.setProperty('--jx',head.x+'px');
    document.documentElement.style.setProperty('--jy',head.y+'px');
    document.documentElement.style.setProperty('--jv',velocity.toFixed(3));

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
