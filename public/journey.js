(() => {
  const $ = (s,r=document)=>r.querySelector(s);
  const $$ = (s,r=document)=>[...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const anyFine = matchMedia('(any-pointer:fine)').matches;

  ['#scrollStory','#kineticBand','.velocity-ticker','.e2-manifesto','.e2-rail'].forEach(sel=> $$(sel).forEach(el=>el.remove()));
  $$('.tilt,.magnet').forEach(el=>{el.classList.remove('tilt','magnet');el.style.transform='';});
  $('#journeyCanvas')?.remove();

  const canvas=document.createElement('canvas');
  canvas.id='journeyCanvas';
  canvas.setAttribute('aria-hidden','true');
  document.body.appendChild(canvas);

  let ctx;
  try { ctx=canvas.getContext('2d',{alpha:true,desynchronized:true}) || canvas.getContext('2d'); }
  catch { ctx=null; }
  if(!ctx) return;

  let w=innerWidth,h=innerHeight,dpr=1;
  let mouseLike=anyFine;
  let pointerKind=anyFine?'mouse':'touch';
  let hasPointer=false,touchReturnAt=0;
  let target={x:w*.68,y:h*.36};
  let pointerSpeed=0,lastPX=target.x,lastPY=target.y,lastPointerT=performance.now();
  let lastInteraction=performance.now(),scrollKick=0,lastScrollY=scrollY;
  let clickPulse=0,pulseX=target.x,pulseY=target.y,hot=0;
  const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));

  const chainCount = reduce ? 26 : (anyFine ? 44 : 28);
  const chain=Array.from({length:chainCount},()=>({x:target.x,y:target.y}));
  const particles=[];

  function resize(){
    dpr=Math.min(devicePixelRatio||1, mouseLike?1.5:1.25);
    w=innerWidth;h=innerHeight;
    canvas.width=Math.max(1,Math.floor(w*dpr));
    canvas.height=Math.max(1,Math.floor(h*dpr));
    canvas.style.width=w+'px';canvas.style.height=h+'px';
    ctx.setTransform(dpr,0,0,dpr,0,0);
  }
  addEventListener('resize',resize,{passive:true});
  resize();

  function setPointer(x,y,kind='mouse',now=performance.now()){
    if(!Number.isFinite(x)||!Number.isFinite(y)) return;
    pointerKind=kind||'mouse';
    mouseLike=pointerKind!=='touch';
    const dt=Math.max(8,now-lastPointerT);
    const dist=Math.hypot(x-lastPX,y-lastPY);
    const inst=clamp(dist/dt/1.45,0,1.6);
    pointerSpeed+=(inst-pointerSpeed)*.34;
    lastPX=x;lastPY=y;lastPointerT=now;lastInteraction=now;
    target.x=x;target.y=y;hasPointer=true;
  }

  function pulseAt(x,y){pulseX=x;pulseY=y;clickPulse=1;lastInteraction=performance.now();}

  // Listen to real pointer events in every browser. Hybrid Windows devices can
  // report pointer:fine differently between Chrome/Yandex/Edge.
  if('PointerEvent' in window){
    addEventListener('pointermove',e=>{
      if(e.pointerType==='touch') return;
      setPointer(e.clientX,e.clientY,e.pointerType||'mouse',e.timeStamp||performance.now());
    },{passive:true});
    addEventListener('pointerdown',e=>{
      if(e.pointerType==='touch'){
        setPointer(e.clientX,e.clientY,'touch',e.timeStamp||performance.now());
        touchReturnAt=performance.now()+700;
      }else setPointer(e.clientX,e.clientY,e.pointerType||'mouse',e.timeStamp||performance.now());
      pulseAt(e.clientX,e.clientY);
    },{passive:true});
    addEventListener('pointerleave',e=>{if(e.pointerType!=='touch')hasPointer=false;},{passive:true});
    addEventListener('pointerenter',e=>{if(e.pointerType!=='touch')setPointer(e.clientX,e.clientY,e.pointerType||'mouse',e.timeStamp||performance.now());},{passive:true});
  }else{
    addEventListener('mousemove',e=>setPointer(e.clientX,e.clientY,'mouse',e.timeStamp||performance.now()),{passive:true});
    addEventListener('mousedown',e=>{setPointer(e.clientX,e.clientY,'mouse');pulseAt(e.clientX,e.clientY);},{passive:true});
  }

  addEventListener('touchstart',e=>{
    const t=e.touches?.[0];if(!t)return;
    setPointer(t.clientX,t.clientY,'touch');pulseAt(t.clientX,t.clientY);touchReturnAt=performance.now()+700;
  },{passive:true});
  addEventListener('touchmove',e=>{
    const t=e.touches?.[0];if(!t)return;
    setPointer(t.clientX,t.clientY,'touch');touchReturnAt=performance.now()+550;
  },{passive:true});
  addEventListener('touchend',()=>{touchReturnAt=performance.now()+380;},{passive:true});

  function autoTarget(now){
    const max=Math.max(1,document.documentElement.scrollHeight-innerHeight);
    const p=clamp(scrollY/max);
    const drift=now*.00018;
    return {
      x:w*(.10+.80*(.5+.5*Math.sin(p*Math.PI*5.6+drift))),
      y:h*(.24+.50*(.5+.5*Math.sin(p*Math.PI*3.1+1.05+drift*.55)))
    };
  }

  addEventListener('scroll',()=>{
    const dy=scrollY-lastScrollY;lastScrollY=scrollY;
    scrollKick=clamp(scrollKick+dy*.045,-42,42);
  },{passive:true});

  const reactiveSelector='.video-card,.zero-card,.idea-card,.tech-flow article,.quality-banner,.truth-card,.community-card,.voice-stage,.timeline-stage,.audience-card,.expert-card';
  let activeSurface=null;
  function reflectAt(x,y){
    if(!mouseLike) return;
    const under=document.elementFromPoint(x,y);
    const el=under?.closest?.(reactiveSelector);
    const interactive=under?.closest?.('a,button,input,textarea,select,.video-card');
    hot+=(Number(Boolean(interactive))-hot)*.18;
    if(activeSurface&&activeSurface!==el)activeSurface.classList.remove('journey-lit');
    activeSurface=el||null;
    if(!el)return;
    const r=el.getBoundingClientRect();
    el.style.setProperty('--light-x',(x-r.left)+'px');
    el.style.setProperty('--light-y',(y-r.top)+'px');
    el.classList.add('journey-lit');
  }

  function spawnParticles(head,speed){
    if(reduce||!mouseLike||speed<.26)return;
    const amount=speed>.85?2:1;
    for(let i=0;i<amount;i++){
      if(particles.length>30)particles.shift();
      const a=Math.random()*Math.PI*2,s=.2+Math.random()*.65+speed*.42;
      particles.push({x:head.x+(Math.random()-.5)*6,y:head.y+(Math.random()-.5)*6,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,size:.6+Math.random()*1.3,lime:Math.random()>.48});
    }
  }

  function drawParticles(){
    ctx.save();ctx.globalCompositeOperation='lighter';
    for(let i=particles.length-1;i>=0;i--){
      const p=particles[i];p.x+=p.vx;p.y+=p.vy;p.vx*=.985;p.vy*=.985;p.life-=.028;
      if(p.life<=0){particles.splice(i,1);continue;}
      ctx.globalAlpha=p.life*.62;ctx.fillStyle=p.lime?'#dfff68':'#68e8ff';ctx.shadowBlur=7;ctx.shadowColor=ctx.fillStyle;
      ctx.beginPath();ctx.arc(p.x,p.y,p.size*p.life,0,Math.PI*2);ctx.fill();
    }
    ctx.restore();
  }

  function ribbonPath(offsetScale=0){
    ctx.beginPath();const last=chain.length-1;
    for(let i=last;i>=0;i--){
      const p=chain[i],age=i/last,yy=p.y+scrollKick*age*offsetScale;
      if(i===last)ctx.moveTo(p.x,yy);
      else{
        const prev=chain[Math.min(last,i+1)],pa=Math.min(last,i+1)/last,py=prev.y+scrollKick*pa*offsetScale;
        ctx.quadraticCurveTo(prev.x,py,(prev.x+p.x)/2,(py+yy)/2);
      }
    }
  }

  function drawRibbon(speed){
    const head=chain[0],tail=chain[chain.length-1];
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.lineCap='round';ctx.lineJoin='round';
    ribbonPath(1);
    let g=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
    g.addColorStop(0,'rgba(104,232,255,0)');g.addColorStop(.5,'rgba(104,232,255,.035)');g.addColorStop(.82,'rgba(104,232,255,.13)');g.addColorStop(1,'rgba(223,255,104,.30)');
    ctx.strokeStyle=g;ctx.lineWidth=(mouseLike?16:11)+speed*13;ctx.shadowBlur=22+speed*18;ctx.shadowColor='rgba(104,232,255,.22)';ctx.stroke();
    ribbonPath(.6);
    g=ctx.createLinearGradient(tail.x,tail.y,head.x,head.y);
    g.addColorStop(0,'rgba(104,232,255,0)');g.addColorStop(.58,'rgba(104,232,255,.07)');g.addColorStop(.88,'rgba(104,232,255,.48)');g.addColorStop(1,'rgba(223,255,104,.88)');
    ctx.strokeStyle=g;ctx.lineWidth=(mouseLike?2.8:2)+speed*3.2;ctx.shadowBlur=12;ctx.shadowColor='rgba(104,232,255,.38)';ctx.stroke();
    ribbonPath(.16);ctx.strokeStyle=`rgba(248,255,232,${.45+Math.min(speed,.8)*.28})`;ctx.lineWidth=.7+speed*.6;ctx.shadowBlur=6;ctx.shadowColor='#dfff68';ctx.stroke();
    ctx.restore();
  }

  let prevHX=target.x,prevHY=target.y,dirX=1,dirY=0;
  function drawCompanion(head,speed,now){
    const dx=head.x-prevHX,dy=head.y-prevHY;prevHX=head.x;prevHY=head.y;
    const len=Math.hypot(dx,dy);if(len>.05){dirX+=(dx/len-dirX)*.18;dirY+=(dy/len-dirY)*.18;}
    const dl=Math.hypot(dirX,dirY)||1,nx=dirX/dl,ny=dirY/dl;
    const idle=clamp((now-lastInteraction-700)/2200,0,1);
    const pulse=1+Math.sin(now*.0055)*(.035+idle*.025);
    const blinkPhase=now%6100,blink=blinkPhase>5600&&blinkPhase<5740?.16:1;
    const bodyR=(9.2+speed*1.7-hot*.7)*pulse;

    ctx.save();ctx.globalCompositeOperation='lighter';
    const radius=(38+speed*19+hot*4)*pulse;
    const halo=ctx.createRadialGradient(head.x,head.y,0,head.x,head.y,radius);
    halo.addColorStop(0,'rgba(255,255,255,.82)');halo.addColorStop(.08,'rgba(223,255,104,.76)');halo.addColorStop(.22,'rgba(104,232,255,.38)');halo.addColorStop(.5,'rgba(157,131,255,.09)');halo.addColorStop(1,'rgba(104,232,255,0)');
    ctx.fillStyle=halo;ctx.beginPath();ctx.arc(head.x,head.y,radius,0,Math.PI*2);ctx.fill();ctx.restore();

    ctx.save();ctx.translate(head.x,head.y);ctx.rotate(Math.atan2(ny,nx)*.18);
    ctx.fillStyle='rgba(5,8,12,.78)';ctx.strokeStyle='rgba(126,239,255,.86)';ctx.lineWidth=.9;ctx.shadowBlur=10;ctx.shadowColor='rgba(104,232,255,.55)';
    ctx.beginPath();ctx.ellipse(0,0,bodyR,bodyR*.72*blink,0,0,Math.PI*2);ctx.fill();ctx.stroke();
    const px=nx*(2.2+speed*.7),py=ny*(2+speed*.6)*blink;
    ctx.fillStyle='#f8ffe9';ctx.shadowBlur=13;ctx.shadowColor='#dfff68';ctx.beginPath();ctx.arc(px,py,2.1+hot*.35,0,Math.PI*2);ctx.fill();ctx.restore();

    if(!reduce){
      ctx.save();ctx.globalCompositeOperation='lighter';const orbit=now*.0013;
      for(let i=0;i<2;i++){
        const a=orbit+i*Math.PI,rr=bodyR+5.5+i*1.4,ox=head.x+Math.cos(a)*rr,oy=head.y+Math.sin(a)*rr*.58;
        ctx.fillStyle=i?'rgba(223,255,104,.75)':'rgba(104,232,255,.8)';ctx.shadowBlur=8;ctx.shadowColor=ctx.fillStyle;ctx.beginPath();ctx.arc(ox,oy,1.05,0,Math.PI*2);ctx.fill();
      }
      ctx.restore();
    }
  }

  function drawClickPulse(){
    if(clickPulse<=.01)return;
    const t=1-clickPulse,r=12+t*44;
    ctx.save();ctx.globalCompositeOperation='lighter';ctx.globalAlpha=clickPulse*.55;ctx.strokeStyle='rgba(104,232,255,.8)';ctx.lineWidth=1;ctx.shadowBlur=10;ctx.shadowColor='#68e8ff';ctx.beginPath();ctx.arc(pulseX,pulseY,r,0,Math.PI*2);ctx.stroke();ctx.restore();
    clickPulse*=.9;
  }

  let lastNow=performance.now();
  function frame(now){
    const dt=Math.min(2,Math.max(.5,(now-lastNow)/16.67));lastNow=now;
    if(pointerKind==='touch'&&hasPointer&&now>touchReturnAt)hasPointer=false;
    if(!hasPointer){const a=autoTarget(now);target.x=a.x;target.y=a.y;}
    else if(mouseLike&&now-lastInteraction>900){target.x+=Math.sin(now*.0021)*.035;target.y+=Math.cos(now*.0018)*.03;}

    const headFollow=(mouseLike?.56:.42)*(reduce?.82:1);
    chain[0].x+=(target.x-chain[0].x)*Math.min(1,headFollow*dt);
    chain[0].y+=(target.y-chain[0].y)*Math.min(1,headFollow*dt);
    for(let i=1;i<chain.length;i++){
      const prev=chain[i-1],p=chain[i];
      const stiffness=Math.max(mouseLike?.07:.085,(mouseLike?.30:.34)-i*(mouseLike?.00435:.008));
      p.x+=(prev.x-p.x)*stiffness*dt;p.y+=(prev.y-p.y)*stiffness*dt;
    }

    pointerSpeed*=mouseLike?.965:.94;scrollKick*=.91;
    const speed=clamp(pointerSpeed,0,1.25),head=chain[0];
    ctx.clearRect(0,0,w,h);
    drawRibbon(speed);spawnParticles(head,speed);drawParticles();drawCompanion(head,speed,now);drawClickPulse();
    reflectAt(head.x,head.y);
    document.documentElement.style.setProperty('--jx',head.x+'px');
    document.documentElement.style.setProperty('--jy',head.y+'px');
    document.documentElement.style.setProperty('--jv',String(clamp(speed,0,1)));
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();