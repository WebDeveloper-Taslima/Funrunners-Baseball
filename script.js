/* ============== Funrunners Baseball - Main Script ============== */
(function () {
  'use strict';

  // ---------- Year ----------
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ---------- Header scroll state ----------
  const header = document.getElementById('site-header');
  const onScroll = () => {
    if (window.scrollY > 20) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Smooth scroll with header offset ----------
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 64;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  // ---------- Reveal on scroll ----------
  document.body.classList.add('js-anim');
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) {
          en.target.classList.add('is-visible');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.05, rootMargin: '0px 0px -10% 0px' });
    revealEls.forEach((el) => io.observe(el));
    // Safety net: ensure everything becomes visible after 3s in case observer never fires
    setTimeout(() => revealEls.forEach((el) => el.classList.add('is-visible')), 3000);
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ---------- Language switcher ----------
  const langSwitcher = document.getElementById('langSwitcher');
  const langBtn = document.getElementById('langBtn');
  const langMenu = document.getElementById('langMenu');
  const langCurrent = langBtn ? langBtn.querySelector('.lang-current') : null;
  const chev = langBtn ? langBtn.querySelector('.icon-chevron-down') : null;

  function closeLang() {
    langMenu.hidden = true;
    langBtn.setAttribute('aria-expanded', 'false');
    if (chev) chev.style.transform = '';
  }
  function openLang() {
    langMenu.hidden = false;
    langBtn.setAttribute('aria-expanded', 'true');
    if (chev) chev.style.transform = 'rotate(180deg)';
  }
  if (langBtn && langMenu) {
    // Mark default
    const defaultBtn = langMenu.querySelector('button[data-code="en"]');
    if (defaultBtn) defaultBtn.classList.add('active');

    langBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (langMenu.hidden) openLang(); else closeLang();
    });

    langMenu.querySelectorAll('button').forEach((b) => {
      b.addEventListener('click', () => {
        langMenu.querySelectorAll('button').forEach((x) => x.classList.remove('active'));
        b.classList.add('active');
        if (langCurrent) langCurrent.innerHTML = '<span class="flag">' + b.dataset.flag + '</span> ' + b.dataset.label;
        closeLang();
      });
    });

    document.addEventListener('click', (e) => {
      if (!langSwitcher.contains(e.target)) closeLang();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLang(); });
  }

  // ---------- Live Auction: Countdown timer ----------
  const timeLeftEl = document.getElementById('timeLeft');
  let totalSec = 4 * 60 + 12;
  function fmt(s) {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const r = (s % 60).toString().padStart(2, '0');
    return m + ':' + r;
  }
  if (timeLeftEl) {
    setInterval(() => {
      totalSec -= 1;
      if (totalSec < 0) totalSec = 9 * 60 + 59; // loop demo
      timeLeftEl.textContent = fmt(totalSec);
    }, 1000);
  }

  // ---------- Live Auction: Place bid ----------
  const placeBidBtn = document.getElementById('placeBid');
  const bidAmountEl = document.getElementById('bidAmount');
  const biddersEl = document.getElementById('bidders');
  let currentBid = 2.45;
  let bidders = 27;
  if (placeBidBtn && bidAmountEl) {
    placeBidBtn.addEventListener('click', () => {
      currentBid = +(currentBid + 0.05).toFixed(2);
      bidders += 1;
      bidAmountEl.textContent = '$' + currentBid.toFixed(2) + 'M';
      if (biddersEl) biddersEl.textContent = bidders.toString();

      // brief flash
      bidAmountEl.style.transition = 'transform .3s';
      bidAmountEl.style.transform = 'scale(1.12)';
      setTimeout(() => { bidAmountEl.style.transform = ''; }, 300);
    });
  }
})();
