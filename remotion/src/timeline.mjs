/* Shared score + script data. Imported by the Remotion composition and by
   scripts/render-music.mjs, so picture and sound can never drift apart.

   Script source: "CELMoD はこうして生まれた" 台本(脚本) v3 (社内検討用資料)。
   本ファイルの CAPTIONS はその台本の文言をそのまま、または narration 用に
   最小限だけ整えたものです。社内資料と独自調査文献を出典として明記しています。
   出典一覧は README.md および drug-mechanism-video.html を参照してください。
   医学的内容の正確性は Medical の正式レビューを別途要します。 */

export const DURATION = 180;
export const FPS = 30;
export const CX = 400, CY = 210;

/* Scene boundaries */
export const S2 = 22.7, S3 = 52.1, S4 = 82.7, S5 = 111.5, S6 = 158.5;

/* Each sentence maps to one on-screen action; the visual cue leads it by ~0.5s */
export const CUE = {
  s1a: 0.3, s1b: 9.9,
  s2a: 23, s2b: 45.9,
  s3a: 54.3, s3b: 66.6,
  s4a: 83, s4b: 89.9, s4c: 105,
  s5a: 127.5, s5b: 137.4,
  s6a: 158.8, s6b: 166.7, s6c: 169.1,
  end: 176.5,
};

export const CAPTIONS = [
  {s: 0.8, e: 7.3, t: "レナリドミド、ポマリドミドは、長年、多発性骨髄腫の治療の柱として、患者さんに届けられてきた。"},
  {s: 7.6, e: 10.1, t: "効くことは、誰の目にも明らかだった。"},
  {s: 10.4, e: 13.7, t: "しかし、その仕組みは、誰にも分かっていなかった。"},
  {s: 14, e: 15.7, t: "なぜ、この薬は効くのか。"},
  {s: 16, e: 22.1, t: "教科書には「免疫調整薬（iMiD）」という、機序ではなく効果を指す名前だけが書かれていた。"},
  {s: 23.5, e: 26.3, t: "2014年。ボストン、ダナファーバーがん研究所。"},
  {s: 26.6, e: 32, t: "Krönkeらのグループは、ある転写因子が、なぜ細胞から消えていくのかを追っていた。"},
  {s: 32.3, e: 35.9, t: "同じ年、別のLuらのグループも、同じ問いを追っていた。"},
  {s: 36.2, e: 38.4, t: "そしてニュージャージー州サミット。"},
  {s: 38.7, e: 46.1, t: "レナリドミド・ポマリドミドを開発した当時のセルジーン社自身の研究チーム、Gandhiらもまた、同じ謎を追っていた。"},
  {s: 46.4, e: 51.5, t: "この年、少なくとも三つの独立したチームが、同じ謎を追い、結論にたどり着いた。"},
  {s: 52.9, e: 54.5, t: "答えはこうだった。"},
  {s: 54.8, e: 58.4, t: "薬は、細胞内の分解装置の一部、セレブロンに結合する。"},
  {s: 58.7, e: 66.8, t: "結合したセレブロンは、それまで手が届かなかった二つのタンパク質——AiolosとIkaros——を、新たに動員できるようになる。"},
  {s: 67.1, e: 73.6, t: "動員された二つのタンパク質は、ユビキチンの印を付けられ、プロテアソームへと送られ、分解されていく。"},
  {s: 73.9, e: 79, t: "骨髄腫細胞の生存に必要な、この二つのタンパク質が消え、細胞は生きられなくなる。"},
  {s: 79.3, e: 82.1, t: "これが、2014年に見つかった答えだった。"},
  {s: 83.5, e: 86.3, t: "機序が分かれば、次の問いは自然に生まれた。"},
  {s: 86.6, e: 90.1, t: "この仕組みを、もっと強く、もっと効率良くできないか。"},
  {s: 90.4, e: 97.1, t: "2018年、有望なものを選び出すスクリーニングによってCC-220、後のIberdomideが見つかった。"},
  {s: 97.4, e: 105.2, t: "この化合物は、レナリドミド・ポマリドミドより強くセレブロンに結合し、Aiolos/Ikarosの動員と分解を、より強く誘導した。"},
  {s: 105.5, e: 110.9, t: "2020年、分解の強さと速さを兼ね備えることを目標に設計されたのがMezigdomideだ。"},
  {s: 112.3, e: 117.7, t: "Mezigdomideは、セレブロンへの結合親和性が、ポマリドミドの実に40倍に達する。"},
  {s: 118, e: 124.9, t: "この結合は、セレブロンの立体構造をClosed型へと変え、AiolosおよびIkarosの分解を強く促進する。"},
  {s: 125.2, e: 127.7, t: "この分解は、二つの効果を同時に生む。"},
  {s: 128, e: 130.5, t: "一つは、骨髄腫細胞そのものへの効果。"},
  {s: 130.8, e: 137.6, t: "従来の免疫調節薬（IMiDs）と比べて、高い増殖抑制作用、アポトーシス誘導、そして腫瘍退縮作用を示す。"},
  {s: 137.9, e: 140, t: "もう一つは、免疫細胞への効果。"},
  {s: 140.3, e: 145.9, t: "T細胞とNK細胞の活性化と増殖を促し、疲弊していたT細胞を、その疲弊から解き放つ。"},
  {s: 146.2, e: 153.8, t: "Mezigdomideは、骨髄腫細胞に対する直接的な増殖抑制作用とともに免疫調節作用を示すことで、抗腫瘍作用を発揮する。"},
  {s: 154.1, e: 157.9, t: "これは、すなわちCELMoDという、新しいクラスの誕生だ。"},
  {s: 159.3, e: 161.5, t: "謎解きから、10年余りが過ぎた。"},
  {s: 161.8, e: 166.9, t: "かつて「免疫調整薬」としか呼べなかった薬の物語は、今、次の一章を迎えている。"},
  {s: 167.2, e: 169.3, t: "CELMoDsは、ここから始まる。"},
  {s: 169.6, e: 176.5, t: "これは、ひとつの謎が解けた物語であり、同時に——多発性骨髄腫治療の、新しい時代の、始まりの物語でもある。"},
];

export const FLASHES = [
  {t: 22.7, a: 0.66, d: 0.7},
  {t: 35.56, a: 0.28, d: 0.5},
  {t: 44.75, a: 0.24, d: 0.4},
  {t: 48.43, a: 0.34, d: 0.55},
  {t: 52.1, a: 0.8, d: 0.85},
  {t: 66.5, a: 0.5, d: 0.7},
  {t: 82.7, a: 0.68, d: 0.8},
  {t: 102.52, a: 0.56, d: 0.9},
  {t: 111.5, a: 0.62, d: 0.9},
  {t: 158.5, a: 0.74, d: 0.9},
  {t: 163.93, a: 0.86, d: 1.3},
  {t: 176.61, a: 0.9, d: 1.4},
];

export const RINGS = [
  {t: 22.7, r: 340, d: 1.7, w: 3, c: "#a8dcff"},
  {t: 35.56, r: 300, d: 1.5, w: 2.4, c: "#d6ecff"},
  {t: 44.75, r: 220, d: 1.2, w: 2.2, c: "#ffd28f"},
  {t: 48.43, r: 360, d: 1.6, w: 3, c: "#ffcf8a"},
  {t: 52.1, r: 460, d: 2.1, w: 4.2, c: "#cbb8ff"},
  {t: 53, r: 420, d: 2.1, w: 2.6, c: "#a8dcff"},
  {t: 66.5, r: 440, d: 2.1, w: 3.4, c: "#ffe2ab"},
  {t: 102.52, r: 300, d: 1.8, w: 3, c: "#ffd782"},
  {t: 114.11, r: 330, d: 2, w: 3.4, c: "#ffcf6e"},
  {t: 140.74, r: 280, d: 1.8, w: 2.6, c: "#8ff0dc"},
  {t: 158.5, r: 480, d: 2.2, w: 3.6, c: "#e3d0ff"},
  {t: 163.93, r: 560, d: 2.6, w: 4, c: "#fff2cf"},
];

/* On-screen labels: scientific naming, with an abstract fallback wording */
export const LABELS = [
  {sci: "セレブロン（足場）", abs: "足場タンパク質", x: 150, y: 300, ax: 200, ay: 274, t0: 45.9, t1: 66.8},
  {sci: "小分子", abs: "小分子", x: 400, y: 150, ax: 400, ay: 176, t0: 45.9, t1: 66.8},
  {sci: "Aiolos / Ikaros", abs: "標的タンパク質", x: 668, y: 306, ax: 640, ay: 276, t0: 46.9, t1: 66.8},
  {sci: "標的の分解", abs: "標的の分解", x: 432, y: 120, ax: 412, ay: 150, t0: 67.1, t1: 79},
  {sci: "CC-220（Iberdomide）", abs: "新規化合物", x: 400, y: 126, ax: 400, ay: 152, t0: 90.4, t1: 105.2},
  {sci: "結合強度の向上", abs: "結合強度の向上", x: 400, y: 352, ax: 400, ay: 326, t0: 89.9, t1: 105},
  {sci: "Mezigdomide", abs: "設計された小分子", x: 400, y: 330, ax: 400, ay: 304, t0: 105.5, t1: 117.7},
  {sci: "立体構造の変化（Closed型）", abs: "立体構造の変化", x: 400, y: 352, ax: 400, ay: 326, t0: 118, t1: 124.9},
  {sci: "免疫細胞", abs: "免疫細胞", x: 242, y: 376, ax: 242, ay: 352, t0: 118, t1: 153.8},
  {sci: "T細胞", abs: "T細胞", x: 590, y: 74, ax: 590, ay: 100, t0: 137.9, t1: 153.8},
];

export const CITES = [
  {t0: 1, t1: 22.1, s: "出典 [1,2,3,4]"},
  {t0: 23.5, t1: 51.5, s: "出典 [5,6,7]"},
  {t0: 52.9, t1: 82.1, s: "出典 [5,6]"},
  {t0: 83.5, t1: 110.9, s: "出典 [8,9,10]"},
  {t0: 112.3, t1: 157.9, s: "出典 [9,10,11,12]"},
];

/* ---------------- score ---------------- */
export const BEAT = 0.5;
export const STEP = BEAT / 4;

export const CHORDS = [
  {t: 0, root: 110, tones: [220, 261.63, 329.63]},
  {t: 11.35, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 22.7, root: 110, tones: [220, 261.63, 329.63]},
  {t: 30.05, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 37.4, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 44.75, root: 98, tones: [196, 246.94, 293.66]},
  {t: 52.1, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 59.3, root: 98, tones: [196, 246.94, 293.66]},
  {t: 66.5, root: 110, tones: [220, 261.63, 329.63]},
  {t: 73.7, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 80, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 82.7, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 89.48, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 96.25, root: 110, tones: [220, 261.63, 329.63]},
  {t: 103.03, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 108.11, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 111.5, root: 73.42, tones: [174.61, 220, 293.66]},
  {t: 121.94, root: 110, tones: [220, 261.63, 329.63]},
  {t: 132.39, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 142.83, root: 98, tones: [196, 246.94, 293.66]},
  {t: 150.67, root: 110, tones: [220, 261.63, 329.63]},
  {t: 158.5, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 163.03, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 166.42, root: 130.81, tones: [196, 261.63, 329.63]},
  {t: 169.82, root: 98, tones: [196, 246.94, 293.66]},
  {t: 173.21, root: 110, tones: [220, 261.63, 329.63]},
  {t: 176.04, root: 87.31, tones: [174.61, 220, 261.63]},
  {t: 177.74, root: 130.81, tones: [196, 261.63, 329.63]},
];

export function chordAt(t) {
  let c = CHORDS[0];
  for (const x of CHORDS) if (t >= x.t) c = x;
  return c;
}

export const LEAD_NOTES = [
  {t: 66.5, f: 880, d: 0.55},
  {t: 67.76, f: 1046.5, d: 0.55},
  {t: 69.02, f: 1318.51, d: 1.1},
  {t: 71.36, f: 1046.5, d: 0.55},
  {t: 72.62, f: 880, d: 1},
  {t: 103.37, f: 698.46, d: 0.6},
  {t: 104.72, f: 880, d: 0.6},
  {t: 106.08, f: 1046.5, d: 1.2},
  {t: 108.45, f: 987.77, d: 0.6},
  {t: 109.81, f: 783.99, d: 1},
  {t: 168.46, f: 783.99, d: 0.5},
  {t: 169.14, f: 1046.5, d: 0.5},
  {t: 169.82, f: 1174.66, d: 1},
  {t: 171.17, f: 1046.5, d: 0.6},
  {t: 172.08, f: 1318.51, d: 1.6},
  {t: 173.89, f: 1046.5, d: 0.6},
  {t: 174.68, f: 880, d: 0.6},
  {t: 175.47, f: 1046.5, d: 1.6},
];

export const BRASS_HITS = [
  {t: 158.5, d: 1.2},
  {t: 160.76, d: 0.9},
  {t: 163.03, d: 1.1},
  {t: 166.42, d: 1},
  {t: 169.82, d: 1},
  {t: 173.21, d: 1.3},
];
export const RISERS = [
  {t: 19.91, d: 1.6},
  {t: 48.79, d: 1.8},
  {t: 79.82, d: 1.6},
  {t: 108.79, d: 1.6},
  {t: 154.32, d: 1.6},
  {t: 174.79, d: 1.6},
];
export const CRASHES = [22.7, 52.1, 66.5, 82.7, 102.52, 111.5, 158.5, 163.93, 176.61];
export const SHIMMERS = [163.93, 176.61];

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
  if (t < 8.73) return 0;
  if (t < S2) return 0.4 * smoothstep(8.73, 12.22, t);
  if (t < S3) return lerp(0.4, 0.95, smoothstep(S2, S2 + (S3 - S2) * 0.0625, t));
  if (t < S4) return 1.15;
  if (t < S5) return 1.0;
  if (t < S6) return lerp(1.0, 1.2, smoothstep(S5, S5 + (S6 - S5) * 0.1111, t));
  return lerp(1.3, 0.5, smoothstep(175.47, 178.87, t));
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
