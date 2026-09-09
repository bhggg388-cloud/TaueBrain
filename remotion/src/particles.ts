/* All "random" scenery is generated once from a fixed seed so that frames
   rendered in parallel processes are pixel-identical. */
// @ts-ignore - plain ESM module shared with the music renderer
import {CUE, CX, CY, S3, S6, mulberry32, polar} from './timeline.mjs';

const rnd = mulberry32(20260909);

export const ZSPAN = 1500;
export const FOV = 620;

export const WARP = Array.from({length: 110}, () => ({
  x: (rnd() - 0.5) * 1500,
  y: (rnd() - 0.5) * 950,
  z0: rnd() * ZSPAN,
  r: 0.7 + rnd() * 1.4,
  warm: rnd() > 0.75,
}));

export const MIST = Array.from({length: 54}, (_, i) => {
  const [sx, sy] = polar(CX, CY, 160 + rnd() * 200, rnd() * 360);
  return {
    sx, sy,
    tx: CX + (rnd() - 0.5) * 260,
    ty: CY + (rnd() - 0.5) * 120,
    t0: 0.6 + (i / 54) * 3.4,
    r: 0.8 + rnd() * 1.5,
  };
});

export const FRAGMENTS = Array.from({length: 34}, () => ({
  a: rnd() * 360,
  d: 60 + rnd() * 230,
  r: 1.6 + rnd() * 2.6,
  t0: CUE.s3a + 0.6 + rnd() * 2.2,
}));

type Spark = {t0: number; life: number; ox: number; oy: number; a: number; dist: number; r: number; color: string};
export const SPARKS: Spark[] = [];
function mkSparks(n: number, t0: number, life: number, ox: number, oy: number, spread: number, color: string) {
  for (let i = 0; i < n; i++) {
    SPARKS.push({t0, life, ox, oy, a: rnd() * 360, dist: spread * (0.4 + rnd() * 0.8), r: 1 + rnd() * 1.9, color});
  }
}
mkSparks(24, 27, 1.3, 352, 204, 180, '#cfeaff');
mkSparks(44, S3, 2.0, CX, CY, 350, '#ffd9a0');
mkSparks(28, CUE.s4c, 1.8, CX, CY, 250, '#ffd782');
mkSparks(30, S6, 2.2, CX, CY, 330, '#e6d4ff');

export const NODES = Array.from({length: 56}, (_, i) => {
  const a = rnd() * 360;
  const rad = 80 + Math.pow(rnd(), 0.65) * 230;
  const [tx, ty] = polar(CX, CY - 6, rad, a);
  return {tx, ty: Math.min(380, Math.max(32, ty)), t0: CUE.s3b - 1.2 + (i / 56) * 3.2, r: 1.6 + rnd() * 1.5};
});

export const NET_PAIRS: {i: number; j: number; d: number}[] = [];
for (let i = 0; i < NODES.length; i++) {
  for (let j = i + 1; j < NODES.length; j++) {
    const d = Math.hypot(NODES[i].tx - NODES[j].tx, NODES[i].ty - NODES[j].ty);
    if (d < 88) NET_PAIRS.push({i, j, d});
  }
}
/* deterministic shuffle, then cap */
NET_PAIRS.sort((a, b) => (a.i * 97 + a.j * 31) % 1000 - ((b.i * 97 + b.j * 31) % 1000));
NET_PAIRS.length = Math.min(NET_PAIRS.length, 56);

export const STREAK_COLORS = ['#7fb6ff', '#4fd6c8', '#ffc069', '#c8a6ff'];
export const STREAKS = Array.from({length: 24}, (_, i) => ({
  color: STREAK_COLORS[i % 4],
  a: i * 15 + rnd() * 7,
  delay: (i % 8) * 0.11,
  len: 70 + rnd() * 70,
}));

export const HEXES: {d: string; dist: number}[] = [];
(() => {
  const R = 46, w = R * 1.5, h = R * Math.sqrt(3);
  for (let c = -1; c < 13; c++) {
    for (let r = -1; r < 8; r++) {
      const cx = c * w, cy = r * h + (c % 2 ? h / 2 : 0);
      if (cx < -60 || cx > 860 || cy < -60 || cy > 510) continue;
      let d = '';
      for (let i = 0; i < 6; i++) {
        const a = (60 * i * Math.PI) / 180;
        d += (i ? 'L' : 'M') + (cx + R * Math.cos(a)).toFixed(1) + ',' + (cy + R * Math.sin(a)).toFixed(1);
      }
      HEXES.push({d: d + 'Z', dist: Math.hypot(cx - CX, cy - CY)});
    }
  }
})();
