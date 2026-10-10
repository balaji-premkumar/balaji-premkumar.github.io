// Share card (public/og-v2.jpg): name, role and stickers from site.json + the avatar mid-vanakkam.
// 1. Avatar cut-out: on the dev server run avatar.seek('vanakkam', 0.6) in the console and capture the
//    canvas with a transparent background (or reuse art/og/avatar.png), cropped to the figure.
// 2. node art/og/card.mjs src/content/site.json art/og/avatar.png /tmp/og.png   (needs playwright-core + Chrome)
// 3. ffmpeg -i /tmp/og.png -q:v 3 public/og-vN.jpg, then bump meta.ogImage in site.json (platforms cache by URL).
import { chromium } from 'playwright-core';
import { readFileSync } from 'node:fs';
const [site, avatarPath, out] = process.argv.slice(2);
const s = JSON.parse(readFileSync(site, 'utf8'));
const t = s.theme;
const hero = s.sections.find((x) => x.type === 'hero');
const avatar = 'data:image/png;base64,' + readFileSync(avatarPath).toString('base64');
const host = s.meta.url.replace(/^https?:\/\//, '').replace(/\/$/, '');
const html = `<!doctype html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:wght@800&family=DM+Sans:wght@700&family=JetBrains+Mono:wght@500&display=block">
<style>
*{margin:0;box-sizing:border-box}
body{width:1200px;height:630px;overflow:hidden;position:relative;font-family:'DM Sans',sans-serif;color:${t.ink};
 background:radial-gradient(color-mix(in oklab,${t.ink} 10%,transparent) 1.5px,transparent 2px) 0 0/26px 26px,${t.bg}}
.brut{border:5px solid ${t.ink};box-shadow:9px 9px 0 ${t.ink}}
.hello{position:absolute;left:64px;top:58px;background:${t.yellow};padding:10px 22px;border-radius:16px;font:800 40px 'Bricolage Grotesque';transform:rotate(-4deg)}
h1{position:absolute;z-index:2;left:64px;top:156px;font:800 112px/0.92 'Bricolage Grotesque';letter-spacing:-0.035em}
h1 span{display:inline-block;margin-top:14px;background:${t.accent};padding:4px 20px 12px;border-radius:14px;transform:rotate(-2deg)}
.role{position:absolute;left:68px;top:452px;font:500 26px 'JetBrains Mono';letter-spacing:.14em;text-transform:uppercase}
.url{position:absolute;left:64px;bottom:44px;background:${t.card};padding:8px 20px;border-radius:999px;font:700 24px 'DM Sans';box-shadow:5px 5px 0 ${t.ink};border-width:4px}
.blob{position:absolute;left:760px;top:92px;width:410px;height:410px;background:${t.blue};border-radius:44% 56% 52% 48%/52% 44% 56% 48%}
.me{position:absolute;left:808px;bottom:6px;height:600px}
.sticker{position:absolute;padding:8px 18px;border-radius:14px;font:700 26px 'DM Sans';border:4px solid ${t.ink};box-shadow:5px 5px 0 ${t.ink}}
</style></head><body>
<div class="hello brut">${'Vanakkam! 🙏'}</div>
<h1>${s.person.firstName}<br><span class="brut">${s.person.lastName}</span></h1>
<p class="role">${s.person.jobTitle}</p>
<div class="url brut">${host}</div>
<div class="blob brut"></div>
<img class="me" src="${avatar}">
${(hero.stickers ?? []).slice(0, 2).map((x, i) => `<div class="sticker" style="${i ? `left:1010px;top:470px;background:${t.lime};transform:rotate(5deg)` : `left:700px;top:60px;background:${t.card};transform:rotate(-6deg)`}">${x}</div>`).join('')}
</body></html>`;
const b = await chromium.launch({ executablePath: '/usr/bin/google-chrome', headless: true });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.screenshot({ path: out });
await b.close();
