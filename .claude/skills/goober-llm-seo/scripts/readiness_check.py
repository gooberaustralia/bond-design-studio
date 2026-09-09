#!/usr/bin/env python3
"""
readiness_check.py — AI-readiness audit tool for the llm-seo skill.

Implements SKILL.md sections 2a-2e (crawler access / robots.txt semantics,
schema coverage, content freshness, render mode) plus basic HTTPS/canonical/
sitemap checks, against the full AI-crawler bot roster in reference.md.

Stdlib only. Usage:
    python3 readiness_check.py https://example.com [--max-pages 25] [--json out.json]

Honesty rules (hard constraints, see SKILL.md §7):
- Every check reports pass / fail / not_measured — a fetch failure is
  not_measured/unknown, NEVER fail.
- No invented numbers. If we didn't measure it, we say so.
- Politeness: <=25 page fetches by default, 0.3s delay between fetches,
  15s timeout each, custom UA identifying the audit tool.
"""

import argparse
import gzip
import io
import json
import re
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime, timezone
from html.parser import HTMLParser
from urllib.parse import urljoin, urlparse
from xml.etree import ElementTree as ET

USER_AGENT = "GooberLLMSEOAudit/1.0 (+https://goober.com.au)"
TIMEOUT = 15
DELAY = 0.3

# --------------------------------------------------------------------------
# Bot roster (reference.md) — the tokens we resolve verdicts for.
# Googlebot / Bingbot are included "for context" per the task brief, even
# though they aren't part of the AI-crawler roster proper.
# --------------------------------------------------------------------------
AI_BOT_ROSTER = [
    ("GPTBot", "ChatGPT / OpenAI"),
    ("OAI-SearchBot", "ChatGPT / OpenAI"),
    ("ChatGPT-User", "ChatGPT / OpenAI (live user-triggered fetch)"),
    ("ClaudeBot", "Claude / Anthropic"),
    ("Claude-Web", "Claude / Anthropic"),
    ("PerplexityBot", "Perplexity"),
    ("Perplexity-User", "Perplexity (live user-triggered fetch)"),
    ("Google-Extended", "Gemini / Google AI features"),
    ("Applebot-Extended", "Apple Intelligence"),
]
CONTEXT_BOTS = [
    ("Googlebot", "Google Search (context only)"),
    ("Bingbot", "Bing Search (context only)"),
]
ALL_BOTS = AI_BOT_ROSTER + CONTEXT_BOTS


# --------------------------------------------------------------------------
# Networking helpers
# --------------------------------------------------------------------------

class FetchResult:
    def __init__(self, ok, status=None, url=None, body=None, headers=None,
                 error=None, final_url=None):
        self.ok = ok
        self.status = status
        self.url = url
        self.body = body  # bytes, already gunzipped
        self.headers = headers or {}
        self.error = error
        self.final_url = final_url or url


def fetch(url, timeout=TIMEOUT, accept_404=True):
    """
    Polite GET fetch. Returns FetchResult. Never raises.
    A 404 is reported as ok=True/status=404 so callers can distinguish
    "not found" (a real, meaningful answer) from "fetch failure" (timeout /
    connection error / non-200-non-404), per §2b honesty semantics.
    """
    req = urllib.request.Request(
        url,
        headers={
            "User-Agent": USER_AGENT,
            "Accept": "*/*",
            "Accept-Encoding": "gzip",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            raw = resp.read()
            status = resp.getcode()
            headers = dict(resp.headers.items())
            final_url = resp.geturl()
            if headers.get("Content-Encoding", "").lower() == "gzip" or \
               raw[:2] == b"\x1f\x8b":
                try:
                    raw = gzip.decompress(raw)
                except OSError:
                    pass
            return FetchResult(True, status=status, url=url, body=raw,
                                headers=headers, final_url=final_url)
    except urllib.error.HTTPError as e:
        if e.code == 404:
            return FetchResult(True, status=404, url=url, body=b"",
                                headers=dict(e.headers.items()) if e.headers else {},
                                final_url=url)
        return FetchResult(False, status=e.code, url=url,
                            error=f"HTTPError {e.code}", final_url=url)
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        return FetchResult(False, status=None, url=url, error=str(e), final_url=url)
    except Exception as e:  # noqa: BLE001 - never let a fetch crash the audit
        return FetchResult(False, status=None, url=url, error=str(e), final_url=url)


def decode_body(body, headers):
    """Best-effort text decode honoring Content-Type charset, else utf-8/latin-1 fallback."""
    if body is None:
        return ""
    ctype = headers.get("Content-Type", "") if headers else ""
    charset = None
    m = re.search(r"charset=([\w-]+)", ctype, re.I)
    if m:
        charset = m.group(1)
    for enc in filter(None, [charset, "utf-8", "latin-1"]):
        try:
            return body.decode(enc, errors="replace")
        except (LookupError, UnicodeDecodeError):
            continue
    return body.decode("utf-8", errors="replace")


def polite_sleep():
    time.sleep(DELAY)


# --------------------------------------------------------------------------
# §2b — robots.txt parsing, exact semantics per SKILL.md
# --------------------------------------------------------------------------

class RobotsGroup:
    def __init__(self):
        self.agents = []       # list of UA tokens (lowercased), as declared
        self.rules = []        # list of (directive, path) in file order, directive in {allow,disallow}
        self.sitemaps = []     # sitemap lines are file-global, tracked separately actually


def parse_robots(text):
    """
    Parse robots.txt into a list of groups following SKILL.md §2b grouping rules:
    - Consecutive User-agent: lines with no rule between them share ONE group.
    - A User-agent: line seen AFTER at least one Allow/Disallow starts a NEW group.
    Returns (groups, sitemap_urls). On totally unparseable/garbled input, returns
    ([], []) which callers treat as "no groups found" => default allow.
    """
    groups = []
    sitemaps = []
    current = None
    seen_rule_in_current = False

    if text is None:
        return [], []

    lines = text.splitlines()
    for raw_line in lines:
        line = raw_line.split("#", 1)[0].strip()
        if not line:
            continue
        if ":" not in line:
            # garbled/unparseable line - skip, don't error
            continue
        field, _, value = line.partition(":")
        field = field.strip().lower()
        value = value.strip()

        if field == "user-agent":
            if current is None or seen_rule_in_current:
                # start a new group
                current = RobotsGroup()
                groups.append(current)
                seen_rule_in_current = False
            current.agents.append(value.lower())
        elif field in ("allow", "disallow"):
            if current is None:
                # rule with no preceding UA line - malformed; ignore per
                # "garbled file degrades to no groups found" spirit for this line
                continue
            current.rules.append((field, value))
            seen_rule_in_current = True
        elif field == "sitemap":
            if value:
                sitemaps.append(value)
        else:
            # crawl-delay etc. - ignored, not relevant to our checks
            continue

    return groups, sitemaps


def _strip_version_suffix(token):
    """Strips a trailing '/version' (e.g. 'gptbot/1.2' -> 'gptbot')."""
    idx = token.find("/")
    return token[:idx] if idx != -1 else token


def _group_matches_token(group, bot_token_lower):
    """
    Case-insensitive EXACT token equality only, plus the '*' wildcard
    (handled by the caller). The only fuzz allowed is a declared group token
    matching a versioned form of the SAME token (e.g. group 'gptbot' matches
    bot token 'gptbot/1.2') - version suffixes are stripped before comparing.
    Prefix/substring matching was previously used here and is a bug: it made
    a 'Googlebot-Image' group match the 'Googlebot' bot token (and vice
    versa), and made an 'Applebot' group incorrectly govern
    'Applebot-Extended' - those are different bots that happen to share a
    prefix, not the same bot with a version suffix.
    """
    target_stem = _strip_version_suffix(bot_token_lower)
    for tok in group.agents:
        if tok == "*":
            continue
        if _strip_version_suffix(tok) == target_stem:
            return True
    return False


def select_group(groups, bot_token):
    """
    Most-specific-group-wins: an exact/specific bot group is used INSTEAD of
    the wildcard group when one exists - never merged. Returns the selected
    group's rules list, or None if no matching group and no wildcard group
    (=> default allow).
    """
    bot_token_lower = bot_token.lower()
    specific = None
    wildcard = None
    for g in groups:
        if any(a == "*" for a in g.agents):
            # a group can technically declare both '*' and other tokens on
            # separate consecutive UA lines; treat as wildcard fallback
            if wildcard is None:
                wildcard = g
        if _group_matches_token(g, bot_token_lower):
            # first matching specific group wins ties by file order
            if specific is None:
                specific = g
    if specific is not None:
        return specific
    return wildcard


def root_path_verdict(group):
    """
    Longest matching Allow/Disallow rule for the root path '/' wins; ties
    resolve to Allow. Only rules whose path is a prefix of '/' count: empty,
    '/', or a wildcarded root like '/*'.
    Returns 'allow' or 'disallow'.
    """
    if group is None:
        return "allow"

    best_len = -1
    best_directive = "allow"
    found_any = False

    for directive, path in group.rules:
        p = path.strip()
        if p == "":
            # An empty Disallow value means "disallow nothing" (=> allow all)
            # per REP convention; treat as an explicit allow-all rule of
            # length 0. An empty Allow value is a no-op allow-all too.
            match_len = 0
            effective_directive = "allow" if directive == "disallow" else "allow"
            found_any = True
            if match_len >= best_len:
                if match_len > best_len or effective_directive == "allow":
                    best_len = match_len
                    best_directive = effective_directive
            continue

        # does this path count as matching root '/'? Only prefixes of '/'
        # count: '/', or a wildcarded root like '/*' (which still matches
        # '/' itself since '/' starts with '/').
        stem = p.rstrip("*") if p.endswith("*") else p
        if stem == "" or stem == "/" or "/".startswith(stem):
            match_len = len(p)
            found_any = True
            if match_len > best_len:
                best_len = match_len
                best_directive = directive
            elif match_len == best_len and directive == "allow":
                # tie -> Allow
                best_directive = "allow"

    if not found_any:
        return "allow"
    return best_directive


def robots_verdict_for_bot(groups, bot_token, robots_fetch):
    """
    Returns dict: {allowed_in_robots: 'allow'|'disallow'|'unknown',
                   group_matched: str|None, reason: str}
    """
    if robots_fetch.ok and robots_fetch.status == 404:
        return {
            "allowed_in_robots": "allow",
            "group_matched": None,
            "reason": "robots.txt returned 404 - allow-all per spec",
        }
    if not robots_fetch.ok or (robots_fetch.status is not None and
                                robots_fetch.status not in (200, 404)):
        return {
            "allowed_in_robots": "unknown",
            "group_matched": None,
            "reason": f"robots.txt fetch failed ({robots_fetch.error or robots_fetch.status}) "
                      f"- unknown, not blocked",
        }

    group = select_group(groups, bot_token)
    verdict = root_path_verdict(group)
    if group is None:
        group_desc = None
        reason = "no matching bot-specific or wildcard group - default allow"
    else:
        specific_agents = ", ".join(group.agents)
        reason = f"matched group [User-agent: {specific_agents}]"
        group_desc = specific_agents
    return {
        "allowed_in_robots": verdict,
        "group_matched": group_desc,
        "reason": reason,
    }


# --------------------------------------------------------------------------
# §2e — Render mode
# --------------------------------------------------------------------------

class VisibleTextExtractor(HTMLParser):
    """Strips script/style/tags/comments and collects visible text, and
    detects known empty-SPA-mount-point markers."""

    # title/meta text isn't rendered page content (it's document metadata,
    # e.g. the browser tab title) - excluded from the visible-text count but
    # NOT counted toward script_bytes either, since it isn't script payload.
    SKIP_TAGS = {"script", "style", "noscript", "template"}
    METADATA_TAGS = {"title", "meta"}

    # tags HTMLParser reports via handle_starttag that browsers still treat
    # as self-closing / void even without an explicit "/>" - without this,
    # a bare <br> or <img> would desync our element stack from actual nesting.
    VOID_TAGS = {
        "area", "base", "br", "col", "embed", "hr", "img", "input",
        "link", "meta", "param", "source", "track", "wbr",
    }

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self._skip_depth = 0
        self._metadata_depth = 0
        self.text_parts = []
        self.script_bytes = 0
        self.mount_points = {
            "root": {"seen": False, "empty": True},
            "__next": {"seen": False, "empty": True},
            "app": {"seen": False, "empty": True},
            "data-reactroot": {"seen": False, "empty": True},
        }
        # General element stack: list of [tag_name, mount_key_or_None].
        # mount_key is set on the entry for the element that opened a mount
        # point, so we can tell exactly when that specific element closes
        # (rather than guessing from tag name alone).
        self._elem_stack = []

    def _open_mount_keys(self):
        return [key for _, key in self._elem_stack if key]

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        tag_l = tag.lower()
        if tag_l in self.SKIP_TAGS:
            self._skip_depth += 1
        # Void metadata tags (<meta ...> without "/>") never get a matching
        # end tag from html.parser, so incrementing metadata_depth for them
        # would permanently suppress visible-text collection for the rest of
        # the page. A void tag can't contain content anyway - don't track it.
        if tag_l in self.METADATA_TAGS and tag_l not in self.VOID_TAGS:
            self._metadata_depth += 1

        elem_id = (attrs_d.get("id") or "").strip()
        has_reactroot = "data-reactroot" in attrs_d

        opened_key = None
        if elem_id == "root":
            opened_key = "root"
        elif elem_id == "__next":
            opened_key = "__next"
        elif elem_id == "app":
            opened_key = "app"
        elif has_reactroot:
            opened_key = "data-reactroot"

        if opened_key:
            self.mount_points[opened_key]["seen"] = True

        if tag_l not in self.VOID_TAGS:
            self._elem_stack.append([tag_l, opened_key])

    def handle_startendtag(self, tag, attrs):
        # self-closing tag (<div .../>) - never actually nests content, so
        # don't push it onto the element stack even if it happens to carry
        # a mount-point id (an empty self-closed mount point is still empty).
        self.handle_starttag(tag, attrs)
        tag_l = tag.lower()
        if tag_l in self.SKIP_TAGS:
            self._skip_depth -= 1
        if tag_l in self.METADATA_TAGS and tag_l not in self.VOID_TAGS:
            self._metadata_depth -= 1
        if self._elem_stack and self._elem_stack[-1][0] == tag_l:
            self._elem_stack.pop()

    def handle_endtag(self, tag):
        tag_l = tag.lower()
        if tag_l in self.SKIP_TAGS and self._skip_depth > 0:
            self._skip_depth -= 1
        if tag_l in self.METADATA_TAGS and self._metadata_depth > 0:
            self._metadata_depth -= 1
        # Pop the matching open element off the stack (search from the top
        # in case of any unbalanced/unclosed tags in real-world malformed
        # HTML - never raise on mismatched tags).
        for i in range(len(self._elem_stack) - 1, -1, -1):
            if self._elem_stack[i][0] == tag_l:
                del self._elem_stack[i:]
                break

    def handle_data(self, data):
        if self._skip_depth > 0:
            self.script_bytes += len(data)
            return
        if self._metadata_depth > 0:
            return
        stripped = data.strip()
        if stripped:
            self.text_parts.append(stripped)
            for key in self._open_mount_keys():
                self.mount_points[key]["empty"] = False

    def get_visible_text(self):
        return " ".join(self.text_parts)


def assess_render_mode(html_text):
    parser = VisibleTextExtractor()
    try:
        parser.feed(html_text)
        parser.close()
    except Exception:
        pass

    visible_text = parser.get_visible_text()
    visible_len = len(visible_text)

    empty_mounts = [k for k, v in parser.mount_points.items()
                    if v["seen"] and v["empty"]]
    any_mount_seen = any(v["seen"] for v in parser.mount_points.values())

    heavy_script = parser.script_bytes > max(visible_len * 2, 2000)

    if visible_len < 500 and (heavy_script or empty_mounts):
        verdict = "likely_client_rendered"
    else:
        verdict = "server_rendered"

    return {
        "verdict": verdict,
        "visible_text_chars": visible_len,
        "script_bytes": parser.script_bytes,
        "empty_mount_points_found": empty_mounts,
        "any_spa_mount_point_seen": any_mount_seen,
    }


# --------------------------------------------------------------------------
# §2c/2d — sitemap discovery, JSON-LD extraction, page classification
# --------------------------------------------------------------------------

SITEMAP_NS = "{http://www.sitemaps.org/schemas/sitemap/0.9}"


def strip_ns(tag):
    return tag.split("}", 1)[-1] if "}" in tag else tag


def parse_sitemap_xml(body_bytes):
    """
    Returns (kind, entries) where kind in {'urlset','sitemapindex','unknown'}
    and entries is a list of dicts {loc, lastmod} (lastmod may be None).
    Handles malformed XML gracefully -> ('unknown', []).
    """
    try:
        root = ET.fromstring(body_bytes)
    except ET.ParseError:
        return "unknown", []

    tag = strip_ns(root.tag)
    entries = []
    if tag not in ("urlset", "sitemapindex"):
        return "unknown", []

    for child in root:
        if strip_ns(child.tag) not in ("url", "sitemap"):
            continue
        loc = None
        lastmod = None
        for sub in child:
            subtag = strip_ns(sub.tag)
            if subtag == "loc" and sub.text:
                loc = sub.text.strip()
            elif subtag == "lastmod" and sub.text:
                lastmod = sub.text.strip()
        if loc:
            entries.append({"loc": loc, "lastmod": lastmod})
    return tag, entries


def discover_sitemap_urls(base_url, robots_sitemaps, log):
    """Try /sitemap.xml, /sitemap_index.xml, then robots.txt Sitemap: lines."""
    candidates = []
    for path in ("/sitemap.xml", "/sitemap_index.xml"):
        candidates.append(urljoin(base_url, path))
    for sm in robots_sitemaps:
        if sm not in candidates:
            candidates.append(sm)

    found = []
    seen = set()
    any_fetch_failure = False
    for url in candidates:
        if url in seen:
            continue
        seen.add(url)
        res = fetch(url)
        polite_sleep()
        if res.ok and res.status == 200 and res.body:
            kind, entries = parse_sitemap_xml(res.body)
            if kind != "unknown" and entries:
                found.append((url, kind, entries))
                log.append(f"sitemap found: {url} ({kind}, {len(entries)} entries)")
            elif kind == "unknown":
                log.append(f"sitemap at {url} returned malformed/unparseable XML - skipped")
        elif res.ok and res.status == 404:
            continue
        else:
            any_fetch_failure = True
            log.append(f"sitemap fetch failed for {url}: {res.error or res.status}")
    return found, any_fetch_failure


def sample_urls_for_depth_diversity(urls, max_pages):
    """Cap URL list to max_pages, preferring diversity of path depth."""
    if len(urls) <= max_pages:
        return urls

    by_depth = {}
    for u in urls:
        path = urlparse(u).path
        depth = len([seg for seg in path.split("/") if seg])
        by_depth.setdefault(depth, []).append(u)

    depths = sorted(by_depth.keys())
    sampled = []
    idx = {d: 0 for d in depths}
    while len(sampled) < max_pages:
        progressed = False
        for d in depths:
            if idx[d] < len(by_depth[d]) and len(sampled) < max_pages:
                sampled.append(by_depth[d][idx[d]])
                idx[d] += 1
                progressed = True
        if not progressed:
            break
    return sampled


class JsonLdAndTitleExtractor(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self._in_jsonld = False
        self._jsonld_chunks = []
        self.jsonld_blocks = []
        self._in_title = False
        self.title = ""
        self._headings_with_q = 0
        self._in_heading = False
        self._heading_buf = ""
        self._in_summary = False

    def handle_starttag(self, tag, attrs):
        attrs_d = dict(attrs)
        tag_l = tag.lower()
        if tag_l == "script" and (attrs_d.get("type") or "").lower() == "application/ld+json":
            self._in_jsonld = True
            self._jsonld_chunks = []
        if tag_l == "title":
            self._in_title = True
        if tag_l in ("h2", "h3", "summary"):
            self._in_heading = True
            self._heading_buf = ""

    def handle_endtag(self, tag):
        tag_l = tag.lower()
        if tag_l == "script" and self._in_jsonld:
            self._in_jsonld = False
            raw = "".join(self._jsonld_chunks).strip()
            if raw:
                self.jsonld_blocks.append(raw)
        if tag_l == "title":
            self._in_title = False
        if tag_l in ("h2", "h3", "summary") and self._in_heading:
            if "?" in self._heading_buf:
                self._headings_with_q += 1
            self._in_heading = False

    def handle_data(self, data):
        if self._in_jsonld:
            self._jsonld_chunks.append(data)
        if self._in_title:
            self.title += data
        if self._in_heading:
            self._heading_buf += data


def extract_jsonld_types(jsonld_blocks):
    """Parse each JSON-LD block, return set of @type values including @graph members."""
    types = set()
    parse_errors = 0
    for raw in jsonld_blocks:
        try:
            data = json.loads(raw)
        except json.JSONDecodeError:
            parse_errors += 1
            continue
        nodes = []
        if isinstance(data, list):
            nodes.extend(data)
        elif isinstance(data, dict):
            nodes.append(data)
        for node in nodes:
            if not isinstance(node, dict):
                continue
            if "@graph" in node and isinstance(node["@graph"], list):
                for g in node["@graph"]:
                    if isinstance(g, dict) and "@type" in g:
                        _collect_type(g["@type"], types)
            if "@type" in node:
                _collect_type(node["@type"], types)
    return types, parse_errors


def _collect_type(t, out_set):
    if isinstance(t, str):
        out_set.add(t)
    elif isinstance(t, list):
        for item in t:
            if isinstance(item, str):
                out_set.add(item)


PAGE_TYPE_RULES = [
    ("home", re.compile(r"^/?$")),
    ("faq", re.compile(r"/faq", re.I)),
    ("contact/about", re.compile(r"/(contact|about)", re.I)),
    ("blog/article", re.compile(r"/(blog|news|article|post)s?/", re.I)),
    ("product", re.compile(r"/(product|shop|store)s?/", re.I)),
    ("collection/category", re.compile(r"/(collection|category|categories)s?/", re.I)),
    ("service", re.compile(r"/(service|services)/", re.I)),
]


def classify_page_type(url, title):
    path = urlparse(url).path
    if path in ("", "/"):
        return "home"
    for label, pattern in PAGE_TYPE_RULES:
        if label == "home":
            continue
        if pattern.search(path):
            return label
    title_l = (title or "").lower()
    if "faq" in title_l or "frequently asked" in title_l:
        return "faq"
    if "contact" in title_l or "about" in title_l:
        return "contact/about"
    return "other"


# --------------------------------------------------------------------------
# §5 basics — HTTPS, canonical
# --------------------------------------------------------------------------

def check_canonical(html_text):
    m = re.search(
        r'<link[^>]+rel=["\']canonical["\'][^>]*href=["\']([^"\']+)["\']',
        html_text, re.I,
    )
    if not m:
        m = re.search(
            r'<link[^>]+href=["\']([^"\']+)["\'][^>]*rel=["\']canonical["\']',
            html_text, re.I,
        )
    return m.group(1) if m else None


# --------------------------------------------------------------------------
# Freshness bucketing (§2d + reference.md buckets)
# --------------------------------------------------------------------------

def bucket_freshness(lastmod_str, now):
    if not lastmod_str:
        return "unknown"
    date_str = lastmod_str.strip()
    parsed = None
    fmts_tz_stripped = date_str
    tzmatch = re.search(r"(Z|[+-]\d{2}:?\d{2})$", date_str)
    try:
        if tzmatch:
            iso = date_str
            if iso.endswith("Z"):
                iso = iso[:-1] + "+00:00"
            else:
                # normalize +HHMM to +HH:MM if needed
                if re.search(r"[+-]\d{4}$", iso):
                    iso = iso[:-2] + ":" + iso[-2:]
            parsed = datetime.fromisoformat(iso)
        else:
            parsed = datetime.fromisoformat(date_str)
    except ValueError:
        for fmt in ("%Y-%m-%d", "%Y-%m-%dT%H:%M:%S", "%Y-%m"):
            try:
                parsed = datetime.strptime(date_str, fmt)
                break
            except ValueError:
                continue

    if parsed is None:
        return "unknown"

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    age_days = (now - parsed).days
    if age_days < 0:
        # future-dated lastmod - treat as fresh but note it's odd; never guess further
        return "fresh"
    if age_days < 90:
        return "fresh"
    if age_days <= 365:
        return "aging"
    return "stale"


# --------------------------------------------------------------------------
# Main audit
# --------------------------------------------------------------------------

def run_audit(base_url, max_pages):
    log = []
    now = datetime.now(timezone.utc)

    parsed_base = urlparse(base_url)
    if not parsed_base.scheme:
        base_url = "https://" + base_url
        parsed_base = urlparse(base_url)

    origin = f"{parsed_base.scheme}://{parsed_base.netloc}"

    result = {
        "audit_target": base_url,
        "run_date": now.strftime("%Y-%m-%d"),
        "run_timestamp_utc": now.isoformat(),
        "tool": USER_AGENT,
        "crawler_access": {},
        "render_mode": {},
        "schema_coverage": {},
        "freshness": {},
        "basics": {},
        "notes": [],
    }

    # ---- Homepage fetch (used for HTTPS/canonical/render mode) ----
    home_res = fetch(base_url)
    polite_sleep()

    if home_res.ok and home_res.status == 200:
        final_scheme = urlparse(home_res.final_url).scheme
        result["basics"]["https"] = {
            "status": "pass" if final_scheme == "https" else "fail",
            "final_url": home_res.final_url,
            "detail": f"final scheme after redirects: {final_scheme}",
        }
        html_text = decode_body(home_res.body, home_res.headers)
        canonical = check_canonical(html_text)
        result["basics"]["canonical_tag"] = {
            "status": "pass" if canonical else "fail",
            "value": canonical,
        }
        render = assess_render_mode(html_text)
        result["render_mode"] = render
    else:
        result["basics"]["https"] = {
            "status": "not_measured",
            "detail": f"homepage fetch failed: {home_res.error or home_res.status}",
        }
        result["basics"]["canonical_tag"] = {
            "status": "not_measured",
            "detail": "homepage fetch failed",
        }
        result["render_mode"] = {
            "verdict": "unknown",
            "detail": f"homepage fetch failed: {home_res.error or home_res.status}",
        }
        log.append(f"WARNING: homepage fetch failed ({home_res.error or home_res.status}) - "
                    f"render mode and canonical checks are not_measured")

    # ---- robots.txt ----
    robots_url = urljoin(origin, "/robots.txt")
    robots_res = fetch(robots_url)
    polite_sleep()

    robots_txt_status = "not_measured"
    groups, robots_sitemaps = [], []
    if robots_res.ok and robots_res.status == 200:
        robots_text = decode_body(robots_res.body, robots_res.headers)
        groups, robots_sitemaps = parse_robots(robots_text)
        robots_txt_status = "found"
        if not groups:
            log.append("robots.txt fetched but no parseable groups found "
                       "(garbled or empty) - default allow applied to all bots")
    elif robots_res.ok and robots_res.status == 404:
        robots_txt_status = "missing_404"
        log.append("robots.txt returned 404 - allow-all applied to all bots per spec")
    else:
        robots_txt_status = "fetch_failed"
        log.append(f"robots.txt fetch failed ({robots_res.error or robots_res.status}) - "
                   f"per-bot verdicts are 'unknown', not 'blocked'")

    per_bot = {}
    for token, service in ALL_BOTS:
        verdict = robots_verdict_for_bot(groups, token, robots_res)
        per_bot[token] = {
            "service": service,
            "allowed_in_robots": verdict["allowed_in_robots"],
            "group_matched": verdict["group_matched"],
            "reason": verdict["reason"],
            "actually_crawled": "not_measured",
            "actually_crawled_detail": "no server log / analytics access available to this script",
        }

    result["crawler_access"] = {
        "robots_txt_url": robots_url,
        "robots_txt_status": robots_txt_status,
        "sitemap_lines_in_robots": robots_sitemaps,
        "bots": per_bot,
    }

    # ---- Sitemap discovery & sampling ----
    sitemaps_found, sitemap_fetch_failure = discover_sitemap_urls(origin, robots_sitemaps, log)

    all_url_entries = {}  # loc -> lastmod
    sitemap_index_followed = False
    for sm_url, kind, entries in sitemaps_found:
        if kind == "sitemapindex" and not sitemap_index_followed:
            # follow one level of sitemap index
            sitemap_index_followed = True
            sub_sitemaps = entries[:10]  # sanity cap on how many child sitemaps to pull
            for sub in sub_sitemaps:
                sub_res = fetch(sub["loc"])
                polite_sleep()
                if sub_res.ok and sub_res.status == 200 and sub_res.body:
                    sub_kind, sub_entries = parse_sitemap_xml(sub_res.body)
                    if sub_kind == "urlset":
                        for e in sub_entries:
                            all_url_entries.setdefault(e["loc"], e.get("lastmod"))
                    else:
                        log.append(f"child sitemap {sub['loc']} was not a urlset "
                                   f"(kind={sub_kind}) - not followed further "
                                   f"(only one level of sitemap index is followed)")
                else:
                    log.append(f"child sitemap fetch failed: {sub['loc']} "
                               f"({sub_res.error or sub_res.status})")
        elif kind == "urlset":
            for e in entries:
                all_url_entries.setdefault(e["loc"], e.get("lastmod"))

    sitemap_found = bool(sitemaps_found) or bool(all_url_entries)
    if sitemap_found:
        sitemap_status = "pass"
    elif sitemap_fetch_failure:
        # a real network/fetch failure prevented us from checking at least
        # one candidate location - honesty rule: not_measured, never fail
        sitemap_status = "not_measured"
    else:
        sitemap_status = "fail"
    result["basics"]["sitemap_found"] = {
        "status": sitemap_status,
        "sitemaps": [u for u, _, _ in sitemaps_found],
        "total_urls_discovered": len(all_url_entries),
    }

    # ---- Freshness bucketing (uses the FULL discovered URL set, not just the sample) ----
    freshness_buckets = {"fresh": 0, "aging": 0, "stale": 0, "unknown": 0}
    freshness_examples = {"fresh": [], "aging": [], "stale": [], "unknown": []}
    for loc, lastmod in all_url_entries.items():
        bucket = bucket_freshness(lastmod, now)
        freshness_buckets[bucket] += 1
        if len(freshness_examples[bucket]) < 5:
            freshness_examples[bucket].append({"url": loc, "lastmod": lastmod})

    if all_url_entries:
        result["freshness"] = {
            "status": "measured",
            "total_urls": len(all_url_entries),
            "buckets": freshness_buckets,
            "examples": freshness_examples,
            "note": "Buckets are sourced only from sitemap <lastmod> values - never guessed. "
                    "'unknown' means no lastmod was present for that URL.",
        }
    else:
        result["freshness"] = {
            "status": "not_measured",
            "detail": "no sitemap discovered / no URL entries found",
        }

    # ---- Sample pages for schema coverage ----
    sample_urls = list(all_url_entries.keys())
    if not sample_urls:
        sample_urls = [base_url]
        log.append("no sitemap URLs discovered - falling back to homepage only for schema sampling")

    sampled = sample_urls_for_depth_diversity(sample_urls, max_pages)

    matrix = {}  # page_type -> {pages_sampled, pages_with_schema, schema_types: set}
    faq_content_no_schema = []
    faq_schema_no_content = []
    pages_detail = []

    for url in sampled:
        res = fetch(url)
        polite_sleep()
        if not (res.ok and res.status == 200 and res.body):
            pages_detail.append({
                "url": url,
                "status": "not_measured",
                "detail": f"fetch failed: {res.error or res.status}",
            })
            continue
        text = decode_body(res.body, res.headers)
        extractor = JsonLdAndTitleExtractor()
        try:
            extractor.feed(text)
            extractor.close()
        except Exception:
            pass

        types, parse_errors = extract_jsonld_types(extractor.jsonld_blocks)
        page_type = classify_page_type(url, extractor.title)

        m = matrix.setdefault(page_type, {
            "pages_sampled": 0, "pages_with_schema": 0, "schema_types": set(),
        })
        m["pages_sampled"] += 1
        has_schema = len(types) > 0
        if has_schema:
            m["pages_with_schema"] += 1
            m["schema_types"].update(types)

        looks_like_faq = ("faq" in urlparse(url).path.lower()) or \
                          (extractor._headings_with_q >= 2)
        has_faq_schema = "FAQPage" in types

        if looks_like_faq and not has_faq_schema:
            faq_content_no_schema.append(url)
        if has_faq_schema and not looks_like_faq:
            faq_schema_no_content.append(url)

        pages_detail.append({
            "url": url,
            "status": "measured",
            "page_type": page_type,
            "title": extractor.title.strip()[:200],
            "has_schema": has_schema,
            "schema_types": sorted(types),
            "jsonld_parse_errors": parse_errors,
        })

    matrix_out = {}
    for ptype, data in matrix.items():
        matrix_out[ptype] = {
            "pages_sampled": data["pages_sampled"],
            "pages_with_schema": data["pages_with_schema"],
            "schema_types_seen": sorted(data["schema_types"]),
        }

    result["schema_coverage"] = {
        "status": "measured" if pages_detail else "not_measured",
        "pages_sampled_count": len([p for p in pages_detail if p["status"] == "measured"]),
        "max_pages_requested": max_pages,
        "matrix_by_page_type": matrix_out,
        "faq_content_without_faqpage_schema": faq_content_no_schema,
        "faqpage_schema_without_faq_looking_content": faq_schema_no_content,
        "pages": pages_detail,
    }

    result["notes"] = log
    return result


# --------------------------------------------------------------------------
# Human-readable summary rendering
# --------------------------------------------------------------------------

def render_summary(result):
    lines = []
    lines.append(f"AI-readiness audit: {result['audit_target']}")
    lines.append(f"Run date: {result['run_date']} (UTC)")
    lines.append("")

    lines.append("== Crawler access (robots.txt) ==")
    ca = result["crawler_access"]
    lines.append(f"robots.txt: {ca['robots_txt_status']}")
    for token, info in ca["bots"].items():
        marker = {"allow": "ALLOWED", "disallow": "BLOCKED", "unknown": "UNKNOWN"}[
            info["allowed_in_robots"]
        ]
        lines.append(f"  {token:<20} {marker:<9} ({info['service']}) - {info['reason']}")
    lines.append("")

    lines.append("== Render mode ==")
    rm = result["render_mode"]
    if "verdict" in rm:
        lines.append(f"Verdict: {rm['verdict']}")
        if "visible_text_chars" in rm:
            lines.append(f"Visible text chars (homepage): {rm['visible_text_chars']}")
        if rm.get("empty_mount_points_found"):
            lines.append(f"Empty SPA mount points found: {', '.join(rm['empty_mount_points_found'])}")
    lines.append("")

    lines.append("== Basics ==")
    b = result["basics"]
    https_status = b.get("https", {}).get("status", "not_measured")
    lines.append(f"HTTPS: {https_status}")
    canon = b.get("canonical_tag", {})
    lines.append(f"Canonical tag present: {canon.get('status')}"
                  + (f" ({canon.get('value')})" if canon.get("value") else ""))
    sm = b.get("sitemap_found", {})
    lines.append(f"Sitemap found: {sm.get('status')} "
                  f"({sm.get('total_urls_discovered', 0)} URLs discovered)")
    lines.append("")

    lines.append("== Schema coverage (sampled pages) ==")
    sc = result["schema_coverage"]
    lines.append(f"Pages sampled: {sc['pages_sampled_count']} (cap: {sc['max_pages_requested']})")
    for ptype, data in sc["matrix_by_page_type"].items():
        lines.append(f"  {ptype:<20} {data['pages_with_schema']}/{data['pages_sampled']} "
                      f"have schema - types: {', '.join(data['schema_types_seen']) or '(none)'}")
    if sc["faq_content_without_faqpage_schema"]:
        lines.append(f"  FAQ-looking content WITHOUT FAQPage schema: "
                      f"{len(sc['faq_content_without_faqpage_schema'])} page(s)")
    if sc["faqpage_schema_without_faq_looking_content"]:
        lines.append(f"  FAQPage schema WITHOUT FAQ-looking content: "
                      f"{len(sc['faqpage_schema_without_faq_looking_content'])} page(s)")
    lines.append("")

    lines.append("== Freshness (from sitemap <lastmod>) ==")
    fr = result["freshness"]
    if fr.get("status") == "measured":
        buckets = fr["buckets"]
        total = fr["total_urls"]
        lines.append(f"Total URLs (from sitemap): {total}")
        for bucket in ("fresh", "aging", "stale", "unknown"):
            lines.append(f"  {bucket:<8} {buckets[bucket]}")
    else:
        lines.append(f"not_measured: {fr.get('detail')}")
    lines.append("")

    if result["notes"]:
        lines.append("== Notes ==")
        for n in result["notes"]:
            lines.append(f"  - {n}")

    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser(description="AI-readiness audit (llm-seo skill).")
    ap.add_argument("url", help="Site URL to audit, e.g. https://example.com")
    ap.add_argument("--max-pages", type=int, default=25,
                     help="Max pages to fetch for schema sampling (default 25)")
    ap.add_argument("--json", nargs="?", const="-", default=None,
                     help="Write structured JSON to this path, or to stdout if no path given")
    args = ap.parse_args()

    max_pages = min(max(args.max_pages, 1), 25) if args.max_pages else 25
    if args.max_pages and args.max_pages > 25:
        sys.stderr.write("Note: --max-pages capped at 25 to stay polite.\n")

    result = run_audit(args.url, max_pages)

    summary = render_summary(result)
    print(summary)

    if args.json is not None:
        payload = json.dumps(result, indent=2, ensure_ascii=False)
        if args.json == "-":
            print("\n" + "=" * 40 + " JSON " + "=" * 40)
            print(payload)
        else:
            with open(args.json, "w", encoding="utf-8") as f:
                f.write(payload)
            print(f"\nJSON written to {args.json}")


if __name__ == "__main__":
    main()
