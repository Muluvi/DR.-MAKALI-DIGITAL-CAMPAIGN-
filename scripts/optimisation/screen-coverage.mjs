// For each phone screen (390x844) of /full, does it contain any visual? Per section.
import { chromium } from "playwright";
const url = process.argv[2] || 'http://localhost:3100/full';
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport:{width:390,height:844} })).newPage();
  await p.goto(url, { waitUntil:'networkidle', timeout: 180000 });
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const H = 844;
    const vis = [];
    const sel = 'figure, table, img, canvas, svg, [class^="vz-"], [class*=" vz-"], [role=img]';
    for (const e of document.querySelectorAll(sel)) {
      const b = e.getBoundingClientRect();
      if (b.width < 120 || b.height < 60) continue;
      vis.push([b.top + scrollY, b.bottom + scrollY]);
    }
    const heads = [...document.querySelectorAll('[id*="-sec-"], h1[id], h2[id]')].map(h => ({ id: h.id.split('-sec-')[0], y: h.getBoundingClientRect().top + scrollY })).filter(h=>h.id);
    const total = document.documentElement.scrollHeight;
    const per = {};
    for (let y = 0; y < total; y += H) {
      let sec = 'cover'; for (const h of heads) if (h.y <= y + H/2) sec = h.id;
      per[sec] = per[sec] || { screens: 0, bare: 0 };
      per[sec].screens++;
      if (!vis.some(([a, z]) => z > y && a < y + H)) per[sec].bare++;
    }
    return { total, screens: Math.ceil(total / H), per };
  });
  console.log(JSON.stringify(r));
  await b.close();
})();
