(function(){
  const svg = p => '<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
  const ICON = {
    moon: svg('<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>'),
    sun:  svg('<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>'),
    menu: svg('<line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/>'),
    close:svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>')
  };
  const $ = (s,c=document)=>c.querySelector(s);
  const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Footer year */
  const yr = $('#year'); if(yr) yr.textContent = new Date().getFullYear();

  /* Theme toggle (remembers choice) */
  const root = document.documentElement, tbtn = $('#theme-toggle');
  const isDark = ()=> root.dataset.theme ? root.dataset.theme==='dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  function paint(){ if(tbtn){ const d=isDark(); tbtn.innerHTML = d?ICON.sun:ICON.moon; tbtn.setAttribute('aria-label', d?'Switch to light theme':'Switch to dark theme'); } }
  if(tbtn){ tbtn.addEventListener('click',()=>{
    const next = isDark()?'light':'dark'; root.dataset.theme = next;
    try{localStorage.setItem('theme',next)}catch(e){} paint();
  }); paint(); }

  /* Mobile menu */
  const mbtn = $('#menu-toggle'), nav = $('#nav');
  if(mbtn && nav){
    mbtn.addEventListener('click',()=>{
      const open = nav.classList.toggle('open');
      mbtn.setAttribute('aria-expanded', open); mbtn.innerHTML = open?ICON.close:ICON.menu;
    });
    document.addEventListener('keydown',e=>{ if(e.key==='Escape' && nav.classList.contains('open')) mbtn.click(); });
  }

  /* Rotating role text on Home */
  const role = $('#role');
  if(role){
    const words = (role.dataset.roles||'').split(',').map(s=>s.trim()).filter(Boolean);
    if(reduce || !words.length){ role.textContent = words[0]||''; }
    else{
      let w=0,i=0,del=false;
      (function tick(){
        const word = words[w];
        role.textContent = word.slice(0,i);
        if(!del && i<word.length){ i++; setTimeout(tick,90); }
        else if(!del){ del=true; setTimeout(tick,1400); }
        else if(i>0){ i--; setTimeout(tick,45); }
        else { del=false; w=(w+1)%words.length; setTimeout(tick,250); }
      })();
    }
  }

  /* Skill meters fill when visible */
  const meters = $$('.meter i');
  if(meters.length){
    const fill = el=> el.style.width = el.dataset.level+'%';
    if('IntersectionObserver' in window && !reduce){
      const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ fill(e.target); io.unobserve(e.target);} }),{threshold:.4});
      meters.forEach(m=>io.observe(m));
    } else meters.forEach(fill);
  }

  /* Project filter */
  const chips = $$('.chip');
  if(chips.length){
    chips.forEach(chip=>chip.addEventListener('click',()=>{
      chips.forEach(c=>c.setAttribute('aria-pressed', c===chip));
      const f = chip.dataset.filter;
      $$('.project').forEach(p=>{ p.hidden = !(f==='all' || p.dataset.type.split(' ').includes(f)); });
      const n = $$('.project').filter(p=>!p.hidden).length;
      const live = $('#count'); if(live) live.textContent = n+' project'+(n===1?'':'s')+' shown';
    }));
  }

  /* Contact form validation */
  const form = $('#contact-form');
  if(form){
    const rules = {
      name:v=>v.trim().length>=2 || 'Enter your name.',
      email:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) || 'Enter a valid email address.',
      message:v=>v.trim().length>=10 || 'Write at least 10 characters.'
    };
    const check = f=>{
      const msg = rules[f.name](f.value), err = $('#'+f.name+'-error');
      err.textContent = msg===true ? '' : msg; f.setAttribute('aria-invalid', msg!==true);
      return msg===true;
    };
    $$('input,textarea',form).forEach(f=>f.addEventListener('blur',()=>check(f)));
    form.addEventListener('submit',e=>{
      e.preventDefault();
      const fields = $$('input,textarea',form), ok = fields.map(check).every(Boolean);
      const status = $('#status');
      if(!ok){ status.textContent='Fix the highlighted fields and try again.'; fields.find(f=>f.getAttribute('aria-invalid')==='true').focus(); return; }
      const d = Object.fromEntries(new FormData(form));
      const to = form.dataset.to;
      location.href = `mailto:${to}?subject=${encodeURIComponent('Portfolio message from '+d.name)}&body=${encodeURIComponent(d.message+'\n\n— '+d.name+' ('+d.email+')')}`;
      status.textContent='Opening your email app to send the message.'; form.reset();
    });
  }
})();
