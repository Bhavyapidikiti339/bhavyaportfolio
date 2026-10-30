/* Original portfolio motion, recreated without a framework or external libraries. */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)');
  const fine = matchMedia('(hover: hover) and (pointer: fine)');
  const cleanup = [];
  const activeAnimations = new Set();
  const activeTimers = new Set();
  function animate(el, frames, options) {
    if (reduce.matches || !el.animate) return;
    const motion = el.animate(frames, options);
    activeAnimations.add(motion);
    motion.finished.catch(() => {}).finally(() => activeAnimations.delete(motion));
    return motion;
  }
  function later(fn, delay) {
    const timer = setTimeout(() => { activeTimers.delete(timer); fn(); }, delay);
    activeTimers.add(timer);
    return timer;
  }
  function element(tag, className, text) {
    const el = document.createElement(tag);
    el.className = className;
    if (text) el.textContent = text;
    return el;
  }

  // The intro never hides the document from assistive technology or traps focus.
  if (!reduce.matches) {
    const boot = element('aside', 'boot-sequence');
    boot.setAttribute('aria-label', 'Portfolio introduction');
    boot.innerHTML = '<div class="boot-content"><span class="boot-code">BHAVYA PIDIKITI / DATA SYSTEMS</span><p class="boot-message" aria-hidden="true">INITIALIZING SYSTEM…</p><div class="boot-track" aria-hidden="true"><span></span></div><button type="button" class="boot-skip">Skip intro ↗</button></div>';
    document.body.append(boot);
    const finish = () => { boot.classList.add('boot-complete'); later(() => boot.remove(), 600); };
    boot.querySelector('button').addEventListener('click', finish);
    const messages = ['CONNECTING DATA SOURCES…', 'VALIDATING PIPELINES…', 'ACCESS GRANTED.'];
    messages.forEach((message, index) => later(() => { const label = boot.querySelector('.boot-message'); if (label) label.textContent = message; }, 450 + index * 650));
    later(finish, 2500);
    cleanup.push(() => boot.remove());
  }

  // Cycling typewriter: the accessible name remains stable while letters change.
  const role = element('p', 'typewriter-role');
  role.setAttribute('aria-label', 'AI Data Engineer. Cloud data platforms. RAG and semantic search.');
  const typed = element('span', '', 'AI Data Engineer');
  typed.setAttribute('aria-hidden', 'true');
  role.append(typed, element('span', 'typing-cursor'));
  document.querySelector('.hero h1').after(role);
  const roles = ['AI Data Engineer', 'Engineering Cloud Data Platforms', 'Building RAG & Semantic Search', 'Connecting Data to Intelligence'];
  let roleIndex = 0, letter = roles[0].length, deleting = false;
  function typeRole() {
    if (reduce.matches) { typed.textContent = roles[0]; return; }
    const word = roles[roleIndex];
    letter += deleting ? -1 : 1;
    typed.textContent = word.slice(0, Math.max(0, letter));
    if (!deleting && letter >= word.length) { deleting = true; later(typeRole, 1700); }
    else if (deleting && letter <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; later(typeRole, 350); }
    else later(typeRole, deleting ? 30 : 55);
  }
  if (!reduce.matches) later(typeRole, 1800);

  // Live terminal, alongside the original pipeline graphic.
  const pipeline = document.querySelector('.pipeline');
  const visuals = element('div', 'hero-visuals');
  pipeline.before(visuals); visuals.append(pipeline);
  const terminal = element('div', 'data-terminal');
  terminal.setAttribute('aria-label', 'Animated data engineering terminal illustration');
  terminal.innerHTML = '<div class="terminal-bar"><div class="terminal-dots" aria-hidden="true"><i></i><i></i><i></i></div><span>bhavya / data-platform</span></div><div class="terminal-output" aria-hidden="true"></div><span class="sr-only">Python and SQL pipelines transform raw data into validated datasets for AI retrieval.</span>';
  visuals.append(terminal);
  const output = terminal.querySelector('.terminal-output');
  const lines = ['$ python pipeline.py --source cloud', '✓ Ingestion complete: batch + streaming', '$ dbt run --target warehouse', '✓ Transformations validated', '$ python build_embeddings.py', '✓ Retrieval index ready', '$ airflow dags trigger data_platform', '✓ Pipeline ready for analytics & AI'];
  let lineIndex = 0, charIndex = 0, currentLine;
  function terminalTick() {
    if (reduce.matches) return;
    if (!currentLine) { currentLine = element('div', lines[lineIndex].startsWith('✓') ? 'terminal-success' : 'terminal-command'); output.append(currentLine); }
    currentLine.textContent = lines[lineIndex].slice(0, ++charIndex);
    if (charIndex >= lines[lineIndex].length) {
      charIndex = 0; currentLine = null; lineIndex++;
      if (lineIndex === lines.length) { later(() => { output.replaceChildren(); lineIndex = 0; terminalTick(); }, 3800); return; }
      if (output.children.length > 5) output.firstElementChild.remove();
      later(terminalTick, 650);
    } else later(terminalTick, 26);
  }
  if (reduce.matches) lines.slice(0,4).forEach(line => output.append(element('div', 'terminal-success', line)));
  else later(terminalTick, 800);

  // Orbiting skill system: rotating tracks, counter-rotating labels, scan lines.
  const orbit = element('div', 'skill-orbit');
  orbit.setAttribute('aria-hidden', 'true');
  orbit.innerHTML = '<div class="orbit-ring ring-one"></div><div class="orbit-ring ring-two"></div><div class="orbit-ring ring-three"></div><div class="orbit-center">BP<span>DATA SYSTEMS</span></div>';
  const orbitTrack = element('div', 'orbit-track');
  ['Python', 'SQL', 'Spark', 'Kafka', 'GCP', 'Azure', 'AWS', 'RAG'].forEach((label,index) => {
    const satellite = element('div', 'orbit-satellite'); satellite.style.setProperty('--angle', `${index * 45}deg`);
    satellite.append(element('span', '', label)); orbitTrack.append(satellite);
  });
  orbit.append(orbitTrack);
  const orbitPanel = element('div', 'orbit-panel'); orbitPanel.append(orbit, element('p', 'orbit-caption', 'DISTRIBUTED DATA / CONNECTED INTELLIGENCE'));
  document.querySelector('.about > div:first-child').append(orbitPanel);

  // A deterministic point cloud projected in 3D, plus moving satellites and rings.
  const canvases = [];
  function addStarfield(parent, globe) {
    const canvas = element('canvas', globe ? 'network-globe' : 'hero-stars');
    canvas.setAttribute('aria-hidden', 'true');
    const context = canvas.getContext('2d');
    if (!context) return;
    parent.prepend(canvas);
    let width = 0, height = 0, visible = true;
    const points = Array.from({length: globe ? 420 : 260}, (_,index) => {
      const y = 1 - (index / ((globe ? 420 : 260) - 1)) * 2;
      const radius = Math.sqrt(1-y*y), angle = index * 2.399963;
      return [Math.cos(angle)*radius, y, Math.sin(angle)*radius];
    });
    const resize = () => { const bounds = parent.getBoundingClientRect(); width = bounds.width; height = globe ? 330 : bounds.height; const dpr = Math.min(devicePixelRatio || 1, 2); canvas.width = Math.round(width*dpr); canvas.height = Math.round(height*dpr); canvas.style.width = `${width}px`; canvas.style.height = `${height}px`; context.setTransform(dpr,0,0,dpr,0,0); };
    resize();
    if ('ResizeObserver' in window) { const ro = new ResizeObserver(resize); ro.observe(parent); }
    else window.addEventListener('resize', resize);
    if ('IntersectionObserver' in window) { const io = new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }); io.observe(parent); }
    const draw = time => {
      if (!visible || !width || !height) return;
      context.clearRect(0,0,width,height);
      const rotation = time * .00008;
      const scale = globe ? Math.min(width*.34,130) : Math.max(width,height)*.51;
      for (const [x,y,z] of points) {
        const rx=x*Math.cos(rotation)+z*Math.sin(rotation), rz=z*Math.cos(rotation)-x*Math.sin(rotation);
        const ry=y*Math.cos(rotation*.4)-rz*Math.sin(rotation*.4);
        const depth=1/(1.7-rz*.32);
        context.beginPath();context.fillStyle=`rgba(105,226,229,${globe ? .2+(rz+1)*.3 : .1+(rz+1)*.16})`;
        context.arc(width/2+rx*scale*depth,height/2+ry*scale*depth,globe?1.15:1.3,0,Math.PI*2);context.fill();
      }
      if(globe){
        [0,1,2].forEach(index=>{context.save();context.translate(width/2,height/2);context.rotate(index*.65-.7);context.strokeStyle=index%2?'#b5a1f25c':'#69e2e54d';context.lineWidth=1;context.beginPath();context.ellipse(0,0,145-index*15,45+index*12,0,0,Math.PI*2);context.stroke();const angle=rotation*(index+1)+index*2;context.fillStyle=index%2?'#b5a1f2':'#69e2e5';context.beginPath();context.arc(Math.cos(angle)*(145-index*15),Math.sin(angle)*(45+index*12),3,0,Math.PI*2);context.fill();context.restore();});
      }
    };
    canvases.push(draw); draw(0);
  }
  document.querySelector('.hero').classList.add('starfield-host');
  addStarfield(document.querySelector('.hero'), false);
  const globeHost = element('div', 'globe-host');
  globeHost.append(element('p','globe-label','GLOBAL DATA NETWORK / USA'));
  document.querySelector('.contact-layout > div:first-child').append(globeHost);
  addStarfield(globeHost, true);
  let frame;
  function drawFrame(time) { canvases.forEach(draw=>draw(time)); frame=requestAnimationFrame(drawFrame); }
  function syncCanvas() { cancelAnimationFrame(frame); if(!reduce.matches&&!document.hidden) frame=requestAnimationFrame(drawFrame); else canvases.forEach(draw=>draw(0)); }
  document.addEventListener('visibilitychange', syncCanvas); syncCanvas();

  // Accessible project/skill selectors retain all content when JavaScript is absent.
  function makeTabs(container, cards, labels, className, prefix) {
    const tabs=element('div', `animated-tabs ${className}`); tabs.setAttribute('role','tablist'); tabs.setAttribute('aria-label',prefix);
    const buttons=[];
    const select = (index, focus=false) => {
      cards.forEach((card,i)=>{ card.hidden=i!==index; buttons[i].setAttribute('aria-selected',String(i===index));buttons[i].tabIndex=i===index?0:-1; });
      const card=cards[index];
      animate(card,[{opacity:0,transform:'perspective(1200px) rotateX(-8deg) scale(.96)'},{opacity:1,transform:'perspective(1200px) rotateX(0) scale(1)'}],{duration:450,easing:'cubic-bezier(.2,.7,.25,1)'});
      card.querySelectorAll('.tags span').forEach((tag,i)=>animate(tag,[{opacity:0,filter:'blur(8px)',transform:'translateX(20px)'},{opacity:1,filter:'blur(0)',transform:'translateX(0)'}],{duration:400,delay:i*65,fill:'backwards'}));
      if(focus) buttons[index].focus();
    };
    cards.forEach((card,index)=>{
      const tab=element('button','animated-tab',labels[index]);tab.type='button';tab.id=`${prefix}-tab-${index}`;card.id=card.id||`${prefix}-panel-${index}`;tab.setAttribute('role','tab');tab.setAttribute('aria-controls',card.id);card.setAttribute('role','tabpanel');card.setAttribute('aria-labelledby',tab.id);card.tabIndex=0;
      tab.addEventListener('click',()=>select(index));
      tab.addEventListener('keydown',event=>{let next;if(event.key==='ArrowRight'||event.key==='ArrowDown')next=(index+1)%cards.length;if(event.key==='ArrowLeft'||event.key==='ArrowUp')next=(index-1+cards.length)%cards.length;if(event.key==='Home')next=0;if(event.key==='End')next=cards.length-1;if(next!==undefined){event.preventDefault();select(next,true);}});
      buttons.push(tab);tabs.append(tab);
    });
    container.before(tabs);container.classList.add('tabbed-panels');select(0);
  }
  const projects=document.querySelector('.project-grid');
  makeTabs(projects,[...projects.children],['01 / Fraud detection','02 / Inventory optimization'],'project-tabs','projects');
  const skills=document.querySelector('.skills-grid');
  makeTabs(skills,[...skills.children],['AI / LLMOps','Data pipelines','Cloud platforms','Programming','Data quality','CI/CD'],'skill-tabs','skills');

  // Animated expertise bars indicate categories, not invented proficiency scores.
  document.querySelectorAll('.skill').forEach(card=>{const bar=element('div','expertise-bar');bar.setAttribute('aria-hidden','true');bar.append(element('span'));card.append(bar);});
  document.querySelectorAll('.education').forEach(card=>{const bar=element('div','education-progress');bar.setAttribute('aria-hidden','true');bar.append(element('span'));card.append(bar);});

  // Text decoding on hover/focus, with the original readable label preserved for AT.
  document.querySelectorAll('.project-card h3,.skill h3').forEach(heading=>{
    const original=heading.textContent;heading.setAttribute('aria-label',original);
    const text=element('span','decode-text',original);text.setAttribute('aria-hidden','true');heading.replaceChildren(text);
    let timer;
    function decode(){
      if(reduce.matches) return; clearInterval(timer);let step=0;
      timer=setInterval(()=>{step+=2;text.textContent=[...original].map((char,index)=>index<step||char===' '?char:'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'[Math.floor(Math.random()*36)]).join('');if(step>=original.length){clearInterval(timer);text.textContent=original;}},25);
    }
    const card=heading.closest('article');card.addEventListener('pointerenter',decode);card.addEventListener('focusin',decode);
    const reset=()=>{clearInterval(timer);text.textContent=original;};card.addEventListener('pointerleave',reset);cleanup.push(reset);
  });
  document.querySelectorAll('.button').forEach(button=>{
    button.addEventListener('pointerdown',()=>animate(button,[{transform:'scale(1)'},{transform:'scale(.95)'},{transform:'scale(1)'}],{duration:220}));
  });
  reduce.addEventListener('change',()=>{
    if(reduce.matches){activeTimers.forEach(clearTimeout);activeTimers.clear();activeAnimations.forEach(a=>a.cancel());activeAnimations.clear();cleanup.forEach(fn=>fn());typed.textContent=roles[0];output.replaceChildren(...lines.slice(0,4).map(line=>element('div','terminal-success',line)));}
    syncCanvas();
  });
})();
