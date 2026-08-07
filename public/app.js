(() => {
  const $ = (s, r=document) => r.querySelector(s);
  const $$ = (s, r=document) => [...r.querySelectorAll(s)];

  const nav = $('#nav');
  const onScroll = () => nav?.classList.toggle('scrolled', scrollY > 24);
  addEventListener('scroll', onScroll, {passive:true}); onScroll();

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, {threshold:.12, rootMargin:'0px 0px -5% 0px'});
  $$('.reveal').forEach(el => io.observe(el));

  const glow = $('#cursorGlow');
  if (matchMedia('(pointer:fine)').matches && glow) {
    addEventListener('pointermove', e => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
    }, {passive:true});
  }

  if (matchMedia('(pointer:fine)').matches) {
    $$('.tilt').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX-r.left)/r.width - .5;
        const y = (e.clientY-r.top)/r.height - .5;
        card.style.transform = `perspective(900px) rotateX(${-y*5}deg) rotateY(${x*7}deg) translateY(-2px)`;
      });
      card.addEventListener('pointerleave', () => card.style.transform = '');
    });
  }

  if (matchMedia('(pointer:fine)').matches) {
    $$('.magnet').forEach(btn => {
      btn.addEventListener('pointermove', e => {
        const r = btn.getBoundingClientRect();
        btn.style.transform = `translate(${(e.clientX-r.left-r.width/2)*.08}px, ${(e.clientY-r.top-r.height/2)*.08}px)`;
      });
      btn.addEventListener('pointerleave', () => btn.style.transform = '');
    });
  }

  const wave = $('#waveform');
  if (wave) {
    for (let i=0;i<46;i++) {
      const b=document.createElement('i');
      const h=15 + Math.sin(i*.63)*18 + Math.random()*40;
      b.style.height = `${Math.max(10,h)}px`;
      b.style.animationDelay = `${(i%9)*-.08}s`;
      b.style.animationDuration = `${.7 + (i%7)*.08}s`;
      wave.appendChild(b);
    }
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

  const videoIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      const v=e.target;
      if(e.isIntersecting) v.play().catch(()=>{});
      else v.pause();
    });
  },{threshold:.22});

  function updateVideoState(){
    if(countEl) countEl.textContent=loaded;
    if(empty) empty.style.display = checked>=20 && loaded===0 ? 'block' : 'none';
  }

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
        loaded++;checked++;card.dataset.ready='1';updateVideoState();videoIO.observe(v);
      },{once:true});
      v.addEventListener('error',()=>{checked++;card.remove();updateVideoState();},{once:true});
      card.addEventListener('click',()=>{
        if(!card.dataset.ready || !modal?.showModal) return;
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

  const stage=$('.timeline-stage'), progress=$('#timelineProgress');
  function timeline(){
    if(!stage || !progress) return;
    const r=stage.getBoundingClientRect();
    const p=Math.max(0,Math.min(1,(innerHeight-r.top)/(innerHeight+r.height*.35)));
    progress.style.width=(p*100)+'%';
  }
  addEventListener('scroll',timeline,{passive:true}); timeline();

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
      const res=await fetch('/api/lead',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        name:data.name||'',phone:data.phone,consent:true,website:''
      })});
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

  const canvas=$('#shader');
  const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
  if(!canvas || reduce) return;
  const gl=canvas.getContext('webgl',{alpha:false,antialias:false,powerPreference:'low-power'});
  if(!gl) return;

  const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`precision highp float;
  uniform vec2 r;uniform float t;uniform vec2 m;uniform float s;
  mat2 R(float a){float c=cos(a),d=sin(a);return mat2(c,-d,d,c);}
  float sdSphere(vec3 p,float q){return length(p)-q;}
  float sdTorus(vec3 p,vec2 q){vec2 x=vec2(length(p.xz)-q.x,p.y);return length(x)-q.y;}
  float map(vec3 p){
    p.xz*=R(.22*sin(t*.12)+m.x*.35+s*.06);
    p.xy*=R(.18*cos(t*.1)+m.y*.2);
    float a=sdTorus(p,vec2(1.32,.18));
    vec3 q=p;q.y+=.1*sin(t*.3);q.xz*=R(t*.08);
    float b=sdSphere(q,1.03+.06*sin(t*.4));
    return min(a,b+.18);
  }
  vec3 normal(vec3 p){
    vec2 e=vec2(.002,0.);float d=map(p);
    return normalize(vec3(map(p+e.xyy)-d,map(p+e.yxy)-d,map(p+e.yyx)-d));
  }
  void main(){
    vec2 uv=(gl_FragCoord.xy*2.-r)/min(r.x,r.y);
    vec3 ro=vec3(0.,0.,3.7),rd=normalize(vec3(uv,-1.8));
    float d=0.;vec3 p;float hit=0.;
    for(int i=0;i<34;i++){p=ro+rd*d;float h=map(p);if(h<.002){hit=1.;break;}d+=h*.72;if(d>7.)break;}
    vec3 col=vec3(.018,.02,.035);
    float vign=1.-smoothstep(.25,1.35,length(uv));
    col+=vec3(.02,.03,.05)*vign;
    if(hit>0.){
      vec3 n=normal(p);vec3 l=normalize(vec3(-.5,.8,.7));
      float dif=max(dot(n,l),0.);
      float rim=pow(1.-max(dot(n,-rd),0.),2.4);
      vec3 c1=vec3(.42,.92,1.);vec3 c2=vec3(.87,1.,.4);vec3 c3=vec3(.62,.48,1.);
      vec3 cc=mix(c1,c2,.5+.5*sin(p.y*2.2+t*.18));
      cc=mix(cc,c3,.35+.25*sin(p.x*2.));
      col+=cc*(dif*.12+rim*.32)*(.5+.5*vign);
    }
    float stars=step(.9975,fract(sin(dot(floor(gl_FragCoord.xy/3.),vec2(12.9898,78.233)))*43758.5453));
    col+=stars*.08;
    col*=.76+.24*vign;
    gl_FragColor=vec4(col,1.);
  }`;

  function shader(type,src){const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);return sh}
  const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const ur=gl.getUniformLocation(prog,'r'),ut=gl.getUniformLocation(prog,'t'),um=gl.getUniformLocation(prog,'m'),us=gl.getUniformLocation(prog,'s');
  let mx=0,my=0;
  addEventListener('pointermove',e=>{mx=(e.clientX/innerWidth-.5)*2;my=(e.clientY/innerHeight-.5)*2},{passive:true});
  function resize(){const d=Math.min(devicePixelRatio||1,1.35);canvas.width=Math.floor(innerWidth*d);canvas.height=Math.floor(innerHeight*d);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,canvas.width,canvas.height)}
  addEventListener('resize',resize,{passive:true});resize();
  const start=performance.now();
  function frame(now){
    if(document.hidden){requestAnimationFrame(frame);return}
    gl.uniform2f(ur,canvas.width,canvas.height);gl.uniform1f(ut,(now-start)/1000);gl.uniform2f(um,mx,my);gl.uniform1f(us,scrollY/Math.max(innerHeight,1));
    gl.drawArrays(gl.TRIANGLES,0,6);requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();