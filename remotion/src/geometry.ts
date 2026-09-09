/* Static drawing data: the chemical skeleton, protein ribbons and bead chains.
   Everything is computed analytically so it needs no DOM measurement. */
// @ts-ignore - plain ESM module shared with the music renderer
import {lerp} from './timeline.mjs';

export type Pt = [number, number];

export function polyD(pts: Pt[], close = false) {
  return 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L') + (close ? ' Z' : '');
}
export function polyLength(pts: Pt[], close = false) {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
  if (close && pts.length > 1) L += Math.hypot(pts[0][0] - pts[pts.length - 1][0], pts[0][1] - pts[pts.length - 1][1]);
  return L;
}
export function hexPts(cx: number, cy: number, r: number, rot = 0): Pt[] {
  return [0, 1, 2, 3, 4, 5].map((i) => {
    const a = ((60 * i + rot) * Math.PI) / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)] as Pt;
  });
}

/* ---- sampling a chain of quadratic beziers ---- */
function quad(p0: Pt, p1: Pt, p2: Pt, u: number): Pt {
  const v = 1 - u;
  return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1]];
}
export function sampleQuadChain(start: Pt, segs: [Pt, Pt][], count: number): Pt[] {
  const out: Pt[] = [];
  for (let i = 0; i < count; i++) {
    const u = (i / (count - 1)) * segs.length;
    const si = Math.min(segs.length - 1, Math.floor(u));
    const p0 = si === 0 ? start : segs[si - 1][1];
    out.push(quad(p0, segs[si][0], segs[si][1], u - si));
  }
  return out;
}
export function quadChainD(start: Pt, segs: [Pt, Pt][]) {
  return `M${start[0]},${start[1]} ` + segs.map((s) => `Q${s[0][0]},${s[0][1]} ${s[1][0]},${s[1][1]}`).join(' ');
}

/* ---- protein ribbon: a coil stroked along a gentle arc ---- */
export function ribbonPts(x0: number, y0: number, x1: number, y1: number, coils: number, amp: number, segs = 90): Pt[] {
  const pts: Pt[] = [];
  const ang = Math.atan2(y1 - y0, x1 - x0) + Math.PI / 2;
  for (let i = 0; i <= segs; i++) {
    const u = i / segs;
    const bx = lerp(x0, x1, u);
    const by = lerp(y0, y1, u) + Math.sin(u * Math.PI) * -28;
    const off = Math.sin(u * coils * Math.PI * 2) * amp * Math.sin(u * Math.PI);
    pts.push([bx + Math.cos(ang) * off, by + Math.sin(ang) * off]);
  }
  return pts;
}

/* ---- the small molecule: a stylised skeletal formula ---- */
export type ChemStroke = {d: string; len: number; w: number; col: string};
export type ChemAtom = {x: number; y: number; s: string};

export const CHEM: {strokes: ChemStroke[]; atoms: ChemAtom[]; fills: string[]} = (() => {
  const strokes: ChemStroke[] = [];
  const atoms: ChemAtom[] = [];
  const add = (pts: Pt[], close: boolean, w = 1.5, col = '#a8e4ff') =>
    strokes.push({d: polyD(pts, close), len: polyLength(pts, close), w, col});

  /* benzene */
  const A = hexPts(-92, 0, 26);
  add(A, true, 1.6);
  ([[0, 1], [2, 3], [4, 5]] as const).forEach(([i, j]) => {
    const a = A[i], b = A[j];
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
    const sx = lerp(a[0], mx, 0.22) + (-92 - mx) * 0.16;
    const sy = lerp(a[1], my, 0.22) + (0 - my) * 0.16;
    const ex = lerp(b[0], mx, 0.22) + (-92 - mx) * 0.16;
    const ey = lerp(b[1], my, 0.22) + (0 - my) * 0.16;
    add([[sx, sy], [ex, ey]], false, 1.2, '#8fd8ff');
  });
  /* fused five-membered ring with a carbonyl */
  add([A[0], [-38, -20], [-22, 0], [-38, 20], A[5]], true, 1.6);
  add([[-22, 0], [-4, 0]], false, 1.4);
  add([[-38, -20], [-40, -40]], false, 1.3);
  atoms.push({x: -40, y: -46, s: 'O'});
  /* imide ring */
  const C = hexPts(30, 0, 26);
  add(C, true, 1.6);
  add([[-4, 0], C[3]], false, 1.4);
  add([C[1], [C[1][0] + 6, C[1][1] - 22]], false, 1.3);
  add([C[5], [C[5][0] + 6, C[5][1] + 22]], false, 1.3);
  atoms.push({x: C[1][0] + 6, y: C[1][1] - 27, s: 'O'});
  atoms.push({x: C[5][0] + 6, y: C[5][1] + 34, s: 'O'});
  atoms.push({x: C[0][0] + 12, y: C[0][1] + 4, s: 'N'});
  /* linker and terminal heterocycle */
  add([C[0], [92, -16], [116, 2]], false, 1.4);
  const D = hexPts(142, 16, 22, 10);
  add(D, true, 1.5);
  atoms.push({x: D[3][0] - 9, y: D[3][1] + 4, s: 'N'});

  const fills = [polyD(hexPts(-92, 0, 20), true), polyD(hexPts(30, 0, 20), true)];
  return {strokes, atoms, fills};
})();

/* ---- bead chains ---- */
export const INNER_CHAINS = [
  sampleQuadChain([188, 240], [[[214, 214], [236, 236]], [[258, 258], [282, 232]]], 13),
  sampleQuadChain([212, 300], [[[238, 286], [252, 306]], [[268, 326], [296, 306]]], 11),
  sampleQuadChain([258, 176], [[[286, 158], [306, 180]], [[324, 200], [348, 186]]], 12),
];
export const SIGNAL_CHAIN = sampleQuadChain([352, 282], [[[436, 346], [500, 268]], [[536, 224], [566, 214]]], 26);
export const TARGET_CHAIN = sampleQuadChain([556, 214], [[[596, 186], [628, 214]], [[660, 242], [700, 220]]], 16);

export const RIBBON_PTS = ribbonPts(150, 268, 268, 214, 4.2, 26);
export const RIBBON_D = polyD(RIBBON_PTS);
export const RIBBON_LEN = polyLength(RIBBON_PTS);
export const CONFORM_A = polyD(ribbonPts(300, 300, 500, 300, 3.4, 30, 70));
export const CONFORM_B = polyD(ribbonPts(300, 300, 500, 300, 5.2, 16, 70));

/* bridging bonds drawn by the small molecule */
export const BRIDGE_L = {d: 'M282,226 Q330,206 352,204', len: 74};
export const BRIDGE_R = {d: 'M452,204 Q506,208 552,214', len: 101};

/* branching light paths in scene 5 */
export const BRANCH_A = {
  d: 'M400,210 Q300,300 214,308',
  pts: sampleQuadChain([400, 210], [[[300, 300], [214, 308]]], 40),
};
export const BRANCH_B = {
  d: 'M400,210 Q520,148 610,146',
  pts: sampleQuadChain([400, 210], [[[520, 148], [610, 146]]], 40),
};
export const BRANCH_A_LEN = polyLength(BRANCH_A.pts);
export const BRANCH_B_LEN = polyLength(BRANCH_B.pts);

/* spiky target particle */
export const SPIKES = Array.from({length: 14}, (_, i) => {
  const a = i * (360 / 14);
  const rad = (deg: number, r: number): Pt => {
    const t = (deg * Math.PI) / 180;
    return [r * Math.cos(t), r * Math.sin(t)];
  };
  const b1 = rad(a - 5, 27), b2 = rad(a + 5, 27), tp = rad(a, 37);
  return polyD([b1, tp, b2], true);
});

export const T_CELLS = [
  {x: 610, y: 140, r: 36},
  {x: 688, y: 196, r: 30},
  {x: 574, y: 212, r: 27},
];
export const T_THREADS = ([[0, 1], [1, 2], [0, 2]] as const).map(([i, j]) => {
  const a = T_CELLS[i], b = T_CELLS[j];
  const pts = sampleQuadChain([a.x, a.y], [[[(a.x + b.x) / 2, (a.y + b.y) / 2 - 20], [b.x, b.y]]], 24);
  return {d: polyD(pts), len: polyLength(pts)};
});

export const ORGANELLES: {x: number; y: number; r: number; c: string}[] = [
  {x: 196, y: 168, r: 13, c: '#4fe08a'},
  {x: 318, y: 252, r: 10, c: '#ff6b7a'},
  {x: 214, y: 286, r: 8, c: '#7fd8ff'},
];
