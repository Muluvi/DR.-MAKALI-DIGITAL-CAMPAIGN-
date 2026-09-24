"use client";

import { useEffect, useMemo, useRef, type MutableRefObject } from "react";
import { Canvas, useFrame, useThree, type ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";

import { COUNTY, MAX_VOTERS, TILE_HALF, type CountyWard } from "../../lib/premium/county";
import { SCENE_COLORS, type SceneColors, type SceneTheme } from "../../lib/premium/palette";

/**
 * <CountyScene>: the signature element (brief G-2).
 *
 * Forty wards, each extruded by its 2022 registered voters, on real boundaries. One scroll value
 * drives three states in order:
 *
 *   relief     tilted, the county as ground
 *   top-down   the camera settles overhead, north up
 *   tiles      every ward morphs from its true outline into its tile on the equal-tile map
 *
 * and then the pool (Mwingi North, West, Central, Kitui South) resolves in laterite, last.
 *
 * WHY MORPH TARGETS. Each ward's outline is resampled to the same number of points as its tile's
 * perimeter, and both are built into one geometry: the true shape as positions, the tile as a
 * morph target. The GPU interpolates; nothing is rebuilt per frame, so the scrubbed morph costs
 * one uniform write per ward. A triangulation of a simple polygon stays valid when its vertices
 * are moved, in the same cyclic order, onto a convex shape, so the tile state needs no second
 * triangulation.
 *
 * It renders on demand only: a frame is drawn when the scroll value or the orbit changes, and
 * never while the canvas is off screen. Nothing loops.
 */

const N = 72; // points per outline, and per tile perimeter
const H_MIN = 8;
const H_SCALE = 70;

type V2 = [number, number];

function resample(ring: V2[], n: number): V2[] {
  const seg: number[] = [];
  let total = 0;
  for (let i = 0; i < ring.length; i++) {
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const d = Math.hypot(b[0] - a[0], b[1] - a[1]);
    seg.push(d);
    total += d;
  }
  const out: V2[] = [];
  let i = 0;
  let acc = 0;
  for (let k = 0; k < n; k++) {
    const target = (k / n) * total;
    while (acc + seg[i] < target && i < ring.length - 1) {
      acc += seg[i];
      i++;
    }
    const a = ring[i];
    const b = ring[(i + 1) % ring.length];
    const t = seg[i] > 0 ? (target - acc) / seg[i] : 0;
    out.push([a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t]);
  }
  return out;
}

/** A square's perimeter, counter-clockwise, starting where a ray at `angle` leaves the square. */
function squareRing(c: V2, h: number, n: number, angle: number): V2[] {
  const at = (u: number): V2 => {
    const s = ((u % 1) + 1) % 1 * 8 * h;
    if (s < h) return [c[0] + h, c[1] + s];
    if (s < 3 * h) return [c[0] + h - (s - h), c[1] + h];
    if (s < 5 * h) return [c[0] - h, c[1] + h - (s - 3 * h)];
    if (s < 7 * h) return [c[0] - h + (s - 5 * h), c[1] - h];
    return [c[0] + h, c[1] - h + (s - 7 * h)];
  };
  const k = h / Math.max(Math.abs(Math.cos(angle)), Math.abs(Math.sin(angle)));
  const px = Math.cos(angle) * k;
  const py = Math.sin(angle) * k;
  let s0: number;
  if (px >= h - 1e-6 && py >= 0) s0 = py;
  else if (py >= h - 1e-6) s0 = h + (h - px);
  else if (px <= -h + 1e-6) s0 = 3 * h + (h - py);
  else if (py <= -h + 1e-6) s0 = 5 * h + (px + h);
  else s0 = 7 * h + (py + h);
  const u0 = s0 / (8 * h);
  return Array.from({ length: n }, (_, i) => at(u0 + i / n));
}

interface WardGeo {
  ward: CountyWard;
  solid: THREE.BufferGeometry;
  cap: THREE.BufferGeometry;
  outline: THREE.BufferGeometry;
  height: number;
}

function buildWard(ward: CountyWard): WardGeo {
  const geo = resample(ward.ring, N);
  const ang = Math.atan2(geo[0][1] - ward.centroid[1], geo[0][0] - ward.centroid[0]);
  const tile = squareRing(ward.tileCentre, TILE_HALF, N, ang);
  const height = H_MIN + (ward.tile.voters / MAX_VOTERS) * H_SCALE;

  const contour = geo.map(([x, y]) => new THREE.Vector2(x, y));
  const faces = THREE.ShapeUtils.triangulateShape(contour, []).map((f) => {
    const [a, b, c] = f;
    const area = (geo[b][0] - geo[a][0]) * (geo[c][1] - geo[a][1]) - (geo[c][0] - geo[a][0]) * (geo[b][1] - geo[a][1]);
    return area < 0 ? [a, c, b] : [a, b, c];
  });

  // Solid: top cap + walls, flat normals, with the tile state as morph target 0.
  const pos: number[] = [];
  const nor: number[] = [];
  const mpos: number[] = [];
  const mnor: number[] = [];
  const uv: number[] = [];
  const idx: number[] = [];
  const push = (p: V2, q: V2, z: number, n: [number, number, number], m: [number, number, number]) => {
    pos.push(p[0], p[1], z);
    mpos.push(q[0], q[1], z);
    nor.push(...n);
    mnor.push(...m);
    uv.push(p[0] / 40, p[1] / 40);
  };
  for (let i = 0; i < N; i++) push(geo[i], tile[i], height, [0, 0, 1], [0, 0, 1]);
  for (const [a, b, c] of faces) idx.push(a, b, c);
  const wallNormal = (r: V2[], i: number): [number, number, number] => {
    const a = r[i];
    const b = r[(i + 1) % N];
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const l = Math.hypot(dx, dy) || 1;
    return [dy / l, -dx / l, 0];
  };
  for (let i = 0; i < N; i++) {
    const j = (i + 1) % N;
    const n1 = wallNormal(geo, i);
    const n2 = wallNormal(tile, i);
    const base = pos.length / 3;
    push(geo[i], tile[i], 0, n1, n2);
    push(geo[j], tile[j], 0, n1, n2);
    push(geo[j], tile[j], height, n1, n2);
    push(geo[i], tile[i], height, n1, n2);
    idx.push(base, base + 1, base + 2, base, base + 2, base + 3);
  }
  const solid = new THREE.BufferGeometry();
  solid.setAttribute("position", new THREE.Float32BufferAttribute(pos, 3));
  solid.setAttribute("normal", new THREE.Float32BufferAttribute(nor, 3));
  solid.setAttribute("uv", new THREE.Float32BufferAttribute(uv, 2));
  solid.setIndex(idx);
  solid.morphAttributes.position = [new THREE.Float32BufferAttribute(mpos, 3)];
  solid.morphAttributes.normal = [new THREE.Float32BufferAttribute(mnor, 3)];
  solid.computeBoundingSphere();

  // Cap only, lifted a hair: carries the weave overlay for the pool.
  const cap = new THREE.BufferGeometry();
  const capZ = height + 0.25;
  cap.setAttribute("position", new THREE.Float32BufferAttribute(geo.flatMap(([x, y]) => [x, y, capZ]), 3));
  cap.setAttribute("uv", new THREE.Float32BufferAttribute(geo.flatMap(([x, y]) => [x / 56, y / 56]), 2));
  cap.setIndex(faces.flat());
  cap.morphAttributes.position = [new THREE.Float32BufferAttribute(tile.flatMap(([x, y]) => [x, y, capZ]), 3)];

  const outline = new THREE.BufferGeometry();
  const lineZ = height + 0.4;
  outline.setAttribute("position", new THREE.Float32BufferAttribute(geo.flatMap(([x, y]) => [x, y, lineZ]), 3));
  outline.morphAttributes.position = [new THREE.Float32BufferAttribute(tile.flatMap(([x, y]) => [x, y, lineZ]), 3)];

  return { ward, solid, cap, outline, height };
}

function weaveTexture(): THREE.CanvasTexture {
  const s = 64;
  const c = document.createElement("canvas");
  c.width = s;
  c.height = s;
  const g = c.getContext("2d")!;
  g.clearRect(0, 0, s, s);
  g.translate(s / 2, s / 2);
  g.rotate(Math.PI / 4);
  g.translate(-s, -s);
  const cell = s / 2 / Math.SQRT2;
  const h = cell / 2;
  const t = cell * 0.36;
  for (let x = 0; x < s * 2; x += cell) {
    for (let y = 0; y < s * 2; y += cell) {
      g.fillStyle = "rgba(255,255,255,1)";
      g.fillRect(x + h / 2 - t / 2, y + 0.5, t, h - 1);
      g.fillRect(x + h + h / 2 - t / 2, y + h + 0.5, t, h - 1);
      g.fillStyle = "rgba(255,255,255,0.6)";
      g.fillRect(x + h + 0.5, y + h / 2 - t / 2, h - 1, t);
      g.fillRect(x + 0.5, y + h + h / 2 - t / 2, h - 1, t);
    }
  }
  const tex = new THREE.CanvasTexture(c);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

const smooth = (a: number, b: number, x: number) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};

/** How far through the cover's story the scroll is, split into the three movements and the pool. */
export function phases(p: number) {
  return { cam: smooth(0.04, 0.36, p), morph: smooth(0.4, 0.74, p), pool: smooth(0.78, 0.94, p) };
}

export { smooth };

/**
 * What a scene shows at a scroll value: the camera (0 relief, 1 overhead), the morph (0 true
 * outlines, 1 tiles), and each ward's colour and weave. The cover and the §3 story drive the same
 * scene with different drivers; the scene itself carries no narrative.
 */
export interface SceneDriver {
  pose(p: number): { cam: number; morph: number };
  /** Writes the ward's fill into `out` and returns the weave's opacity on it (0 for none). */
  paint(w: CountyWard, p: number, c: SceneColors, out: THREE.Color): number;
}

/** The cover: relief to overhead, then the tile map, then the pool resolves in laterite. */
export const COVER_DRIVER: SceneDriver = {
  pose: (p) => {
    const { cam, morph } = phases(p);
    return { cam, morph };
  },
  paint: (w, p, c, out) => {
    const { pool } = phases(p);
    if (w.role === "held") out.copy(c.held);
    else if (w.role === "pool") out.copy(c.other).lerp(c.pool, pool);
    else out.copy(c.other);
    return w.role === "pool" ? pool * 0.3 : 0;
  },
};

/**
 * Everything the scene mutates per frame lives here, behind methods: geometry, materials, the
 * mesh handles. React owns the tree; the rig owns the imperative WebGL state, which is the
 * boundary R3F intends (and keeps the React compiler's immutability rules honest).
 */
class CountyRig {
  wards = COUNTY.map(buildWard);
  weave = weaveTexture();
  solidMats = this.wards.map(() => new THREE.MeshStandardMaterial({ roughness: 0.92, metalness: 0 }));
  capMats = this.wards.map(() => new THREE.MeshBasicMaterial({ map: this.weave, transparent: true, depthWrite: false, opacity: 0 }));
  lineMat = new THREE.LineBasicMaterial({ transparent: true, opacity: 0.9 });
  meshes: (THREE.Mesh | null)[] = [];
  caps: (THREE.Mesh | null)[] = [];
  lines: (THREE.LineLoop | null)[] = [];
  private tmp = new THREE.Color();
  private up = new THREE.Vector3();

  attach(kind: "mesh" | "cap" | "line", i: number, o: THREE.Mesh | THREE.LineLoop | null) {
    const list = kind === "mesh" ? this.meshes : kind === "cap" ? this.caps : this.lines;
    list[i] = o as never;
    o?.updateMorphTargets();
  }

  frame(camera: THREE.Camera, size: { width: number; height: number }, p: number, orbit: number, colors: SceneColors, driver: SceneDriver) {
    const { cam, morph } = driver.pose(p);

    // Camera: relief (tilted, from the south-west) to overhead, north up.
    const pc = camera as THREE.PerspectiveCamera;
    const aspect = size.width / Math.max(1, size.height);
    const vfov = (pc.fov * Math.PI) / 180;
    // Relief needs more room than overhead (the tilt throws the far edge up the frame), and a
    // phone needs the finished tile map clear of the caption card, so its view sits higher.
    const portrait = aspect < 0.8;
    const margin = 1.04 + (1 - cam) * 0.16 + (portrait ? 0.14 : 0);
    const fit = Math.max(520 / Math.tan(vfov / 2), 330 / (Math.tan(vfov / 2) * aspect)) * margin;
    if (portrait) pc.setViewOffset(size.width, size.height, 0, size.height * 0.09 * cam, size.width, size.height);
    else pc.clearViewOffset();
    const polar = (1 - cam) * 0.92 + 0.0005;
    const az = (1 - cam) * (-0.38 + orbit);
    const dist = fit * (1 - (1 - cam) * 0.1);
    pc.position.set(dist * Math.sin(polar) * Math.sin(az), -dist * Math.sin(polar) * Math.cos(az), dist * Math.cos(polar));
    this.up.set(0, cam, 1 - cam).normalize();
    pc.up.copy(this.up);
    pc.lookAt(0, (1 - cam) * 40, 0);
    pc.updateProjectionMatrix();

    this.lineMat.color.copy(colors.edge);
    this.wards.forEach((w, i) => {
      for (const o of [this.meshes[i], this.caps[i], this.lines[i]]) {
        if (o?.morphTargetInfluences) o.morphTargetInfluences[0] = morph;
      }
      const weave = driver.paint(w.ward, p, colors, this.tmp);
      this.solidMats[i].color.copy(this.tmp);
      const cm = this.capMats[i];
      cm.color.copy(colors.weave);
      cm.opacity = weave;
      cm.visible = cm.opacity > 0.001;
    });
  }
}

function Wards({
  progress,
  theme,
  driver,
  orbit,
  onPick,
  visible,
}: {
  progress: MutableRefObject<number>;
  theme: SceneTheme;
  driver: SceneDriver;
  orbit: MutableRefObject<number>;
  onPick: (w: CountyWard | null) => void;
  visible: MutableRefObject<boolean>;
}) {
  const invalidate = useThree((s) => s.invalidate);
  const rig = useMemo(() => new CountyRig(), []);
  const colors = SCENE_COLORS[theme];

  // A theme change is a redraw.
  useEffect(() => invalidate(), [colors, invalidate]);

  // Redraw when the reader scrolls or resizes, and only while the canvas is on screen.
  useEffect(() => {
    let frame = 0;
    const on = () => {
      if (!visible.current || frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        invalidate();
      });
    };
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on, { passive: true });
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", on);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [invalidate, visible]);

  useFrame((state) => rig.frame(state.camera, state.size, progress.current, orbit.current, colors, driver));

  const pick = (w: CountyWard) => (e: ThreeEvent<MouseEvent>) => {
    // A drag that ends over a ward is an orbit, not a tap.
    if (e.delta > 6) return;
    e.stopPropagation();
    onPick(w);
  };

  return (
    <group>
      <hemisphereLight args={[colors.sky, colors.groundLight, 1.1]} />
      <directionalLight position={[-420, -620, 900]} intensity={1.35} color={colors.sun} />
      {rig.wards.map((w, i) => (
        <group key={w.ward.tile.id}>
          <mesh ref={(m) => rig.attach("mesh", i, m)} geometry={w.solid} material={rig.solidMats[i]} onClick={pick(w.ward)} />
          {w.ward.role === "pool" && (
            <mesh ref={(m) => rig.attach("cap", i, m)} geometry={w.cap} material={rig.capMats[i]} raycast={() => null} />
          )}
          <lineLoop
            ref={(l: THREE.LineLoop | null) => rig.attach("line", i, l)}
            geometry={w.outline}
            material={rig.lineMat}
            raycast={() => null}
          />
        </group>
      ))}
    </group>
  );
}

export default function CountyScene({
  progress,
  theme,
  driver = COVER_DRIVER,
  onPick,
  className = "",
}: {
  progress: MutableRefObject<number>;
  theme: SceneTheme;
  driver?: SceneDriver;
  onPick: (w: CountyWard | null) => void;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const orbit = useRef(0);
  const visible = useRef(true);
  const invalidateRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      visible.current = e.isIntersecting;
      if (e.isIntersecting) invalidateRef.current?.();
    });
    io.observe(el);

    // Horizontal drag orbits, clamped. Vertical movement is left to the page (touch-action:
    // pan-y), so the scene can never trap a reader's scroll.
    let startX = 0;
    let startOrbit = 0;
    let down = false;
    const onDown = (e: PointerEvent) => {
      down = true;
      startX = e.clientX;
      startOrbit = orbit.current;
    };
    const onMove = (e: PointerEvent) => {
      if (!down) return;
      const next = Math.max(-0.6, Math.min(0.6, startOrbit + (e.clientX - startX) / 320));
      if (next !== orbit.current) {
        orbit.current = next;
        invalidateRef.current?.();
      }
    };
    const onUp = () => {
      down = false;
    };
    el.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    return () => {
      io.disconnect();
      el.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
    };
  }, []);

  return (
    <div ref={wrap} className={`pf-scene ${className}`} style={{ touchAction: "pan-y" }}>
      <Canvas
        frameloop="demand"
        flat
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ fov: 30, near: 10, far: 8000, position: [0, -1800, 1500] }}
        onCreated={({ invalidate }) => {
          invalidateRef.current = invalidate;
        }}
        onPointerMissed={() => onPick(null)}
      >
        <Wards progress={progress} theme={theme} driver={driver} orbit={orbit} onPick={onPick} visible={visible} />
      </Canvas>
    </div>
  );
}
