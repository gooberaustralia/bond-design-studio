// middleware.js — Goober AI-crawler visibility (Vercel Edge). GENERATED — edit via the Tracking panel.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const ua = request.headers.get('user-agent') || '';
  if (/GPTBot|OAI-SearchBot|ChatGPT-User|PerplexityBot|Perplexity-User|ClaudeBot|Claude-Web|Google-Extended|CCBot|Bytespider|Amazonbot|Applebot-Extended/i.test(ua)) {
    try {
      const url = new URL(request.url);
      fetch('https://adwords.goober.com.au/api/ai-traffic/5f61d428-7382-407b-ae64-47500908824a', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ kind: 'crawler', source: ua.slice(0, 120), path: url.pathname }),
      });
    } catch (e) {}
  }
}
