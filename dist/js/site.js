/*
 * Bond Design Studio — new-home
 * Motion is limited to what explains something: the masthead changing state,
 * a slow hero parallax for depth, reveals, the services index, the plumb line.
 * Everything degrades to a still page under prefers-reduced-motion.
 */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var masthead = document.getElementById('masthead');

  /* ----------------------------------------------------------
     DAY / NIGHT
     The same house at two times of day, not a developer toggle.
     ---------------------------------------------------------- */

  (function theme() {
    var btn = document.getElementById('daynight');
    var label = document.getElementById('daynight-label');
    if (!btn) return;

    function paint() {
      var night = document.documentElement.getAttribute('data-theme') === 'night';
      label.textContent = night ? 'Night' : 'Day';
      btn.setAttribute('aria-pressed', String(night));
    }

    btn.addEventListener('click', function () {
      var night = document.documentElement.getAttribute('data-theme') === 'night';
      var next = night ? 'day' : 'night';
      document.documentElement.setAttribute('data-theme', next);
      try { localStorage.setItem('bds-theme', next); } catch (e) {}
      paint();
    });

    paint();
  })();

  /* ----------------------------------------------------------
     MASTHEAD — sticky, and it changes ground once the photograph
     is no longer behind it.
     ---------------------------------------------------------- */

  (function header() {
    var hero = document.querySelector('.hero');
    if (!masthead) return;

    // No hero means no photograph behind the masthead, so it stays solid.
    if (!hero) { masthead.setAttribute('data-over', 'false'); return; }

    function state() {
      masthead.setAttribute('data-over', String(window.scrollY < hero.offsetHeight - 120));
    }

    window.addEventListener('scroll', state, { passive: true });
    window.addEventListener('resize', state);
    state();
  })();

  /* ----------------------------------------------------------
     MOBILE DRAWER
     ---------------------------------------------------------- */

  (function drawer() {
    var btn = document.getElementById('burger');
    var panel = document.getElementById('drawer');
    var main = document.getElementById('main');
    if (!btn || !panel) return;

    function setInert(on) {
      // keeps Tab inside the drawer instead of walking the page behind it
      [main, document.querySelector('.footer')].forEach(function (el) {
        if (el) el.inert = on;
      });
    }

    function close() {
      panel.setAttribute('data-open', 'false');
      btn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      setInert(false);
      if (masthead) masthead.removeAttribute('data-locked');
    }

    btn.addEventListener('click', function () {
      if (panel.getAttribute('data-open') === 'true') { close(); return; }
      panel.setAttribute('data-open', 'true');
      btn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      setInert(true);
      // the drawer is paper, so the masthead has to stop being white over it
      if (masthead) masthead.setAttribute('data-locked', 'true');
      panel.querySelector('a').focus();
    });

    panel.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.getAttribute('data-open') === 'true') { close(); btn.focus(); }
    });
  })();

  /* ----------------------------------------------------------
     SERVICES INDEX
     ---------------------------------------------------------- */

  (function index() {
    var heads = document.querySelectorAll('.index__head');
    Array.prototype.forEach.call(heads, function (head) {
      head.addEventListener('click', function () {
        var panel = document.getElementById(head.getAttribute('aria-controls'));
        var open = head.getAttribute('aria-expanded') === 'true';

        // one open at a time keeps the index readable as an index
        Array.prototype.forEach.call(heads, function (other) {
          if (other === head) return;
          other.setAttribute('aria-expanded', 'false');
          var op = document.getElementById(other.getAttribute('aria-controls'));
          if (op) op.setAttribute('data-open', 'false');
        });

        head.setAttribute('aria-expanded', String(!open));
        if (panel) panel.setAttribute('data-open', String(!open));
      });
    });
  })();

  /* ----------------------------------------------------------
     REVEALS
     ---------------------------------------------------------- */

  (function reveals() {
    var items = document.querySelectorAll('[data-reveal], [data-reveal-line]');
    if (reduced || !('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.setAttribute('data-shown', 'true'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-shown', 'true');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    Array.prototype.forEach.call(items, function (el) { io.observe(el); });
  })();

  /* ----------------------------------------------------------
     PROCESS PLUMB LINE
     The line is drawn as you read down it, the way a drawing is drawn.
     ---------------------------------------------------------- */

  (function plumb() {
    var list = document.getElementById('process-list');
    var line = document.getElementById('process-line');
    if (!list || !line || reduced) return;

    function draw() {
      var r = list.getBoundingClientRect();
      var vh = window.innerHeight;
      var p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      line.style.setProperty('--draw', p.toFixed(4));
    }

    window.addEventListener('scroll', function () { requestAnimationFrame(draw); }, { passive: true });
    window.addEventListener('resize', draw);
    draw();
  })();

  /* ----------------------------------------------------------
     HERO PARALLAX
     A still photograph, moved slowly against the page so the frame
     has depth. Nothing else in the hero moves.
     ---------------------------------------------------------- */

  (function parallax() {
    var media = document.getElementById('hero-media');
    var hero = document.querySelector('.hero');
    if (!media || !hero || reduced) return;

    var ticking = false;

    function move() {
      var p = clamp(window.scrollY / hero.offsetHeight, 0, 1);
      media.style.transform = 'translate3d(0,' + (p * 7).toFixed(2) + '%,0)';
      ticking = false;
    }

    window.addEventListener('scroll', function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(move);
    }, { passive: true });

    move();
  })();

})();
