/* ── GALLERY RIPPLE CANVAS ── */
(function(){
  const canvas = document.getElementById('gt-canvas');
  if(!canvas) return;
  const gt = document.getElementById('gallery-teaser');
  const ctx = canvas.getContext('2d');
  const ripples = [];
  let animFrame;

  function resize(){
    canvas.width = gt.offsetWidth;
    canvas.height = gt.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Ripple class
  function Ripple(x, y){
    this.x = x; this.y = y;
    this.r = 0;
    this.maxR = Math.random() * 120 + 80;
    this.alpha = 0.55;
    this.speed = Math.random() * 1.8 + 1.2;
  }
  Ripple.prototype.update = function(){
    this.r += this.speed;
    this.alpha = 0.55 * (1 - this.r / this.maxR);
  };
  Ripple.prototype.draw = function(ctx){
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(196,144,122,${this.alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  };
  Ripple.prototype.done = function(){
    return this.r >= this.maxR;
  };

  // On hover add ripple at mouse position
  gt.addEventListener('mousemove', function(e){
    const rect = gt.getBoundingClientRect();
    // Only add every ~60ms to avoid flooding
    if(!this._lastRipple || Date.now() - this._lastRipple > 60){
      ripples.push(new Ripple(e.clientX - rect.left, e.clientY - rect.top));
      this._lastRipple = Date.now();
    }
  });

  // Click burst — 4 ripples at once
  gt.addEventListener('click', function(e){
    const rect = gt.getBoundingClientRect();
    for(let i=0;i<4;i++){
      const r = new Ripple(e.clientX - rect.left, e.clientY - rect.top);
      r.maxR = 80 + i * 55;
      r.speed = 2.5 - i * 0.3;
      ripples.push(r);
    }
  });

  // Auto-seed a slow ambient ripple when idle on hover
  let seedInterval;
  gt.addEventListener('mouseenter', function(){
    seedInterval = setInterval(()=>{
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const r = new Ripple(x, y);
      r.maxR = Math.random() * 80 + 40;
      r.speed = 0.8;
      r.alpha = 0.25;
      ripples.push(r);
    }, 400);
  });
  gt.addEventListener('mouseleave', ()=>{
    clearInterval(seedInterval);
  });

  function loop(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = ripples.length-1; i >= 0; i--){
      ripples[i].update();
      ripples[i].draw(ctx);
      if(ripples[i].done()) ripples.splice(i, 1);
    }
    animFrame = requestAnimationFrame(loop);
  }
  loop();
})();

/* ── CURSOR ── */
const cd=document.getElementById('cd'),cr=document.getElementById('cr');
let mx=0,my=0,rx=0,ry=0;
document.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;cd.style.left=mx+'px';cd.style.top=my+'px';});
(function ar(){rx+=(mx-rx)*.13;ry+=(my-ry)*.13;cr.style.left=rx+'px';cr.style.top=ry+'px';requestAnimationFrame(ar)})();
document.querySelectorAll('a,button,.proj-card,.blog-card,.interest-list li,.edu-card,.award-item').forEach(el=>{
  el.addEventListener('mouseenter',()=>{cr.style.width='44px';cr.style.height='44px';cr.style.borderColor='var(--rose)';});
  el.addEventListener('mouseleave',()=>{cr.style.width='28px';cr.style.height='28px';cr.style.borderColor='rgba(196,144,122,.4)';});
});

/* ── NAV ── */
window.addEventListener('scroll',()=>document.getElementById('nav').classList.toggle('scrolled',scrollY>60));
const navham  = document.getElementById('navham');
const mnav    = document.getElementById('mnav');
const mclose  = document.getElementById('mnavclose');

function openMnav(){
  mnav.classList.add('open');
  navham.classList.add('open');
  document.body.style.overflow='hidden';
}
function closeMnav(){
  mnav.classList.remove('open');
  navham.classList.remove('open');
  document.body.style.overflow='';
}

navham.addEventListener('click', ()=> mnav.classList.contains('open') ? closeMnav() : openMnav());
if(mclose) mclose.addEventListener('click', closeMnav);
mnav.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMnav));
// Close on backdrop click
mnav.addEventListener('click', e => { if(e.target === mnav) closeMnav(); });
// Close on Escape key
document.addEventListener('keydown', e => { if(e.key === 'Escape') closeMnav(); });

/* ── PARALLAX ──
   Layered approach:
   1. Hero bg words drift at different rates (depth split)
   2. Section deco letters drift slowly on scroll
   3. Gallery background word drifts
   4. Hero pull quote has subtle horizontal drift on mouse
*/
const bgw1=document.getElementById('bgw1');
const bgw2=document.getElementById('bgw2');
const bgw3=document.getElementById('bgw3');
const heroPull=document.getElementById('heroPull');
const gtBgWord=document.getElementById('gtBgWord');

// Hero left col parallax — bg words at different depths
const heroEl=document.getElementById('hero');
function onScroll(){
  const s=scrollY;
  const hh=heroEl.offsetHeight;

  // hero words — three layers at distinct depths
  if(s<hh*1.2){
    if(bgw1) bgw1.style.transform=`translateY(${s*0.22}px)`;
    if(bgw2) bgw2.style.transform=`translateY(${s*-0.12}px)`;
    if(bgw3) bgw3.style.transform=`translateY(${s*0.08}px)`;
  }

  // deco letters in sections — slow drift
  document.querySelectorAll('.deco-letter[data-parallax]').forEach(el=>{
    const rate=parseFloat(el.dataset.parallax)||0.04;
    const rect=el.parentElement.getBoundingClientRect();
    const offset=(window.innerHeight/2-rect.top)*rate;
    el.style.transform=`translateY(${offset}px)`;
  });

  // gallery bg word parallax
  if(gtBgWord){
    const gr=gtBgWord.parentElement.getBoundingClientRect();
    const gOffset=(window.innerHeight/2-gr.top)*0.12;
    gtBgWord.style.transform=`translateY(calc(-50% + ${gOffset}px))`;
  }
}
window.addEventListener('scroll',onScroll,{passive:true});
onScroll();

// Mouse parallax on hero pull quote — subtle horizontal tilt
document.addEventListener('mousemove',e=>{
  if(!heroPull)return;
  const xRel=(e.clientX/window.innerWidth-.5)*8;
  const yRel=(e.clientY/window.innerHeight-.5)*4;
  heroPull.style.transform=`translate(${xRel}px,${yRel}px)`;
});

/* ── SCROLL REVEAL ── */
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('vs');io.unobserve(e.target);}});},{threshold:.07});
document.querySelectorAll('.rv').forEach(el=>io.observe(el));

/* ── SKILLS HERO CARDS — staggered border draw on scroll ── */
const sfObserver=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(e.isIntersecting){
      const cards=e.target.querySelectorAll('[data-sf]');
      cards.forEach((c,i)=>setTimeout(()=>c.classList.add('sf-active'),i*150));
      sfObserver.unobserve(e.target);
    }
  });
},{threshold:.2});
const sfSection=document.querySelector('.skills-featured');
if(sfSection) sfObserver.observe(sfSection);