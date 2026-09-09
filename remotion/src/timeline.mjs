/* Shared score + script data. Imported by the Remotion composition and by
   scripts/render-music.mjs, so picture and sound can never drift apart. */

export const DURATION = 100;
export const FPS = 30;
export const CX = 400, CY = 210;

/* Scene boundaries */
export const S2 = 13, S3 = 29, S4 = 46, S5 = 63, S6 = 81;

/* Each sentence maps to one on-screen action; the visual cue leads it by 0.5s */
export const CUE = {
  s1a: 0.3,  s1b: 6.7,
  s2a: 13.5, s2b: 21.0,
  s3a: 29.5, s3b: 36.0,
  s4a: 46.5, s4b: 51.9, s4c: 57.7,
  s5a: 64.0, s5b: 72.2,
  s6a: 82.0, s6b: 85.8, s6c: 89.6,
  end: 97.0,
};

export const CAPTIONS = [
  {s: CUE.s1a + 0.5, e: 6.2,  t: '効くという事実の先に、まだ見えていない答えがあった。'},
  {s: CUE.s1b + 0.5, e: 11.9, t: '私たちは、その理由を知りたかった。'},
  {s: CUE.s2a + 0.5, e: 20.4, t: '複数の研究チームが、同じ答えにたどり着いた。'},
  {s: CUE.s2b + 0.5, e: 27.8, t: '鍵は、分子同士を近づけるという発想だった。'},
  {s: CUE.s3a + 0.5, e: 35.4, t: '薬は、標的を抑えるだけではない。'},
  {s: CUE.s3b + 0.5, e: 43.2, t: '標的の運命を変えるという、新たな創薬の視点が生まれた。'},
  {s: CUE.s4a + 0.5, e: 51.3, t: '発見は、次の問いを生んだ。'},
  {s: CUE.s4b + 0.5, e: 57.1, t: 'この分解を、意図して設計できるだろうか。'},
  {s: CUE.s4c + 0.5, e: 62.9, t: 'そして、狙い通りに分子を導くという発想が、ここから生まれた。'},
  {s: CUE.s5a + 0.5, e: 71.6, t: '分子機構への理解は、免疫細胞の生物学を見つめ直す視点をもたらした。'},
  {s: CUE.s5b + 0.5, e: 79.3, t: 'そして、免疫細胞の機能に関わる可能性も示している。'},
  {s: CUE.s6a + 0.5, e: 85.2, t: '問いは、理解へ。'},
  {s: CUE.s6b + 0.5, e: 89.0, t: '理解は、設計へ。'},
  {s: CUE.s6c + 0.5, e: 96.4, t: 'そして今、分子を狙って導くという新たな時代が始まる。'},
];

export const FLASHES = [
  {t: S2, a: 0.66, d: 0.7}, {t: 20, a: 0.28, d: 0.5}, {t: 25, a: 0.24, d: 0.4},
  {t: 27, a: 0.34, d: 0.55}, {t: S3, a: 0.8, d: 0.85}, {t: 37, a: 0.5, d: 0.7},
  {t: S4, a: 0.68, d: 0.8}, {t: CUE.s4c, a: 0.56, d: 0.9}, {t: S5, a: 0.62, d: 0.9},
  {t: S6, a: 0.74, d: 0.9}, {t: CUE.s6b, a: 0.86, d: 1.3}, {t: CUE.end, a: 0.9, d: 1.4},
];

export const RINGS = [
  {t: S2, r: 340, d: 1.7, w: 3, c: '#a8dcff'},
  {t: 20, r: 300, d: 1.5, w: 2.4, c: '#d6ecff'},
  {t: 25, r: 220, d: 1.2, w: 2.2, c: '#ffd28f'},
  {t: 27, r: 360, d: 1.6, w: 3, c: '#ffcf8a'},
  {t: S3, r: 460, d: 2.1, w: 4.2, c: '#cbb8ff'},
  {t: S3 + 0.5, r: 420, d: 2.1, w: 2.6, c: '#a8dcff'},
  {t: 37, r: 440, d: 2.1, w: 3.4, c: '#ffe2ab'},
  {t: CUE.s4c, r: 300, d: 1.8, w: 3, c: '#ffd782'},
  {t: CUE.s5a, r: 330, d: 2, w: 3.4, c: '#ffcf6e'},
  {t: CUE.s5b + 2, r: 280, d: 1.8, w: 2.6, c: '#8ff0dc'},
  {t: S6, r: 480, d: 2.2, w: 3.6, c: '#e3d0ff'},
  {t: CUE.s6b, r: 560, d: 2.6, w: 4, c: '#fff2cf'},
];

/* On-screen labels: scientific naming, with an abstract fallback wording */
export const LABELS = [
  {sci: 'cereblon（足場）', abs: '足場タンパク質', x: 150, y: 300, ax: 200, ay: 274, t0: 22.4, t1: 29.6},
  {sci: '小分子', abs: '小分子', x: 400, y: 150, ax: 400, ay: 176, t0: 22.0, t1: 29.6},
  {sci: 'Ikaros / Aiolos', abs: '標的タンパク質', x: 668, y: 306, ax: 640, ay: 276, t0: 23.0, t1: 29.6},
  {sci: '標的の分解', abs: '標的の分解', x: 432, y: 120, ax: 412, ay: 150, t0: 31.0, t1: 35.0},
  {sci: '構造最適化 [4]', abs: '構造最適化', x: 400, y: 126, ax: 400, ay: 152, t0: 53.4, t1: 57.0},
  {sci: '立体構造の変化 [5]', abs: '立体構造の変化', x: 400, y: 352, ax: 400, ay: 326, t0: 54.6, t1: 58.3},
  {sci: '設計された小分子', abs: '設計された小分子', x: 400, y: 330, ax: 400, ay: 304, t0: 58.6, t1: 62.4},
  {sci: '免疫細胞', abs: '免疫細胞', x: 242, y: 376, ax: 242, ay: 352, t0: 66.0, t1: 79.4},
  {sci: 'T細胞', abs: 'T細胞', x: 590, y: 74, ax: 590, ay: 100, t0: 73.4, t1: 79.4},
];

export const CITES = [
  {t0: 14.5, t1: 28.4, s: '出典 [1,2]'},
  {t0: 30.0, t1: 44.0, s: '出典 [1,2,3]'},
  {t0: 47.5, t1: 62.4, s: '出典 [4,5]'},
  {t0: 64.5, t1: 79.4, s: '出典 [3,6,7]'},
  {t0: 82.5, t1: 93.0, s: '出典 [8,9]'},
];

/* ---------------- score ---------------- */
export const BEAT = 0.5;
export const STEP = BEAT / 4;

export const CHORDS = [
  {t: 0, root: 110, tones: [220, 261.63, 329.63]},
  {t: 6.5, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 13, root: 110, tones: [220, 261.63, 329.63]},
  {t: 17, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 21, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 25, root: 98, tones: [196, 246.94, 293.66]},
  {t: 29, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 33, root: 98, tones: [196, 246.94, 293.66]},
  {t: 37, root: 110, tones: [220, 261.63, 329.63]},
  {t: 41, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 44.5, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 46, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 50, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 54, root: 110, tones: [220, 261.63, 329.63]},
  {t: 58, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 61, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 63, root: 73.42, tones: [174.61, 220, 293.66]},
  {t: 67, root: 110, tones: [220, 261.63, 329.63]},
  {t: 71, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 75, root: 98, tones: [196, 246.94, 293.66]},
  {t: 78, root: 110, tones: [220, 261.63, 329.63]},
  {t: 81, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 85, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 88, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 91, root: 98, tones: [196, 246.94, 293.66]},
  {t: 94, root: 110, tones: [220, 261.63, 329.63]},
  {t: 96.5, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 98, root: 130.81, tones: [196, 261.63, 329.63]},
];

export function chordAt(t) {
  let c = CHORDS[0];
  for (const x of CHORDS) if (t >= x.t) c = x;
  return c;
}

export const LEAD_NOTES = [
  {t: 37, f: 880, d: 0.55}, {t: 37.7, f: 1046.5, d: 0.55}, {t: 38.4, f: 1318.51, d: 1.1},
  {t: 39.7, f: 1046.5, d: 0.55}, {t: 40.4, f: 880, d: 1},
  {t: 58.2, f: 698.46, d: 0.6}, {t: 59, f: 880, d: 0.6}, {t: 59.8, f: 1046.5, d: 1.2},
  {t: 61.2, f: 987.77, d: 0.6}, {t: 62, f: 783.99, d: 1},
  {t: 89.8, f: 783.99, d: 0.5}, {t: 90.4, f: 1046.5, d: 0.5}, {t: 91, f: 1174.66, d: 1},
  {t: 92.2, f: 1046.5, d: 0.6}, {t: 93, f: 1318.51, d: 1.6},
  {t: 94.6, f: 1046.5, d: 0.6}, {t: 95.3, f: 880, d: 0.6}, {t: 96, f: 1046.5, d: 1.6},
];

export const BRASS_HITS = [
  {t: S6, d: 1.2}, {t: 83, d: 0.9}, {t: 85, d: 1.1},
  {t: 88, d: 1}, {t: 91, d: 1}, {t: 94, d: 1.3},
];
export const RISERS = [
  {t: 11.4, d: 1.6}, {t: 27.2, d: 1.8}, {t: 44.4, d: 1.6},
  {t: 61.4, d: 1.6}, {t: 79.4, d: 1.6}, {t: 95.4, d: 1.6},
];
export const CRASHES = [S2, S3, 37, S4, CUE.s4c, S5, S6, CUE.s6b, CUE.end];
export const SHIMMERS = [CUE.s6b, CUE.end];

/* ---------------- shared math ---------------- */
export const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export function smoothstep(e0, e1, x) {
  const t = clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}
export const easeOut = (x) => 1 - Math.pow(1 - x, 3);
export const easeOutQuint = (x) => 1 - Math.pow(1 - x, 5);
export function polar(cx, cy, r, deg) {
  const a = (deg * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

export function energyAt(t) {
  if (t < 5) return 0;
  if (t < S2) return 0.4 * smoothstep(5, 7, t);
  if (t < S3) return lerp(0.4, 0.95, smoothstep(S2, S2 + 1, t));
  if (t < S4) return 1.15;
  if (t < S5) return 1.0;
  if (t < S6) return lerp(1.0, 1.2, smoothstep(S5, S5 + 2, t));
  return lerp(1.3, 0.5, smoothstep(96, 99, t));
}

export function flashAt(t) {
  let v = 0;
  for (const f of FLASHES) {
    const d = t - f.t;
    if (d >= 0 && d < f.d) v = Math.max(v, f.a * Math.pow(1 - d / f.d, 2.3));
  }
  return v;
}

export function shakeAt(t) {
  let sx = 0, sy = 0, rr = 0;
  for (const f of FLASHES) {
    const d = t - f.t;
    if (d >= 0 && d < 0.55) {
      const k = Math.pow(1 - d / 0.55, 2) * f.a;
      sx += Math.sin(d * 88) * 8 * k;
      sy += Math.cos(d * 74) * 6 * k;
      rr += Math.sin(d * 62) * 0.8 * k;
    }
  }
  return [sx, sy, rr];
}

/* narration is king: the score ducks whenever a line is on screen */
export function captionActive(t) {
  return CAPTIONS.some((c) => t > c.s - 0.15 && t < c.e + 0.1);
}

export function hexToRgb(h) {
  return [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
}
export function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return `rgb(${Math.round(lerp(A[0], B[0], t))},${Math.round(lerp(A[1], B[1], t))},${Math.round(lerp(A[2], B[2], t))})`;
}

/* Deterministic PRNG: every render process must generate identical particles,
   otherwise frames rendered in parallel would not match. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
