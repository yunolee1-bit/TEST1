/* AI Molecular Modeling & Cheminformatics Lab — KRICT
   Vanilla JS: language toggle, mobile menu, sticky nav, scroll spy. */
(function () {
  'use strict';

  var root = document.documentElement;

  /* ---------- 1. Language toggle (KO / EN) ---------- */
  var STORAGE_KEY = 'krict-lab-lang';
  var langToggle = document.getElementById('langToggle');

  function setLang(lang) {
    root.lang = lang;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
    if (langToggle) {
      langToggle.setAttribute('aria-label', lang === 'ko' ? 'Switch to English' : '한국어로 보기');
    }
  }

  var saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  if (saved === 'ko' || saved === 'en') {
    setLang(saved);
  } else if ((navigator.language || '').toLowerCase().indexOf('ko') !== 0) {
    setLang('en');
  }

  if (langToggle) {
    langToggle.addEventListener('click', function () {
      setLang(root.lang === 'ko' ? 'en' : 'ko');
    });
  }

  /* ---------- 2. Mobile menu ---------- */
  var menuToggle = document.getElementById('menuToggle');
  var navLinks = document.getElementById('navLinks');

  function closeMenu() {
    if (!navLinks || !menuToggle) return;
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', function () {
      var open = navLinks.classList.toggle('open');
      menuToggle.setAttribute('aria-expanded', String(open));
    });
    navLinks.addEventListener('click', function (e) {
      if (e.target.closest('a')) closeMenu();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });
  }

  /* ---------- 3. Sticky nav shadow ---------- */
  var nav = document.getElementById('nav');
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle('scrolled', window.scrollY > 8);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ---------- 4. Scroll spy ---------- */
  var links = navLinks ? Array.prototype.slice.call(navLinks.querySelectorAll('a[href^="#"]')) : [];
  var sections = links
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);

  if (sections.length && 'IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- 5. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
