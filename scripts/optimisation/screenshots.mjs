import { chromium } from "playwright";
const out = process.argv[2], tag = process.argv[3] || 'before';
(async () => {
  const b = await chromium.launch();
  const sizes = [[360,780],[390,844],[430,932],[768,1024],[1280,800],[1440,900],[1920,1080],[844,390]];
  const report = {};
  for (const [w,h] of sizes) {
    const ctx = await b.newContext({ viewport:{width:w,height:h}, deviceScaleFactor:1, colorScheme:'dark' });
    const p = await ctx.newPage();
    const imgs = [];
    p.on('request', r => { const u=r.url(); if (u.includes('/_next/image')) imgs.push(u.replace(/.*url=/,'').slice(0,90)); });
    await p.goto('http://localhost:3100/', { waitUntil:'networkidle' });
    await p.waitForTimeout(1200);
    const name = `${w}x${h}${w>h&&w<900?'-landscape':''}`;
    await p.screenshot({ path: `${out}/${tag}-${name}.png` });
    report[name] = await p.evaluate(() => ({
      docW: document.documentElement.scrollWidth, vw: innerWidth,
      dom: document.querySelectorAll('*').length,
      height: document.documentElement.scrollHeight,
    }));
    report[name].images = imgs;
    await ctx.close();
  }
  console.log(JSON.stringify(report, null, 1));
  await b.close();
})();
