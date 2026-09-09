/* Offline renderer for the score.
   Remotion cannot capture Web Audio output while rendering frames, so the same
   synth used in the HTML preview is reproduced here as direct sample
   computation and written to public/score.wav. */
import {writeFileSync, mkdirSync} from 'node:fs';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import {
  BEAT, CHORDS, CRASHES, CUE, DURATION, LEAD_NOTES, BRASS_HITS, RISERS, SHIMMERS,
  S2, S3, S4, S5, S6, STEP, captionActive, chordAt, clamp, lerp, smoothstep,
} from '../src/timeline.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SR = 48000;
const TAIL = 5;
const N = Math.ceil((DURATION + TAIL) * SR);

/* two buses: melodic content ducks hard under narration, percussion less so */
const melodic = new Float32Array(N);
const perc = new Float32Array(N);

/* ---------------- building blocks ---------------- */
const TAU = Math.PI * 2;

function onePole() {
  let y = 0;
  return (x, fc) => {
    const a = 1 - Math.exp((-TAU * fc) / SR);
    y += a * (x - y);
    return y;
  };
}
function lp2() {
  const a = onePole(), b = onePole();
  return (x, fc) => b(a(x, fc), fc);
}
function saw(p) { return 2 * (p / TAU - Math.floor(p / TAU + 0.5)); }
function squ(p) { return Math.sin(p) >= 0 ? 1 : -1; }
function tri(p) { return 1 - 4 * Math.abs(((p / TAU + 0.75) % 1) - 0.5); }

function write(buf, i, v) { if (i >= 0 && i < N) buf[i] += v; }

/* ---------------- voices ---------------- */
function piano(bus, t0, freq, vel) {
  const parts = [[1, 1, 1.7], [2, 0.34, 1.1], [3, 0.15, 0.72], [4.2, 0.06, 0.45]];
  const dur = 1.8;
  const n = Math.ceil(dur * SR), i0 = Math.floor(t0 * SR);
  for (const [m, amp, dec] of parts) {
    const w = (TAU * freq * m) / SR;
    for (let i = 0; i < n; i++) {
      const tt = i / SR;
      if (tt > dec) break;
      const env = tt < 0.006 ? tt / 0.006 : Math.exp(-tt / (dec * 0.32));
      const osc = m === 1 ? tri(w * i) : Math.sin(w * i);
      write(bus, i0 + i, osc * 0.3 * amp * vel * env);
    }
  }
}
function kick(bus, t0, vel) {
  const n = Math.ceil(0.34 * SR), i0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const f = 44 + (165 - 44) * Math.exp(-tt / 0.032);
    ph += (TAU * f) / SR;
    const env = tt < 0.006 ? tt / 0.006 : Math.exp(-tt / 0.075);
    write(bus, i0 + i, Math.sin(ph) * 0.6 * vel * env);
  }
}
function tom(bus, t0, vel) {
  const n = Math.ceil(0.4 * SR), i0 = Math.floor(t0 * SR);
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const f = 96 + (220 - 96) * Math.exp(-tt / 0.06);
    ph += (TAU * f) / SR;
    const env = tt < 0.008 ? tt / 0.008 : Math.exp(-tt / 0.09);
    write(bus, i0 + i, Math.sin(ph) * 0.3 * vel * env);
  }
}
function snare(bus, t0, vel) {
  const n = Math.ceil(0.22 * SR), i0 = Math.floor(t0 * SR);
  const lo = lp2(), hi = lp2();
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const env = tt < 0.005 ? tt / 0.005 : Math.exp(-tt / 0.048);
    const nz = Math.random() * 2 - 1;
    const band = lo(nz, 2600) - hi(nz, 1200);
    ph += (TAU * 196) / SR;
    const body = Math.sin(ph) * 0.4 * Math.exp(-tt / 0.033);
    write(bus, i0 + i, (band * 0.3 + body * 0.12) * vel * env * 2.4);
  }
}
function hat(bus, t0, open, vel) {
  const dur = open ? 0.26 : 0.09;
  const n = Math.ceil(dur * SR), i0 = Math.floor(t0 * SR);
  const lo = onePole();
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const env = tt < 0.003 ? tt / 0.003 : Math.exp(-tt / (open ? 0.055 : 0.014));
    const nz = Math.random() * 2 - 1;
    const hp = nz - lo(nz, 7400);
    write(bus, i0 + i, hp * (open ? 0.13 : 0.09) * vel * env);
  }
}
function bassVoice(bus, t0, freq, dur) {
  const n = Math.ceil((dur + 0.05) * SR), i0 = Math.floor(t0 * SR);
  const f = lp2();
  let p1 = 0, p2 = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const env = tt < 0.012 ? tt / 0.012 : Math.exp(-tt / (dur * 0.34));
    if (env < 0.0005) break;
    const fc = 240 + (880 - 240) * Math.exp(-tt / (dur * 0.4));
    p1 += (TAU * freq) / SR;
    p2 += (TAU * freq * 0.5) / SR;
    write(bus, i0 + i, f(saw(p1) * 0.7 + squ(p2) * 0.3, fc) * 0.28 * env);
  }
}
function pluck(bus, t0, freq, vel) {
  const n = Math.ceil(0.4 * SR), i0 = Math.floor(t0 * SR);
  const f = lp2();
  let ph = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const env = tt < 0.008 ? tt / 0.008 : Math.exp(-tt / 0.085);
    if (env < 0.0005) break;
    const fc = 900 + (5200 - 900) * Math.exp(-tt / 0.09);
    ph += (TAU * freq) / SR;
    write(bus, i0 + i, f(tri(ph), fc) * 0.15 * vel * env);
  }
}
function lead(bus, t0, freq, dur) {
  const n = Math.ceil((dur + 0.3) * SR), i0 = Math.floor(t0 * SR);
  const f = lp2();
  let p1 = 0, p2 = 0;
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    let env;
    if (tt < 0.04) env = tt / 0.04;
    else if (tt < dur * 0.6) env = 1;
    else env = Math.exp(-(tt - dur * 0.6) / (dur * 0.34));
    if (env < 0.0005) break;
    p1 += (TAU * freq * Math.pow(2, -8 / 1200)) / SR;
    p2 += (TAU * freq * Math.pow(2, 8 / 1200)) / SR;
    write(bus, i0 + i, f(tri(p1) * 0.5 + saw(p2) * 0.32, 3200) * 0.19 * env);
  }
}
function brass(bus, t0, freq, dur) {
  const n = Math.ceil((dur + 0.35) * SR), i0 = Math.floor(t0 * SR);
  const f = lp2();
  const ph = [0, 0, 0], mul = [1, 1.5, 2], amp = [0.5, 0.24, 0.16];
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    let env;
    if (tt < 0.07) env = tt / 0.07;
    else if (tt < dur * 0.55) env = 1;
    else env = Math.exp(-(tt - dur * 0.55) / (dur * 0.3));
    if (env < 0.0005) break;
    const fc = tt < 0.16 ? 700 + (2600 - 700) * (tt / 0.16) : Math.max(1100, 2600 - (2600 - 1100) * ((tt - 0.16) / dur));
    let s = 0;
    for (let k = 0; k < 3; k++) {
      ph[k] += (TAU * freq * mul[k]) / SR;
      s += saw(ph[k]) * amp[k];
    }
    write(bus, i0 + i, f(s, fc) * 0.2 * env);
  }
}
function crash(bus, t0) {
  const n = Math.ceil(1.7 * SR), i0 = Math.floor(t0 * SR);
  const lo = onePole();
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const env = tt < 0.01 ? tt / 0.01 : Math.exp(-tt / 0.42);
    if (env < 0.0004) break;
    const nz = Math.random() * 2 - 1;
    write(bus, i0 + i, (nz - lo(nz, 3600)) * 0.3 * env);
  }
}
function riser(bus, t0, dur) {
  const n = Math.ceil((dur + 0.2) * SR), i0 = Math.floor(t0 * SR);
  const lo = lp2(), hi = lp2();
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    const u = clamp(tt / dur, 0, 1);
    const env = tt < dur ? Math.pow(u, 2.2) * 0.22 : 0.22 * Math.exp(-(tt - dur) / 0.04);
    const fc = 400 * Math.pow(6500 / 400, u);
    const nz = Math.random() * 2 - 1;
    const band = lo(nz, fc * 1.4) - hi(nz, fc * 0.7);
    write(bus, i0 + i, band * env * 2.2);
  }
}
function shimmer(bus, t0) {
  [1046.5, 1318.51, 1567.98, 2093, 2637.02].forEach((f, k) => {
    const s = t0 + k * 0.09;
    const n = Math.ceil(2.5 * SR), i0 = Math.floor(s * SR);
    const w = (TAU * f) / SR;
    for (let i = 0; i < n; i++) {
      const tt = i / SR;
      const env = tt < 0.02 ? tt / 0.02 : Math.exp(-tt / 0.62);
      if (env < 0.0004) break;
      write(bus, i0 + i, Math.sin(w * i) * 0.09 * env);
    }
  });
}
function finale(bus, t0) {
  const freqs = [130.81, 261.63, 329.63, 392, 523.25], amps = [0.55, 0.4, 0.28, 0.22, 0.16];
  const n = Math.ceil(4.6 * SR), i0 = Math.floor(t0 * SR);
  const f = lp2();
  const ph = new Float64Array(5);
  for (let i = 0; i < n; i++) {
    const tt = i / SR;
    let env;
    if (tt < 0.9) env = tt / 0.9;
    else if (tt < 2.2) env = 1;
    else env = Math.exp(-(tt - 2.2) / 0.72);
    if (env < 0.0004) break;
    let s = 0;
    for (let k = 0; k < 5; k++) {
      ph[k] += (TAU * freqs[k]) / SR;
      s += (k < 2 ? Math.sin(ph[k]) : saw(ph[k])) * amps[k];
    }
    write(bus, i0 + i, f(s, 2400) * 0.26 * env);
  }
}

/* ---------------- sequencer (mirrors the preview's playStep) ---------------- */
function sequence() {
  const steps = Math.floor(DURATION / STEP);
  for (let idx = 0; idx < steps; idx++) {
    const t = idx * STEP;
    if (t < 6 || t >= CUE.end - 0.2) continue;
    const s = idx % 16, bar = Math.floor(idx / 16), ch = chordAt(t);

    if (t < S2) {
      if (s === 0) piano(melodic, t, ch.tones[0], 0.5);
      if (s === 8) piano(melodic, t, ch.tones[2], 0.38);
      if (s === 12 && bar % 2 === 1) piano(melodic, t, ch.tones[1], 0.3);
      if (t >= 9.5 && s === 0) bassVoice(perc, t, ch.root, 0.9);
      continue;
    }
    if (t < S3) {
      if (s === 0) { kick(perc, t, 0.5); piano(melodic, t, ch.tones[0], 0.48); bassVoice(perc, t, ch.root, 0.55); }
      if (s === 8) { kick(perc, t, 0.4); piano(melodic, t, ch.tones[2], 0.36); bassVoice(perc, t, ch.root, 0.4); }
      if (s === 4 || s === 12) tom(perc, t, 0.42);
      if (t >= 21 && (s === 6 || s === 14)) pluck(melodic, t, ch.tones[(idx >> 1) % 3] * 2, 0.7);
      continue;
    }
    if (t < S4) {
      if (s === 0 || s === 8 || s === 11) kick(perc, t, s === 11 ? 0.7 : 1);
      if (s === 4 || s === 12) snare(perc, t, 0.85);
      if (s % 2 === 0) hat(perc, t, s === 14, 0.7);
      if (s === 0 || s === 3 || s === 6 || s === 8 || s === 11 || s === 14) bassVoice(perc, t, ch.root, s === 0 ? 0.42 : 0.24);
      if (s === 2 || s === 6 || s === 10 || s === 14) pluck(melodic, t, ch.tones[(idx >> 1) % 3] * 2, 0.85);
      if (s === 0) piano(melodic, t, ch.tones[1], 0.3);
      continue;
    }
    if (t < S5) {
      if (s % 4 === 0) kick(perc, t, 0.8);
      if (s === 4 || s === 12) snare(perc, t, 0.7);
      if (s % 2 === 1) hat(perc, t, false, 0.55);
      if (s % 4 === 0 || s === 6 || s === 14) bassVoice(perc, t, ch.root, 0.3);
      if (s % 2 === 0) pluck(melodic, t, ch.tones[(idx >> 1) % 3] * (s % 8 === 0 ? 2 : 4), 0.6);
      if (s === 0) piano(melodic, t, ch.tones[0], 0.34);
      continue;
    }
    if (t < S6) {
      if (s === 0 || s === 8 || s === 10) kick(perc, t, 0.9);
      if (s === 12) snare(perc, t, 0.8);
      if (s === 6 || s === 14) tom(perc, t, 0.6);
      if (s % 2 === 0) hat(perc, t, false, 0.5);
      if (s % 2 === 0) bassVoice(perc, t, ch.root, 0.24);
      if (s === 4 || s === 12) pluck(melodic, t, ch.tones[0], 0.5);
      continue;
    }
    if (s % 4 === 0) kick(perc, t, 1);
    if (s === 4 || s === 12) snare(perc, t, 0.95);
    if (s % 2 === 0) hat(perc, t, s === 6 || s === 14, 0.85);
    if (s % 2 === 0) bassVoice(perc, t, ch.root, 0.24);
    if (s % 2 === 1) pluck(melodic, t, ch.tones[(idx >> 1) % 3] * (idx % 4 === 1 ? 4 : 2), 0.7);
    if (s === 0) piano(melodic, t, ch.tones[2], 0.32);
  }

  for (const n of LEAD_NOTES) lead(melodic, n.t, n.f, n.d);
  for (const b of BRASS_HITS) brass(melodic, b.t, chordAt(b.t).root * 2, b.d);
  for (const r of RISERS) riser(perc, r.t, r.d);
  for (const c of CRASHES) crash(perc, c);
  for (const s of SHIMMERS) shimmer(melodic, s);
  finale(melodic, CUE.end - 0.4);
}

/* ---------------- sustained layers ---------------- */
function sustained() {
  const padF = lp2(), strF = lp2();
  const padPh = [0, 0, 0], strPh = [0, 0, 0];
  let subPh = 0;
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    if (t > DURATION) break;
    const ch = chordAt(t);
    const tail = 1 - smoothstep(98.4, 100, t);

    const padLevel = (0.1 + smoothstep(44, 50, t) * 0.03) * smoothstep(0, 2, t) * tail;
    const strLevel =
      (smoothstep(20, 25, t) * 0.075 + smoothstep(29, 33, t) * 0.035 +
        smoothstep(63, 68, t) * 0.035 + smoothstep(81, 86, t) * 0.05) * tail;
    const padCut = 520 + smoothstep(0, 3, t) * 260 + smoothstep(12, 16, t) * 420 +
      smoothstep(28, 32, t) * 700 + smoothstep(80, 86, t) * 900;
    const strCut = 1500 + smoothstep(28, 34, t) * 900 + smoothstep(80, 88, t) * 1400;
    /* the tense section gets tremolo on the strings */
    const trem = t >= S5 && t < S6 ? 1 + 0.22 * Math.sin(TAU * 7.2 * t) : 1;
    const vib = Math.sin(TAU * 5.2 * t) * 5.5;

    let pad = 0, str = 0;
    for (let k = 0; k < 3; k++) {
      padPh[k] += (TAU * ch.tones[k] * Math.pow(2, ((k - 1) * 6) / 1200)) / SR;
      pad += saw(padPh[k]) * 0.2;
      strPh[k] += (TAU * ch.tones[k] * 2 * Math.pow(2, ((k - 1) * 9 + vib) / 1200)) / SR;
      str += saw(strPh[k]) * 0.26;
    }
    subPh += (TAU * (ch.root / 2)) / SR;
    const sub = Math.sin(subPh) * 0.15 * smoothstep(8, 13, t) * tail;

    melodic[i] += padF(pad, padCut) * padLevel + strF(str, strCut) * strLevel * trem;
    melodic[i] += sub;
  }
}

/* ---------------- echo on the melodic bus ---------------- */
function echo() {
  const d = Math.floor(BEAT * 0.75 * SR);
  const fbk = 0.32, wet = 0.4;
  const line = new Float32Array(N);
  for (let i = 0; i < N; i++) {
    const back = i - d >= 0 ? line[i - d] : 0;
    line[i] = melodic[i] + back * fbk;
    melodic[i] += back * wet;
  }
}

/* ---------------- mix, duck, limit ---------------- */
function mix() {
  const out = new Float32Array(N);
  /* ducking envelopes, smoothed like the browser's setTargetAtTime */
  let busEnv = 1, mstEnv = 0.95;
  const a = 1 - Math.exp(-1 / (0.22 * SR));
  for (let i = 0; i < N; i++) {
    const t = i / SR;
    const duck = captionActive(t);
    busEnv += a * ((duck ? 0.34 : 1) - busEnv);
    mstEnv += a * ((duck ? 0.72 : 0.95) - mstEnv);
    const fade = smoothstep(0, 1.2, t) * (1 - smoothstep(98.4, 100, t));
    out[i] = (melodic[i] * busEnv * fade + perc[i]) * mstEnv;
  }
  /* soft limiter */
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(out[i]));
  const target = 0.89;
  const pre = peak > 0 ? Math.min(1.6, target / peak) : 1;
  for (let i = 0; i < N; i++) out[i] = Math.tanh(out[i] * pre * 1.15) * 0.94;
  return out;
}

function writeWav(path, data) {
  const bytes = data.length * 2 * 2; // 16-bit stereo
  const buf = Buffer.alloc(44 + bytes);
  buf.write('RIFF', 0);
  buf.writeUInt32LE(36 + bytes, 4);
  buf.write('WAVE', 8);
  buf.write('fmt ', 12);
  buf.writeUInt32LE(16, 16);
  buf.writeUInt16LE(1, 20);
  buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24);
  buf.writeUInt32LE(SR * 4, 28);
  buf.writeUInt16LE(4, 32);
  buf.writeUInt16LE(16, 34);
  buf.write('data', 36);
  buf.writeUInt32LE(bytes, 40);
  let o = 44;
  for (let i = 0; i < data.length; i++) {
    const v = Math.max(-1, Math.min(1, data[i]));
    const s = v < 0 ? v * 32768 : v * 32767;
    buf.writeInt16LE(s | 0, o); o += 2;
    buf.writeInt16LE(s | 0, o); o += 2;
  }
  mkdirSync(dirname(path), {recursive: true});
  writeFileSync(path, buf);
}

console.log('rendering score...');
sequence();
sustained();
echo();
const out = mix();
const path = join(__dirname, '..', 'public', 'score.wav');
writeWav(path, out);
console.log(`wrote ${path} (${(out.length / SR).toFixed(1)}s)`);
