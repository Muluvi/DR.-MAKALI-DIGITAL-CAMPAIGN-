#!/usr/bin/env node
/**
 * Measure how often painted floating chrome sits on top of document content.
 *
 * Usage:  npx next start -p 5000 &  node scripts/measure-chrome-occlusion.mjs 5000
 *
 * Why this exists as a committed script rather than a throwaway: the first version of this
 * measurement selected capsules by CSS class alone and never checked whether they were
 * actually painted. A capsule hidden with `opacity-0 ... pointer-events-none` still matched,
 * still had a bounding rect, and so still reported the content behind it as occluded. It
 * returned ~2,950 desktop / ~3,610 mobile hits both before and after a fix that demonstrably
 * worked, and those invalid figures were quoted in commit 5a0834d's message. Keeping the
 * corrected instrument in the repo means the next person measures the right thing.
 *
 * Measured with this version, walking all ten sections:
 *   pre-fix  (e079509):  483 desktop / 1,279 mobile
 *   post-fix (5a0834d):   35 desktop /   656 mobile
 * Mobile keeps a floor because the nav recall pill is meant to stay visible.
 */
import { chromium } from 'playwright';
const PORT = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
for (const [label,w,h] of [['desktop',1440,900],['iphone',393,852]]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, hasTouch:w<1024, isMobile:w<1024 });
  await p.goto('http://localhost:'+PORT,{waitUntil:'networkidle'});
  const SEL='button.group.relative.flex.items-center';
  const n = await p.$$eval(SEL,e=>e.length).catch(()=>0);
  let hits=0, sample=[];
  for (let i=0;i<Math.min(n,10);i++){
    await p.$$eval(SEL,(e,i)=>e[i]?.click(),i).catch(()=>{});
    await p.waitForTimeout(600);
    const r = await p.evaluate(async ()=>{
      const res=[];
      for(let y=400;y<document.body.scrollHeight-400;y+=900){
        window.scrollTo(0,y);
        await new Promise(r=>setTimeout(r,260));   // let the scroll model settle
        // Only capsules that are ACTUALLY PAINTED count. This is what the earlier
        // instrument got wrong: it matched on class name, so a hidden capsule still
        // reported the content behind it as occluded.
        const caps=[...document.querySelectorAll('div,aside')].filter(d=>{
          const s=getComputedStyle(d);
          if(s.position!=='fixed') return false;
          if(parseFloat(s.opacity)<0.05) return false;
          if(s.visibility==='hidden'||s.display==='none') return false;
          if(s.pointerEvents==='none') return false;
          const r0=d.getBoundingClientRect();
          return r0.width>5 && r0.height>5 && r0.top<innerHeight && r0.bottom>0 && /bottom-/.test(d.className||'');
        });
        for(const c of caps){
          const r0=c.getBoundingClientRect();
          for(const [x,yy] of [[r0.left+6,r0.top+r0.height/2],[r0.left+r0.width/2,r0.top+4]]){
            if(x<0||x>innerWidth||yy<0||yy>innerHeight) continue;
            const under=document.elementsFromPoint(x,yy).find(e=>!c.contains(e)&&e!==c&&getComputedStyle(e).position!=='fixed');
            const txt=(under?.textContent||'').replace(/\s+/g,' ').trim();
            if(txt.length>8) res.push(txt.slice(0,50));
          }
        }
      }
      return res;
    });
    hits+=r.length; sample.push(...r.slice(0,1));
  }
  console.log(`${label.padEnd(8)} ${String(w).padStart(4)}px  painted-capsule-over-content hits: ${hits}`);
  [...new Set(sample)].slice(0,3).forEach(s=>console.log(`            e.g. "${s}"`));
  await p.close();
}
await b.close();
