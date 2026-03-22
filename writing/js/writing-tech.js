/* ============================================================
   writing-tech.js
   Used only by technical essays
   Active TOC tracking · Copy code button
   ============================================================ */

(function () {
  'use strict';

  /* ── ACTIVE TOC ITEM ON SCROLL ── */
  const tocItems = document.querySelectorAll('.toc-item[data-lesson]');
  if (tocItems.length) {
    const sections = document.querySelectorAll('[id]');
    const sectionObserver = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocItems.forEach(t => t.classList.remove('active'));
          const active = document.querySelector(`.toc-item[data-lesson="${e.target.id}"]`);
          if (active) active.classList.add('active');
        }
      });
    }, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' });

    sections.forEach(s => sectionObserver.observe(s));
  }

  /* ── COPY CODE BUTTON ── */
  window.copyCode = function (btn) {
    const pre  = btn.closest('.code-block').querySelector('pre');
    const text = pre.innerText;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = 'Copied ✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'Copy';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(() => {
      /* fallback for older browsers */
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      btn.textContent = 'Copied ✓';
      setTimeout(() => { btn.textContent = 'Copy'; }, 2000);
    });
  };

})();
