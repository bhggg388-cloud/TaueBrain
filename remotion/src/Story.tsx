import React from 'react';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
// @ts-ignore - plain ESM module shared with the music renderer
import {
  CAPTIONS, CITES, CUE, CX, CY, LABELS, RINGS, S2, S3, S4, S5, S6,
  clamp, easeOut, easeOutQuint, energyAt, flashAt, lerp, mixHex, polar, shakeAt, smoothstep, BEAT,
} from './timeline.mjs';
import {FOV, FRAGMENTS, HEXES, MIST, NET_PAIRS, NODES, SPARKS, STREAKS, WARP, ZSPAN} from './particles';
import {
  BRANCH_A, BRANCH_A_LEN, BRANCH_B, BRANCH_B_LEN, BRIDGE_L, BRIDGE_R, BYSTANDER_PROTEINS, CANDIDATES,
  CHEM, CLAMP_JAW, CONFORM_A, CONFORM_B, INNER_CHAINS, ORGANELLES, PROTEASOME_RINGS, PROTEASOME_X,
  PROTEASOME_Y, RIBBON_D, RIBBON_LEN, SIGNAL_CHAIN, SPIKES, TARGET_CHAIN, T_CELLS, T_THREADS,
} from './geometry';

const FONT = 'IPAGothic, "Noto Sans JP", sans-serif';
const END_TITLE = 'CELMoD はこうして生まれた';
const SCI_LABELS = true;

/* warp field speed varies with energy, so pre-integrate it into a lookup */
const WSTEP = 0.1;
const warpTable = [0];
for (let i = 1; i <= Math.ceil(100 / WSTEP) + 2; i++) {
  warpTable[i] = warpTable[i - 1] + (80 + 220 * energyAt(i * WSTEP)) * WSTEP;
}
function warpDist(t: number) {
  const i = clamp(Math.floor(t / WSTEP), 0, warpTable.length - 2);
  return lerp(warpTable[i], warpTable[i + 1], (t - i * WSTEP) / WSTEP);
}

const F = (n: number) => Number(n.toFixed(2));

export const Story: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const t = frame / fps;

  const energy = energyAt(t);
  const beat = Math.max(0, 1 - ((t % BEAT) / BEAT) * 3.4) * energy;
  const dawn = smoothstep(CUE.s6b, 174.91, t);
  const gold = smoothstep(CUE.s4c, 107.26, t);

  /* background grade */
  let inner = mixHex('#0a1230', '#152a72', smoothstep(19.21, 26.38, t));
  inner = mixHex(inner, '#2a1f66', smoothstep(50.26, 57.5, t));
  inner = mixHex(inner, '#0e3a44', smoothstep(80.9, 87.78, t));
  inner = mixHex(inner, '#2a1046', smoothstep(109.81, 119.33, t));
  inner = mixHex(inner, '#fff8ec', dawn);
  let outer = mixHex('#02030a', '#050a24', smoothstep(19.21, 26.38, t));
  outer = mixHex(outer, '#0a0723', smoothstep(50.26, 57.5, t));
  outer = mixHex(outer, '#04181d', smoothstep(80.9, 87.78, t));
  outer = mixHex(outer, '#100420', smoothstep(109.81, 119.33, t));
  outer = mixHex(outer, '#ece3d2', dawn);

  /* camera */
  let cs: number;
  if (t < S2) cs = lerp(1.16, 1, easeOut(smoothstep(0, 20.95, t)));
  else if (t < S3) cs = lerp(1, 1.07, smoothstep(S2, S3, t));
  else if (t < S4) cs = lerp(0.95, 1.1, easeOut(smoothstep(S3, S4, t)));
  else if (t < S5) cs = lerp(1, 1.05, smoothstep(S4, S5, t));
  else if (t < S6) cs = lerp(0.97, 1.06, smoothstep(S5, S6, t));
  else cs = lerp(1, 1.15, easeOut(smoothstep(S6, 176.61, t)));
  if (t >= CUE.end) cs = lerp(1.15, 1.03, smoothstep(CUE.end, CUE.end + 1.6, t));
  cs += beat * 0.012;
  const [shx, shy, shr] = shakeAt(t);
  const camX = CX + Math.sin(t * 0.21) * 8 * energy + shx;
  const camY = CY + Math.cos(t * 0.17) * 5 * energy + shy;
  const roll = Math.sin(t * 0.13) * 0.9 * energy + shr;
  const cam = `translate(${F(camX)} ${F(camY)}) rotate(${F(roll)}) scale(${cs.toFixed(4)}) translate(${-CX} ${-CY})`;

  const cellsVisible = t > 108.96 && t < 161.89;
  const dissolved = 1 - smoothstep(S3 + 0.8, 62, t);
  const degrade = smoothstep(CUE.s3a + 0.4, CUE.s3a + 4.2, t);
  const complexFade = smoothstep(CUE.s2b - 0.4, CUE.s2b + 1.6, t) * (1 - smoothstep(79.1, 82.7, t));
  const showComplex = t > CUE.s2b - 0.6 && t < 82.7;
  const wd = warpDist(t);
  const starFade = 1 - dawn;

  const chemDraw = smoothstep(CUE.s1b, CUE.s1b + 4.4, t);
  const chemOn = clamp(smoothstep(CUE.s1b, CUE.s1b + 1, t) * (1 - smoothstep(110.48, 115.16, t)), 0, 1);
  const chemCy = t < S4 ? 0 : lerp(0, -56, smoothstep(S4, S4 + 2.5, t));
  const chemScale =
    t < S2 ? lerp(1.18, 1, smoothstep(CUE.s1b, S2, t)) : t < S4 ? 1 : lerp(1, 0.92, smoothstep(S4, S4 + 2.5, t));
  const chemCol = mixHex('#a8e4ff', '#ffd58a', gold);

  const caption = CAPTIONS.find((c: any) => t > c.s && t < c.e);
  const cite = CITES.find((c: any) => t > c.t0 && t < c.t1);

  return (
    <AbsoluteFill style={{backgroundColor: '#02030a'}}>
      <Audio src={staticFile('score.wav')} />

      <svg width="100%" height="100%" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid slice"
        style={{position: 'absolute', inset: 0}}>
        <defs>
          <filter id="gS" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="3" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gM" x="-90%" y="-90%" width="280%" height="280%">
            <feGaussianBlur stdDeviation="7" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="gL" x="-120%" y="-120%" width="340%" height="340%">
            <feGaussianBlur stdDeviation="18" result="b" />
            <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
          <filter id="memA" x="-45%" y="-45%" width="190%" height="190%">
            <feTurbulence type="fractalNoise" baseFrequency={0.0125 + Math.sin(t * 0.42) * 0.0022}
              numOctaves="3" seed="7" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="30" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="3.5" />
          </filter>
          <filter id="memB" x="-45%" y="-45%" width="190%" height="190%">
            <feTurbulence type="fractalNoise" baseFrequency={0.0165 + Math.sin(t * 0.55 + 1.6) * 0.0026}
              numOctaves="3" seed="21" result="n" />
            <feDisplacementMap in="SourceGraphic" in2="n" scale="22" xChannelSelector="R" yChannelSelector="G" result="d" />
            <feGaussianBlur in="d" stdDeviation="2.6" />
          </filter>
          <filter id="grain" x="-25%" y="-25%" width="150%" height="150%">
            <feTurbulence type="fractalNoise" baseFrequency={0.055 + Math.sin(t * 0.3) * 0.006}
              numOctaves="4" seed="3" result="n" />
            <feDiffuseLighting in="n" lightingColor="#a8f0ff" surfaceScale="2.6" diffuseConstant="1.1" result="lit">
              <feDistantLight azimuth="130" elevation="58" />
            </feDiffuseLighting>
            <feComposite in="lit" in2="SourceGraphic" operator="in" result="c" />
            <feBlend in="c" in2="SourceGraphic" mode="screen" />
          </filter>

          <radialGradient id="bgGrad" cx="50%" cy="44%" r="84%">
            <stop offset="0%" stopColor={inner} />
            <stop offset="100%" stopColor={outer} />
          </radialGradient>
          <radialGradient id="magentaCell" cx="42%" cy="38%" r="62%">
            <stop offset="0%" stopColor="#7a2ea8" stopOpacity=".62" />
            <stop offset="58%" stopColor="#4a1470" stopOpacity=".45" />
            <stop offset="100%" stopColor="#2a0942" stopOpacity=".08" />
          </radialGradient>
          <radialGradient id="magentaRim" cx="50%" cy="50%" r="50%">
            <stop offset="72%" stopColor="#e05fd8" stopOpacity="0" />
            <stop offset="88%" stopColor="#e264d4" stopOpacity=".55" />
            <stop offset="100%" stopColor="#ff8ae8" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyanCell" cx="38%" cy="34%" r="66%">
            <stop offset="0%" stopColor="#3fd8f0" stopOpacity=".55" />
            <stop offset="55%" stopColor="#1878b8" stopOpacity=".5" />
            <stop offset="100%" stopColor="#062a52" stopOpacity=".22" />
          </radialGradient>
          <radialGradient id="cyanRim" cx="50%" cy="50%" r="50%">
            <stop offset="74%" stopColor="#7fe8ff" stopOpacity="0" />
            <stop offset="90%" stopColor="#8ff0ff" stopOpacity=".5" />
            <stop offset="100%" stopColor="#c8faff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="beadGold" cx="36%" cy="34%" r="64%">
            <stop offset="0%" stopColor="#fff0c8" /><stop offset="45%" stopColor="#ffc25a" />
            <stop offset="100%" stopColor="#c46f10" />
          </radialGradient>
          <radialGradient id="beadCyan" cx="36%" cy="34%" r="64%">
            <stop offset="0%" stopColor="#eaffff" /><stop offset="45%" stopColor="#7fe4ff" />
            <stop offset="100%" stopColor="#1a7ba8" />
          </radialGradient>
          <radialGradient id="spikeGold" cx="38%" cy="34%" r="66%">
            <stop offset="0%" stopColor="#ffe9a8" /><stop offset="50%" stopColor="#e8a028" />
            <stop offset="100%" stopColor="#7a4406" />
          </radialGradient>
          <radialGradient id="coreFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={mixHex('#8fd8ff', '#ffd782', gold)} stopOpacity=".5" />
            <stop offset="58%" stopColor={mixHex('#5aa8ff', '#ffb347', gold)} stopOpacity=".16" />
            <stop offset="100%" stopColor="#5aa8ff" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="goldFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffd782" stopOpacity=".8" />
            <stop offset="100%" stopColor="#ffb347" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="dawnFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fffdf6" stopOpacity=".98" />
            <stop offset="45%" stopColor="#ffe6ab" stopOpacity=".5" />
            <stop offset="100%" stopColor="#ffd48a" stopOpacity="0" />
          </radialGradient>
          {/* shafts fade with distance from the light source, not across their own box */}
          <radialGradient id="shaftGrad" gradientUnits="userSpaceOnUse" cx={CX} cy={CY} r={520}>
            <stop offset="0%" stopColor="#cfe8ff" stopOpacity=".30" />
            <stop offset="35%" stopColor="#bfe4ff" stopOpacity=".12" />
            <stop offset="100%" stopColor="#bfe4ff" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect x={-160} y={-160} width={1120} height={770} fill="url(#bgGrad)" />

        <g transform={cam}>
          {/* 3D warp field */}
          <g>
            {WARP.map((w, i) => {
              const z = (((w.z0 - wd) % ZSPAN) + ZSPAN) % ZSPAN + 30;
              const k = FOV / z;
              const x = CX + w.x * k, y = CY + w.y * k;
              if (x < -140 || x > 940 || y < -140 || y > 590 || k < 0.12) return null;
              const op = clamp((ZSPAN - z) / ZSPAN, 0, 1) * 0.85 * (0.3 + energy * 0.5) * starFade;
              if (op < 0.01) return null;
              return <circle key={i} cx={F(x)} cy={F(y)} r={F(w.r * k * 1.5)} opacity={F(op)}
                fill={w.warm ? mixHex('#d5e6ff', '#ffe0a6', gold) : '#d5e6ff'} />;
            })}
          </g>

          {/* volumetric shafts */}
          <g opacity={F(clamp((smoothstep(22.35, 26.38, t) * 0.24 + smoothstep(51.73, 55.7, t) * 0.2 +
            smoothstep(CUE.s4c, 106.42, t) * 0.22 + smoothstep(S6, 161.89, t) * 0.4) *
            (1 - smoothstep(175.47, 178.87, t)) * (0.55 + beat * 0.25), 0, 0.42))}>
            <g transform={`rotate(${F(-t * 4.5)} ${CX} ${CY})`}>
              {Array.from({length: 7}, (_, i) => {
                const a = i * (360 / 7);
                const [x1, y1] = polar(CX, CY, 60, a - 3);
                const [x2, y2] = polar(CX, CY, 640, a - 9);
                const [x3, y3] = polar(CX, CY, 640, a + 9);
                const [x4, y4] = polar(CX, CY, 60, a + 3);
                return <path key={i} fill="url(#shaftGrad)"
                  d={`M${F(x1)},${F(y1)} L${F(x2)},${F(y2)} L${F(x3)},${F(y3)} L${F(x4)},${F(y4)} Z`} />;
              })}
            </g>
          </g>

          {/* design lattice */}
          {t > 79.1 && t < 119.33 && (
            <g stroke="#4fd6c8" fill="none"
              opacity={F(smoothstep(CUE.s4a, CUE.s4a + 2.2, t) * (1 - smoothstep(108.11, 114.11, t)) * 0.9)}>
              {HEXES.map((h, i) => (
                <path key={i} d={h.d} strokeWidth={0.8}
                  opacity={F(smoothstep(CUE.s4a + h.dist * 0.0045, CUE.s4a + 1.2 + h.dist * 0.0045, t) *
                    (0.07 + 0.11 * Math.max(0, Math.sin(t * 2.2 - h.dist * 0.017))))} />
              ))}
            </g>
          )}

          {/* central glow */}
          <circle cx={CX} cy={CY} fill="url(#coreFade)"
            r={F(160 + beat * 22 + smoothstep(52.1, 61.1, t) * 55)}
            opacity={F(clamp((smoothstep(10.48, 19.21, t) * 0.45 + smoothstep(34.46, 37.4, t) * 0.3 +
              smoothstep(51.73, 55.7, t) * 0.4 + smoothstep(CUE.s4c, 106.42, t) * 0.45 + beat * 0.2) *
              (1 - dawn * 0.7) * (1 - smoothstep(111.5, 119.33, t) * 0.5), 0, 1.2))} />

          {/* ---- scene 5: cells ---- */}
          {cellsVisible && <Cells t={t} beat={beat} />}

          {/* ---- scene 2-3: scaffold, target, bridges ---- */}
          {showComplex && (
            <>
              <g opacity={F(complexFade)}
                transform={`translate(${F(Math.sin(t * 0.7) * 2)} ${F(Math.cos(t * 0.5) * 2)})`}>
                <path d={RIBBON_D} fill="none" stroke="#3fe8b8" strokeWidth={7} strokeLinecap="round"
                  filter="url(#gM)" opacity={0.9} strokeDasharray={RIBBON_LEN}
                  strokeDashoffset={F(RIBBON_LEN * (1 - smoothstep(CUE.s2b - 0.2, CUE.s2b + 2.4, t)))} />
                <path d={RIBBON_D} fill="none" stroke="#c8fff0" strokeWidth={2} strokeLinecap="round"
                  opacity={0.8} strokeDasharray={RIBBON_LEN}
                  strokeDashoffset={F(RIBBON_LEN * (1 - smoothstep(CUE.s2b - 0.2, CUE.s2b + 2.4, t)))} />
                <circle cx={150} cy={268} r={7} fill="#8ffce0" filter="url(#gS)" />
              </g>

              {/* ref: Krönke J et al. Science 2014 Fig.1 — many substrates are present,
                  only the two CRBN neosubstrates are selectively removed */}
              <g opacity={F(complexFade * 0.6 * (1 - degrade * 0.5))}>
                {BYSTANDER_PROTEINS.map((b, i) => (
                  <circle key={i} cx={F(b.x + Math.sin(t * 1.1 + i) * 1.5)}
                    cy={F(b.y + Math.cos(t * 0.9 + i) * 1.5)} r={b.r} fill="#cfe0ff"
                    opacity={F(0.3 + 0.25 * Math.sin(t * 1.6 + i * 0.7))} />
                ))}
              </g>

              {/* ref: Lu G et al. Science 2014 Fig.1-3 — CRBN-bound targets are
                  ubiquitinated (small tag) and travel to the proteasome for degradation */}
              <g opacity={F(complexFade)}>
                {TARGET_CHAIN.map((p, i) => {
                  const tagged = smoothstep(CUE.s3a - 0.4 + i * 0.06, CUE.s3a + 0.6 + i * 0.06, t);
                  const toProt = smoothstep(CUE.s3b - 0.5, CUE.s3b + 3.5, t);
                  const bx = lerp(p[0] + Math.sin(t * 1.8 + i * 0.5) * 2.2, PROTEASOME_X, toProt);
                  const by = lerp(p[1] + Math.cos(t * 1.5 + i * 0.42) * 2, PROTEASOME_Y, toProt);
                  const op = 1 - smoothstep(0.8, 1, toProt);
                  if (op < 0.01) return null;
                  return (
                    <g key={i} opacity={F(op)}>
                      <circle cx={F(bx)} cy={F(by)} r={F(6 * (1 - toProt * 0.85))}
                        fill={tagged > 0.5 ? 'url(#beadCyan)' : 'url(#beadGold)'} filter="url(#gS)" />
                      {tagged > 0.5 && (
                        <>
                          <circle cx={F(bx + 6)} cy={F(by - 6)} r={1.8} fill="#ffd782"
                            opacity={F(tagged * (1 - toProt))} />
                          <circle cx={F(bx + 9)} cy={F(by - 3)} r={1.4} fill="#ffd782"
                            opacity={F(tagged * (1 - toProt) * 0.8)} />
                        </>
                      )}
                    </g>
                  );
                })}
              </g>
              <Proteasome t={t} />

              <g opacity={F(complexFade * (1 - degrade))}
                transform={`translate(628 268) scale(${(1 + beat * 0.05 - degrade * 0.4).toFixed(3)})`}>
                <g transform={`rotate(${F(t * 11)})`}>
                  {SPIKES.map((d, i) => <path key={i} d={d} fill="url(#spikeGold)" opacity={0.9} />)}
                  <circle r={30} fill="url(#spikeGold)" />
                  <circle r={15.6} fill="rgba(0,0,0,.28)" />
                  <circle r={30} fill="none" stroke="#ffd88a" strokeWidth={1} opacity={0.55} />
                </g>
              </g>
              <path d="M584,246 A56,56 0 0 1 676,242" fill="none" stroke="rgba(255,214,140,.5)"
                strokeWidth={1.1} opacity={F(complexFade * (1 - degrade) * 0.7)} />

              <path d={BRIDGE_L.d} fill="none" stroke="#bfeaff" strokeWidth={1.6} filter="url(#gS)"
                strokeDasharray={BRIDGE_L.len}
                strokeDashoffset={F(BRIDGE_L.len * (1 - smoothstep(CUE.s2b + 1.8, CUE.s2b + 3.6, t)))}
                opacity={F(smoothstep(CUE.s2b + 1.8, CUE.s2b + 3.6, t) * complexFade * (1 - degrade) * 0.9)} />
              <path d={BRIDGE_R.d} fill="none" stroke="#ffd28f" strokeWidth={1.6} filter="url(#gS)"
                strokeDasharray={BRIDGE_R.len}
                strokeDashoffset={F(BRIDGE_R.len * (1 - smoothstep(CUE.s2b + 2.4, CUE.s2b + 4.2, t)))}
                opacity={F(smoothstep(CUE.s2b + 2.4, CUE.s2b + 4.2, t) * complexFade * (1 - degrade) * 0.9)} />
            </>
          )}

          {/* ---- the small molecule ---- */}
          {chemOn > 0.01 && (
            <g opacity={F(chemOn)}
              transform={`translate(${CX} ${F(CY + chemCy)}) scale(${(chemScale * (1 + beat * 0.02)).toFixed(4)}) rotate(${F(Math.sin(t * 0.25) * 2.5)})`}>
              {CHEM.strokes.map((s, i) => (
                <path key={i} d={s.d} fill="none" stroke={chemCol} strokeWidth={s.w}
                  strokeLinejoin="round" strokeLinecap="round" strokeDasharray={s.len}
                  strokeDashoffset={F(s.len * (1 - clamp((chemDraw - i * 0.012) / 0.7, 0, 1)))}
                  filter={gold > 0.3 ? 'url(#gS)' : undefined} />
              ))}
              {CHEM.atoms.map((a, i) => (
                <text key={i} x={a.x} y={a.y} textAnchor="middle" fill="#bfeaff" fontSize={11}
                  fontFamily={FONT} opacity={F(clamp((chemDraw - 0.5) * 3, 0, 1))}>{a.s}</text>
              ))}
              {CHEM.fills.map((d, i) => {
                const a = smoothstep(CUE.s2b + 0.4 + i * 0.5, CUE.s2b + 1.6 + i * 0.5, t) * (1 - smoothstep(80.9, 84.39, t)) * 0.9 +
                  smoothstep(CUE.s4c, CUE.s4c + 1.4, t) * 0.9;
                return <path key={i} d={d} opacity={F(clamp(a, 0, 1))} filter="url(#gS)"
                  fill={gold > 0.3 ? 'rgba(255,232,170,.92)' : 'rgba(255,255,255,.9)'} />;
              })}
            </g>
          )}

          {/* ---- scene 1 mist ---- */}
          {t < 26.38 && MIST.map((m, i) => {
            const p = easeOut(smoothstep(m.t0, m.t0 + 5.2, t));
            if (t < m.t0) return null;
            const op = clamp((p < 0.45 ? p / 0.45 : 1 - (p - 0.45) / 0.55) * 0.85, 0, 1);
            if (op < 0.01) return null;
            return <circle key={i} cx={F(lerp(m.sx, m.tx, p))} cy={F(lerp(m.sy, m.ty, p))}
              r={F(m.r)} fill="#dff0ff" opacity={F(op)} />;
          })}

          {/* ---- scene 2: sources and beams ---- */}
          {t > 20.95 && t < 57.5 && <Sources t={t} />}

          {/* ---- scene 3: fragments + evidence network ---- */}
          {t > CUE.s3a - 1 && t < 86.09 && <Evidence t={t} />}

          {/* ---- scene 4: conformational change ---- */}
          {t > 79.1 && t < 119.33 && <Design t={t} beat={beat} />}

          {/* rings + sparks */}
          {RINGS.map((r: any, i: number) => {
            const d = t - r.t;
            if (d < 0 || d > r.d) return null;
            const q = easeOut(d / r.d);
            return <circle key={i} cx={CX} cy={CY} r={F(q * r.r)} fill="none" stroke={r.c}
              strokeWidth={F(r.w * (1 - q * 0.7))} opacity={F((1 - q) * 0.85)} />;
          })}
          {SPARKS.map((s, i) => {
            const d = t - s.t0;
            if (d < 0 || d > s.life) return null;
            const q = easeOut(d / s.life);
            const [x, y] = polar(s.ox, s.oy, q * s.dist, s.a);
            return <circle key={i} cx={F(x)} cy={F(y)} r={F(s.r)} fill={s.color}
              opacity={F((1 - q) * 0.85)} filter="url(#gS)" />;
          })}

          {/* ---- scene 6 ---- */}
          {t > 154.58 && <Finale t={t} />}

          {/* ---- labels ---- */}
          {LABELS.map((L: any, i: number) => {
            const ap = smoothstep(L.t0, L.t0 + 0.7, t) * (1 - smoothstep(L.t1 - 0.7, L.t1, t));
            if (ap < 0.01) return null;
            return (
              <g key={i} opacity={F(ap * 0.95)}>
                <line x1={L.x} y1={L.y + (L.ay > L.y ? 4 : -6)} x2={L.ax} y2={L.ay}
                  stroke="rgba(220,236,255,.42)" strokeWidth={1} />
                <text x={L.x} y={L.y} textAnchor="middle" fill="rgba(232,242,255,.94)" fontSize={13}
                  letterSpacing="0.06em" fontFamily={FONT}
                  style={{paintOrder: 'stroke', stroke: 'rgba(0,0,0,.55)', strokeWidth: '3px'}}>
                  {SCI_LABELS ? L.sci : L.abs}
                </text>
              </g>
            );
          })}

          {/* ---- citation chip ---- */}
          {cite && (
            <g opacity={F(smoothstep(cite.t0, cite.t0 + 0.6, t) * (1 - smoothstep(cite.t1 - 0.6, cite.t1, t)) * 0.92)}>
              <rect x={22} y={16} width={124} height={24} rx={6} fill="rgba(4,8,20,.55)"
                stroke="rgba(150,196,255,.26)" strokeWidth={1} />
              <text x={84} y={32} textAnchor="middle" fill="rgba(158,208,255,.95)" fontSize={11}
                fontWeight={600} fontFamily={FONT}>{cite.s}</text>
            </g>
          )}
        </g>

        {/* vignette */}
        <rect x={-160} y={-160} width={1120} height={770} fill="url(#vig)" opacity={F(1 - dawn * 0.85)} />
        <defs>
          <radialGradient id="vig" cx="50%" cy="46%" r="72%">
            <stop offset="48%" stopColor="#000" stopOpacity="0" />
            <stop offset="100%" stopColor="#000" stopOpacity="0.72" />
          </radialGradient>
        </defs>

        {/* scene tag */}
        {t < CUE.end && (
          <text x={784} y={26} textAnchor="end" fontSize={10.5} letterSpacing="0.09em" fontFamily={FONT}
            fill={dawn > 0.5 ? 'rgba(40,36,30,.55)' : 'rgba(255,255,255,.45)'}>
            {t < S2 ? 'シーン1・問い' : t < S3 ? 'シーン2・歴史的転換点' : t < S4 ? 'シーン3・エビデンスが世界を変える'
              : t < S5 ? 'シーン4・設計する科学へ' : t < S6 ? 'シーン5・分子機構から免疫へ' : 'シーン6・新時代の幕開け'}
          </text>
        )}

        {/* caption: always one line, scaled to fit */}
        {caption && <Caption t={t} cap={caption} />}
      </svg>

      {/* full-frame flash */}
      <AbsoluteFill style={{backgroundColor: '#fff', opacity: F(flashAt(t)), pointerEvents: 'none'}} />
    </AbsoluteFill>
  );
};

/* ============ scene components ============ */

const Caption: React.FC<{t: number; cap: any}> = ({t, cap}) => {
  const n = cap.t.length;
  const size = Math.min(26, 726 / n);
  const w = n * size + 40;
  let o = 1;
  if (t < cap.s + 0.45) o = (t - cap.s) / 0.45;
  else if (t > cap.e - 0.45) o = (cap.e - t) / 0.45;
  const y = 416;
  return (
    <g opacity={F(clamp(o, 0, 1))}>
      <rect x={F(400 - w / 2)} y={F(y - size * 0.92)} width={F(w)} height={F(size * 1.5)} rx={8}
        fill="rgba(2,4,12,.58)" />
      <text x={400} y={F(y + size * 0.18)} textAnchor="middle" fill="#fff" fontSize={F(size)}
        fontWeight={600} letterSpacing="0.02em" fontFamily={FONT}>{cap.t}</text>
    </g>
  );
};

const Sources: React.FC<{t: number}> = ({t}) => {
  const pts: [number, number][] = [[108, 72], [692, 72], [400, 392]];
  return (
    <>
      {pts.map(([x, y], i) => {
        const ap = smoothstep(CUE.s2a + i * 0.28, CUE.s2a + 0.9 + i * 0.28, t) * (1 - smoothstep(38.32, 41.99, t));
        if (ap < 0.01) return null;
        const hp = smoothstep(CUE.s2a + i * 0.28, CUE.s2a + 1.4 + i * 0.28, t);
        const h2 = (t * 0.55 + i * 0.33) % 1;
        return (
          <g key={i} opacity={F(ap)}>
            <circle cx={x} cy={y} r={22} fill="#bfe4ff" filter="url(#gL)" opacity={0.35} />
            <circle cx={x} cy={y} r={4} fill="#fff" filter="url(#gS)" />
            <circle cx={x} cy={y} r={F(6 + hp * 36)} fill="none" stroke="#cfe8ff" strokeWidth={1.4}
              opacity={F((1 - hp) * 0.8)} />
            <circle cx={x} cy={y} r={F(6 + h2 * 30)} fill="none" stroke="#9fd6ff" strokeWidth={1}
              opacity={F((1 - h2) * 0.4)} />
          </g>
        );
      })}
      {pts.map(([x, y], i) => {
        const mx = (x + CX) / 2, my = (y + CY) / 2;
        const nx = -(CY - y), ny = CX - x, n = Math.hypot(nx, ny) || 1;
        const qx = mx + (nx / n) * 52, qy = my + (ny / n) * 52;
        const d = `M${x},${y} Q${F(qx)},${F(qy)} ${CX},${CY}`;
        const len = Math.hypot(qx - x, qy - y) + Math.hypot(CX - qx, CY - qy);
        const dp = smoothstep(CUE.s2a + 1.1 + i * 0.45, CUE.s2a + 5.9 + i * 0.45, t);
        const op = dp * (1 - smoothstep(36.67, 40.34, t)) * 0.9;
        if (op < 0.01) return null;
        /* comet head with a tapering trail */
        const bez = (u: number): [number, number] => {
          const v = 1 - u;
          return [v * v * x + 2 * v * u * qx + u * u * CX, v * v * y + 2 * v * u * qy + u * u * CY];
        };
        return (
          <g key={'p' + i}>
            <path d={d} fill="none" stroke="#9fd6ff" strokeWidth={1.6} filter="url(#gS)"
              strokeDasharray={F(len)} strokeDashoffset={F(len * (1 - dp))} opacity={F(op)} />
            {dp > 0 && dp < 1 && Array.from({length: 9}, (_, k) => {
              const [bx, by] = bez(clamp(dp - k * 0.018, 0, 1));
              return <circle key={k} cx={F(bx)} cy={F(by)} r={F(Math.max(0.7, 4 - k * 0.42))}
                fill="#fff" opacity={F(0.95 - k * 0.09)} filter="url(#gS)" />;
            })}
          </g>
        );
      })}
    </>
  );
};

const Evidence: React.FC<{t: number}> = ({t}) => {
  const pos = NODES.map((n) => {
    const p = easeOutQuint(smoothstep(n.t0, n.t0 + 3.2, t));
    return [lerp(CX, n.tx, p), lerp(CY, n.ty, p), p] as [number, number, number];
  });
  const lo = smoothstep(CUE.s3b - 1, 71.9, t) * 0.45 * (1 - smoothstep(80, 85.24, t));
  return (
    <>
      {FRAGMENTS.map((f, i) => {
        if (t < f.t0) return null;
        const p = easeOut(smoothstep(f.t0, f.t0 + 3.4, t));
        const op = (1 - p) * 0.85 * (1 - smoothstep(79.1, 84.39, t));
        if (op < 0.01) return null;
        const [x, y] = polar(628, 232, p * f.d, f.a);
        return <circle key={i} cx={F(x)} cy={F(y)} r={F(f.r * (1 - p * 0.5))} fill="url(#beadGold)"
          opacity={F(op)} filter="url(#gS)" />;
      })}
      {lo > 0.01 && NET_PAIRS.map((pr, i) => (
        <line key={i} x1={F(pos[pr.i][0])} y1={F(pos[pr.i][1])} x2={F(pos[pr.j][0])} y2={F(pos[pr.j][1])}
          stroke="#8fc9ff" strokeWidth={0.8} opacity={F(lo * (1 - pr.d / 88))} />
      ))}
      {NODES.map((n, i) => {
        if (t < n.t0) return null;
        const op = clamp(pos[i][2] * (0.5 + 0.45 * Math.sin(t * 3 + i)) * (1 - smoothstep(80, 85.24, t)), 0, 1);
        if (op < 0.01) return null;
        return <circle key={i} cx={F(pos[i][0])} cy={F(pos[i][1])} r={F(n.r)} fill="#dff0ff" opacity={F(op)} />;
      })}
    </>
  );
};

const Design: React.FC<{t: number; beat: number}> = ({t, beat}) => {
  const morph = smoothstep(CUE.s4b + 2.4, CUE.s4b + 6, t);
  const out = 1 - smoothstep(108.11, 112.81, t);
  return (
    <>
      {/* ref: Hansen JD et al. J Med Chem 2020 — iterative screening narrows
          many candidate compounds toward one optimized molecule */}
      {CANDIDATES.map((c, i) => {
        const fadeAt = S4 + 1.2 + i * 1.4;
        const op = smoothstep(S4, S4 + 0.6, t) * (1 - smoothstep(fadeAt, fadeAt + 1.4, t));
        if (op < 0.01) return null;
        return <circle key={i} cx={c.x} cy={c.y} r={4} fill="none" stroke="#ffd782" strokeWidth={1.3}
          opacity={F(op * 0.75)} />;
      })}
      <path d={CONFORM_A} fill="none" stroke="#3fe8b8" strokeWidth={6} strokeLinecap="round" filter="url(#gM)"
        opacity={F(smoothstep(CUE.s4b + 0.6, CUE.s4b + 2, t) * (1 - morph) * 0.9 * out)} />
      <path d={CONFORM_B} fill="none" stroke="#7fe8ff" strokeWidth={6} strokeLinecap="round" filter="url(#gM)"
        opacity={F(morph * 0.9 * out)} />
      {([[-92, 0], [30, 0], [142, 16]] as const).map(([mx, my], i) => {
        const ap = smoothstep(CUE.s4b + 1.2 + i * 0.5, CUE.s4b + 2.2 + i * 0.5, t) *
          (1 - smoothstep(CUE.s4c, CUE.s4c + 1.4, t));
        if (ap < 0.01) return null;
        return <circle key={i} cx={F(CX + mx * 0.92)} cy={F(CY - 56 + my * 0.92)}
          r={F(24 + Math.sin(t * 3 + i) * 3)} fill="none" stroke="#ffd782" strokeWidth={1.3}
          strokeDasharray="4 4" opacity={F(ap * 0.85)} />;
      })}
      <circle cx={CX} cy={CY - 56} r={F(140 + beat * 18)} fill="url(#goldFade)"
        opacity={F(smoothstep(CUE.s4c, 105.57, t) * (1 - smoothstep(110.48, 114.11, t)) * 0.85)} />
    </>
  );
};

/* ref: Lu G et al. Science 2014 Fig.1-3 — the proteasome that receives
   ubiquitinated CRBN neosubstrates (scene 3) */
const Proteasome: React.FC<{t: number}> = ({t}) => {
  const on = smoothstep(S3 - 1, S3 + 2, t) * (1 - smoothstep(S4 - 3, S4, t));
  if (on < 0.01) return null;
  const cyclePos = ((t - CUE.s3b) % 3 + 3) % 3;
  const pulse = clamp(1 - cyclePos / 3, 0, 1) * smoothstep(CUE.s3b, CUE.s3b + 2, t);
  return (
    <g opacity={F(on)} transform={`translate(${PROTEASOME_X} ${PROTEASOME_Y})`}>
      <ellipse cx={0} cy={0} rx={22} ry={30} fill="rgba(20,40,90,.55)" />
      {PROTEASOME_RINGS.map((r, i) => (
        <ellipse key={i} cx={0} cy={r.dy} rx={r.rx} ry={r.ry} fill="none"
          stroke="#7fb6ff" strokeWidth={2.2} opacity={0.7} filter="url(#gS)" />
      ))}
      <circle r={F(9 + pulse * 7)} fill="url(#coreFade)" opacity={F(0.3 + pulse * 0.4)} />
    </g>
  );
};

/* ref: Watson ER et al. Science 2022 Fig.3 — CRBN's open-to-closed
   conformational change locks the neosubstrate in place (scene 5) */
const Clamp: React.FC<{t: number; fade: number}> = ({t, fade}) => {
  const on = smoothstep(S5, S5 + 2.5, t) * (1 - smoothstep(S5 + 15, S5 + 18, t)) * fade;
  if (on < 0.01) return null;
  const closeT = clamp((t - (S5 + 1)) / 11, 0, 1);
  const gap = lerp(44, 2, easeOut(closeT));
  const lockOn = smoothstep(S5 + 9, S5 + 12, t);
  return (
    <g opacity={F(on)} transform={`translate(${CX} ${CY - 74})`}>
      <path d={CLAMP_JAW} fill="none" stroke="#8ff0dc" strokeWidth={5} strokeLinecap="round"
        filter="url(#gM)" transform={`rotate(${F(-gap)})`} opacity={0.9} />
      <path d={CLAMP_JAW} fill="none" stroke="#8ff0dc" strokeWidth={5} strokeLinecap="round"
        filter="url(#gM)" transform={`rotate(${F(180 + gap)})`} opacity={0.9} />
      <circle r={F(6 + lockOn * 3)} fill="url(#beadCyan)" filter="url(#gS)" opacity={F(0.5 + lockOn * 0.5)} />
    </g>
  );
};

const Cells: React.FC<{t: number; beat: number}> = ({t, beat}) => {
  const fade = 1 - smoothstep(157.19, 160.76, t);
  const aOn = smoothstep(CUE.s5a - 0.5, CUE.s5a + 2, t) * fade;
  const bOn = smoothstep(CUE.s5b - 0.5, CUE.s5b + 2, t) * fade;
  const act = smoothstep(CUE.s5b + 1.6, CUE.s5b + 5, t);
  const quiet = smoothstep(CUE.s5a + 2.6, CUE.s5a + 6.6, t);
  const travel = smoothstep(CUE.s5b - 1.2, CUE.s5b + 3.4, t);
  const dA = smoothstep(CUE.s5a + 0.8, CUE.s5a + 4, t);
  const dB = smoothstep(CUE.s5b + 0.4, CUE.s5b + 3.2, t);
  const thP = smoothstep(CUE.s5b + 4, CUE.s5b + 7, t);
  const aScale = 1 + Math.sin(t * 0.8) * 0.012 + beat * 0.012;
  const bScale = 1 + act * 0.05 + Math.sin(t * 1.1) * 0.014 + beat * 0.02;

  return (
    <>
      <Clamp t={t} fade={fade} />

      {/* immune cell */}
      <g opacity={F(aOn)} transform={`translate(242 222) scale(${aScale.toFixed(4)}) translate(-242 -222)`}>
        <circle cx={242} cy={222} r={169} fill="url(#magentaCell)" filter="url(#gL)" opacity={0.5} />
        <circle cx={242} cy={222} r={132} fill="url(#magentaCell)" filter="url(#memA)" />
        <circle cx={242} cy={222} r={135} fill="url(#magentaRim)" filter="url(#memA)" />
        <circle cx={242} cy={222} r={132} fill="none" stroke="#e264d4" strokeWidth={1.4}
          filter="url(#memA)" opacity={0.75} />
      </g>
      {ORGANELLES.map((o, i) => (
        <g key={i} opacity={F(aOn * (0.55 + 0.4 * Math.sin(t * 1.4 + i * 1.3)))}>
          <circle cx={o.x} cy={o.y} r={o.r} fill="none" stroke={o.c} strokeWidth={3} filter="url(#gS)" opacity={0.85} />
          <circle cx={o.x} cy={o.y} r={F(o.r * 0.45)} fill={o.c} opacity={0.35} />
        </g>
      ))}
      {/* target chains inside quietly fade */}
      {INNER_CHAINS.map((chain, ci) => (
        <g key={ci} opacity={F(aOn * (1 - quiet * 0.92))}>
          {chain.map((p, i) => (
            <circle key={i} cx={F(p[0] + Math.sin(t * 1.5 + i * 0.5 + ci) * 2.4)}
              cy={F(p[1] + Math.cos(t * 1.2 + i * 0.42 + ci) * 2.4)}
              r={F(5 * (1 - quiet * 0.55))} fill="url(#beadGold)" filter="url(#gS)" />
          ))}
        </g>
      ))}

      {/* branching light paths */}
      <path d={BRANCH_A.d} fill="none" stroke="#c8b4ff" strokeWidth={2.2} strokeDasharray={F(BRANCH_A_LEN)}
        strokeDashoffset={F(BRANCH_A_LEN * (1 - dA))} opacity={F(dA * 0.85 * fade)} />
      <path d={BRANCH_B.d} fill="none" stroke="#7fe8dc" strokeWidth={2.2} strokeDasharray={F(BRANCH_B_LEN)}
        strokeDashoffset={F(BRANCH_B_LEN * (1 - dB))} opacity={F(dB * 0.85 * fade)} />

      {/* T cells */}
      <g opacity={F(bOn)} transform={`translate(590 206) scale(${bScale.toFixed(4)}) translate(-590 -206)`}>
        <circle cx={590} cy={206} r={148} fill="url(#cyanCell)" filter="url(#gL)"
          opacity={F(0.4 + act * 0.45 + beat * 0.12)} />
        <circle cx={590} cy={206} r={116} fill="url(#cyanCell)" filter="url(#memB)" />
        <circle cx={590} cy={206} r={114} fill="#0d5a86" filter="url(#grain)" opacity={F(0.42 + act * 0.3)} />
        <circle cx={590} cy={206} r={118} fill="url(#cyanRim)" filter="url(#memB)" />
        <circle cx={590} cy={206} r={116} fill="none" stroke="#8ff0ff" strokeWidth={1.4}
          filter="url(#memB)" opacity={F(0.5 + act * 0.45)} />
      </g>
      {/* ref: Chiu H et al. Blood 2026 Fig.7 — exhausted T cells (dim, low
          reactivity) are reinvigorated once CRBN degrades IKZF1/3: a
          before/after contrast rather than the cells simply appearing */}
      {T_CELLS.map((c, i) => {
        const exOn = smoothstep(S5 + 1, S5 + 3, t) * (1 - smoothstep(CUE.s5b - 0.3, CUE.s5b + 0.8, t)) * fade;
        const ap = smoothstep(CUE.s5b + 0.8 + i * 0.4, CUE.s5b + 2.4 + i * 0.4, t) * fade;
        const a2 = smoothstep(CUE.s5b + 2 + i * 0.35, CUE.s5b + 4.5 + i * 0.35, t);
        const hp = (t * 0.6 + i * 0.4) % 1, hp2 = (t * 0.6 + i * 0.4 + 0.5) % 1;
        return (
          <g key={i}>
            {exOn > 0.01 && (
              <circle cx={c.x} cy={c.y} r={F(c.r * 0.82)} fill="rgba(110,116,128,.12)"
                stroke="#6a7280" strokeWidth={1.1} strokeDasharray="3 3" opacity={F(exOn)} />
            )}
            {ap > 0.01 && (
              <g opacity={F(ap)}>
                <circle cx={c.x} cy={c.y} r={c.r} fill="rgba(80,220,190,.15)" stroke="#6fe6cd" strokeWidth={1.6} />
                <circle cx={c.x} cy={c.y} r={F(c.r + hp * 24)} fill="none" stroke="#b6fff0" strokeWidth={1.8}
                  opacity={F(a2 * (1 - hp) * 0.8)} />
                <circle cx={c.x} cy={c.y} r={F(c.r + hp2 * 24)} fill="none" stroke="#8ff0dc" strokeWidth={1.1}
                  opacity={F(a2 * (1 - hp2) * 0.45)} />
                <circle cx={c.x} cy={c.y} r={F(c.r * 0.42)} fill="rgba(190,255,240,.5)" filter="url(#gS)"
                  opacity={F(0.35 + a2 * 0.5 + beat * 0.12)} />
              </g>
            )}
          </g>
        );
      })}
      {T_THREADS.map((th, i) => (
        <path key={i} d={th.d} fill="none" stroke="#bff3e4" strokeWidth={1.2} strokeDasharray={F(th.len)}
          strokeDashoffset={F(th.len * (1 - thP))} opacity={F(thP * 0.75 * fade)} />
      ))}

      {/* travelling signal */}
      <g opacity={F(fade)}>
        {SIGNAL_CHAIN.map((p, i) => {
          const u = i / (SIGNAL_CHAIN.length - 1);
          const on = clamp((travel - u) * 6, 0, 1);
          if (on < 0.01) return null;
          return <circle key={i} cx={F(p[0] + Math.sin(t * 2 + i * 0.6) * 1.6)}
            cy={F(p[1] + Math.cos(t * 1.7 + i * 0.5) * 1.6)} r={3.6} fill="url(#beadCyan)"
            filter="url(#gS)" opacity={F(on * (0.55 + 0.45 * Math.sin(t * 4 - i * 0.7)))} />;
        })}
      </g>
    </>
  );
};

const Finale: React.FC<{t: number}> = ({t}) => {
  const ro = smoothstep(CUE.s6c, CUE.s6c + 2.2, t) * (1 - smoothstep(174.91, 176.61, t));
  const et = smoothstep(CUE.end + 0.3, CUE.end + 1.8, t);
  const VPY = CY - 6;
  return (
    <>
      {STREAKS.map((s, i) => {
        const p = smoothstep(CUE.s6a + s.delay, CUE.s6a + 2.6 + s.delay, t);
        if (p >= 1 || p <= 0) return null;
        const r0 = lerp(540, 90, easeOut(p));
        const [x1, y1] = polar(CX, CY, r0 + s.len, s.a);
        const [x2, y2] = polar(CX, CY, r0, s.a);
        return <line key={i} x1={F(x1)} y1={F(y1)} x2={F(x2)} y2={F(y2)} stroke={s.color}
          strokeWidth={2.4} opacity={F(p * 0.85)} filter="url(#gS)" />;
      })}
      <circle cx={CX} cy={CY} r={F(smoothstep(CUE.s6b, CUE.s6b + 4.5, t) * 580)} fill="url(#dawnFade)"
        opacity={F(smoothstep(CUE.s6b, CUE.s6b + 0.7, t) * (1 - smoothstep(CUE.s6b + 3, 175.47, t) * 0.55))} />
      {ro > 0.01 && (
        <g opacity={F(ro)}>
          <path d={`M110,470 L${CX - 10},${VPY} L${CX + 10},${VPY} L690,470 Z`} fill="rgba(255,246,220,.17)" />
          <line x1={110} y1={470} x2={CX - 8} y2={VPY} stroke="rgba(255,238,190,.55)" strokeWidth={2} />
          <line x1={690} y1={470} x2={CX + 8} y2={VPY} stroke="rgba(255,238,190,.55)" strokeWidth={2} />
          {Array.from({length: 5}, (_, i) => {
            const q = ((t - CUE.s6c) * 0.19 + i * 0.17) % 1;
            const ez = Math.pow(q, 1.7);
            const op = ro * (q < 0.06 ? q / 0.06 : 1) * (q > 0.9 ? (1 - q) / 0.1 : 1);
            const tr = `translate(${F(lerp(400 + (i - 2) * 120, CX, ez))} ${F(lerp(462, VPY, ez))}) scale(${lerp(1.25, 0.12, ez).toFixed(3)})`;
            return (
              <g key={i} transform={tr} opacity={F(op)}>
                {i === 0 && [0, 60, 120, 180, 240, 300].map((a, k, arr) => {
                  const [x1, y1] = polar(0, 0, 11, a);
                  const [x2, y2] = polar(0, 0, 11, arr[(k + 1) % arr.length]);
                  return <line key={k} x1={F(x1)} y1={F(y1)} x2={F(x2)} y2={F(y2)} stroke="#fff4d8" strokeWidth={1.6} />;
                })}
                {(i === 1 || i === 3) && Array.from({length: 7}, (_, k) => {
                  const [x, y] = polar(0, 0, 4 + ((k * 37) % 9), k * 51);
                  return <circle key={k} cx={F(x)} cy={F(y)} r={1.8} fill="#fff8e4" />;
                })}
                {i === 2 && <><circle r={10} fill="none" stroke="#fff4d8" strokeWidth={1.8} />
                  <circle r={4} fill="rgba(255,248,228,.7)" /></>}
                {i === 4 && <path d="M-12,6 Q0,-10 12,4" fill="none" stroke="#fff4d8" strokeWidth={1.8} />}
              </g>
            );
          })}
        </g>
      )}
      {et > 0.01 && (
        <g opacity={F(et)}>
          <text x={CX} y={CY + 14} textAnchor="middle" fill="#2b2620" fontSize={F(46 * lerp(0.94, 1, et))}
            fontWeight={700} letterSpacing="0.08em" fontFamily={FONT}>{END_TITLE}</text>
          <line x1={CX - 90} y1={CY + 42} x2={CX + 90} y2={CY + 42} stroke="rgba(60,52,40,.35)"
            strokeWidth={1.4} opacity={F(et * 0.8)} />
        </g>
      )}
    </>
  );
};
