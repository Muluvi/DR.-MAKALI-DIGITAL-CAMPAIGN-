import { chromium } from "playwright";
(async () => {
  const b = await chromium.launch();
  const p = await (await b.newContext({ viewport:{width:360,height:780} })).newPage();
  await p.goto('http://localhost:3100/full', { waitUntil:'networkidle', timeout: 120000 });
  await p.waitForTimeout(1500);
  const r = await p.evaluate(() => {
    const out = {};
    out.dom = document.querySelectorAll('*').length;
    out.html_kB = Math.round(document.documentElement.outerHTML.length/1024);
    // ward label duplication
    const txt = [...document.querySelectorAll('svg text, svg tspan, [class*=tile] *')].map(e=>e.textContent.trim());
    const kwa = [...document.querySelectorAll('*')].filter(e=>e.children.length===0 && /Kwa Mutonga/.test(e.textContent)).length;
    out.kwaMutongaLeafNodes = kwa;
    out.svgCount = document.querySelectorAll('svg').length;
    out.svgRectOver39 = [...document.querySelectorAll('svg')].filter(s=>s.querySelectorAll('rect,path').length>=40).length;
    // tile maps: elements with 40 tile children
    const maps=[...document.querySelectorAll('[class*="tile"],[class*="Tile"],[data-ward]')];
    out.dataWardEls = document.querySelectorAll('[data-ward]').length;
    // overflow: leaf elements whose scrollWidth > clientWidth with visible overflow
    const of=[];
    for (const e of document.querySelectorAll('body *')) {
      if (e.children.length) continue;
      const cs=getComputedStyle(e); if (cs.display==='none'||cs.visibility==='hidden') continue;
      if (e.scrollWidth > e.clientWidth+1 && e.clientWidth>0 && cs.overflow==='visible' && !['inline'].includes(cs.display)) of.push((e.className&&e.className.baseVal===undefined?e.className:'').toString().slice(0,40)+' | '+e.textContent.trim().slice(0,40));
    }
    out.overflowLeaves = of.length; out.overflowSamples = of.slice(0,15);
    out.tierBadges = document.querySelectorAll('[class*=tier]').length;
    out.sections = document.querySelectorAll('section').length;
    out.fonts = [...new Set([...document.querySelectorAll('body *')].slice(0,4000).map(e=>getComputedStyle(e).fontFamily.split(',')[0]))];
    const sizes={}; for (const e of [...document.querySelectorAll('body *')].slice(0,20000)) { if(!e.childNodes.length||![...e.childNodes].some(n=>n.nodeType===3&&n.textContent.trim()))continue; const fs=getComputedStyle(e).fontSize; sizes[fs]=(sizes[fs]||0)+1 } out.fontSizes=Object.entries(sizes).sort((a,b)=>b[1]-a[1]);
    return out;
  });
  console.log(JSON.stringify(r,null,1));
  await b.close();
})();
