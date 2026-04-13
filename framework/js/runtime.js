/**
 * GOOBER FRAMEWORK — runtime.js
 * Version: 2.0.0
 *
 * Simplified runtime for Claude Code-generated sites.
 * Claude Code writes real nav/footer HTML directly into pages.
 * This file handles interactive behaviour only — no data hydration.
 *
 * Handles:
 *   - Hamburger mobile nav toggle
 *   - Scroll behaviour (sticky header shadow)
 *   - FAQ accordion
 *   - Smooth scroll for anchor links
 *   - Scroll reveal animations
 */

(function () {
  'use strict';

  // ── HAMBURGER MENU ─────────────────────────────────────────

  function initHamburger() {
    var btn   = document.querySelector('[data-toggle-mobile-nav]');
    var panel = document.querySelector('[data-mobile-nav]');
    if (!btn || !panel) return;

    btn.addEventListener('click', function () {
      var isOpen = panel.classList.contains('open');
      btn.classList.toggle('open');
      panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(!isOpen));
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && panel.classList.contains('open')) {
        btn.classList.remove('open');
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });

    // Close when a mobile nav link is clicked
    panel.addEventListener('click', function (e) {
      if (e.target && e.target.tagName === 'A') {
        btn.classList.remove('open');
        panel.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }
    });
  }

  // ── SCROLL BEHAVIOUR ───────────────────────────────────────

  function initScrollBehaviour() {
    var header = document.querySelector('.header-shell, .section-nav, #site-header, header');
    if (!header) return;

    window.addEventListener('scroll', function () {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── ACCORDION (FAQ) ────────────────────────────────────────

  function initAccordions() {
    document.querySelectorAll('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item   = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');

        // Close all open items
        document.querySelectorAll('.faq-item.open').forEach(function (i) {
          i.classList.remove('open');
        });

        // Open clicked item (if it was closed)
        if (!isOpen) item.classList.add('open');
      });
    });
  }

  // ── SMOOTH SCROLL ──────────────────────────────────────────

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var href   = a.getAttribute('href');
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── SCROLL REVEAL ──────────────────────────────────────────

  function initScrollReveal() {
    if (!('IntersectionObserver' in window)) return;
    document.documentElement.classList.add('js-scroll');

    // Assign stagger index to grid children
    var staggerTargets = '.card, .team-card, .testimonial-card, .gallery-item, .blog-card, .feature-item, .step-item, .trust-grid > div';
    document.querySelectorAll('[data-section]').forEach(function (section) {
      section.querySelectorAll(staggerTargets).forEach(function (el, i) {
        el.style.setProperty('--stagger', String(i));
      });
    });

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });

    document.querySelectorAll('[data-section]').forEach(function (s) { io.observe(s); });
  }

  // ── INIT ───────────────────────────────────────────────────

  function init() {
    initHamburger();
    initScrollBehaviour();
    initAccordions();
    initSmoothScroll();
    initScrollReveal();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
