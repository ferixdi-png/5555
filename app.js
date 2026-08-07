(() => {
  const nav=document.getElementById('nav');
  const onScroll=()=>nav.classList.toggle('scrolled',scrollY>20);onScroll();addEventListener('scroll',onScroll,{passive:true});

  const io=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)e.target.classList.add('in')}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

  document.querySelectorAll('video').forEach(v=>{
    const p=v.parentElement?.querySelector('.media-placeholder');
    v.addEventListener('loadeddata',()=>{if(p)p.style.display='none'});
    if(v.muted){const vis=new IntersectionObserver(([e])=>{if(e.isIntersecting)v.play().catch(()=>{});else v.pause()},{threshold:.25});vis.observe(v)}
  });

  const audio=document.getElementById('autoAudio');
  if(audio){audio.volume=.95;audio.play().catch(()=>{});}

  if(matchMedia('(pointer:fine)').matches){
    document.querySelectorAll('[data-tilt]').forEach(card=>{
      const amount=+card.dataset.tilt||5;
      card.addEventListener('pointermove',e=>{const r=card.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;card.style.transform=`perspective(1100px) rotateX(${-y*amount}deg) rotateY(${x*amount}deg) translateZ(0)`});
      card.addEventListener('pointerleave',()=>card.style.transform='');
    });
  }

  const canvas=document.getElementById('world');
  const gl=canvas.getContext('webgl',{antialias:false,alpha:false,powerPreference:'high-performance'});
  if(!gl){canvas.style.background='radial-gradient(circle at 70% 18%,#15343e,transparent 34%),radial-gradient(circle at 20% 68%,#283016,transparent 38%),#05070a';return;}
  const vs=`attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
  const fs=`precision highp float;
uniform vec2 r;uniform float t;uniform float s;uniform vec2 m;
float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);} 
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.48;}return v;}
vec3 pal(float x){vec3 a=vec3(.50,.52,.52),b=vec3(.48,.50,.50),c=vec3(1.,1.,1.),d=vec3(.02,.16,.33);return a+b*cos(6.28318*(c*x+d));}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*r.xy)/min(r.x,r.y);
 float scroll=s;
 vec2 mouse=(m-.5)*.28;
 uv+=mouse*vec2(.6,-.45);
 float tt=t*.11;
 vec2 q=uv;
 q.x+=.14*sin(q.y*2.6+tt*1.8+scroll*2.2);
 q.y+=.12*cos(q.x*2.2-tt*1.5-scroll*1.5);
 float n=fbm(q*2.15+vec2(tt*.8,-tt*.55));
 float d1=length(q-vec2(.62+.12*sin(tt+scroll*2.),.34+.11*cos(tt*1.4)))-(.34+.08*n);
 float d2=length(q-vec2(-.58+.14*cos(tt*.8-scroll),-.26+.10*sin(tt*1.3)))-(.42+.07*n);
 float d3=length(q-vec2(.08+.18*sin(tt*.7),-.72+.10*cos(tt+scroll)))-(.28+.06*n);
 float field=exp(-7.5*abs(d1))+exp(-7.0*abs(d2))+exp(-8.0*abs(d3));
 float glow=exp(-2.9*length(uv-vec2(.18*sin(tt),.08*cos(tt*.7))));
 vec3 base=vec3(.018,.026,.040);
 vec3 c1=pal(n*.9+scroll*.22+tt*.2);
 c1=mix(c1,vec3(.86,1.,.44),.22);
 vec3 col=base+c1*field*.22;
 col+=vec3(.18,.72,.82)*pow(glow,5.)*.12;
 col+=vec3(.65,.52,1.)*exp(-5.*length(uv-vec2(-.7,.55)))*.045;
 float vig=1.-smoothstep(.3,1.25,length(uv));col*=.66+.34*vig;
 col+=noise(gl_FragCoord.xy*.45+t)*.012;
 gl_FragColor=vec4(col,1.);
}`;
  const shader=(type,src)=>{const sh=gl.createShader(type);gl.shaderSource(sh,src);gl.compileShader(sh);return sh};
  const prog=gl.createProgram();gl.attachShader(prog,shader(gl.VERTEX_SHADER,vs));gl.attachShader(prog,shader(gl.FRAGMENT_SHADER,fs));gl.linkProgram(prog);gl.useProgram(prog);
  const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),gl.STATIC_DRAW);
  const loc=gl.getAttribLocation(prog,'p');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
  const ur=gl.getUniformLocation(prog,'r'),ut=gl.getUniformLocation(prog,'t'),us=gl.getUniformLocation(prog,'s'),um=gl.getUniformLocation(prog,'m');
  let mx=.5,my=.5;addEventListener('pointermove',e=>{mx=e.clientX/innerWidth;my=e.clientY/innerHeight},{passive:true});
  const resize=()=>{const cap=innerWidth<700?1.0:1.35,d=Math.min(devicePixelRatio||1,cap);canvas.width=Math.max(1,innerWidth*d);canvas.height=Math.max(1,innerHeight*d);canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';gl.viewport(0,0,canvas.width,canvas.height)};resize();addEventListener('resize',resize,{passive:true});
  const start=performance.now();let last=0;
  const draw=now=>{requestAnimationFrame(draw);if(document.hidden)return;if(now-last<24&&innerWidth<700)return;last=now;gl.uniform2f(ur,canvas.width,canvas.height);gl.uniform1f(ut,(now-start)/1000);gl.uniform1f(us,scrollY/Math.max(1,document.documentElement.scrollHeight-innerHeight));gl.uniform2f(um,mx,my);gl.drawArrays(gl.TRIANGLES,0,6)};requestAnimationFrame(draw);
})();
