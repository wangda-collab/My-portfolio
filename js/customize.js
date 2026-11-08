/* Background scenes + movable photo sticker + customize panel */
(function(){
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const store = {
    get(k,d){ try{ const v=localStorage.getItem(k); return v===null?d:v }catch(e){ return d } },
    set(k,v){ try{ localStorage.setItem(k,v) }catch(e){} },
    del(k){ try{ localStorage.removeItem(k) }catch(e){} }
  };
  const DEFAULT_PHOTO = 'assets/pema.jpg';       // drop your photo here for the deployed site
  const DEFAULT_CLIP  = 'assets/background.mp4'; // drop your clip here for the deployed site

  /* ================= Background scene ================= */
  const scene = $('#scene');
  let bgObjectURL = null, bgIsImage = false, stopFx = null, parallaxOff = null;

  const MOUNTAINS = `
  <svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stop-color="#6F8CFF"/><stop offset=".55" stop-color="#FFB5A0"/><stop offset="1" stop-color="#FFE29A"/>
      </linearGradient>
    </defs>
    <rect width="1440" height="900" fill="url(#sky)"/>
    <g class="layer" data-depth="6"><circle cx="1060" cy="470" r="90" fill="#FFF3C4" opacity=".95"/></g>
    <g class="layer" data-depth="10"><path d="M0 560 L220 380 L360 480 L560 300 L760 500 L920 400 L1160 560 L1440 420 V900 H0Z" fill="#8E9BE0" opacity=".75"/></g>
    <g class="layer" data-depth="18"><path d="M0 640 L180 520 L340 610 L560 440 L740 620 L980 480 L1200 640 L1440 540 V900 H0Z" fill="#5A6BC0" opacity=".9"/></g>
    <g class="layer" data-depth="28"><path d="M0 740 L200 640 L420 740 L640 600 L860 750 L1080 650 L1300 760 L1440 700 V900 H0Z" fill="#33407F"/></g>
    <g class="layer" data-depth="40"><path d="M0 830 L260 750 L520 840 L800 760 L1100 850 L1440 780 V900 H0Z" fill="#1B2350"/></g>
  </svg>`;


  /* ---- Web technology slideshow (HTML, CSS, JS, responsive, deploy) ---- */
  const BG = `<defs><linearGradient id="wt" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#0B1230"/><stop offset="1" stop-color="#1A2760"/></linearGradient>
    <pattern id="wg" width="48" height="48" patternUnits="userSpaceOnUse"><path d="M48 0H0V48" fill="none" stroke="#7F95FF" stroke-opacity=".08"/></pattern></defs>
    <rect width="1440" height="900" fill="url(#wt)"/><rect width="1440" height="900" fill="url(#wg)"/>`;
  const svg = inner => `<svg viewBox="0 0 1440 900" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" class="wt">${BG}${inner}</svg>`;
  const T = (x,y,txt,c='#CFD8FF',sz=26,extra='') => `<text x="${x}" y="${y}" fill="${c}" font-size="${sz}" ${extra}>${txt}</text>`;
  const codeLines = (x,y,lines,gap=44) => lines.map((l,i)=>`<g class="ln" style="--i:${i}">${T(x,y+i*gap,l[0],l[1]||'#CFD8FF',28)}</g>`).join('');

  const SLIDES = [
    { name:'HTML · structure', svg: svg(`
      <rect x="300" y="130" width="840" height="640" rx="20" fill="#fff" fill-opacity=".05" stroke="#7F95FF" stroke-width="2"/>
      <circle cx="340" cy="168" r="8" fill="#FF8F7A"/><circle cx="368" cy="168" r="8" fill="#FFC93C"/><circle cx="396" cy="168" r="8" fill="#7BE0B5"/>
      <rect x="440" y="150" width="400" height="36" rx="18" fill="#fff" fill-opacity=".08"/>${T(462,176,'pema.dev','#9AA6C4',20)}
      <rect x="330" y="215" width="780" height="66" rx="10" fill="#2B50FF" fill-opacity=".45"/>${T(350,258,'&lt;header&gt;','#FFC93C')}
      <rect x="330" y="300" width="170" height="380" rx="10" fill="#7BE0B5" fill-opacity=".25"/>${T(346,345,'&lt;nav&gt;','#7BE0B5')}
      <rect x="520" y="300" width="590" height="380" rx="10" fill="#fff" fill-opacity=".07"/>${T(540,345,'&lt;main&gt;','#FFC93C')}
      <rect x="540" y="370" width="270" height="130" rx="8" fill="#7F95FF" fill-opacity=".35"/>${T(556,415,'&lt;section&gt;','#CFD8FF',22)}
      <rect x="830" y="370" width="260" height="130" rx="8" fill="#FF8F7A" fill-opacity=".3"/>${T(846,415,'&lt;section&gt;','#CFD8FF',22)}
      <rect x="540" y="520" width="550" height="140" rx="8" fill="#fff" fill-opacity=".06"/>${T(556,565,'&lt;article&gt;','#CFD8FF',22)}
      <rect x="330" y="700" width="780" height="50" rx="10" fill="#2B50FF" fill-opacity=".3"/>${T(350,734,'&lt;footer&gt;','#FFC93C',24)}
      <g class="float" style="--d:0s">${T(110,260,'&lt;h1&gt;','#7F95FF',44,'font-weight="700"')}</g>
      <g class="float" style="--d:-2s">${T(1190,330,'&lt;a href&gt;','#7BE0B5',38)}</g>
      <g class="float" style="--d:-4s">${T(1170,650,'&lt;img&gt;','#FFC93C',42)}</g>
      <g class="float" style="--d:-1s">${T(90,620,'&lt;p&gt;','#FF8F7A',48)}</g>`) },

    { name:'CSS · style', svg: svg(`
      <rect x="150" y="190" width="640" height="470" rx="20" fill="#fff" fill-opacity=".05" stroke="#7F95FF" stroke-width="2"/>
      ${codeLines(190,260,[['.card {','#FFC93C'],['  display: grid;','#CFD8FF'],['  gap: 1.25rem;','#CFD8FF'],['  color: #2B50FF;','#7F95FF'],['  border-radius: 14px;','#CFD8FF'],['  transition: .2s;','#CFD8FF'],['}','#FFC93C']],56)}
      <g class="float" style="--d:0s"><circle cx="980" cy="260" r="62" fill="#2B50FF"/></g>
      <g class="float" style="--d:-2s"><circle cx="1110" cy="340" r="62" fill="#FFC93C"/></g>
      <g class="float" style="--d:-3s"><circle cx="1000" cy="420" r="62" fill="#7BE0B5"/></g>
      <g class="float" style="--d:-1s"><circle cx="1130" cy="500" r="62" fill="#FF8F7A"/></g>
      <rect x="880" y="580" width="140" height="90" rx="12" fill="#7F95FF" fill-opacity=".55"/>
      <rect x="1040" y="580" width="140" height="90" rx="12" fill="#7F95FF" fill-opacity=".35"/>
      <rect x="1200" y="580" width="90" height="90" rx="12" fill="#7F95FF" fill-opacity=".2"/>
      ${T(880,725,'flexbox · grid · variables','#9AA6C4',24)}`) },

    { name:'JavaScript · behaviour', svg: svg(`
      <text x="1010" y="600" font-size="520" fill="#7F95FF" fill-opacity=".1" font-weight="800">{ }</text>
      <rect x="170" y="150" width="860" height="600" rx="20" fill="#fff" fill-opacity=".05" stroke="#7F95FF" stroke-width="2"/>
      ${codeLines(210,225,[['const skills = ["HTML", "CSS", "JS"];','#CFD8FF'],['skills.forEach(s =&gt; console.log(s));','#7BE0B5'],['',''],['button.addEventListener("click", () =&gt; {','#FFC93C'],['  document.body.classList.toggle("dark");','#CFD8FF'],['});','#FFC93C'],['',''],['fetch("/api/projects")','#FF8F7A'],['  .then(r =&gt; r.json());','#FF8F7A']],54)}`) },

    { name:'Responsive · every screen', svg: svg(`
      ${T(330,215,'@media (max-width: 820px) { … }','#FFC93C',34)}
      <rect x="310" y="290" width="380" height="250" rx="14" fill="none" stroke="#7F95FF" stroke-width="3"/>
      <rect x="326" y="306" width="348" height="34" rx="6" fill="#2B50FF" fill-opacity=".5"/><rect x="326" y="352" width="100" height="170" rx="6" fill="#7BE0B5" fill-opacity=".3"/><rect x="438" y="352" width="236" height="80" rx="6" fill="#fff" fill-opacity=".1"/><rect x="438" y="442" width="236" height="80" rx="6" fill="#FF8F7A" fill-opacity=".3"/>
      <rect x="470" y="545" width="80" height="22" rx="4" fill="#7F95FF" fill-opacity=".6"/>
      <rect x="750" y="270" width="200" height="290" rx="18" fill="none" stroke="#7F95FF" stroke-width="3"/>
      <rect x="766" y="290" width="168" height="30" rx="6" fill="#2B50FF" fill-opacity=".5"/><rect x="766" y="332" width="168" height="100" rx="6" fill="#fff" fill-opacity=".1"/><rect x="766" y="444" width="168" height="100" rx="6" fill="#FF8F7A" fill-opacity=".3"/>
      <rect x="1010" y="330" width="120" height="220" rx="18" fill="none" stroke="#7F95FF" stroke-width="3"/>
      <rect x="1022" y="350" width="96" height="24" rx="5" fill="#2B50FF" fill-opacity=".5"/><rect x="1022" y="384" width="96" height="70" rx="5" fill="#fff" fill-opacity=".1"/><rect x="1022" y="464" width="96" height="70" rx="5" fill="#FF8F7A" fill-opacity=".3"/>
      ${T(430,610,'1440 px','#9AA6C4',24)}${T(810,610,'820 px','#9AA6C4',24)}${T(1030,610,'390 px','#9AA6C4',24)}`) },

    { name:'Git · deploy', svg: svg(`
      ${[['150','&lt;/&gt;','Code','#7F95FF'],['470','GitHub','Repository','#7BE0B5'],['790','Vercel','or Pages','#FFC93C'],['1110','Live','pema.dev','#FF8F7A']].map(n=>
        `<rect x="${n[0]}" y="370" width="190" height="140" rx="20" fill="#fff" fill-opacity=".06" stroke="${n[3]}" stroke-width="3"/>${T(+n[0]+95,432,n[1],n[3],36,'text-anchor="middle" font-weight="700"')}${T(+n[0]+95,478,n[2],'#9AA6C4',22,'text-anchor="middle"')}`).join('')}
      ${[340,660,980].map(x=>`<line class="flow" x1="${x+8}" y1="440" x2="${x+122}" y2="440" stroke="#CFD8FF" stroke-width="3" stroke-dasharray="10 10"/><path d="M${x+122} 428 L${x+138} 440 L${x+122} 452" fill="none" stroke="#CFD8FF" stroke-width="3"/>`).join('')}
      ${T(720,620,'git push  →  build  →  online','#9AA6C4',30,'text-anchor="middle"')}`) }
  ];

  function webtech(){
    scene.innerHTML = '<div class="slides">'+SLIDES.map((s,k)=>`<div class="slide${k?'':' on'}">${s.svg}</div>`).join('')+'</div>';
    const els=$$('.slide',scene), label=$('#slide-name'), prev=$('#slide-prev'), next=$('#slide-next');
    let k=0, timer=null;
    const go=n=>{ els[k].classList.remove('on'); k=(n+els.length)%els.length; els[k].classList.add('on'); if(label) label.textContent=SLIDES[k].name; };
    const start=()=>{ clearInterval(timer); if(!reduce) timer=setInterval(()=>go(k+1),7000); };
    const onPrev=()=>{ go(k-1); start(); }, onNext=()=>{ go(k+1); start(); };
    prev?.addEventListener('click',onPrev); next?.addEventListener('click',onNext);
    if(label) label.textContent=SLIDES[0].name; start();
    stopFx=()=>{ clearInterval(timer); prev?.removeEventListener('click',onPrev); next?.removeEventListener('click',onNext); };
  }

  function clearScene(){
    if(stopFx){ stopFx(); stopFx=null; }
    if(parallaxOff){ parallaxOff(); parallaxOff=null; }
    scene.innerHTML='';
  }
  function parallax(){
    if(reduce) return;
    const layers = $$('.layer',scene);
    const move = e=>{
      const x=(e.clientX/innerWidth-.5), y=(e.clientY/innerHeight-.5);
      layers.forEach(l=>{ const d=+l.dataset.depth; l.style.transform=`translate(${-x*d}px,${-y*d*.5}px)`; });
    };
    addEventListener('pointermove',move);
    parallaxOff = ()=>removeEventListener('pointermove',move);
  }
  function stars(){
    const c=document.createElement('canvas'); scene.appendChild(c);
    const g=c.getContext('2d'); let W,H,pts=[],raf;
    const size=()=>{ W=c.width=innerWidth; H=c.height=innerHeight;
      pts=Array.from({length:Math.round(W*H/5500)},()=>({x:Math.random()*W,y:Math.random()*H,r:Math.random()*1.4+.3,p:Math.random()*6.3})); };
    const draw=t=>{
      const bg=g.createLinearGradient(0,0,0,H); bg.addColorStop(0,'#050A1E'); bg.addColorStop(1,'#1B2A5E');
      g.fillStyle=bg; g.fillRect(0,0,W,H);
      pts.forEach(s=>{ g.globalAlpha=.55+.45*Math.sin(t/700+s.p); g.fillStyle='#fff'; g.beginPath(); g.arc(s.x,s.y,s.r,0,6.3); g.fill(); });
      g.globalAlpha=1; if(!reduce) raf=requestAnimationFrame(draw);
    };
    size(); addEventListener('resize',size); draw(0);
    stopFx=()=>{ cancelAnimationFrame(raf); removeEventListener('resize',size); };
  }
  function clip(){
    const status=$('#custom-status');
    if(bgObjectURL){
      if(bgIsImage){ const im=document.createElement('img'); im.className='bg'; im.alt=''; im.src=bgObjectURL; scene.appendChild(im); }
      else addVideo(bgObjectURL);
      return;
    }
    addVideo(DEFAULT_CLIP, ()=>{ clearScene(); scene.innerHTML=MOUNTAINS; parallax();
      const f=$('#bg-file'); if(f){ $('#custom-panel').hidden=false; $('#custom-toggle').setAttribute('aria-expanded','true'); f.focus(); } });
  }
  function addVideo(src,onError){
    const v=document.createElement('video');
    v.muted=true; v.loop=true; v.autoplay=true; v.playsInline=true; v.setAttribute('muted','');
    v.src=src; if(onError) v.addEventListener('error',onError,{once:true});
    scene.appendChild(v); const p=v.play(); if(p&&p.catch) p.catch(()=>{});
  }
  function setScene(name,persist=true){
    clearScene();
    scene.dataset.kind=name; document.documentElement.dataset.scene=name;
    if(name==='webtech') webtech();
    else if(name==='mountains'){ scene.innerHTML=MOUNTAINS; parallax(); }
    else if(name==='night') stars();
    else if(name==='aurora') scene.innerHTML='<div class="aurora"><i></i><i></i><i></i></div>';
    else if(name==='clip') clip();
    const ctl=$('#slide-ctl'); if(ctl) ctl.hidden = name!=='webtech';
    $$('#scene-grid .chip').forEach(b=>b.setAttribute('aria-pressed', b.dataset.scene===name));
    if(persist) store.set('scene',name);
  }
  $('#bg-file')?.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return;
    if(bgObjectURL) URL.revokeObjectURL(bgObjectURL);
    bgObjectURL=URL.createObjectURL(f); bgIsImage=f.type.startsWith('image/');
    setScene('clip');
  });
  $('#scene-grid')?.addEventListener('click',e=>{ const b=e.target.closest('[data-scene]'); if(b) setScene(b.dataset.scene); });
  setScene(store.get('scene','webtech'),false);

  /* ================= Photo ================= */
  const sticker=$('#sticker'), face=$('.sticker-face',sticker), portrait=$('#portrait');
  function showPhoto(url){
    face.innerHTML=''; const i=document.createElement('img'); i.src=url; i.alt=''; face.appendChild(i);
    if(portrait){ portrait.innerHTML=''; const p=document.createElement('img'); p.src=url; p.alt='Photo of Pema Wangda'; portrait.appendChild(p); }
  }
  function showInitials(){
    face.textContent=face.dataset.initials;
    if(portrait) portrait.textContent=portrait.dataset.initials;
  }
  /* Photo search order: the <img> already written in the page, then common names in assets/ and media/ */
  const staticImg = portrait && portrait.querySelector('img');
  const STATIC_SRC = staticImg ? staticImg.getAttribute('src') : null;
  const PHOTO_NAMES = [...(STATIC_SRC?[STATIC_SRC]:[]),
    ...['assets','media'].flatMap(d=>['pema','Pema','profile','Profile','photo','me'].flatMap(n=>['jpg','jpeg','png','webp'].map(e=>d+'/'+n+'.'+e)))];
  function findPhoto(i=0){
    if(i>=PHOTO_NAMES.length){ showInitials(); return; }
    const probe=new Image(); probe.onload=()=>showPhoto(PHOTO_NAMES[i]); probe.onerror=()=>findPhoto(i+1); probe.src=PHOTO_NAMES[i];
  }
  function loadPhoto(){
    const saved=store.get('photo');
    if(saved){ showPhoto(saved); return; }
    findPhoto();
  }
  $('#photo-file')?.addEventListener('change',e=>{
    const f=e.target.files[0]; if(!f) return;
    const img=new Image(), url=URL.createObjectURL(f);
    img.onload=()=>{
      const s=Math.min(img.width,img.height), c=document.createElement('canvas'); c.width=c.height=320;
      c.getContext('2d').drawImage(img,(img.width-s)/2,(img.height-s)/2,s,s,0,0,320,320);
      const data=c.toDataURL('image/jpeg',.88); URL.revokeObjectURL(url);
      store.set('photo',data); showPhoto(data);
    };
    img.src=url;
  });

  /* ================= Movable sticker ================= */
  const emojis=['👋','😄','🎉','💻','🏔️','✨'], lines=['Hi, I’m Pema! 👋','Nice to meet you!','Thanks for visiting 🎉','Let’s build something','Made with HTML, CSS & JS','Drag me anywhere ✨'];
  const bubble=$('.sticker-bubble',sticker), badge=$('.sticker-emoji',sticker);
  let ei=0, size=+store.get('size',96), pos=null, bt;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  function place(x,y){
    x=clamp(x,0,innerWidth-size); y=clamp(y,0,innerHeight-size);
    sticker.style.transform=`translate(${x}px,${y}px)`; pos={x,y};
  }
  function savePos(){ store.set('pos',JSON.stringify({x:pos.x/innerWidth,y:pos.y/innerHeight})); }
  function setSize(n){ size=n; sticker.style.setProperty('--sticker-size',n+'px'); store.set('size',n); if(pos) place(pos.x,pos.y); }
  function speak(){
    bubble.textContent=lines[ei]; bubble.classList.add('show'); clearTimeout(bt); bt=setTimeout(()=>bubble.classList.remove('show'),2200);
  }
  function nextEmoji(){ ei=(ei+1)%emojis.length; badge.textContent=emojis[ei]; speak(); }

  sticker.style.setProperty('--sticker-size',size+'px');
  const sp=JSON.parse(store.get('pos','null')||'null');
  place(sp? sp.x*innerWidth : innerWidth-size-24, sp? sp.y*innerHeight : innerHeight-size-90);
  addEventListener('resize',()=>place(pos.x,pos.y));

  let drag=null;
  sticker.addEventListener('pointerdown',e=>{
    sticker.setPointerCapture(e.pointerId);
    drag={dx:e.clientX-pos.x,dy:e.clientY-pos.y,sx:e.clientX,sy:e.clientY,moved:false};
    sticker.classList.add('dragging');
  });
  sticker.addEventListener('pointermove',e=>{
    if(!drag) return;
    if(Math.hypot(e.clientX-drag.sx,e.clientY-drag.sy)>4) drag.moved=true;
    place(e.clientX-drag.dx,e.clientY-drag.dy);
  });
  const end=()=>{ if(!drag) return; sticker.classList.remove('dragging'); if(drag.moved) savePos(); else nextEmoji(); drag=null; };
  sticker.addEventListener('pointerup',end);
  sticker.addEventListener('pointercancel',()=>{ drag&&(drag.moved=true); end(); });
  sticker.addEventListener('keydown',e=>{
    const step=e.shiftKey?40:12, k={ArrowLeft:[-step,0],ArrowRight:[step,0],ArrowUp:[0,-step],ArrowDown:[0,step]}[e.key];
    if(k){ e.preventDefault(); place(pos.x+k[0],pos.y+k[1]); savePos(); }
    else if(e.key==='Enter'||e.key===' '){ e.preventDefault(); nextEmoji(); }
  });
  loadPhoto();

  /* ================= Panel ================= */
  const tbtn=$('#custom-toggle'), panel=$('#custom-panel'), range=$('#sticker-size');
  range.value=size;
  range.addEventListener('input',()=>setSize(+range.value));
  tbtn.addEventListener('click',()=>{ const open=panel.hidden; panel.hidden=!open; tbtn.setAttribute('aria-expanded',open); });
  document.addEventListener('keydown',e=>{ if(e.key==='Escape'&&!panel.hidden){ panel.hidden=true; tbtn.setAttribute('aria-expanded','false'); tbtn.focus(); } });
  $('#custom-reset').addEventListener('click',()=>{
    ['scene','photo','pos','size'].forEach(store.del);
    if(bgObjectURL){ URL.revokeObjectURL(bgObjectURL); bgObjectURL=null; }
    setSize(96); range.value=96; place(innerWidth-96-24,innerHeight-96-90); setScene('webtech',false); loadPhoto();
  });
})();