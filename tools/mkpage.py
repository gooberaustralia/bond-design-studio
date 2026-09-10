#!/usr/bin/env python3
"""Wrap a body fragment in the shared Bond page skeleton and write it to pages/.

Usage: python3 tools/mkpage.py <out-path-under-pages> <meta.json> <body.html>
The meta json carries title, description, canonical, optional preload and schema.
"""
import json, os, sys, re

out, metafile, bodyfile = sys.argv[1], sys.argv[2], sys.argv[3]
meta = json.load(open(metafile, encoding='utf-8'))
body = open(bodyfile, encoding='utf-8').read()

extra_head = meta.get('head', '')
schema = meta.get('schema', '')
if isinstance(schema, (dict, list)):
    schema = ('<script type="application/ld+json">\n'
              + json.dumps(schema, indent=2, ensure_ascii=False) + '\n</script>')

# FAQPage schema is generated from the markup, never hand written, so the two
# can never disagree.
if meta.get('faq_from_markup'):
    m = re.search(r'<dl class="faq"[^>]*>(.*?)</dl>', body, re.S)
    if m:
        pairs = re.findall(r'<dt>(.*?)</dt>\s*<dd>(.*?)</dd>', m.group(1), re.S)
        clean = lambda t: re.sub(r'\s+', ' ', re.sub(r'<[^>]+>', '', t)).strip()
        faq = {"@context": "https://schema.org", "@type": "FAQPage",
               "mainEntity": [{"@type": "Question", "name": clean(q),
                               "acceptedAnswer": {"@type": "Answer", "text": clean(a)}}
                              for q, a in pairs]}
        schema += ('\n\n<script type="application/ld+json">\n'
                   + json.dumps(faq, indent=2, ensure_ascii=False) + '\n</script>')
        print(f"  {len(faq['mainEntity'])} FAQ entries")

page = f'''<!DOCTYPE html>
<html lang="en-AU" data-theme="day">
<head>
<!-- @use:bond-head title="{meta['title']}" description="{meta['description']}" canonical="{meta['canonical']}" -->
{extra_head}</head>

<body>
<!-- @use:bond-header -->

<main id="main">
{body}
</main>

<!-- @use:bond-footer -->

{schema}
</body>
</html>
'''
path = os.path.join('pages', out)
os.makedirs(os.path.dirname(path), exist_ok=True)
open(path, 'w', encoding='utf-8').write(page)
print(f"wrote pages/{out}")
