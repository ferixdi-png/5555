(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];

  // Keep the page visually calm: one continuous motion language only.
  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail'].forEach(sel=> $$(sel).forEach(el=>el.remove()));
  $$('.tilt,.magnet').forEach(el=>{el.classList.remove('tilt','magnet');el.style.transform='';});

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

  const worksP=$('#works .section-head.split>p');
  if(worksP) worksP.textContent='Здесь мои реальные генерации из этого доступа. Не демо платформы и не постановочные мокапы сайта — обычные тесты, которые я сам запускал. Открой любой ролик крупно и оцени качество без лишней рекламы.';

  if(reduce) return;

  const canvas=document.createElement('canvas');
  canvas.id='journeyCanvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);
  const ctx=canvas.getContext('2d',{alpha:true,desynchronized:true});
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

  const fine=matchMedia('(pointer:fine)').matches;
  let target={x:w*.72,y:h*.34};
  let hasPointer=false;
  let pointerSpeed=0,lastPX=target.x,lastPY=target.y,lastPointerT=performance.now();
  let scrollKick=0,lastScrollY=scrollY;

  const N=fine?42:30;
  const chain=Array.from({length:N},()=>({x:target.x,y:target.y}));
  const particles=[];
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  function setPointer(x,y,now=performance.now()){
    const dt=Math.max(8,now-lastPointerT);
    const dist=Math.hypot(x-lastPX,y-lastPY);
    const inst=clamp(dist/dt/1.55,0,1.6);
    pointerSpeed += (inst-pointerSpeed)*.34;
    lastPX=x;lastPY=y;lastPointerT=now;
    target.x=x;target.y=y;hasPointer=true;
  }

  if(fine){
    addEventListener('pointermove',e=>setPointer(e.clientX,e.clientY,e.timeStamp||performance.now()),{passive:true});
    addEventListener('pointerdown',e=>setPointer(e.clientX,e.clientY,e.timeStamp||performance.now()),{passive:true});
  } else {
    addEventListener('touchstart',e=>{const t=e.touches[0];if(t)setPointer(t.clientX,t.clientY);},{passive:true});
    addEventListener('touchmove',e=>{const t=e.touches[0];if(t)setPointer(t.clientX,t.clientY);},{passive:true});
  }

  addEventListener('scroll',()=>{
    const dy=scrollY-lastScrollY;lastScrollY=scrollY;
    scrollKick=clamp(scrollKick+dy*.055,-46,46);
    if(!fine && !hasPointer){
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      const p=clamp(scrollY/max);
      target.x=w*(.12+.76*(.5+.5*Math.sin(p*Math.PI*5.2)));
      target.y=h*(.34+.30*(.5+.5*Math.sin(p*Math.PI*2.7+1.1)));
    }
  },{passive:true});

  // The same light source softly reflects in the surface directly under it.
  const reactiveSelector='.video-card,.zero-card,.why-card,.idea-card,.tech-flow article,.quality-banner,.truth-card,.community-card,.contact-shell,.voice-stage,.timeline-stage';
  let activeSurface=null;
  function reflectAt(x,y){
    if(!fine) return;
    const el=document.elementFromPoint(x,y)?.closest?.(reactiveSelector);
    if(activeSurface && activeSurface!==el) activeSurface.classList.remove('journey-lit');
    activeSurface=el||null;
    if(!el) return;
    const r=el.getBoundingClientRect();
    el.style.setProperty('--light-x',(x-r.left)+'px');
    el.style.setProperty('--light-y',(y-r.top)+'px');
    el.classList.add('journey-lit');
  }

  function spawnParticles(head,speed){
    if(speed<.18) return;
    const amount=speed>.8?2:1;
    for(let i=0;i<amount;i++){
      if(particles.length>36) particles.shift();
      const a=Math.random()*Math.PI*2;
      const s=.22+Math.random()*.72+speed*.45;
      particles.push({
        x:head.x+(Math.random()-.5)*7,
        y:head.y+(Math.random()-.5)*7,
        vx:Math.cos(a)*s,
        vy:Math.sin(a)*s,
        life:1,
        size:.7+Math.random()*1.5,
        lime:Math.random()>.48
      });
    }
  }

  function drawParticles(){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];
      p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy*=.985;p.life-=.026;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.globalAlpha=p.life*.7;
      ctx.fillStyle=p.lime?'#dfff68':'#68e8ff';
      ctx.shadowBlur=8;ctx.shadowColor=ctx.fillStyle;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function ribbonPath(offsetScale=0){
    ctx.beginPath();
    const last=chain.length-1;
    for(let i=last;i>=0;i--){
      const p=chain[i];
      const age=i/last;
      const yy=p.y+scrollKick*age*offsetScale;
      if(i===last) ctx.moveTo(p.x,yy);
      else {
        const prev=chain[Math.min(last,i+1)];
        const prevAge=Math.min(last,i+1)/last;
        const py=prev.y+scrollKick*prevAge*offsetScale;
        ctx.quadraticCurveTo(prev.x,py,(prev.x+p.x)/2,(py+yy)/2);
      }
    }
    ctx.lineTo(chain[0].x,chain[0].y);
  }

  function drawRibbon(speed){
    const head=chain[0],tail=chain[chain.length-1];
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';

    ribbonPath(1);
    let g=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
    g.addColorStop(0,'rgba(104,232,255,0)');
    g.addColorStop(.42,'rgba(104,232,255,.035)');
    g.addColorStop(.78,'rgba(104,232,255,.13)');
    g.addColorStop(1,'rgba(223,255,104,.34)');
    ctx.strokeStyle=g;ctx.lineWidth=18+speed*15;ctx.shadowBlur=25+speed*22;ctx.shadowColor='rgba(104,232,255,.24)';ctx.stroke();

    ribbonPath(.65);
    g=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
    g.addColorStop(0,'rgba(104,232,255,0)');
    g.addColorStop(.52,'rgba(104,232,255,.08)');
    g.addColorStop(.86,'rgba(104,232,255,.52)');
    g.addColorStop(1,'rgba(223,255,104,.94)');
    ctx.strokeStyle=g;ctx.lineWidth=3.2+speed*3.6;ctx.shadowBlur=14;ctx.shadowColor='rgba(104,232,255,.42)';ctx.stroke();

    ribbonPath(.2);
    ctx.strokeStyle=`rgba(248,255,232,${.50+Math.min(speed,.8)*.32})`;
    ctx.lineWidth=.72+speed*.7;ctx.shadowBlur=7;ctx.shadowColor='#dfff68';ctx.stroke();
    ctx.restore();
  }

  function drawHead(head,speed,now){
    ctx.save();ctx.globalCompositeOperation='lighter';
    const pulse=1+Math.sin(now*.006)*.06;
    const radius=(42+speed*22)*pulse;
    const halo=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,radius);
    halo.addColorStop(0,'rgba(255,255,255,.98)');
    halo.addColorStop(.055,'rgba(223,255,104,.98)');
    halo.addColorStop(.18,'rgba(104,232,255,.46)');
    halo.addColorStop(.46,'rgba(157,131,255,.11)');
    halo.addColorStop(1,'rgba(104,232,255,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(head.x,head.y,radius,0,Math.PI*2);ctx.fill();

    ctx.strokeStyle='rgba(255,255,255,.82)';ctx.lineWidth=.8;
    ctx.shadowBlur=12;ctx.shadowColor='#68e8ff';
    ctx.beginPath();ctx.arc(head.x,head.y,5.5+speed*2.2,0,Math.PI*2);ctx.stroke();

    ctx.fillStyle='#fbffe9';ctx.shadowBlur=20;ctx.shadowColor='#dfff68';
    ctx.beginPath();ctx.arc(head.x,head.y,2.25+speed*.9,0,Math.PI*2);ctx.fill();
    ctx.restore();
  }

  let lastNow=performance.now();
  function frame(now){
    const dt=Math.min(2,Math.max(.5,(now-lastNow)/16.67));lastNow=now;

    if(!fine && !hasPointer){
      const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
      const p=clamp(scrollY/max);
      const drift=now*.00012;
      target.x=w*(.13+.74*(.5+.5*Math.sin(p*Math.PI*5.2+drift)));
      target.y=h*(.30+.37*(.5+.5*Math.sin(p*Math.PI*2.8+1.1)));
    }

    // Head is anchored to the cursor; every following point has more inertia.
    chain[0].x += (target.x-chain[0].x)*Math.min(1,.52*dt);
    chain[0].y += (target.y-chain[0].y)*Math.min(1,.52*dt);
    for(let i=1;i<chain.length;i++){
      const prev=chain[i-1],p=chain[i];
      const stiffness=Math.max(.07,.30-i*.0044);
      p.x += (prev.x-p.x)*stiffness*dt;
      p.y += (prev.y-p.y)*stiffness*dt;
    }

    pointerSpeed*=.965;
    scrollKick*=.91;
    const speed=clamp(pointerSpeed,0,1.25);
    const head=chain[0];

    ctx.clearRect(0,0,w,h);
    drawRibbon(speed);
    spawnParticles(head,speed);
    drawParticles();
    drawHead(head,speed,now);

    document.documentElement.style.setProperty('--jx',head.x+'px');
    document.documentElement.style.setProperty('--jy',head.y+'px');
    document.documentElement.style.setProperty('--jv',speed.toFixed(3));
    reflectAt(head.x,head.y);

    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();