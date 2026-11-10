import { motionOk, readPrefs } from "./prefs";

/**
 * Feedback primitives shared by every effect: synthesised micro-sounds and a confetti burst.
 *
 * Sounds are generated with the Web Audio API (no audio files are downloaded) and play only when
 * the reader has switched sound on in the effects panel. Confetti draws on one transient canvas
 * that removes itself when the last piece has fallen, and never runs under reduced motion.
 */

let ctx: AudioContext | null = null;

type Tone = "tap" | "toggle" | "success" | "error" | "open" | "close";

const TONES: Record<Tone, { f: number[]; d: number; type: OscillatorType; g: number }> = {
  tap: { f: [880], d: 0.05, type: "sine", g: 0.035 },
  toggle: { f: [660, 990], d: 0.07, type: "triangle", g: 0.04 },
  success: { f: [660, 880, 1320], d: 0.09, type: "sine", g: 0.045 },
  error: { f: [220, 180], d: 0.11, type: "square", g: 0.025 },
  open: { f: [520, 780], d: 0.08, type: "sine", g: 0.035 },
  close: { f: [780, 520], d: 0.08, type: "sine", g: 0.035 },
};

export function sound(tone: Tone) {
  if (typeof window === "undefined" || !readPrefs().sound) return;
  try {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    ctx ??= new AC();
    if (ctx.state === "suspended") void ctx.resume();
    const spec = TONES[tone];
    let t = ctx.currentTime;
    for (const f of spec.f) {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = spec.type;
      osc.frequency.setValueAtTime(f, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(spec.g, t + 0.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + spec.d);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t);
      osc.stop(t + spec.d + 0.02);
      t += spec.d * 0.75;
    }
  } catch {
    // Audio is a nicety; a browser that refuses it loses nothing else.
  }
}

/** The brand colours, read live so a palette or theme change is honoured. */
function brandColours(): string[] {
  const s = getComputedStyle(document.documentElement);
  const pick = (name: string, fallback: string) => s.getPropertyValue(name).trim() || fallback;
  return [pick("--accent-solid", "#2546c8"), pick("--gold", "#c99a2e"), pick("--danger", "#c0392b"), pick("--accent", "#6f8cff"), "#ffffff"];
}

/**
 * A celebratory burst from a point on screen. Physics: gravity, air drag, spin and a flutter,
 * integrated per frame; each piece fades over its last 30% of life.
 */
export function confetti(x = window.innerWidth / 2, y = window.innerHeight / 3, count = 90) {
  if (typeof window === "undefined" || !motionOk()) return;
  const canvas = document.createElement("canvas");
  canvas.className = "fx-confetti";
  canvas.setAttribute("aria-hidden", "true");
  const dpr = Math.min(2, window.devicePixelRatio || 1);
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  const g = canvas.getContext("2d");
  if (!g) {
    canvas.remove();
    return;
  }
  g.scale(dpr, dpr);
  const colours = brandColours();
  const pieces = Array.from({ length: count }, () => {
    const a = Math.random() * Math.PI * 2;
    const v = 4 + Math.random() * 8;
    return {
      x,
      y,
      vx: Math.cos(a) * v,
      vy: Math.sin(a) * v - 6,
      r: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.4,
      w: 5 + Math.random() * 6,
      h: 3 + Math.random() * 4,
      c: colours[(Math.random() * colours.length) | 0],
      life: 0,
      max: 70 + Math.random() * 50,
    };
  });
  let raf = 0;
  const step = () => {
    g.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;
    for (const p of pieces) {
      if (p.life > p.max) continue;
      alive++;
      p.life++;
      p.vy += 0.28; // gravity
      p.vx *= 0.985; // drag
      p.vy *= 0.985;
      p.x += p.vx + Math.sin(p.life * 0.15) * 0.6; // flutter
      p.y += p.vy;
      p.r += p.vr;
      const fade = p.life > p.max * 0.7 ? 1 - (p.life - p.max * 0.7) / (p.max * 0.3) : 1;
      g.save();
      g.globalAlpha = Math.max(0, fade);
      g.translate(p.x, p.y);
      g.rotate(p.r);
      g.scale(1, Math.cos(p.life * 0.2)); // the 3D tumble
      g.fillStyle = p.c;
      g.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      g.restore();
    }
    if (alive) raf = requestAnimationFrame(step);
    else canvas.remove();
  };
  raf = requestAnimationFrame(step);
  window.setTimeout(() => {
    cancelAnimationFrame(raf);
    canvas.remove();
  }, 6000);
}
