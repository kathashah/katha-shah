/* ============================================================
   writing-base.js
   Shared across ALL pages in /writing/
   Cursor · Nav scroll · Progress bar · Scroll reveal
   ============================================================ */

(function () {
  'use strict';

  /* ── CURSOR ── */
  const cd = document.getElementById('cd');
  const cr = document.getElementById('cr');
  if (cd && cr) {
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX; my = e.clientY;
      cd.style.left = mx + 'px';
      cd.style.top  = my + 'px';
    });

    (function animateRing() {
      rx += (mx - rx) * 0.13;
      ry += (my - ry) * 0.13;
      cr.style.left = rx + 'px';
      cr.style.top  = ry + 'px';
      requestAnimationFrame(animateRing);
    })();

    /* Cursor expand on interactive elements */
    document.querySelectorAll('a, button, .proj-card, .blog-card, .ef-link').forEach(el => {
      el.addEventListener('mouseenter', () => {
        cr.style.width = '44px';
        cr.style.height = '44px';
        cr.style.borderColor = 'var(--rose)';
      });
      el.addEventListener('mouseleave', () => {
        cr.style.width = '28px';
        cr.style.height = '28px';
        cr.style.borderColor = 'rgba(196,144,122,.4)';
      });
    });
  }

  /* ── NAV SCROLL ── */
  const nav = document.getElementById('w-nav');
  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  /* ── READING PROGRESS BAR ── */
  const progress = document.getElementById('progress');
  if (progress) {
    window.addEventListener('scroll', () => {
      const h = document.documentElement;
      const scrolled = (h.scrollTop || document.body.scrollTop);
      const total    = (h.scrollHeight || document.body.scrollHeight) - h.clientHeight;
      progress.style.width = (scrolled / total * 100) + '%';
    }, { passive: true });
  }

  /* ── SCROLL REVEAL ── */
  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('vs');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.07 });

  document.querySelectorAll('.rv').forEach(el => io.observe(el));

})();
