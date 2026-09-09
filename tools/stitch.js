#!/usr/bin/env node
/**
 * Goober stitch — zero-dep static-site builder.
 *
 * Reads source pages from `pages/` and `blog/`, inlines `partials/` via
 * `@use:<name> [key="value"]` markers, generates SEO meta from `@seo`,
 * derives `site/*.json` registries, writes everything to `dist/`.
 *
 * Usage:
 *   node tools/stitch.js                  # full rebuild
 *   node tools/stitch.js --verify          # dry-run + validation
 *   node tools/stitch.js --state-only      # derive site/*.json only (no dist writes)
 *   node tools/stitch.js --changed <path>  # incremental (changed file + dependents)
 *   node tools/stitch.js --watch --serve   # dev server on :4001 (or PORT env)
 *
 * Exits 0 on success, non-zero on errors. Final stdout line is a JSON
 * outcome the Electron-side wrapper parses.
 *
 * Phase 1 shipped the marker parser + dev server. Phase 6 adds
 * @seo/@page/@post block parsing, SEO <head> + JSON-LD injection,
 * deterministic site/*.json derivation, and sitemap/robots/feed.
 * Phase 8 adds perf-budget enforcement at build time.
 *
 * site/*.json files are serialized DETERMINISTICALLY (sorted keys, sorted
 * arrays, no embedded timestamps) so `node tools/stitch.js` always produces
 * byte-identical output for the same inputs — clean git diffs across
 * machines, branches, and merges.
 */

'use strict';
const fs = require('fs');
const path = require('path');

// ─── CLI args ───────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const FLAGS = {
  verify: argv.includes('--verify'),
  watch: argv.includes('--watch'),
  serve: argv.includes('--serve'),
  stateOnly: argv.includes('--state-only'),
};
function getArg(name) {
  const i = argv.indexOf(name);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[i + 1] : null;
}
const CHANGED = getArg('--changed');
const CHECKPOINT = getArg('--checkpoint');

// ─── Paths ──────────────────────────────────────────────────────────────
const ROOT = process.cwd();
const PAGES_DIR = path.join(ROOT, 'pages');
const BLOG_DIR = path.join(ROOT, 'blog');
const PARTIALS_DIR = path.join(ROOT, 'partials');
const DIST_DIR = path.join(ROOT, 'dist');
const SITE_DIR = path.join(ROOT, 'site');
const ASSETS_DIR = path.join(ROOT, 'assets');
const DESIGN_DIR = path.join(ROOT, 'design-guide');

// ─── Logging helpers ────────────────────────────────────────────────────
const warnings = [];
const errors = [];
function warn(msg) { warnings.push(msg); console.error(`[stitch] WARN: ${msg}`); }
function fail(msg) { errors.push(msg); console.error(`[stitch] ERROR: ${msg}`); }

// ─── Filesystem walk ────────────────────────────────────────────────────
function walk(dir, predicate = () => true) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const name of fs.readdirSync(dir)) {
    const abs = path.join(dir, name);
    const stat = fs.statSync(abs);
    if (stat.isDirectory()) {
      out.push(...walk(abs, predicate));
    } else if (stat.isFile() && predicate(abs)) {
      out.push(abs);
    }
  }
  return out;
}

function rel(abs) {
  return path.relative(ROOT, abs).split(path.sep).join('/');
}

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

// ─── Deterministic JSON serialization ───────────────────────────────────
/** Recursively sort object keys so output bytes are stable run-to-run. */
function sortKeys(v) {
  if (Array.isArray(v)) return v.map(sortKeys);
  if (v && typeof v === 'object') {
    const out = {};
    for (const k of Object.keys(v).sort()) out[k] = sortKeys(v[k]);
    return out;
  }
  return v;
}
function stableStringify(value) {
  return JSON.stringify(sortKeys(value), null, 2) + '\n';
}

// ─── Marker + block parsing ─────────────────────────────────────────────
/**
 * Parses a single line like:
 *   <!-- @use:header title="About" og_image="/a.jpg" -->
 * Returns { name, attrs } or null.
 */
function parseUseMarker(line) {
  const m = line.match(/^\s*<!--\s*@use:([\w-]+)\s*(.*?)\s*-->\s*$/);
  if (!m) return null;
  return { name: m[1], attrs: parseAttrs(m[2] || '') };
}

/** Parse `key="value" key2="value 2"` into an object. Quotes required. */
function parseAttrs(text) {
  const out = {};
  const re = /([\w-]+)\s*=\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(text))) out[m[1]] = m[2];
  return out;
}

/**
 * Parse a multi-line `@seo` / `@page` / `@post` block body. Supports:
 *   key="string"
 *   key=["a","b"]      (arrays — secondary_keywords, sections, tags)
 *   key=5  key=true    (bare numbers / booleans — reading_minutes, noindex)
 */
function parseBlockBody(body) {
  const out = {};
  // Arrays first so their quoted items aren't mistaken for string attrs.
  const arrRe = /([\w-]+)\s*=\s*\[([^\]]*)\]/g;
  let am;
  while ((am = arrRe.exec(body))) {
    out[am[1]] = am[2]
      .split(',')
      .map((s) => s.trim().replace(/^"|"$/g, ''))
      .filter(Boolean);
  }
  // Quoted strings.
  const strRe = /([\w-]+)\s*=\s*"([^"]*)"/g;
  let sm;
  while ((sm = strRe.exec(body))) {
    if (!(sm[1] in out)) out[sm[1]] = sm[2];
  }
  // Bare numbers / booleans.
  const bareRe = /([\w-]+)\s*=\s*(true|false|-?\d+(?:\.\d+)?)\b/g;
  let bm;
  while ((bm = bareRe.exec(body))) {
    if (!(bm[1] in out)) {
      const v = bm[2];
      out[bm[1]] = v === 'true' ? true : v === 'false' ? false : Number(v);
    }
  }
  return out;
}

/** Extract one `<!-- @name ... -->` block's attrs, or null when absent. */
function parseBlock(html, name) {
  const re = new RegExp(`<!--\\s*@${name}\\b([\\s\\S]*?)-->`, 'i');
  const m = html.match(re);
  return m ? parseBlockBody(m[1]) : null;
}

/** Strip all @seo / @page / @post comment blocks from the source. */
function stripMetaBlocks(html) {
  return html
    .replace(/<!--\s*@seo\b[\s\S]*?-->\s*/i, '')
    .replace(/<!--\s*@page\b[\s\S]*?-->\s*/i, '')
    .replace(/<!--\s*@post\b[\s\S]*?-->\s*/i, '')
    .replace(/^\s*\n/, '');
}

/** Replace {{key}} placeholders in a string with values from `attrs`. */
function interpolate(template, attrs, defaults = {}) {
  return template.replace(/\{\{(\w+)\}\}/g, (_, k) => {
    if (attrs[k] !== undefined && attrs[k] !== '') return String(attrs[k]);
    if (defaults[k] !== undefined) return String(defaults[k]);
    return '';
  });
}

/** Find the `<!-- @default ... -->` line in a partial and extract attrs. */
function readDefaults(partialBody) {
  const m = partialBody.match(/<!--\s*@default\s+([^>]*?)-->/);
  return m ? parseAttrs(m[1]) : {};
}

// ─── Business profile (for SEO + JSON-LD) ───────────────────────────────
let businessCache = null;
function loadBusiness() {
  if (businessCache) return businessCache;
  const file = path.join(SITE_DIR, 'business.json');
  let data = {};
  if (fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch (e) { warn(`Couldn't parse site/business.json: ${e.message}`); }
  }
  businessCache = data;
  return data;
}

let perfBudgetCache = null;
function loadPerfBudget() {
  if (perfBudgetCache) return perfBudgetCache;
  const file = path.join(SITE_DIR, 'perf-budget.json');
  let data = {};
  if (fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { /* ignore */ }
  }
  perfBudgetCache = data;
  return data;
}

let seoCache = null;
function loadSeo() {
  if (seoCache) return seoCache;
  const file = path.join(SITE_DIR, 'seo.json');
  let data = {};
  if (fs.existsSync(file)) {
    try { data = JSON.parse(fs.readFileSync(file, 'utf8')); }
    catch { /* ignore */ }
  }
  seoCache = data;
  return data;
}

/** Named AI crawlers robots.txt gets an explicit group for (readiness — never a ranking lever). */
const AI_CRAWLER_USER_AGENTS = [
  'OAI-SearchBot',
  'PerplexityBot',
  'Claude-SearchBot',
  'GPTBot',
  'ClaudeBot',
  'Google-Extended',
  'Applebot-Extended',
];

// ─── Copy checker — small, zero-dep subset, single source of rules ─────────
// Reads the SAME tools/copy-rules.json as electron/copyCheck.ts (the editor's
// rich, IPC-exposed engine) and Phase 4's writer gate, so "no dashes as
// punctuation" is one rule set enforced identically here, in the app, and on
// Vercel's own build — never three copies drifting apart.
let copyRulesCache = null;
function loadCopyRules() {
  if (copyRulesCache) return copyRulesCache;
  const file = path.join(__dirname, 'copy-rules.json');
  let data = { bannedPhrases: [], dash: { message: 'No dashes as punctuation.' }, shapes: [] };
  if (fs.existsSync(file)) {
    try { data = Object.assign({}, data, JSON.parse(fs.readFileSync(file, 'utf8'))); }
    catch { /* ignore — checks below just find nothing */ }
  }
  copyRulesCache = data;
  return data;
}

/** Strips tags/scripts/styles/comments to plain visible text. */
function htmlToVisibleText(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Small subset of electron/copyCheck.ts's engine: dashes, banned phrases, and
 * the named shapes only — no reading grade / sentence-length spread /
 * invented numbers, which need context (a proof list, a full document) this
 * build step doesn't have. Returns plain warning strings; never fails.
 */
function checkCopyRulesLite(text) {
  const rules = loadCopyRules();
  const messages = [];
  if (/—|–|\s-\s/.test(text)) {
    messages.push((rules.dash && rules.dash.message) || 'No dashes as punctuation.');
  }
  const lower = text.toLowerCase();
  for (const rule of rules.bannedPhrases || []) {
    if (rule && rule.phrase && lower.includes(String(rule.phrase).toLowerCase())) {
      messages.push(`Banned phrase: "${rule.phrase}".`);
    }
  }
  for (const shape of rules.shapes || []) {
    if (!shape || !shape.pattern) continue;
    try {
      if (new RegExp(shape.pattern, 'i').test(text)) messages.push(shape.message || `Shape rule: ${shape.id}`);
    } catch {
      /* a malformed pattern never breaks the build */
    }
  }
  return messages;
}

/**
 * The site's canonical origin (absolute, no trailing slash) derived from
 * business.canonical_url. Empty string when unset — callers must treat that as
 * "domain unknown" (stitch warns; URLs stay relative and are flagged invalid).
 */
function canonicalBase() {
  const business = loadBusiness();
  return (business.canonical_url || '').replace(/\/$/, '');
}

/**
 * Resolve a value to an ABSOLUTE URL against the canonical base.
 *   - Already-absolute (`http(s)://…`) → returned unchanged.
 *   - Otherwise → `base + (val || route)`.
 * When `base` is empty this yields a relative URL (invalid for SEO) — the build
 * emits a warning elsewhere so the operator sets the production domain.
 */
function absUrl(base, val, route) {
  const v = val || route || '';
  if (/^https?:\/\//i.test(v)) return v;
  return base + v;
}

/**
 * "9:00 AM - 5:00 PM", "9am-5pm", "09:00-17:00" → { opens: "09:00", closes:
 * "17:00" }. Returns null for "Closed", "By appointment" or anything else
 * that isn't a plain time range. Never invents a number, the JSON-LD just
 * omits that day rather than guess.
 */
function parseHoursRange(raw) {
  if (!raw || typeof raw !== 'string') return null;
  const m = raw.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(am|pm)?\s*(?:-|to)\s*(\d{1,2})(?::(\d{2}))?\s*(am|pm)?$/i);
  if (!m) return null;
  const to24 = (h, min, ap) => {
    let hh = parseInt(h, 10);
    const mm = min ? parseInt(min, 10) : 0;
    if (ap) {
      const isPm = /pm/i.test(ap);
      if (hh === 12) hh = isPm ? 12 : 0;
      else if (isPm) hh += 12;
    }
    return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`;
  };
  return { opens: to24(m[1], m[2], m[3]), closes: to24(m[4], m[5], m[6]) };
}

const DAY_LABELS = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
};

/** business.hours (day key → free-text range) → schema.org openingHoursSpecification entries, skipping any day whose text doesn't parse as a plain time range. */
function buildOpeningHours(hours) {
  if (!hours || typeof hours !== 'object') return [];
  const out = [];
  for (const key of Object.keys(hours)) {
    const dayOfWeek = DAY_LABELS[key.toLowerCase()];
    if (!dayOfWeek) continue;
    const range = parseHoursRange(hours[key]);
    if (!range) continue;
    out.push({ '@type': 'OpeningHoursSpecification', dayOfWeek, opens: range.opens, closes: range.closes });
  }
  return out;
}

/** Build a JSON-LD <script> from @seo.schema_type + business.json. */
function buildJsonLd(seo, business, route) {
  const type = seo.schema_type;
  if (!type) return '';
  const data = { '@context': 'https://schema.org', '@type': type };
  if (business.name) data.name = business.name;
  if (business.legal_name) data.legalName = business.legal_name;
  if (business.tagline) data.description = business.tagline;
  if (business.phone) data.telephone = business.phone;
  if (business.email) data.email = business.email;
  if (business.abn) data.taxID = business.abn;
  if (business.canonical_url) {
    data.url = absUrl((business.canonical_url || '').replace(/\/$/, ''), '', route);
  }
  if (business.address && (business.address.suburb || business.address.street)) {
    data.address = { '@type': 'PostalAddress' };
    if (business.address.street) data.address.streetAddress = business.address.street;
    if (business.address.suburb) data.address.addressLocality = business.address.suburb;
    if (business.address.state) data.address.addressRegion = business.address.state;
    if (business.address.postcode) data.address.postalCode = business.address.postcode;
    if (business.address.country) data.address.addressCountry = business.address.country;
  }
  const openingHours = buildOpeningHours(business.hours);
  if (openingHours.length > 0) data.openingHoursSpecification = openingHours;
  return `<script type="application/ld+json">${JSON.stringify(sortKeys(data))}</script>`;
}

// ─── Partial loader (cached per-run) ────────────────────────────────────
const partialCache = new Map();
function loadPartial(name) {
  if (partialCache.has(name)) return partialCache.get(name);
  const file = path.join(PARTIALS_DIR, `${name}.html`);
  if (!fs.existsSync(file)) {
    warn(`Missing partial: ${name} (looked at ${rel(file)})`);
    partialCache.set(name, null);
    return null;
  }
  const body = fs.readFileSync(file, 'utf8');
  const defaults = readDefaults(body);
  const stripped = body.replace(/<!--\s*@default[\s\S]*?-->/, '').trimStart();
  const entry = { body: stripped, defaults };
  partialCache.set(name, entry);
  return entry;
}

// ─── Stitch one page ────────────────────────────────────────────────────
function stitchHtml(html, dependencies = new Set(), depth = 0, ctx = {}) {
  if (depth > 20) {
    fail('Partial inclusion depth exceeded 20 — likely a circular reference.');
    return html;
  }
  const lines = html.split('\n');
  const out = [];
  for (const line of lines) {
    const marker = parseUseMarker(line);
    if (!marker) {
      out.push(line);
      continue;
    }
    // Synthesised partial: posts-list.
    if (marker.name === 'posts-list') {
      dependencies.add('posts-list');
      const limit = marker.attrs.limit ? Number(marker.attrs.limit) : Infinity;
      const excludeCurrent = marker.attrs['exclude-current'] === 'true';
      let posts = getBlogPosts();
      if (excludeCurrent && ctx.currentSlug) {
        posts = posts.filter((p) => p.slug !== ctx.currentSlug);
      }
      if (Number.isFinite(limit)) posts = posts.slice(0, limit);
      out.push(renderPostsList(posts, marker.attrs));
      continue;
    }
    const partial = loadPartial(marker.name);
    if (!partial) {
      out.push(line); // keep marker visible so the failure shows in preview
      continue;
    }
    dependencies.add(marker.name);
    // `meta` partial gets the page's @seo values merged in (page wins over
    // partial @default; an explicit marker attr wins over everything).
    let effAttrs = marker.attrs;
    if (marker.name === 'meta' && ctx.metaAttrs) {
      effAttrs = Object.assign({}, ctx.metaAttrs, marker.attrs);
    }
    let filled = interpolate(partial.body, effAttrs, partial.defaults);
    filled = stitchHtml(filled, dependencies, depth + 1, ctx);
    out.push(filled);
    // Inject JSON-LD immediately after the meta block.
    if (marker.name === 'meta' && ctx.jsonLd) {
      out.push(ctx.jsonLd);
    }
  }
  return out.join('\n');
}

// ─── Blog post metadata + posts-list synthesis ──────────────────────────
function parsePostMeta(html) {
  const block = parseBlock(html, 'post');
  if (!block) return null;
  // Pull summary/title from the @seo block too if missing on @post.
  const seo = parseBlock(html, 'seo');
  if (seo) {
    if (block.title === undefined && seo.title) block.title = seo.title;
    if (block.summary === undefined && seo.description) block.summary = seo.description;
  }
  return block;
}

function enumerateBlogPosts() {
  if (!fs.existsSync(BLOG_DIR)) return [];
  const posts = [];
  for (const name of fs.readdirSync(BLOG_DIR)) {
    if (!name.toLowerCase().endsWith('.html')) continue;
    if (name === 'index.html') continue;
    if (name.startsWith('_')) continue;
    const abs = path.join(BLOG_DIR, name);
    const html = fs.readFileSync(abs, 'utf8');
    const meta = parsePostMeta(html);
    if (!meta) continue;
    if (meta.status === 'draft') continue;
    const slug = name.replace(/\.html$/i, '');
    posts.push({
      slug,
      route: `/blog/${slug}/`,
      title: meta.title || slug,
      date: meta.date || '',
      summary: meta.summary || '',
      hero: meta.hero || '',
      tags: meta.tags || [],
    });
  }
  posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
  return posts;
}

function renderPostsList(posts) {
  if (posts.length === 0) return '<p class="blog-empty">No posts published yet.</p>';
  return posts
    .map((p) => {
      const tags = (p.tags || [])
        .map((t) => `<span class="blog-tag">${escapeHtml(t)}</span>`)
        .join(' ');
      const dateHtml = p.date
        ? `<time class="blog-card__date" datetime="${escapeHtml(p.date)}">${escapeHtml(p.date)}</time>`
        : '';
      return `<article class="blog-card">
  ${dateHtml}
  <h3 class="blog-card__title"><a href="${escapeHtml(p.route)}">${escapeHtml(p.title)}</a></h3>
  ${p.summary ? `<p class="blog-card__summary">${escapeHtml(p.summary)}</p>` : ''}
  ${tags ? `<p class="blog-card__tags">${tags}</p>` : ''}
</article>`;
    })
    .join('\n');
}

let blogPostsCache = null;
function getBlogPosts() {
  if (blogPostsCache) return blogPostsCache;
  blogPostsCache = enumerateBlogPosts();
  return blogPostsCache;
}

// ─── Route + dist-path helpers ──────────────────────────────────────────
function computeDistPath(srcRel) {
  if (srcRel === 'pages/index.html') return 'index.html';
  if (srcRel.startsWith('pages/')) {
    const slug = srcRel.replace(/^pages\//, '').replace(/\.html$/, '');
    return `${slug}/index.html`;
  }
  if (srcRel === 'blog/index.html') return 'blog/index.html';
  if (srcRel.startsWith('blog/')) {
    const slug = srcRel.replace(/^blog\//, '').replace(/\.html$/, '');
    return `blog/${slug}/index.html`;
  }
  return srcRel;
}

/** Public route for a source page, e.g. pages/about.html → "/about/". */
function computeRoute(srcRel) {
  if (srcRel === 'pages/index.html') return '/';
  if (srcRel.startsWith('pages/')) {
    const slug = srcRel.replace(/^pages\//, '').replace(/\.html$/, '');
    return `/${slug}/`;
  }
  if (srcRel === 'blog/index.html') return '/blog/';
  if (srcRel.startsWith('blog/')) {
    const slug = srcRel.replace(/^blog\//, '').replace(/\.html$/, '');
    return `/blog/${slug}/`;
  }
  return '/' + srcRel;
}

// ─── Source scanners (links / blocks / images) ──────────────────────────
function extractLinks(body) {
  const out = [];
  const re = /<a\b[^>]*\bhref="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi;
  let m;
  while ((m = re.exec(body))) {
    const href = m[1];
    if (!href.startsWith('/')) continue; // internal, root-relative only
    out.push({ to: href, anchor: m[2].replace(/<[^>]+>/g, '').trim() });
  }
  return out;
}

function extractBlocks(body) {
  const out = [];
  const re = /\bdata-block="([^"]+)"/g;
  let m;
  while ((m = re.exec(body))) out.push(m[1]);
  return out;
}

/** Map a character offset in `text` to a 1-based line number (binary search). */
function makeLineLookup(text) {
  const starts = [0];
  for (let k = 0; k < text.length; k++) if (text[k] === '\n') starts.push(k + 1);
  return (off) => {
    let lo = 0, hi = starts.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >> 1;
      if (starts[mid] <= off) lo = mid; else hi = mid - 1;
    }
    return lo + 1;
  };
}

/** Trim a class/tag list to a stable, compact, sorted-unique set. */
function compactList(values, cap) {
  return [...new Set(values.filter(Boolean))].sort().slice(0, cap);
}

/**
 * Surgical-edit index: locate every `<section data-block="…">` in the RAW page
 * source (markers intact, so line numbers match what an agent opens) and return
 * its block name, id, 1-based start/end lines, plus a compact class/tag summary
 * derived from its inner HTML (used to enrich blocks.json). Depth-aware for
 * nested <section> elements.
 */
function extractSections(raw, route, srcRel) {
  const lineAt = makeLineLookup(raw);
  const tagRe = /<\/?section\b[^>]*>/gi;
  const stack = [];
  const out = [];
  let m;
  while ((m = tagRe.exec(raw))) {
    const tag = m[0];
    if (tag[1] === '/') {
      const open = stack.pop();
      if (open && open.block) {
        const inner = raw.slice(open.innerStart, m.index);
        const tags = compactList(
          (inner.match(/<([a-z][\w-]*)/gi) || []).map((t) => t.slice(1).toLowerCase()),
          12
        );
        const classes = compactList(
          [...inner.matchAll(/class="([^"]+)"/gi)].flatMap((x) => x[1].split(/\s+/)),
          16
        );
        out.push({
          route,
          src_file: srcRel,
          block: open.block,
          id: open.id || null,
          start_line: open.line,
          end_line: lineAt(m.index),
          tags,
          classes,
        });
      }
    } else {
      const blockM = tag.match(/\bdata-block="([^"]+)"/i);
      const idM = tag.match(/\bid="([^"]+)"/i);
      stack.push({
        block: blockM ? blockM[1] : null,
        id: idM ? idM[1] : null,
        line: lineAt(m.index),
        innerStart: m.index + tag.length,
      });
    }
  }
  return out;
}

/** Warn if a `@use:` appears but not alone on its own line (it would be ignored). */
function warnMidLineMarkers(raw, srcRel) {
  const lines = raw.split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line.includes('@use:') && !parseUseMarker(line)) {
      warn(`${srcRel}:${i + 1}: '@use:' marker is not alone on its line — it will be ignored.`);
    }
  }
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Pictographic emoji ranges (excludes ★/✓ which are sometimes legit inline text).
const EMOJI_RE = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu;

/**
 * QC: agents must use inline SVG icons, never emoji. Warn (per page) when
 * pictographic emoji appear in shipped markup so the goober-web-design "no emoji
 * as icons" rule is actually enforced at build time.
 */
function warnEmojiIcons(raw, srcRel) {
  const found = raw.match(EMOJI_RE);
  if (!found) return 0;
  const unique = [...new Set(found)];
  warn(`${srcRel}: ${found.length} emoji in markup (${unique.slice(0, 6).join(" ")}) — use inline SVG icons, not emoji.`);
  return found.length;
}

/**
 * Content-quality validation (warnings only — these never fail the build, but
 * they surface in the outcome so agents and the portal can self-correct instead
 * of failing silently downstream).
 */
function validatePageMeta(srcRel, isBlog, pageMeta, seo, post) {
  // Blog filename convention: blog/YYYY-MM-DD-<slug>.html
  if (isBlog) {
    const base = path.basename(srcRel);
    if (!srcRel.includes('/_drafts/') && !/^\d{4}-\d{2}-\d{2}-[a-z0-9-]+\.html$/i.test(base)) {
      warn(`${srcRel}: blog filename should be 'YYYY-MM-DD-slug.html'.`);
    }
    if (post && post.date && !DATE_RE.test(post.date)) {
      warn(`${srcRel}: @post date "${post.date}" is not YYYY-MM-DD.`);
    }
  }
  // last_human_edit must be a parseable date when present.
  if (pageMeta && pageMeta.last_human_edit && !DATE_RE.test(String(pageMeta.last_human_edit))) {
    warn(`${srcRel}: @page last_human_edit "${pageMeta.last_human_edit}" is not YYYY-MM-DD.`);
  }
  // SEO: a published, indexable page that declares a schema_type should carry a
  // primary keyword (the portal's keyword tasks depend on this).
  const isDraft = srcRel.includes('/_drafts/') || (post && post.status === 'draft');
  const indexable = !(seo && seo.noindex);
  if (!isDraft && indexable && seo && seo.schema_type && !seo.primary_keyword) {
    warn(`${srcRel}: published ${seo.schema_type} page has no @seo primary_keyword.`);
  }
}

/** Count external `<script src="http(s)://… | //…">` tags (third-party). */
function countThirdPartyScripts(body) {
  let count = 0;
  const re = /<script\b[^>]*\bsrc="([^"]+)"/gi;
  let m;
  while ((m = re.exec(body))) {
    const src = m[1];
    if (/^https?:\/\//i.test(src) || src.startsWith('//')) count++;
  }
  return count;
}

/**
 * Speed (Phase 3): the first <img> on a page gets fetchpriority="high" (it's
 * almost always the hero, the LCP candidate); every <img> OUTSIDE the page's
 * first <section> gets loading="lazy" decoding="async" (it's below the
 * fold). Never overrides an attribute the markup already sets.
 */
function applyImageLoadingAttrs(html) {
  // "The hero" is the page's FIRST <section> — chrome before it (the header
  // partial's logo <img>) is neither the LCP candidate nor below the fold,
  // so it's left alone entirely.
  const firstSectionOpen = html.search(/<section\b/i);
  let firstSectionEnd = html.length;
  if (firstSectionOpen !== -1) {
    const closeMatch = /<\/section>/i.exec(html.slice(firstSectionOpen));
    firstSectionEnd = closeMatch ? firstSectionOpen + closeMatch.index + closeMatch[0].length : html.length;
  }
  let sawHeroImage = false;
  return html.replace(/<img\b([^>]*)>/gi, (full, attrs, offset) => {
    const inHero = firstSectionOpen !== -1 && offset >= firstSectionOpen && offset < firstSectionEnd;
    const afterHero = offset >= firstSectionEnd;
    const hasLoading = /\bloading\s*=/i.test(attrs);
    const hasDecoding = /\bdecoding\s*=/i.test(attrs);
    const hasFetchPriority = /\bfetchpriority\s*=/i.test(attrs);
    let next = attrs;
    if (inHero && !sawHeroImage) {
      sawHeroImage = true;
      if (!hasFetchPriority) next += ' fetchpriority="high"';
      return `<img${next}>`;
    }
    if (afterHero) {
      if (!hasLoading) next += ' loading="lazy"';
      if (!hasDecoding) next += ' decoding="async"';
    }
    return `<img${next}>`;
  });
}

function extractImgRefs(body, route, acc) {
  const re = /<img\b([^>]*)>/gi;
  let m;
  while ((m = re.exec(body))) {
    const attrs = m[1];
    const srcM = attrs.match(/\bsrc="([^"]+)"/);
    if (!srcM) continue;
    const src = srcM[1];
    if (!src.startsWith('/')) continue;
    const altM = attrs.match(/\balt="([^"]*)"/);
    const hasAlt = !!altM;
    const altVal = altM ? altM[1] : '';
    if (!acc[src]) acc[src] = { routes: new Set(), hasEmptyAlt: false, alt: undefined };
    acc[src].routes.add(route);
    if (!hasAlt || altVal.trim() === '') acc[src].hasEmptyAlt = true;
    else if (acc[src].alt === undefined) acc[src].alt = altVal;
  }
}

// ─── Per-page CSS (Phase W3) ────────────────────────────────────────────
/**
 * Page-specific stylesheet convention: `assets/css/pages/<slug>.css`, where
 * slug is the page filename (the home page `pages/index.html` uses "home",
 * matching the wp-sync / WP-theme slug). When the file exists, its <link> is
 * injected into that page's stitched HTML right after the last stylesheet
 * link, so it can override components.css. The file itself reaches dist/ via
 * the normal assets/ passthrough copy.
 */
function pageCssSlug(srcRel) {
  if (!srcRel.startsWith('pages/')) return null; // pages only (not blog)
  const slug = srcRel.replace(/^pages\//, '').replace(/\.html$/i, '');
  if (slug.includes('/')) return null; // nested paths (drafts are skipped earlier)
  return slug === 'index' ? 'home' : slug;
}

function injectPageCssLink(html, srcRel) {
  const slug = pageCssSlug(srcRel);
  if (!slug) return html;
  if (!fs.existsSync(path.join(ASSETS_DIR, 'css', 'pages', `${slug}.css`))) return html;
  const href = `/assets/css/pages/${slug}.css`;
  if (html.includes(`href="${href}"`)) return html; // page links it explicitly
  const link = `<link rel="stylesheet" href="${href}" />`;
  // After the LAST stylesheet link (tokens/base/components from @use:meta)…
  const re = /<link\b[^>]*rel="stylesheet"[^>]*>/gi;
  let last = null;
  let m;
  while ((m = re.exec(html))) last = m;
  if (last) {
    const end = last.index + last[0].length;
    return html.slice(0, end) + '\n' + link + html.slice(end);
  }
  // …or before </head> when a page carries no stylesheet links at all.
  const headEnd = html.search(/<\/head>/i);
  if (headEnd >= 0) return html.slice(0, headEnd) + link + '\n' + html.slice(headEnd);
  return html;
}

// ─── Page processor ─────────────────────────────────────────────────────
function processPage(srcAbs) {
  const srcRel = rel(srcAbs);
  if (srcRel.includes('/_drafts/') || path.basename(srcAbs).startsWith('_')) {
    return { skipped: true };
  }
  const raw = fs.readFileSync(srcAbs, 'utf8');
  const isBlog = srcRel.startsWith('blog/') && srcRel !== 'blog/index.html';

  const seo = parseBlock(raw, 'seo') || {};
  const pageMeta = parseBlock(raw, 'page') || {};
  const post = isBlog ? parsePostMeta(raw) : null;

  const route = computeRoute(srcRel);
  const business = loadBusiness();
  const base = canonicalBase();

  // Build the meta values that feed @use:meta. @seo wins, then @post.
  // <link rel="canonical"> MUST be absolute (HARD SEO rule). An already-absolute
  // @seo.canonical is kept as-is; a blank or relative one becomes base + route.
  const metaAttrs = {
    title: seo.title || (post && post.title) || business.name || '',
    description: seo.description || (post && post.summary) || business.tagline || '',
    canonical: absUrl(base, seo.canonical, route),
    og_image: seo.og_image || (post && post.hero) || '',
  };
  const jsonLd = buildJsonLd(seo, business, route);

  const src = stripMetaBlocks(raw);
  const deps = new Set();
  const currentSlug = isBlog ? srcRel.replace(/^blog\//, '').replace(/\.html$/i, '') : null;
  const stitched = applyImageLoadingAttrs(
    injectPageCssLink(stitchHtml(src, deps, 0, { currentSlug, metaAttrs, jsonLd }), srcRel)
  );

  // Content validation (warnings only — never breaks the build).
  validatePageMeta(srcRel, isBlog, pageMeta, seo, post);
  warnMidLineMarkers(raw, srcRel);
  warnEmojiIcons(raw, srcRel);

  const distRel = computeDistPath(srcRel);
  const record = {
    srcRel,
    route,
    distRel,
    isBlog,
    seo,
    page: pageMeta,
    post,
    // Read from the STITCHED body (partials expanded), not the page's own
    // pre-@use source, because the shared nav and footer links live in
    // partials/nav.html and partials/footer.html, not in the page file
    // itself. Reading `src` here made every page except one with a direct
    // body CTA look like an orphan, because its only inbound links never
    // existed until the partial was inlined.
    links: extractLinks(stitched),
    blocks: extractBlocks(src),
    // Line numbers come from the RAW source (markers intact) so they match the file.
    sections: extractSections(raw, route, srcRel),
    sourceBody: src,
    bytes: Buffer.byteLength(stitched),
    deps: [...deps],
  };

  // ── Deterministic SEO + copy warnings (advisory — never fail the build) ──
  const isDraftPage = srcRel.includes('/_drafts/') || (post && post.status === 'draft');
  if (!isDraftPage && !(seo && seo.noindex)) {
    const h1Count = (stitched.match(/<h1\b/gi) || []).length;
    if (h1Count === 0) warn(`${srcRel}: no <h1> found on a published, indexable page.`);
    else if (h1Count > 1) warn(`${srcRel}: ${h1Count} <h1> tags found — a page should have exactly one.`);

    if (seo && seo.schema_type === 'Service') {
      const blocks = extractBlocks(src);
      const hasFaq = blocks.some((b) => /faq/i.test(b)) || /\bfaq\b/i.test(stitched);
      if (!hasFaq) warn(`${srcRel}: Service page has no FAQ section — LLM citations lean heavily on FAQ shape.`);
    }
  }

  for (const msg of checkCopyRulesLite(htmlToVisibleText(stitched))) {
    warn(`${srcRel}: ${msg}`);
  }

  // Perf-budget enforcement (Phase 8).
  const budget = loadPerfBudget();
  if (budget.max_page_html_kb) {
    const kb = record.bytes / 1024;
    if (kb > budget.max_page_html_kb) {
      fail(
        `${srcRel}: stitched HTML is ${kb.toFixed(1)}KB, over the ${budget.max_page_html_kb}KB budget (site/perf-budget.json:max_page_html_kb).`
      );
    }
  }
  if (budget.third_party_scripts_max !== undefined) {
    const thirdParty = countThirdPartyScripts(stitched);
    if (thirdParty > budget.third_party_scripts_max) {
      fail(
        `${srcRel}: ${thirdParty} third-party scripts, over the limit of ${budget.third_party_scripts_max} (site/perf-budget.json:third_party_scripts_max).`
      );
    }
  }

  // Incremental: with --changed, only WRITE dist for affected pages (we still
  // stitch everything so site/*.json stays consistent + deps are known).
  if (FLAGS.verify || FLAGS.stateOnly || !isAffected(record)) {
    return { record, written: false };
  }
  const distAbs = path.join(DIST_DIR, distRel);
  fs.mkdirSync(path.dirname(distAbs), { recursive: true });
  fs.writeFileSync(distAbs, stitched);
  return { record, written: true };
}

/** Whether a page's dist output must be rewritten given the --changed file. */
function isAffected(record) {
  if (!CHANGED) return true; // full build
  const changed = CHANGED.split(path.sep).join('/');
  if (changed === record.srcRel) return true; // the page itself
  if (changed.startsWith('partials/')) {
    // A partial changed → only pages that use it (incl. posts-list consumers
    // when a blog post changed elsewhere) need rewriting.
    const partialName = changed.replace(/^partials\//, '').replace(/\.html$/i, '');
    return record.deps.includes(partialName);
  }
  if (changed.startsWith('blog/')) {
    // A blog post changed → rewrite it + any page rendering posts-list.
    return changed === record.srcRel || record.deps.includes('posts-list');
  }
  if (changed.startsWith('pages/')) {
    // Another page changed → only that page (handled by the equality check
    // above); this one is unaffected.
    return false;
  }
  // assets/css, site/*, design-guide, etc. → rebuild everything (safe default).
  return true;
}

// ─── Drafts enumeration ─────────────────────────────────────────────────
function enumerateDrafts() {
  const out = { pages: [], posts: [] };
  for (const [dir, key] of [
    [path.join(PAGES_DIR, '_drafts'), 'pages'],
    [path.join(BLOG_DIR, '_drafts'), 'posts'],
  ]) {
    if (!fs.existsSync(dir)) continue;
    for (const f of walk(dir, (p) => p.toLowerCase().endsWith('.html'))) {
      out[key].push(rel(f));
    }
    out[key].sort();
  }
  return out;
}

// ─── site/*.json derivation ─────────────────────────────────────────────
/**
 * Build a PageEntry from a processed record. Shared by pages.json + blog.json.
 */
function entryFromRecord(r) {
  const seo = r.seo || {};
  const pg = r.page || {};
  const entry = {
    path: r.srcRel,
    slug: r.route,
    title: seo.title || path.basename(r.srcRel, '.html'),
    is_draft: false,
  };
  if (seo.description) entry.description = seo.description;
  if (seo.primary_keyword) entry.primary_keyword = seo.primary_keyword;
  if (seo.secondary_keywords) entry.secondary_keywords = seo.secondary_keywords;
  if (seo.canonical) entry.canonical = seo.canonical;
  if (seo.og_image) entry.og_image = seo.og_image;
  if (seo.schema_type) entry.schema_type = seo.schema_type;
  if (seo.noindex !== undefined) entry.noindex = !!seo.noindex;
  if (pg.intent) entry.intent = pg.intent;
  if (pg.sections) entry.sections = pg.sections;
  if (pg.primary_cta) entry.primary_cta = pg.primary_cta;
  if (pg.last_human_edit) entry.last_human_edit = pg.last_human_edit;
  return entry;
}

function deriveSiteState(records) {
  const written = [];
  if (!fs.existsSync(SITE_DIR)) fs.mkdirSync(SITE_DIR, { recursive: true });

  // pages.json = pages/ inventory; blog.json = blog posts (excl. archive index).
  const pageRecords = records.filter((r) => r.srcRel.startsWith('pages/'));
  const blogRecords = records.filter((r) => r.isBlog);

  // pages.json
  const pages = pageRecords
    .map(entryFromRecord)
    .sort((a, b) => a.path.localeCompare(b.path));
  const pagesJson = { generated_by: 'siteState', count: pages.length, pages };

  // blog.json
  const posts = blogRecords
    .map((r) => {
      const e = entryFromRecord(r);
      const p = r.post || {};
      e.date = p.date || '';
      if (p.author) e.author = p.author;
      if (p.tags) e.tags = p.tags;
      if (p.hero) e.hero = p.hero;
      if (p.reading_minutes !== undefined) e.reading_minutes = p.reading_minutes;
      e.status = p.status === 'draft' ? 'draft' : 'published';
      return e;
    })
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : a.path.localeCompare(b.path)));
  const blogJson = { generated_by: 'siteState', count: posts.length, posts };

  // internal-links.json
  const allRoutes = new Set(records.map((r) => r.route));
  const edges = [];
  const inbound = new Set();
  for (const r of records) {
    for (const l of r.links) {
      // Normalise trailing slash for comparison but keep authored form in edge.
      edges.push({ from: r.route, to: l.to, anchor: l.anchor });
    }
  }
  const broken = [];
  for (const e of edges) {
    const target = e.to.split('#')[0].split('?')[0];
    if (target.startsWith('/') && /\/$/.test(target) === false && !/\.\w+$/.test(target)) {
      // tolerate links without trailing slash by also checking the slashed form
    }
    if (allRoutes.has(target)) {
      inbound.add(target);
    } else if (allRoutes.has(target + '/')) {
      inbound.add(target + '/');
    } else if (target.startsWith('/') && !/\.\w+$/.test(target)) {
      broken.push(`${e.from} -> ${e.to}`);
    }
  }
  edges.sort((a, b) =>
    a.from.localeCompare(b.from) || a.to.localeCompare(b.to) || a.anchor.localeCompare(b.anchor)
  );
  // Routes that are reached by something other than a link, so a missing
  // inbound link is not a fault. The enquiry form posts to /thank-you/ from
  // api/enquiry.js, so it is never linked from a page and flagging it sent
  // the owner to a "Fix with AI" button that had nothing to fix.
  const NON_LINKED_ROUTES = new Set(['/thank-you/']);
  const orphans = records
    .filter((r) => r.route !== '/' && !NON_LINKED_ROUTES.has(r.route) && !inbound.has(r.route))
    .map((r) => r.route)
    .sort();
  const internalLinksJson = {
    generated_by: 'siteState',
    edges,
    orphans,
    broken: [...new Set(broken)].sort(),
  };

  // sections.json — the surgical-edit index: every section with its source
  // file + line range. Lets a cold external agent jump straight to a section.
  const allSections = [];
  for (const r of records) {
    for (const s of r.sections || []) {
      allSections.push({
        route: s.route,
        src_file: s.src_file,
        block: s.block,
        id: s.id,
        start_line: s.start_line,
        end_line: s.end_line,
      });
    }
  }
  allSections.sort(
    (a, b) => a.src_file.localeCompare(b.src_file) || a.start_line - b.start_line
  );
  const sectionsJson = { generated_by: 'siteState', count: allSections.length, sections: allSections };

  // blocks.json — pattern registry, now enriched with where each block is first
  // defined and the classes it uses, so an agent can reuse it without grepping.
  const blockInfo = new Map(); // name -> { used_on:Set, defined_in, example_line, classes:Set }
  for (const r of records) {
    for (const s of r.sections || []) {
      let info = blockInfo.get(s.block);
      if (!info) {
        info = { used_on: new Set(), defined_in: s.src_file, example_line: s.start_line, classes: new Set() };
        blockInfo.set(s.block, info);
      }
      info.used_on.add(s.route);
      for (const c of s.classes || []) info.classes.add(c);
    }
  }
  // Blocks may also appear on elements that aren't <section> — keep the legacy
  // data-block scan so nothing is dropped from used_on.
  for (const r of records) {
    for (const b of r.blocks) {
      if (!blockInfo.has(b)) blockInfo.set(b, { used_on: new Set([r.route]), defined_in: r.srcRel, example_line: 0, classes: new Set() });
      else blockInfo.get(b).used_on.add(r.route);
    }
  }
  const blocks = [...blockInfo.entries()]
    .map(([name, info]) => ({
      name,
      used_on: [...info.used_on].sort(),
      defined_in: info.defined_in,
      example_line: info.example_line,
      classes: [...info.classes].sort(),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
  const blocksJson = { generated_by: 'siteState', blocks };

  // assets.json
  const imgRefs = {};
  for (const r of records) extractImgRefs(r.sourceBody, r.route, imgRefs);
  // Partials (header/footer/nav) carry the logo + chrome images — scan them too
  // so broken refs like a missing logo are caught, not just page-body images.
  if (fs.existsSync(PARTIALS_DIR)) {
    for (const pf of walk(PARTIALS_DIR, (p) => p.endsWith('.html'))) {
      extractImgRefs(fs.readFileSync(pf, 'utf8'), `partial:${path.basename(pf)}`, imgRefs);
    }
  }
  const budget = loadPerfBudget();
  const maxImageKb = budget.max_image_kb || 250;
  const imagesDir = path.join(ASSETS_DIR, 'images');
  const images = [];
  const referencedSrcs = new Set(Object.keys(imgRefs));
  if (fs.existsSync(imagesDir)) {
    for (const abs of walk(imagesDir)) {
      const relSrc = '/' + rel(abs); // e.g. /assets/images/hero.jpg
      const stat = fs.statSync(abs);
      const ref = imgRefs[relSrc];
      const img = {
        path: relSrc,
        size_kb: Math.round(stat.size / 1024),
        format: path.extname(abs).replace('.', '').toLowerCase(),
        used_on: ref ? [...ref.routes].sort() : [],
      };
      if (ref && ref.alt) img.alt = ref.alt;
      images.push(img);
      referencedSrcs.delete(relSrc);
    }
  }
  images.sort((a, b) => a.path.localeCompare(b.path));
  const oversize = images.filter((i) => i.size_kb > maxImageKb).map((i) => i.path).sort();
  // Perf-budget enforcement (Phase 3 Speed): an oversize image is a hard
  // failure, not just an assets.json advisory line, so a build can't ship a
  // slow hero image unnoticed. The message names the fix so a first publish
  // on an older site doesn't just look broken.
  for (const p of oversize) {
    const img = images.find((i) => i.path === p);
    fail(
      `${p}: image is ${img ? img.size_kb : '?'}KB, over the ${maxImageKb}KB budget ` +
      `(site/perf-budget.json:max_image_kb). Run the WebP optimiser in the Speed panel ` +
      `or resize the image, then publish again.`
    );
  }
  const missingAlt = images
    .filter((i) => i.used_on.length && imgRefs[i.path] && imgRefs[i.path].hasEmptyAlt)
    .map((i) => i.path)
    .sort();
  const unused = images.filter((i) => i.used_on.length === 0).map((i) => i.path).sort();

  // QC: referenced /assets/* images that don't exist on disk (broken <img>),
  // e.g. a logo path the partials expect but no file was placed. Warn per ref.
  const broken_images = [];
  for (const src of Object.keys(imgRefs)) {
    if (!src.startsWith('/assets/')) continue;
    if (!fs.existsSync(path.join(ROOT, src.slice(1)))) {
      broken_images.push(src);
      const routes = [...imgRefs[src].routes].sort().join(', ');
      warn(`Broken image: ${src} referenced on ${routes} but no file on disk.`);
    }
  }
  broken_images.sort();

  const assetsJson = {
    generated_by: 'siteState',
    images,
    oversize,
    missing_alt: missingAlt,
    broken_images,
    unused,
  };

  // drafts.json
  const draftsJson = Object.assign({ generated_by: 'siteState' }, enumerateDrafts());

  const toWrite = [
    ['pages.json', pagesJson],
    ['blog.json', blogJson],
    ['internal-links.json', internalLinksJson],
    ['blocks.json', blocksJson],
    ['sections.json', sectionsJson],
    ['assets.json', assetsJson],
    ['drafts.json', draftsJson],
  ];
  if (!FLAGS.verify) {
    for (const [name, data] of toWrite) {
      fs.writeFileSync(path.join(SITE_DIR, name), stableStringify(data));
      written.push(`site/${name}`);
    }
  }
  return {
    written,
    pageCount: pages.length,
    postCount: posts.length,
    imageCount: images.length,
    sectionCount: allSections.length,
    blockCount: blocks.length,
    issues: { orphans, broken, oversize, missingAlt, brokenImages: broken_images },
  };
}

/** Verify-time check: every line of audit-log.jsonl must be valid JSON. */
function validateAgentFiles() {
  const logPath = path.join(SITE_DIR, 'agents', 'audit-log.jsonl');
  if (!fs.existsSync(logPath)) return;
  const lines = fs.readFileSync(logPath, 'utf8').split('\n');
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    try {
      JSON.parse(line);
    } catch {
      warn(`site/agents/audit-log.jsonl:${i + 1}: not valid JSON.`);
    }
  }
}

// ─── SEO assets (sitemap / robots / feed) ───────────────────────────────
function writeSeoAssets(records) {
  if (FLAGS.verify || FLAGS.stateOnly) return [];
  const business = loadBusiness();
  const base = canonicalBase();
  const written = [];

  // sitemap.xml — published, indexable routes.
  const urlRoutes = records
    .filter((r) => !(r.seo && r.seo.noindex))
    .map((r) => r.route)
    .sort();

  // HARD SEO rule: sitemap <loc>, robots Sitemap:, and <link rel="canonical">
  // must all be ABSOLUTE. That requires business.canonical_url (the client's
  // production domain). Warn loudly if it's missing while pages are published —
  // the output is technically invalid until the operator sets the domain.
  if (!base && urlRoutes.length > 0) {
    warn(
      'business.canonical_url is empty — sitemap <loc>, robots Sitemap, and ' +
        '<link rel=canonical> will be RELATIVE and invalid. Set the site\'s ' +
        'production domain (project profile website URL).'
    );
  }

  const sitemap =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    urlRoutes
      .map((route) => `  <url><loc>${escapeXml(absUrl(base, '', route))}</loc></url>`)
      .join('\n') +
    '\n</urlset>\n';
  fs.mkdirSync(DIST_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemap);
  written.push('dist/sitemap.xml');

  // robots.txt — explicit per-bot groups for AI crawlers (readiness, never a
  // ranking lever) on top of the default group. site/seo.json.ai_crawlers
  // controls all of them together: "allow" (default) or "block".
  const seo = loadSeo();
  const aiCrawlerAllowed = seo.ai_crawlers !== 'block';
  const aiGroups = AI_CRAWLER_USER_AGENTS.map(
    (ua) => `User-agent: ${ua}\n${aiCrawlerAllowed ? 'Allow: /' : 'Disallow: /'}\n`
  ).join('\n');
  const robots =
    'User-agent: *\n' +
    'Disallow: /_drafts/\n' +
    'Allow: /\n\n' +
    aiGroups +
    '\n' +
    `Sitemap: ${absUrl(base, '', '/sitemap.xml')}\n`;
  fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robots);
  written.push('dist/robots.txt');

  // llms.txt — a plain-text index of the site for LLM crawlers, from
  // business.json + the derived page records. site/seo.json.llms_txt
  // defaults to true; set false to omit it.
  if (seo.llms_txt !== false) {
    const pageLines = records
      .filter((r) => r.srcRel.startsWith('pages/') && !(r.seo && r.seo.noindex))
      .map((r) => entryFromRecord(r))
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((e) => `- [${e.title}](${absUrl(base, '', e.slug)})${e.description ? `: ${e.description}` : ''}`);
    const llmsTxt =
      `# ${business.name || 'Website'}\n\n` +
      (business.tagline ? `> ${business.tagline}\n\n` : '') +
      '## Pages\n\n' +
      (pageLines.length ? pageLines.join('\n') + '\n' : '');
    fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsTxt);
    written.push('dist/llms.txt');
  }

  // feed.xml — last 20 published posts.
  const posts = getBlogPosts().slice(0, 20);
  const items = posts
    .map(
      (p) =>
        `    <item>\n` +
        `      <title>${escapeXml(p.title)}</title>\n` +
        `      <link>${escapeXml(absUrl(base, '', p.route))}</link>\n` +
        `      <guid>${escapeXml(absUrl(base, '', p.route))}</guid>\n` +
        (p.date ? `      <pubDate>${escapeXml(p.date)}</pubDate>\n` : '') +
        (p.summary ? `      <description>${escapeXml(p.summary)}</description>\n` : '') +
        `    </item>`
    )
    .join('\n');
  const feed =
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    '<rss version="2.0">\n  <channel>\n' +
    `    <title>${escapeXml(business.name || 'Blog')}</title>\n` +
    `    <link>${escapeXml(absUrl(base, '', '/blog/'))}</link>\n` +
    (business.tagline ? `    <description>${escapeXml(business.tagline)}</description>\n` : '') +
    (items ? items + '\n' : '') +
    '  </channel>\n</rss>\n';
  fs.writeFileSync(path.join(DIST_DIR, 'feed.xml'), feed);
  written.push('dist/feed.xml');

  return written;
}

// ─── Assets passthrough ─────────────────────────────────────────────────
// ─── Design tokens → tokens.css ─────────────────────────────────────────
/**
 * Regenerate `assets/css/tokens.css` from `design-guide/tokens.json` so the
 * documented contract ("edit tokens.json and re-stitch") actually holds.
 * v1 keys map to the classic variables; optional v2 keys (`palette_extended`,
 * `typography_extended`, `motion`, `shape`) map generically to custom props.
 * Content-compare before writing so watch mode never build-loops.
 */
function fontStack(value, generic) {
  if (!value) return null;
  const v = String(value).trim();
  if (v.includes(',')) return v; // already a full stack — verbatim
  const quoted = /[\s]/.test(v) && !/^["']/.test(v) ? `"${v}"` : v;
  return `${quoted}, ${generic}`;
}

function regenerateTokensCss() {
  const tokensPath = path.join(DESIGN_DIR, 'tokens.json');
  if (!fs.existsSync(tokensPath)) return false;
  let t;
  try {
    t = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  } catch (e) {
    warn(`design-guide/tokens.json is not valid JSON (${e.message}) — tokens.css left unchanged`);
    return false;
  }
  const p = t.palette || {};
  const ty = t.typography || {};
  const sp = t.spacing || {};
  const lines = [
    '/*',
    ' * GENERATED from design-guide/tokens.json by the stitch step.',
    ' * Do NOT hand-edit. To change values, edit tokens.json and re-stitch.',
    ' */',
    ':root {',
    '  /* palette */',
  ];
  const colour = (name, val) => { if (val) lines.push(`  --color-${name}: ${val};`); };
  colour('primary', p.primary);
  colour('accent', p.accent);
  colour('ink', p.ink);
  colour('paper', p.paper);
  colour('muted', p.muted || '#6B7280');
  // v2: extended palette (surface, surface_tint, dark, dark_ink, border, accent_2, …)
  for (const [k, v] of Object.entries(t.palette_extended || {})) {
    colour(k.replace(/_/g, '-'), v);
  }
  lines.push('', '  /* typography */');
  const heading = fontStack(ty.heading, 'system-ui, -apple-system, sans-serif');
  const body = fontStack(ty.body, 'system-ui, -apple-system, sans-serif');
  if (heading) lines.push(`  --font-heading: ${heading};`);
  if (body) lines.push(`  --font-body: ${body};`);
  const tyx = t.typography_extended || {};
  if (tyx.scale_ratio) lines.push(`  --type-scale: ${tyx.scale_ratio};`);
  if (tyx.heading_weight) lines.push(`  --font-heading-weight: ${tyx.heading_weight};`);
  if (tyx.heading_tracking) lines.push(`  --font-heading-tracking: ${tyx.heading_tracking};`);
  if (tyx.body_size) lines.push(`  --font-body-size: ${tyx.body_size};`);
  lines.push('', '  /* spacing */');
  lines.push(`  --spacing-unit: ${sp.unit || '0.25rem'};`);
  lines.push(`  --page-max: ${sp.page_max || '1200px'};`);
  lines.push(`  --section-y: ${sp.section_y || '4rem'};`);
  lines.push('', '  /* radius */');
  if (t.radius) lines.push(`  --radius: ${t.radius};`);
  const shape = t.shape || {};
  if (shape.radius_lg) lines.push(`  --radius-lg: ${shape.radius_lg};`);
  if (shape.shadow) lines.push(`  --shadow: ${shape.shadow};`);
  const motion = t.motion || {};
  if (motion.easing || motion.duration_base || motion.stagger || motion.distance) {
    lines.push('', '  /* motion */');
    if (motion.easing) lines.push(`  --motion-easing: ${motion.easing};`);
    if (motion.duration_base) lines.push(`  --motion-duration: ${motion.duration_base};`);
    if (motion.stagger) lines.push(`  --motion-stagger: ${motion.stagger};`);
    if (motion.distance) lines.push(`  --motion-distance: ${motion.distance};`);
  }
  lines.push('}', '');
  const out = lines.join('\n');
  const cssPath = path.join(ASSETS_DIR, 'css', 'tokens.css');
  let existing = null;
  try { existing = fs.readFileSync(cssPath, 'utf8'); } catch { /* absent */ }
  if (existing === out) return false;
  fs.mkdirSync(path.dirname(cssPath), { recursive: true });
  fs.writeFileSync(cssPath, out);
  return true;
}

// ─── Design tokens → webfont <link> in partials/meta.html ───────────────
/**
 * Keep partials/meta.html's Google Fonts <link> block in sync with
 * design-guide/tokens.json, the same way regenerateTokensCss keeps
 * tokens.css in sync. The block is baked in at scaffold time from a
 * <link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Outfit:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap" /> placeholder (electron/scaffold.ts's scaffoldV2 + its
 * googleFontsLink helper) and is not a re-interpolatable placeholder after
 * that, so nothing used to touch it again once the design step changed
 * tokens.json's fonts. This mirrors googleFontsLink's link shape and
 * electron/brandV2.ts's old updateMetaFontLink regex exactly, so the two
 * never drift apart. Stitch is a zero dependency scaffold file, so this is
 * implemented inline rather than imported from the app.
 */
function googleFontsLinkBlock(headingFont, bodyFont) {
  const enc = (f) => f.trim().replace(/ /g, '+');
  const families = [];
  const seen = new Set();
  const add = (f, weights) => {
    const key = f.trim().toLowerCase();
    if (!f.trim() || seen.has(key)) return;
    seen.add(key);
    families.push(`family=${enc(f)}:wght@${weights}`);
  };
  add(headingFont || '', '500;600;700');
  add(bodyFont || '', '400;500;600;700');
  if (!families.length) return '';
  return (
    '<link rel="preconnect" href="https://fonts.googleapis.com" />\n' +
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />\n' +
    `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${families.join('&')}&display=swap" />`
  );
}

const META_FONT_LINK_RE = /<link rel="preconnect" href="https:\/\/fonts\.googleapis\.com"[^>]*\/?>\s*\n?\s*(?:<link rel="preconnect" href="https:\/\/fonts\.gstatic\.com"[^>]*\/?>\s*\n?\s*)?<link[^>]*fonts\.googleapis\.com[^>]*\/?>/;

function regenerateMetaFontLink() {
  const tokensPath = path.join(DESIGN_DIR, 'tokens.json');
  if (!fs.existsSync(tokensPath)) {
    warn('design-guide/tokens.json not found, partials/meta.html font link left unchanged');
    return false;
  }
  let t;
  try {
    t = JSON.parse(fs.readFileSync(tokensPath, 'utf8'));
  } catch (e) {
    warn(`design-guide/tokens.json is not valid JSON (${e.message}), partials/meta.html font link left unchanged`);
    return false;
  }
  const ty = t.typography || {};
  if (!ty.heading && !ty.body) return false;
  const nextLink = googleFontsLinkBlock(ty.heading, ty.body);
  if (!nextLink) return false;
  const metaPath = path.join(PARTIALS_DIR, 'meta.html');
  if (!fs.existsSync(metaPath)) {
    warn('partials/meta.html not found, font link not synced');
    return false;
  }
  const html = fs.readFileSync(metaPath, 'utf8');
  if (!META_FONT_LINK_RE.test(html)) {
    warn('Could not find the Google Fonts <link> block in partials/meta.html, left unchanged');
    return false;
  }
  const replaced = html.replace(META_FONT_LINK_RE, nextLink);
  if (replaced === html) return false;
  fs.writeFileSync(metaPath, replaced, 'utf8');
  return true;
}

function copyAssets() {
  if (!fs.existsSync(ASSETS_DIR)) return 0;
  let copied = 0;
  for (const file of walk(ASSETS_DIR)) {
    const r = path.relative(ROOT, file).split(path.sep).join('/');
    const dest = path.join(DIST_DIR, r);
    fs.mkdirSync(path.dirname(dest), { recursive: true });
    fs.copyFileSync(file, dest);
    copied++;
  }
  return copied;
}

// Imported sites (e.g. flat HTML sites that got the v2 scaffold) reference
// root-level CSS/JS and a top-level images/ folder rather than everything under
// assets/. Mirror those into dist so the DEPLOYED site is complete — otherwise
// the page loads but renders unstyled with broken images.
const ROOT_STATIC_FILE_EXT = new Set(['.css', '.js', '.mjs', '.map']);
const ROOT_STATIC_DIRS = ['images', 'img', 'fonts', 'media', 'css', 'js', 'video', 'videos'];
function copyRootStatics() {
  let copied = 0;
  for (const name of fs.readdirSync(ROOT)) {
    const abs = path.join(ROOT, name);
    let st;
    try { st = fs.statSync(abs); } catch { continue; }
    if (st.isFile() && ROOT_STATIC_FILE_EXT.has(path.extname(name).toLowerCase())) {
      fs.copyFileSync(abs, path.join(DIST_DIR, name));
      copied++;
    }
  }
  for (const dir of ROOT_STATIC_DIRS) {
    const srcDir = path.join(ROOT, dir);
    if (!fs.existsSync(srcDir) || !fs.statSync(srcDir).isDirectory()) continue;
    for (const file of walk(srcDir)) {
      const r = path.relative(ROOT, file).split(path.sep).join('/');
      const dest = path.join(DIST_DIR, r);
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.copyFileSync(file, dest);
      copied++;
    }
  }
  return copied;
}

// ─── Main build ─────────────────────────────────────────────────────────
function fullBuild() {
  partialCache.clear();
  blogPostsCache = null;
  businessCache = null;
  perfBudgetCache = null;
  if (!FLAGS.verify && !FLAGS.stateOnly) {
    fs.mkdirSync(DIST_DIR, { recursive: true });
    // tokens.json is the source of truth for tokens.css — regenerate before
    // assets are copied so dist always carries the current design tokens.
    regenerateTokensCss();
    // tokens.json is also the source of truth for the webfont <link> in
    // partials/meta.html — resync before pages are composed so every page
    // picks up the current heading/body fonts.
    regenerateMetaFontLink();
  }
  const pages = [
    ...walk(PAGES_DIR, (p) => p.endsWith('.html')),
    ...walk(BLOG_DIR, (p) => p.endsWith('.html')),
  ];
  let written = 0;
  const records = [];
  for (const p of pages) {
    const r = processPage(p);
    if (r && r.skipped) continue;
    if (r && r.record) records.push(r.record);
    if (r && r.written) written++;
  }
  const state = deriveSiteState(records);
  if (FLAGS.verify) validateAgentFiles();
  const seoAssets = writeSeoAssets(records);
  const assetsCopied =
    FLAGS.verify || FLAGS.stateOnly ? 0 : copyAssets() + copyRootStatics();
  return {
    written,
    assetsCopied,
    stateFilesWritten: [...state.written, ...seoAssets],
    pageCount: state.pageCount,
    postCount: state.postCount,
    sectionCount: state.sectionCount,
    blockCount: state.blockCount,
    imageCount: state.imageCount,
    issues: state.issues,
  };
}

/**
 * Final stdout line — a stable JSON contract consumed by the Electron wrapper,
 * the verify command, and the portal. Schema:
 *   { ok, pagesWritten, stateFilesWritten[], counts{}, checks{}, errors[], warnings[], elapsedMs }
 * `ok` is false iff the build hit a hard error (perf budget, fatal). `checks`
 * is advisory (non-fatal) so agents can self-correct.
 */
function emitOutcome(result, elapsedMs) {
  const issues = result.issues || {};
  const outcome = {
    ok: errors.length === 0,
    pagesWritten: result.written,
    stateFilesWritten: result.stateFilesWritten || [],
    counts: {
      pages: result.pageCount || 0,
      posts: result.postCount || 0,
      sections: result.sectionCount || 0,
      blocks: result.blockCount || 0,
      images: result.imageCount || 0,
    },
    checks: {
      perf: { oversize_images: (issues.oversize || []).length },
      links: { broken: (issues.broken || []).length, orphans: (issues.orphans || []).length },
      seo: { missing_alt: (issues.missingAlt || []).length },
      assets: { broken_images: (issues.brokenImages || []).length },
    },
    errors,
    warnings,
    elapsedMs: elapsedMs || 0,
  };
  console.log(JSON.stringify(outcome));
}

// ─── Dev server ─────────────────────────────────────────────────────────
function startDevServer() {
  const http = require('http');
  const url = require('url');
  const port = Number(process.env.PORT || 4001);
  const mime = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
  };
  const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(url.parse(req.url).pathname || '/');
    if (pathname.endsWith('/')) pathname += 'index.html';
    const filePath = path.join(DIST_DIR, pathname);
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403); res.end('Forbidden'); return;
    }
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<h1>404</h1><p>${pathname} not found in dist/.</p>`);
        return;
      }
      const ext = path.extname(filePath).toLowerCase();
      res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
      res.end(data);
    });
  });
  server.listen(port, () => {
    console.log(`[stitch] dev server: http://localhost:${port}/`);
  });
}

function watchAndRebuild() {
  const watchPaths = [PAGES_DIR, BLOG_DIR, PARTIALS_DIR, ASSETS_DIR, DESIGN_DIR, SITE_DIR];
  let pending = null;
  const trigger = () => {
    if (pending) clearTimeout(pending);
    pending = setTimeout(() => {
      pending = null;
      try {
        const r = fullBuild();
        console.log(`[stitch] rebuild: ${r.written} pages, ${r.assetsCopied} assets`);
      } catch (e) {
        console.error(`[stitch] rebuild failed: ${e.message}`);
      }
    }, 80);
  };
  for (const dir of watchPaths) {
    if (!fs.existsSync(dir)) continue;
    fs.watch(dir, { recursive: true }, trigger);
  }
  console.log('[stitch] watching for changes…');
}

/**
 * Snapshot the current design tokens + guide into design-guide/checkpoints/<name>.json
 * so an agent (or human) has an approved-state baseline to compare drift against
 * or revert to. Pure copy of the inputs — no build.
 */
function writeCheckpoint(name) {
  const safe = String(name).replace(/[^a-z0-9-_]/gi, '-').slice(0, 60) || 'checkpoint';
  const dir = path.join(DESIGN_DIR, 'checkpoints');
  fs.mkdirSync(dir, { recursive: true });
  const tokensPath = path.join(DESIGN_DIR, 'tokens.json');
  const guidePath = path.join(DESIGN_DIR, 'current.md');
  const snapshot = {
    name: safe,
    created_utc: new Date().toISOString(),
    tokens: fs.existsSync(tokensPath) ? JSON.parse(fs.readFileSync(tokensPath, 'utf8')) : null,
    design_guide_md: fs.existsSync(guidePath) ? fs.readFileSync(guidePath, 'utf8') : null,
  };
  const out = path.join(dir, `${safe}.json`);
  fs.writeFileSync(out, JSON.stringify(snapshot, null, 2) + '\n');
  console.log(`[stitch] checkpoint written: design-guide/checkpoints/${safe}.json`);
  console.log(JSON.stringify({ ok: true, checkpoint: `design-guide/checkpoints/${safe}.json` }));
}

// ─── Entry point ────────────────────────────────────────────────────────
(function main() {
  const started = Date.now();
  try {
    if (CHECKPOINT !== null) {
      writeCheckpoint(CHECKPOINT);
      process.exit(0);
    }
    const result = fullBuild();
    if (errors.length > 0) {
      console.error(`[stitch] ${errors.length} error(s); aborting.`);
      emitOutcome(result, Date.now() - started);
      process.exit(2);
    }
    const elapsed = Date.now() - started;
    console.log(
      `[stitch] ${result.written} pages, ${result.assetsCopied} assets, ${warnings.length} warnings, ${elapsed}ms`
    );
    emitOutcome(result, elapsed);

    if (FLAGS.watch) watchAndRebuild();
    if (FLAGS.serve) startDevServer();
    if (!FLAGS.watch && !FLAGS.serve) process.exit(0);
  } catch (e) {
    console.error(`[stitch] fatal: ${e.message}`);
    process.exit(1);
  }
})();
