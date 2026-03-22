/* ── WRITING CAROUSEL — drag + arrows ── */
(function(){
  const wrap = document.getElementById('writingWrap');
  const car  = document.getElementById('writingCarousel');
  const arL  = document.getElementById('wArrowL');
  const arR  = document.getElementById('wArrowR');
  if(!wrap || !car) return;

  const cardW = () => car.querySelector('.wcard')?.offsetWidth || 480;

  function updateArrows(){
    if(!arL || !arR) return;
    arL.classList.toggle('disabled', wrap.scrollLeft <= 4);
    arR.classList.toggle('disabled', wrap.scrollLeft >= wrap.scrollWidth - wrap.clientWidth - 4);
  }
  wrap.addEventListener('scroll', updateArrows, {passive:true});
  updateArrows();

  if(arL) arL.addEventListener('click', ()=>{ wrap.scrollBy({left:-cardW(), behavior:'smooth'}); });
  if(arR) arR.addEventListener('click', ()=>{ wrap.scrollBy({left:cardW(), behavior:'smooth'}); });

  let isDown=false, startX=0, scrollLeft=0, velX=0, lastX=0, rafId=null, totalMoved=0;

  wrap.addEventListener('mousedown', e=>{
    if(e.target.closest('.warrow')) return;
    isDown=true; startX=e.pageX; scrollLeft=wrap.scrollLeft;
    velX=0; lastX=e.pageX; totalMoved=0;
    wrap.style.cursor='grabbing';
    cancelAnimationFrame(rafId);
  });

  window.addEventListener('mouseup', ()=>{
    if(!isDown) return;
    isDown=false;
    wrap.style.cursor='grab';
    (function glide(){
      velX*=0.88;
      if(Math.abs(velX)>0.8){ wrap.scrollLeft+=velX; rafId=requestAnimationFrame(glide); }
    })();
  });

  window.addEventListener('mousemove', e=>{
    if(!isDown) return;
    e.preventDefault();
    const dx=e.pageX-startX;
    totalMoved=Math.abs(dx);
    velX=e.pageX-lastX; lastX=e.pageX;
    wrap.scrollLeft=scrollLeft-dx;
  });

  car.querySelectorAll('a').forEach(a=>{
    a.addEventListener('click', e=>{ if(totalMoved>5) e.preventDefault(); });
  });

  let tX=0, tSL=0;
  wrap.addEventListener('touchstart', e=>{ tX=e.touches[0].pageX; tSL=wrap.scrollLeft; },{passive:true});
  wrap.addEventListener('touchmove',  e=>{ wrap.scrollLeft=tSL-(e.touches[0].pageX-tX); },{passive:true});
})();