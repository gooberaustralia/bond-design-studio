/**
 * GOOBER FRAMEWORK — cms.js
 * Version: 1.0.0
 *
 * Client self-editing layer.
 * Activates when ?cms=true is in the URL or when the
 * parent window sends a postMessage: { type: 'CMS_ACTIVATE' }
 *
 * Features:
 * - Edit mode toggle (URL param or postMessage)
 * - Double-click text elements to edit inline
 * - Click images to open replacement panel (posts to parent)
 * - Section hover highlight with label
 * - Section click to select (posts message to parent)
 * - Change tracking (pendingChanges array)
 * - Publish bar (shows when pendingChanges.length > 0)
 * - Save changes via fetch to /api/save-content
 * - Revert individual changes
 * - CMS toolbar (floating top bar with Edit/Preview toggle)
 *
 * All CMS UI elements are injected by JS — not in page HTML.
 */

(function () {
  'use strict';

  // ── STATE ──────────────────────────────────────────────────

  var editMode       = false;
  var pendingChanges = [];
  var toolbar        = null;
  var publishBar     = null;
  var dblClickHandler = null;

  var EDITABLE_TAGS = ['H1','H2','H3','H4','H5','H6','P','SPAN','LI','A','STRONG','EM','BUTTON'];

  // ── ACTIVATION ─────────────────────────────────────────────

  function shouldActivate() {
    return window.location.search.indexOf('cms=true') !== -1;
  }

  function activate() {
    injectStyles();
    injectToolbar();
    if (shouldActivate()) {
      enableEditMode();
    }
    bindMessages();
    bindSectionClicks();
  }

  // ── MESSAGE BUS ────────────────────────────────────────────

  function bindMessages() {
    window.addEventListener('message', function (e) {
      if (!e.data) return;
      switch (e.data.type) {
        case 'CMS_ACTIVATE':
          enableEditMode();
          break;
        case 'CMS_DEACTIVATE':
          disableEditMode();
          break;
        case 'SET_EDIT_MODE':
          if (e.data.enabled) enableEditMode();
          else disableEditMode();
          break;
      }
    });
  }

  // ── INJECT STYLES ──────────────────────────────────────────

  function injectStyles() {
    var style = document.createElement('style');
    style.textContent = [
      /* Toolbar */
      '#cms-toolbar { position:fixed; top:0; left:0; right:0; z-index:10000; background:#0F172A; color:#fff; display:flex; align-items:center; gap:12px; padding:0 16px; height:48px; font-family:system-ui,sans-serif; font-size:14px; box-shadow:0 2px 8px rgba(0,0,0,0.3); }',
      '#cms-toolbar .cms-logo { font-weight:700; color:#60A5FA; margin-right:8px; }',
      '#cms-toolbar button { height:32px; padding:0 14px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600; transition:filter 0.15s; }',
      '#cms-toolbar button:hover { filter:brightness(1.1); }',
      '#cms-btn-toggle { background:#2563EB; color:#fff; }',
      '#cms-btn-toggle.preview-mode { background:#475569; }',
      '#cms-changes-badge { background:#F97316; color:#fff; border-radius:99px; padding:2px 10px; font-size:12px; font-weight:700; display:none; }',
      '#cms-btn-publish { background:#16A34A; color:#fff; display:none; }',
      '#cms-btn-undo { background:#475569; color:#fff; display:none; }',

      /* Publish bar */
      '#cms-publish-bar { position:fixed; bottom:0; left:0; right:0; z-index:9999; background:#1E293B; color:#fff; display:none; align-items:center; justify-content:space-between; padding:12px 24px; font-family:system-ui,sans-serif; font-size:14px; box-shadow:0 -4px 20px rgba(0,0,0,0.3); }',
      '#cms-publish-bar.visible { display:flex; }',
      '#cms-publish-bar button { height:36px; padding:0 16px; border-radius:6px; border:none; cursor:pointer; font-size:13px; font-weight:600; }',

      /* Section highlight */
      'body.cms-edit-mode [data-section] { cursor:pointer; outline:2px solid transparent; transition:outline-color 0.15s; }',
      'body.cms-edit-mode [data-section]:hover { outline:2px solid #2563EB; outline-offset:2px; }',
      'body.cms-edit-mode [data-section].cms-selected { outline:3px solid #F97316 !important; outline-offset:4px; }',

      /* Editable element hover */
      'body.cms-edit-mode [data-section] h1:hover, body.cms-edit-mode [data-section] h2:hover, body.cms-edit-mode [data-section] h3:hover, body.cms-edit-mode [data-section] p:hover, body.cms-edit-mode [data-section] span:hover, body.cms-edit-mode [data-section] li:hover, body.cms-edit-mode [data-section] a:hover, body.cms-edit-mode [data-section] button:hover { outline:1px dashed #2563EB; outline-offset:2px; cursor:text; }',

      /* Section label tooltip */
      'body.cms-edit-mode [data-label]:hover::before { content:attr(data-label); position:absolute; top:8px; left:8px; background:#0F172A; color:#fff; font-size:11px; font-weight:600; padding:3px 8px; border-radius:4px; z-index:100; font-family:system-ui,sans-serif; pointer-events:none; }',
      'body.cms-edit-mode [data-section] { position:relative; }',
    ].join('\n');
    document.head.appendChild(style);
  }

  // ── INJECT TOOLBAR ─────────────────────────────────────────

  function injectToolbar() {
    toolbar = document.createElement('div');
    toolbar.id = 'cms-toolbar';
    toolbar.innerHTML = [
      '<span class="cms-logo">Goober CMS</span>',
      '<button id="cms-btn-toggle">✏️ Edit Mode</button>',
      '<span id="cms-changes-badge">0 changes</span>',
      '<button id="cms-btn-publish">🚀 Publish</button>',
      '<button id="cms-btn-undo">↩ Undo Last</button>',
      '<div style="flex:1"></div>',
      '<span style="color:#94A3B8;font-size:12px;">Goober Builder</span>',
    ].join('');
    document.body.prepend(toolbar);

    document.getElementById('cms-btn-toggle').addEventListener('click', function () {
      if (editMode) disableEditMode(); else enableEditMode();
    });

    document.getElementById('cms-btn-publish').addEventListener('click', publishChanges);
    document.getElementById('cms-btn-undo').addEventListener('click', undoLast);

    // Offset page for toolbar
    document.body.style.paddingTop = (parseInt(document.body.style.paddingTop || '0') + 48) + 'px';
  }

  // ── EDIT MODE ──────────────────────────────────────────────

  function enableEditMode() {
    editMode = true;
    document.body.classList.add('cms-edit-mode');
    var btn = document.getElementById('cms-btn-toggle');
    if (btn) { btn.textContent = '👁 Preview'; btn.classList.add('preview-mode'); }
    bindDoubleClick();
    bindImageClicks();
    window.parent.postMessage({ type: 'CMS_MODE_CHANGED', editMode: true }, '*');
  }

  function disableEditMode() {
    editMode = false;
    document.body.classList.remove('cms-edit-mode');
    document.querySelectorAll('.cms-selected').forEach(function (el) {
      el.classList.remove('cms-selected');
    });
    var btn = document.getElementById('cms-btn-toggle');
    if (btn) { btn.textContent = '✏️ Edit Mode'; btn.classList.remove('preview-mode'); }
    unbindDoubleClick();
    window.parent.postMessage({ type: 'CMS_MODE_CHANGED', editMode: false }, '*');
  }

  // ── SECTION CLICKS ─────────────────────────────────────────

  function bindSectionClicks() {
    document.addEventListener('click', function (e) {
      if (!editMode) return;
      var section = e.target.closest('[data-section]');
      if (!section) return;

      // Don't select on text editable elements (handled separately)
      if (EDITABLE_TAGS.indexOf(e.target.tagName) !== -1 && e.target.isContentEditable) return;

      document.querySelectorAll('.cms-selected').forEach(function (el) {
        el.classList.remove('cms-selected');
      });
      section.classList.add('cms-selected');

      window.parent.postMessage({
        type:       'section-click',
        sectionKey: section.dataset.section,
        sectionId:  section.dataset.sectionDbId || section.id || null,
        label:      section.dataset.label || '',
      }, '*');
    });
  }

  // ── DOUBLE CLICK TO EDIT TEXT ──────────────────────────────

  function bindDoubleClick() {
    if (dblClickHandler) return;
    dblClickHandler = function (e) {
      var target = e.target;
      if (!target || EDITABLE_TAGS.indexOf(target.tagName) === -1) return;
      if (!target.closest('[data-section]')) return;
      if (target.tagName === 'A') e.preventDefault();

      var originalText = target.innerText;
      var originalHtml = target.outerHTML;

      target.contentEditable = 'true';
      target.style.outline       = '2px solid #2563EB';
      target.style.outlineOffset = '2px';
      target.style.borderRadius  = '2px';
      target.focus();

      // Select all text
      try {
        var range = document.createRange();
        range.selectNodeContents(target);
        var sel = window.getSelection();
        if (sel) { sel.removeAllRanges(); sel.addRange(range); }
      } catch (_) {}

      function handleBlur() {
        var newText = (target.innerText || '').trim();
        target.contentEditable = 'false';
        target.style.outline   = '';

        target.removeEventListener('keydown', handleKey);
        target.removeEventListener('blur', handleBlur);

        if (newText !== originalText && newText !== '') {
          var sectionEl = target.closest('[data-section]');
          var change = {
            type:       'text',
            oldHtml:    originalHtml,
            newText:    newText,
            sectionKey: sectionEl ? sectionEl.dataset.section : null,
            sectionId:  sectionEl && sectionEl.dataset.sectionDbId ? sectionEl.dataset.sectionDbId : null,
            element:    target,
          };
          pendingChanges.push(change);
          updateChangesBadge();

          window.parent.postMessage({
            type:       'TEXT_EDITED',
            oldHtml:    originalHtml,
            newText:    newText,
            sectionKey: change.sectionKey,
            sectionId:  change.sectionId,
          }, '*');
        }
      }

      function handleKey(e) {
        if (e.key === 'Escape') {
          target.innerText         = originalText;
          target.contentEditable   = 'false';
          target.style.outline     = '';
          target.removeEventListener('blur', handleBlur);
          target.removeEventListener('keydown', handleKey);
        }
      }

      target.addEventListener('blur', handleBlur);
      target.addEventListener('keydown', handleKey);
    };

    document.addEventListener('dblclick', dblClickHandler);
  }

  function unbindDoubleClick() {
    if (dblClickHandler) {
      document.removeEventListener('dblclick', dblClickHandler);
      dblClickHandler = null;
    }
  }

  // ── IMAGE CLICK HANDLER ────────────────────────────────────

  function bindImageClicks() {
    document.addEventListener('click', function (e) {
      if (!editMode) return;
      var target = e.target.tagName === 'IMG'
        ? e.target
        : (e.target.closest && e.target.closest('img'));
      if (!target) return;

      e.preventDefault();
      e.stopPropagation();

      var sectionEl = target.closest('[data-section]');
      window.parent.postMessage({
        type:          'IMAGE_CLICKED',
        src:           target.src,
        alt:           target.alt || '',
        isPlaceholder: target.dataset.placeholder === 'true',
        sectionKey:    sectionEl ? sectionEl.dataset.section : null,
        sectionDbId:   sectionEl && sectionEl.dataset.sectionDbId
                         ? sectionEl.dataset.sectionDbId
                         : null,
      }, '*');
    }, true);
  }

  // ── CHANGES BADGE ──────────────────────────────────────────

  function updateChangesBadge() {
    var badge     = document.getElementById('cms-changes-badge');
    var publishBtn = document.getElementById('cms-btn-publish');
    var undoBtn   = document.getElementById('cms-btn-undo');

    var count = pendingChanges.length;

    if (badge) {
      badge.textContent   = count + (count === 1 ? ' change' : ' changes');
      badge.style.display = count > 0 ? 'inline-flex' : 'none';
    }

    if (publishBtn) publishBtn.style.display = count > 0 ? 'block' : 'none';
    if (undoBtn)    undoBtn.style.display    = count > 0 ? 'block' : 'none';
  }

  // ── PUBLISH ────────────────────────────────────────────────

  function publishChanges() {
    if (pendingChanges.length === 0) return;

    // Post to parent (EditorPage handles the actual save)
    window.parent.postMessage({
      type:    'CMS_PUBLISH',
      changes: pendingChanges.map(function (c) {
        return {
          type:       c.type,
          oldHtml:    c.oldHtml,
          newText:    c.newText,
          sectionKey: c.sectionKey,
          sectionId:  c.sectionId,
        };
      }),
    }, '*');

    pendingChanges = [];
    updateChangesBadge();
  }

  // ── UNDO LAST ──────────────────────────────────────────────

  function undoLast() {
    var last = pendingChanges.pop();
    if (!last) return;

    // Revert DOM change
    if (last.element && last.oldHtml) {
      try {
        var temp  = document.createElement('div');
        temp.innerHTML = last.oldHtml;
        var restored = temp.firstChild;
        if (restored && last.element.parentNode) {
          last.element.parentNode.replaceChild(restored, last.element);
        }
      } catch (_) {}
    }

    updateChangesBadge();
    window.parent.postMessage({ type: 'CMS_UNDO', count: pendingChanges.length }, '*');
  }

  // ── ENTRY POINT ────────────────────────────────────────────

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', activate);
  } else {
    activate();
  }

})();
