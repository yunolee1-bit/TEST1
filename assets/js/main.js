/* A2DL — AI Autonomous Drug Discovery Lab, KRICT
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

  /* ---------- 6. Publications (assets/data/publications.json) ---------- */
  var pubList = document.getElementById('pubList');

  function esc(v) {
    return String(v == null ? '' : v)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  // 저자 필드에서만 <b>...</b> 강조를 허용합니다 (직접 관리하는 데이터 파일).
  function authors(v) {
    return esc(v).replace(/&lt;(\/?b)&gt;/g, '<$1>');
  }

  function bilingual(ko, en) {
    return '<span data-lang="ko">' + ko + '</span><span data-lang="en">' + en + '</span>';
  }

  function renderEntry(pub) {
    var bits = ['<li>'];
    if (pub.authors) bits.push('<span class="authors">' + authors(pub.authors) + '</span>');
    bits.push('<span class="pub-title">' + esc(pub.title) + '</span>');

    var venue = '';
    if (pub.venue) venue += '<em>' + esc(pub.venue) + '</em>';
    if (pub.detail) venue += (venue ? ', ' : '') + esc(pub.detail);
    if (pub.year) venue += (venue ? ' ' : '') + '(' + esc(pub.year) + ').';
    if (venue) bits.push('<span class="venue">' + venue + '</span>');

    var href = pub.url || (pub.doi ? 'https://doi.org/' + pub.doi : '');
    if (href) {
      bits.push('<span class="links"><a href="' + esc(href) +
                '" target="_blank" rel="noopener">' + (pub.doi ? 'DOI' : 'Link') + '</a></span>');
    }
    if (pub.note) bits.push('<span class="venue">' + esc(pub.note) + '</span>');
    bits.push('</li>');
    return bits.join('');
  }

  function renderYear(y, items) {
    return '<div class="pub-year"><h3>' + esc(y) + '</h3><ol class="pubs">' +
           items.map(renderEntry).join('') + '</ol></div>';
  }

  function renderPublications(data) {
    var pubs = (data && data.publications) || [];
    if (!pubs.length) {
      pubList.innerHTML = '<p class="pub-empty">' +
        bilingual('논문 목록을 정리하고 있습니다.',
                  'Our publication list is being compiled.') + '</p>';
      return;
    }

    // 연도별로 묶어 최신순 정렬
    var byYear = {};
    pubs.forEach(function (p) {
      var y = p.year || '기타';
      (byYear[y] = byYear[y] || []).push(p);
    });
    var years = Object.keys(byYear).sort(function (a, b) { return Number(b) - Number(a); });

    var recentCount = Math.max(1, Number(data.recentYears) || 2);
    var recent = years.slice(0, recentCount);
    var older = years.slice(recentCount);

    var html = recent.map(function (y) { return renderYear(y, byYear[y]); }).join('');

    if (older.length) {
      var olderTotal = older.reduce(function (n, y) { return n + byYear[y].length; }, 0);
      html += '<button type="button" class="pub-toggle" id="pubToggle" aria-expanded="false" aria-controls="pubOlder">' +
              '<span class="pub-toggle-open">' +
                bilingual('이전 논문 ' + olderTotal + '편 펼치기',
                          'Show ' + olderTotal + ' earlier publication' + (olderTotal > 1 ? 's' : '')) +
              '</span>' +
              '<span class="pub-toggle-close">' +
                bilingual('이전 논문 접기', 'Hide earlier publications') +
              '</span></button>' +
              '<div class="pub-older" id="pubOlder" hidden>' +
                older.map(function (y) { return renderYear(y, byYear[y]); }).join('') +
              '</div>';
    }

    pubList.innerHTML = html;

    var toggle = document.getElementById('pubToggle');
    var olderBox = document.getElementById('pubOlder');
    if (toggle && olderBox) {
      toggle.addEventListener('click', function () {
        var open = olderBox.hidden;
        olderBox.hidden = !open;
        toggle.setAttribute('aria-expanded', String(open));
      });
    }
  }

  if (pubList) {
    fetch(pubList.getAttribute('data-src'), { cache: 'no-cache' })
      .then(function (r) {
        if (!r.ok) throw new Error('HTTP ' + r.status);
        return r.json();
      })
      .then(renderPublications)
      .catch(function () {
        pubList.innerHTML = '<p class="pub-empty">' +
          bilingual('논문 목록을 불러오지 못했습니다. 아래 연락처로 문의해 주세요.',
                    'The publication list could not be loaded. Please contact us below.') + '</p>';
      });
  }

  /* ---------- 5. Footer year ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
