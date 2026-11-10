"use client";

import { useEffect, useRef, useState } from "react";

import { FX_EVENT, motionOk, readPrefs } from "../../lib/fx/prefs";

/**
 * The cover's effects layer. Everything here is decoration and adds no claim: it is aria-hidden,
 * it sits behind or beside content the server already rendered, and it never delays that content
 * (the canvases start after hydration, in an idle callback).
 *
 *   <HeroShader>     WebGL: a liquid mesh gradient (domain-warped noise) with ray-marched
 *                    metaballs, caustic light and a displacement that follows the pointer, then
 *                    post-processing — bloom, chromatic aberration, vignette and grain. Rendered at
 *                    reduced resolution, paused off-screen, in a hidden tab, or with ambient off.
 *   <HeroParticles>  A 3D constellation: points in a rotating volume, projected with perspective,
 *                    smaller and softer with depth (depth of field), linked when near, scattering
 *                    from the pointer.
 *   <HeroType>       A typewriter cycling the title's own three words, with a typing indicator
 *                    while it pauses. Screen readers get the title, not this.
 *   <HeroMapFX>      On the cover county: a pin dropped on Kitui Central with a catchment pulse,
 *                    and flight-line arcs traced out to the largest wards in the pool.
 *
 * Under reduced motion none of it runs; the static cover is complete without it.
 */

/** Resolves any CSS colour (oklch included) to [r, g, b] in 0–1 by painting one pixel. */
function rgbOf(cssVar: string, fallback: [number, number, number]): [number, number, number] {
  try {
    const value = getComputedStyle(document.documentElement).getPropertyValue(cssVar).trim();
    if (!value) return fallback;
    const c = document.createElement("canvas");
    c.width = c.height = 1;
    const g = c.getContext("2d", { willReadFrequently: true });
    if (!g) return fallback;
    g.fillStyle = "#000";
    g.fillStyle = value;
    g.fillRect(0, 0, 1, 1);
    const d = g.getImageData(0, 0, 1, 1).data;
    return [d[0] / 255, d[1] / 255, d[2] / 255];
  } catch {
    return fallback;
  }
}

function useAmbient(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const read = () => setOn(motionOk() && readPrefs().ambient);
    read();
    window.addEventListener(FX_EVENT, read);
    return () => window.removeEventListener(FX_EVENT, read);
  }, []);
  return on;
}

/** Runs `frame` on every animation frame while `el` is on screen and the tab is visible. */
function useVisibleLoop(el: React.RefObject<HTMLElement | null>, active: boolean, frame: (t: number) => void) {
  const cb = useRef(frame);
  useEffect(() => {
    cb.current = frame;
  });
  useEffect(() => {
    const node = el.current;
    if (!node || !active) return;
    let raf = 0;
    let visible = false;
    const loop = (t: number) => {
      cb.current(t);
      raf = requestAnimationFrame(loop);
    };
    const sync = () => {
      const run = visible && !document.hidden;
      if (run && !raf) raf = requestAnimationFrame(loop);
      if (!run && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    };
    const io = new IntersectionObserver(([e]) => {
      visible = !!e?.isIntersecting;
      sync();
    });
    io.observe(node);
    document.addEventListener("visibilitychange", sync);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", sync);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [el, active]);
}

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`;

const FRAG = `precision mediump float;
uniform vec2 uRes; uniform float uTime; uniform vec2 uMouse; uniform float uDark;
uniform vec3 uA; uniform vec3 uB; uniform vec3 uC; uniform vec3 uG;

float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); vec2 u = f*f*(3.0-2.0*f);
  return mix(mix(hash(i), hash(i+vec2(1,0)), u.x), mix(hash(i+vec2(0,1)), hash(i+vec2(1,1)), u.x), u.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a*noise(p); p *= 2.02; a *= 0.5; } return v; }

// Metaballs, ray-marched as a smooth union of spheres.
float smin(float a, float b, float k){ float h = clamp(0.5+0.5*(b-a)/k, 0.0, 1.0); return mix(b, a, h) - k*h*(1.0-h); }
float scene(vec3 p){
  float t = uTime*0.35;
  float d = length(p - vec3(sin(t)*0.55, cos(t*1.3)*0.35, 0.0)) - 0.32;
  d = smin(d, length(p - vec3(cos(t*0.8)*0.6, sin(t*0.9)*0.4, 0.2)) - 0.26, 0.35);
  d = smin(d, length(p - vec3(uMouse.x*0.9, uMouse.y*0.6, -0.1)) - 0.22, 0.4);
  return d;
}
vec3 normalAt(vec3 p){ vec2 e = vec2(0.002, 0.0); return normalize(vec3(scene(p+e.xyy)-scene(p-e.xyy), scene(p+e.yxy)-scene(p-e.yxy), scene(p+e.yyx)-scene(p-e.yyx))); }

vec3 field(vec2 uv){
  vec2 q = uv*1.6;
  // Displacement: the pointer pushes the warp field.
  vec2 m = uMouse*0.5 + 0.5;
  float md = exp(-6.0*length(uv - (m*2.0-1.0)*vec2(uRes.x/uRes.y,1.0)));
  vec2 w = vec2(fbm(q + uTime*0.05), fbm(q + vec2(5.2,1.3) - uTime*0.04)) + md*0.35;
  float n = fbm(q + 2.2*w);
  vec3 col = mix(uA, uB, smoothstep(0.2, 0.8, n));
  col = mix(col, uC, smoothstep(0.55, 0.95, w.y)*0.6);
  // Caustics: thin bright filaments where a second warped field folds.
  float c = abs(sin(fbm(q*2.5 + w*3.0 + uTime*0.12)*12.0));
  col += uG * pow(1.0 - c, 14.0) * 0.35;
  return col;
}

void main(){
  vec2 frag = gl_FragCoord.xy;
  vec2 uv = (frag*2.0 - uRes)/uRes.y;
  // Chromatic aberration: sample the field three times, offset radially.
  vec2 ca = uv*0.006;
  vec3 col = vec3(field(uv+ca).r, field(uv).g, field(uv-ca).b);

  // Ray-marched metaballs over the field, lit from the upper left.
  vec3 ro = vec3(0.0, 0.0, 2.2), rd = normalize(vec3(uv*0.55, -1.0));
  float t = 0.0; float hit = 0.0;
  for (int i = 0; i < 40; i++){ float d = scene(ro + rd*t); if (d < 0.002){ hit = 1.0; break; } t += d; if (t > 4.0) break; }
  if (hit > 0.5){
    vec3 p = ro + rd*t; vec3 nrm = normalAt(p);
    float diff = clamp(dot(nrm, normalize(vec3(-0.5, 0.7, 0.6))), 0.0, 1.0);
    float rim = pow(1.0 - clamp(dot(nrm, -rd), 0.0, 1.0), 3.0);
    vec3 glass = mix(uA, uG, 0.35) * (0.35 + 0.65*diff) + rim*uG*0.8;
    col = mix(col, glass, 0.55);
  }

  // Bloom (cheap): lift and spread the brightest tones.
  float l = dot(col, vec3(0.299, 0.587, 0.114));
  col += smoothstep(0.6, 1.0, l) * 0.18;
  // Vignette and grain.
  vec2 vu = frag/uRes;
  col *= mix(1.0, 0.82, smoothstep(0.35, 0.95, length(vu - 0.5)*1.4));
  col += (hash(frag + uTime) - 0.5) * 0.03;
  gl_FragColor = vec4(col, 1.0);
}`;

function HeroShader({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const gl = useRef<{
    g: WebGLRenderingContext;
    u: Record<string, WebGLUniformLocation | null>;
    t0: number;
  } | null>(null);
  const mouse = useRef<[number, number]>([0, 0]);
  const target = useRef<[number, number]>([0, 0]);

  useEffect(() => {
    const c = ref.current;
    if (!c || !active) return;
    const g = c.getContext("webgl", { antialias: false, alpha: false, powerPreference: "low-power", premultipliedAlpha: false });
    if (!g) return;
    const compile = (type: number, src: string) => {
      const s = g.createShader(type)!;
      g.shaderSource(s, src);
      g.compileShader(s);
      return g.getShaderParameter(s, g.COMPILE_STATUS) ? s : null;
    };
    const vs = compile(g.VERTEX_SHADER, VERT);
    const fs = compile(g.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;
    const prog = g.createProgram()!;
    g.attachShader(prog, vs);
    g.attachShader(prog, fs);
    g.linkProgram(prog);
    if (!g.getProgramParameter(prog, g.LINK_STATUS)) return;
    g.useProgram(prog);
    const buf = g.createBuffer();
    g.bindBuffer(g.ARRAY_BUFFER, buf);
    g.bufferData(g.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), g.STATIC_DRAW);
    const loc = g.getAttribLocation(prog, "p");
    g.enableVertexAttribArray(loc);
    g.vertexAttribPointer(loc, 2, g.FLOAT, false, 0, 0);
    const u: Record<string, WebGLUniformLocation | null> = {};
    for (const n of ["uRes", "uTime", "uMouse", "uDark", "uA", "uB", "uC", "uG"]) u[n] = g.getUniformLocation(prog, n);
    gl.current = { g, u, t0: performance.now() };

    const colours = () => {
      const dark = document.documentElement.classList.contains("dark");
      g.uniform1f(u.uDark, dark ? 1 : 0);
      g.uniform3fv(u.uA, rgbOf("--paper", dark ? [0.05, 0.07, 0.13] : [0.97, 0.96, 0.93]));
      g.uniform3fv(u.uB, rgbOf("--accent-solid", [0.15, 0.27, 0.78]));
      g.uniform3fv(u.uC, rgbOf("--gold", [0.79, 0.6, 0.18]));
      g.uniform3fv(u.uG, rgbOf("--accent", [0.45, 0.55, 1]));
    };
    const size = () => {
      // Half resolution: the field is soft by nature, and fragments are the cost.
      const scale = 0.5;
      c.width = Math.max(1, Math.round(c.clientWidth * scale));
      c.height = Math.max(1, Math.round(c.clientHeight * scale));
      g.viewport(0, 0, c.width, c.height);
      g.uniform2f(u.uRes, c.width, c.height);
    };
    colours();
    size();
    const mo = new MutationObserver(colours);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-fx-palette"] });
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      target.current = [((e.clientX - r.left) / r.width) * 2 - 1, -(((e.clientY - r.top) / r.height) * 2 - 1)];
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    c.setAttribute("data-ready", "");
    return () => {
      mo.disconnect();
      ro.disconnect();
      window.removeEventListener("pointermove", onMove);
      gl.current = null;
      g.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [active]);

  useVisibleLoop(ref as React.RefObject<HTMLElement | null>, active, (now) => {
    const s = gl.current;
    if (!s) return;
    // Ease the pointer so the blob follows with weight.
    mouse.current[0] += (target.current[0] - mouse.current[0]) * 0.05;
    mouse.current[1] += (target.current[1] - mouse.current[1]) * 0.05;
    s.g.uniform1f(s.u.uTime, (now - s.t0) / 1000);
    s.g.uniform2f(s.u.uMouse, mouse.current[0], mouse.current[1]);
    s.g.drawArrays(s.g.TRIANGLE_STRIP, 0, 4);
  });

  return <canvas ref={ref} className="fx-hero-shader" aria-hidden="true" />;
}

type P = { x: number; y: number; z: number; vx: number; vy: number; vz: number };

/** One frame of the constellation: integrate, project, link, draw. Mutates `pts` in place. */
function drawParticles(c: HTMLCanvasElement, pts: P[], m: { x: number; y: number; on: boolean }, rot: number, rgb: string) {
  const g = c.getContext("2d");
  if (!g) return;
  const w = c.clientWidth;
  const h = c.clientHeight;
  g.clearRect(0, 0, w, h);
  const cos = Math.cos(rot);
  const sin = Math.sin(rot);
  const fov = 2.6;
  const proj: { x: number; y: number; s: number; d: number }[] = [];
  for (const p of pts) {
    // Drift, with a spring back toward the volume so the cloud never disperses.
    p.vx += (Math.random() - 0.5) * 0.0006 - p.x * 0.00004;
    p.vy += (Math.random() - 0.5) * 0.0006 - p.y * 0.00004;
    p.vz += (Math.random() - 0.5) * 0.0006 - p.z * 0.00004;
    p.vx *= 0.985;
    p.vy *= 0.985;
    p.vz *= 0.985;
    p.x += p.vx;
    p.y += p.vy;
    p.z += p.vz;
    const rx = p.x * cos - p.z * sin;
    const rz = p.x * sin + p.z * cos;
    const s = fov / (fov + rz + 1.2);
    let sx = w / 2 + rx * s * w * 0.42;
    let sy = h / 2 + p.y * s * h * 0.42;
    // The pointer scatters what is near it, more for the nearer points.
    if (m.on) {
      const dx = sx - m.x;
      const dy = sy - m.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 140) {
        const f = ((140 - dist) / 140) * 0.0025 * s;
        p.vx += (dx / (dist || 1)) * f;
        p.vy += (dy / (dist || 1)) * f;
        sx += (dx / (dist || 1)) * (140 - dist) * 0.08;
        sy += (dy / (dist || 1)) * (140 - dist) * 0.08;
      }
    }
    proj.push({ x: sx, y: sy, s, d: rz });
  }
  // Links between near neighbours: the constellation.
  g.lineWidth = 1;
  for (let i = 0; i < proj.length; i++) {
    for (let j = i + 1; j < proj.length; j++) {
      const a = proj[i];
      const b = proj[j];
      const d = Math.hypot(a.x - b.x, a.y - b.y);
      if (d < 90) {
        g.strokeStyle = `rgba(${rgb}, ${((1 - d / 90) * 0.22 * Math.min(a.s, b.s)).toFixed(3)})`;
        g.beginPath();
        g.moveTo(a.x, a.y);
        g.lineTo(b.x, b.y);
        g.stroke();
      }
    }
  }
  // Points, nearest last; far points smaller and softer (depth of field).
  proj.sort((a, b) => b.d - a.d);
  for (const p of proj) {
    const r = 0.6 + p.s * 2.4;
    const focus = Math.max(0, 1 - Math.abs(p.d) * 0.6);
    g.fillStyle = `rgba(${rgb}, ${(0.25 + focus * 0.6).toFixed(3)})`;
    g.beginPath();
    g.arc(p.x, p.y, r * (1.6 - focus * 0.6), 0, Math.PI * 2);
    g.fill();
  }
}

function HeroParticles({ active }: { active: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const pts = useRef<P[]>([]);
  const mouse = useRef<{ x: number; y: number; on: boolean }>({ x: 0, y: 0, on: false });
  const rot = useRef(0);
  const colour = useRef("#6f8cff");

  useEffect(() => {
    const c = ref.current;
    if (!c || !active) return;
    const small = window.innerWidth < 700;
    pts.current = Array.from({ length: small ? 46 : 90 }, () => ({
      x: (Math.random() - 0.5) * 2,
      y: (Math.random() - 0.5) * 2,
      z: (Math.random() - 0.5) * 2,
      vx: 0,
      vy: 0,
      vz: 0,
    }));
    const size = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      c.width = c.clientWidth * dpr;
      c.height = c.clientHeight * dpr;
      c.getContext("2d")?.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    const tint = () => {
      const [r, g, b] = rgbOf("--accent", [0.45, 0.55, 1]);
      colour.current = `${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}`;
    };
    size();
    tint();
    const ro = new ResizeObserver(size);
    ro.observe(c);
    const mo = new MutationObserver(tint);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "data-fx-palette"] });
    const onMove = (e: PointerEvent) => {
      const r = c.getBoundingClientRect();
      mouse.current = { x: e.clientX - r.left, y: e.clientY - r.top, on: e.clientY >= r.top && e.clientY <= r.bottom };
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [active]);

  useVisibleLoop(ref as React.RefObject<HTMLElement | null>, active, () => {
    const c = ref.current;
    if (!c) return;
    rot.current += 0.0016;
    drawParticles(c, pts.current, mouse.current, rot.current, colour.current);
  });

  return <canvas ref={ref} className="fx-hero-particles" aria-hidden="true" />;
}

const WORDS = ["Analysis", "Strategy", "Direction"];

export function HeroType() {
  const [text, setText] = useState(WORDS[0]);
  const [typing, setTyping] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!motionOk()) return;
    let word = 0;
    let i = WORDS[0].length;
    let deleting = false;
    let timer = 0;
    const step = () => {
      const w = WORDS[word];
      if (!deleting) {
        i++;
        setText(w.slice(0, i));
        if (i >= w.length) {
          setTyping(false);
          setPaused(true);
          deleting = true;
          timer = window.setTimeout(step, 2200);
          return;
        }
        setTyping(true);
        setPaused(false);
        timer = window.setTimeout(step, 70 + Math.random() * 60);
      } else {
        i--;
        setPaused(false);
        setText(w.slice(0, Math.max(0, i)));
        if (i <= 0) {
          deleting = false;
          word = (word + 1) % WORDS.length;
          // The typing indicator: a beat before the next word starts.
          setPaused(true);
          timer = window.setTimeout(() => {
            setPaused(false);
            step();
          }, 650);
          return;
        }
        timer = window.setTimeout(step, 35);
      }
    };
    timer = window.setTimeout(step, 2600);
    return () => window.clearTimeout(timer);
  }, []);

  return (
    <p className="fx-type" aria-hidden="true">
      <span className="fx-type__k">&gt;</span>
      <span className="fx-type__word">{text}</span>
      <span className="fx-type__caret" data-typing={typing ? "true" : "false"} />
      <span className="fx-type__dots" data-on={paused && text.length === 0 ? "true" : "false"}>
        <span />
        <span />
        <span />
      </span>
    </p>
  );
}

/** The kinetic line under the title: each character arrives on its own, then the words breathe. */
export function HeroKinetic({ text }: { text: string }) {
  return (
    <span className="fx-kinetic" aria-hidden="true">
      {text.split(" ").map((word, wi) => (
        <span key={wi} className="fx-kinetic__word" style={{ "--w": wi } as React.CSSProperties}>
          {Array.from(word).map((ch, ci) => (
            <span key={ci} className="fx-kinetic__ch" style={{ "--c": ci } as React.CSSProperties}>
              {ch}
            </span>
          ))}
        </span>
      ))}
    </span>
  );
}

const SVGNS = "http://www.w3.org/2000/svg";

function HeroMapFX() {
  useEffect(() => {
    if (!motionOk()) return;
    const svg = document.querySelector<SVGSVGElement>(".pf-hero__static");
    if (!svg || svg.querySelector(".fx-map")) return;
    const wards = Array.from(svg.querySelectorAll<SVGPathElement>("path.pf-county__ward"));
    const held = wards.filter((p) => p.style.fill.includes("accent"));
    const pool = wards.filter((p) => p.style.fill.includes("earth"));
    if (!held.length) return;
    const union = held.map((p) => p.getBBox()).reduce((a, b) => {
      const x = Math.min(a.x, b.x);
      const y = Math.min(a.y, b.y);
      return { x, y, width: Math.max(a.x + a.width, b.x + b.width) - x, height: Math.max(a.y + a.height, b.y + b.height) - y } as DOMRect;
    });
    const hx = union.x + union.width / 2;
    const hy = union.y + union.height / 2;
    const vb = svg.viewBox.baseVal;
    const unit = Math.max(vb.width, vb.height) / 100;

    const g = document.createElementNS(SVGNS, "g");
    g.setAttribute("class", "fx-map");
    g.setAttribute("aria-hidden", "true");

    // Flight-line arcs to the five largest pool wards, each a quadratic curve bowed upward.
    pool
      .map((p) => p.getBBox())
      .sort((a, b) => b.width * b.height - a.width * a.height)
      .slice(0, 5)
      .forEach((b, i) => {
        const tx = b.x + b.width / 2;
        const ty = b.y + b.height / 2;
        const mx = (hx + tx) / 2;
        const my = (hy + ty) / 2 - Math.hypot(tx - hx, ty - hy) * 0.35;
        const path = document.createElementNS(SVGNS, "path");
        path.setAttribute("d", `M${hx},${hy} Q${mx},${my} ${tx},${ty}`);
        path.setAttribute("class", "fx-map__arc");
        path.setAttribute("pathLength", "1");
        path.style.setProperty("--i", String(i));
        g.appendChild(path);
        const end = document.createElementNS(SVGNS, "circle");
        end.setAttribute("cx", String(tx));
        end.setAttribute("cy", String(ty));
        end.setAttribute("r", String(unit * 0.9));
        end.setAttribute("class", "fx-map__end");
        end.style.setProperty("--i", String(i));
        g.appendChild(end);
      });

    // The catchment pulse, then the pin.
    for (let k = 0; k < 2; k++) {
      const pulse = document.createElementNS(SVGNS, "circle");
      pulse.setAttribute("cx", String(hx));
      pulse.setAttribute("cy", String(hy));
      pulse.setAttribute("r", String(unit * 6));
      pulse.setAttribute("class", "fx-map__pulse");
      pulse.style.setProperty("--k", String(k));
      g.appendChild(pulse);
    }
    const pin = document.createElementNS(SVGNS, "g");
    pin.setAttribute("class", "fx-map__pin");
    pin.setAttribute("transform", `translate(${hx} ${hy}) scale(${unit / 4})`);
    const head = document.createElementNS(SVGNS, "path");
    head.setAttribute("d", "M0 0 C-6 -9 -9 -13 -9 -18 A9 9 0 1 1 9 -18 C9 -13 6 -9 0 0Z");
    const eye = document.createElementNS(SVGNS, "circle");
    eye.setAttribute("cy", "-18");
    eye.setAttribute("r", "3.4");
    eye.setAttribute("class", "fx-map__eye");
    const inner = document.createElementNS(SVGNS, "g");
    inner.setAttribute("class", "fx-map__drop");
    inner.append(head, eye);
    pin.appendChild(inner);
    g.appendChild(pin);
    svg.appendChild(g);
    return () => g.remove();
  }, []);
  return null;
}

export function HeroFX() {
  const ambient = useAmbient();
  const [ready, setReady] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  // Start after the first paint has settled, so the canvases never compete with the LCP.
  useEffect(() => {
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(() => setReady(true), { timeout: 1500 });
    else window.setTimeout(() => setReady(true), 600);
  }, []);

  return (
    <div ref={stage} className="fx-hero" aria-hidden="true">
      {ready && ambient && <HeroShader active />}
      {ready && ambient && <HeroParticles active />}
      <div className="fx-hero__spot" />
      <svg className="fx-hero__seal" viewBox="0 0 120 120">
        <defs>
          <path id="fx-seal-path" d="M60 60 m-46 0 a46 46 0 1 1 92 0 a46 46 0 1 1 -92 0" />
        </defs>
        <text>
          <textPath href="#fx-seal-path">KITUI 2027 · ANALYSIS · STRATEGY · DIRECTION ·</textPath>
        </text>
        <circle cx="60" cy="60" r="6" />
      </svg>
      <HeroMapFX />
    </div>
  );
}
