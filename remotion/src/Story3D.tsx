import React, {useMemo} from 'react';
import * as THREE from 'three';
import {AbsoluteFill, Audio, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
// @ts-ignore - plain ESM module shared with the music renderer
import {CAPTIONS, CITES, CUE, DURATION, LABELS, S2, S3, S4, S5, S6, clamp, lerp, smoothstep} from './timeline.mjs';
import {Starfield} from './three/Starfield';
import {Molecule} from './three/Molecule';
import {Ribbon} from './three/Ribbon';
import {SpikySphere} from './three/SpikySphere';
import {Proteasome} from './three/Proteasome';
import {Cell} from './three/Cell';
import {Clamp} from './three/Clamp';
import {Beacons} from './three/Beacons';
import {CameraRig, makeCameraRig} from './three/CameraRig';
import {COL} from './three/palette';

const FONT = '"Hiragino Sans","Noto Sans JP",system-ui,sans-serif';
const END_TITLE = 'CELMoD はこうして生まれた';
const SCI_LABELS = true;

const rig = makeCameraRig([
  {t: 0, pos: [0, 0, 7.2], look: [0, 0, 0], fov: 34},
  {t: S2 - 2, pos: [0, 0, 6.6], look: [0, 0, 0], fov: 34},
  {t: S2, pos: [0, 1, 12], look: [0, -0.2, 0], fov: 46},
  {t: S3 - 2, pos: [0, 0.4, 9], look: [0, -0.3, 0], fov: 42},
  {t: S3, pos: [-0.4, 0.1, 7.6], look: [0.1, -0.5, 0], fov: 36},
  {t: S4 - 2, pos: [-0.2, 0, 7.4], look: [0.1, -0.8, 0], fov: 36},
  {t: S4, pos: [0, 0.3, 6.2], look: [0, 0, 0], fov: 32},
  {t: S5 - 2, pos: [0, 0, 6], look: [0, 0, 0], fov: 32},
  {t: S5, pos: [0, 0, 10.5], look: [0, 0.6, 0], fov: 45},
  {t: S6 - 2, pos: [0, 0, 10], look: [0, 0.6, 0], fov: 45},
  {t: S6, pos: [0, 0.5, 15], look: [0, 0, 0], fov: 50},
  {t: DURATION, pos: [0, 1.2, 19], look: [0, 0, 0], fov: 54},
]);

const F = (n: number) => Number(n.toFixed(3));

const Scene: React.FC<{t: number}> = ({t}) => {
  const dawn = smoothstep(CUE.s6b, DURATION - 2, t);
  const bg = useMemo(() => {
    const c = new THREE.Color('#050814');
    c.lerp(new THREE.Color('#0a1130'), smoothstep(S2 - 2, S2 + 2, t));
    c.lerp(new THREE.Color('#1a0f3a'), smoothstep(S3 - 2, S3 + 2, t));
    c.lerp(new THREE.Color('#08222a'), smoothstep(S4 - 2, S4 + 2, t));
    c.lerp(new THREE.Color('#20102f'), smoothstep(S5 - 2, S5 + 2, t));
    c.lerp(new THREE.Color('#fff2d8'), dawn);
    return c;
  }, [t]);

  /* scene windows */
  const s1On = 1 - smoothstep(S2 - 1, S2, t);
  const s2On = smoothstep(S2 - 1, S2 + 1, t) * (1 - smoothstep(S3 - 1, S3, t));
  const s3On = smoothstep(S3 - 1, S3 + 1, t) * (1 - smoothstep(S4 - 1, S4, t));
  const s4On = smoothstep(S4 - 1, S4 + 1, t) * (1 - smoothstep(S5 - 1, S5, t));
  const s5On = smoothstep(S5 - 1, S5 + 1, t) * (1 - smoothstep(S6 - 1, S6, t));
  const s6On = smoothstep(S6 - 1, S6 + 1, t);

  return (
    <>
      <color attach="background" args={[bg]} />
      <fog attach="fog" args={[bg, 5, 20]} />
      <ambientLight intensity={0.3 + dawn * 0.5} color={dawn > 0.3 ? '#fff2d8' : '#8fa8ff'} />
      <pointLight position={[4, 3, 5]} intensity={30 + dawn * 40} color={dawn > 0.3 ? '#fff2d8' : '#8fd8ff'} />
      <pointLight position={[-4, -2, 3]} intensity={18} color="#ffb347" />
      <Starfield color={dawn > 0.3 ? '#fff2d8' : '#cfe4ff'} />

      {/* ref: scene 1 — molecule assembling out of the dark, no literal figure */}
      {s1On > 0.01 && (
        <group visible={s1On > 0.01}>
          <Molecule progress={clamp((t - CUE.s1b) / 6, 0, 1)} scale={1.1} />
        </group>
      )}

      {/* ref: scene 2 — three independent teams converging on the same answer */}
      {s2On > 0.01 && (
        <group>
          <Beacons progress={clamp((t - CUE.s2a) / 6, 0, 1)} />
        </group>
      )}

      {/* ref: Lu G et al. Science 2014 Fig.1-3 — CRBN binds the drug, recruits
          Aiolos/Ikaros, which are ubiquitinated and sent to the proteasome */}
      {s3On > 0.01 && <Scene3 t={t} opacity={s3On} />}

      {/* ref: Hansen JD et al. J Med Chem 2020 — candidate compounds narrow
          toward one optimized molecule (CC-220 -> Mezigdomide) */}
      {s4On > 0.01 && <Scene4 t={t} opacity={s4On} />}

      {/* ref: Watson ER et al. Science 2022 Fig.3 (CRBN open/closed) +
          Chiu H et al. Blood 2026 Fig.7 (T-cell reinvigoration) */}
      {s5On > 0.01 && <Scene5 t={t} opacity={s5On} />}

      {s6On > 0.01 && (
        <mesh scale={2 + dawn * 10}>
          <sphereGeometry args={[1, 24, 24]} />
          <meshBasicMaterial color="#fff2d8" transparent opacity={dawn * 0.18} />
        </mesh>
      )}
    </>
  );
};

const Scene3: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const degrade = smoothstep(CUE.s3a + 0.4, CUE.s3a + 4.2, t);
  const toProt = smoothstep(CUE.s3b - 0.5, CUE.s3b + 3.5, t);
  const beadStart = new THREE.Vector3(2.6, 0, 0);
  const beadEnd = new THREE.Vector3(2.6, -1.9, 0);
  const beads = [0, 1, 2, 3, 4, 5];
  return (
    <group>
      <group position={[-2.3, 0.3, 0]}>
        <Ribbon points={[[0, -0.9, -0.2], [0.35, -0.1, 0.4], [-0.15, 0.9, 0.15], [0.4, 1.7, -0.2]]}
          reveal={clamp((t - (CUE.s2b - 0.2)) / 2.6, 0, 1)} color={COL.scaffold} />
      </group>
      <group position={[0, 0.15, 0]}>
        <Molecule progress={1} scale={0.95} />
      </group>
      <group position={beadStart.toArray()} scale={1 - degrade * 0.25}>
        <SpikySphere radius={0.55} color={COL.target} opacity={1 - toProt * 0.6} />
      </group>
      <group position={beadEnd.toArray()}>
        <Proteasome pulse={clamp(1 - (((t - CUE.s3b) % 3) + 3) % 3 / 3, 0, 1) * smoothstep(CUE.s3b, CUE.s3b + 2, t)} />
      </group>
      {beads.map((i) => {
        const tagged = smoothstep(CUE.s3a - 0.2 + i * 0.15, CUE.s3a + 0.8 + i * 0.15, t);
        const ang = (i / beads.length) * Math.PI * 2;
        const local = new THREE.Vector3(Math.cos(ang) * 0.4, Math.sin(ang) * 0.4, Math.sin(ang * 2) * 0.2);
        const from = beadStart.clone().add(local);
        const pos = from.clone().lerp(beadEnd, toProt);
        const op = 1 - smoothstep(0.82, 1, toProt);
        if (op < 0.01) return null;
        return (
          <group key={i}>
            <mesh position={pos.toArray()} scale={0.13 * (1 - toProt * 0.6)}>
              <sphereGeometry args={[1, 14, 14]} />
              <meshStandardMaterial color={tagged > 0.5 ? '#7fe0ff' : COL.tag}
                emissive={tagged > 0.5 ? '#7fe0ff' : COL.tag} emissiveIntensity={0.9} transparent opacity={op} />
            </mesh>
            {tagged > 0.5 && (
              <mesh position={[pos.x + 0.14, pos.y + 0.1, pos.z]} scale={0.05}>
                <sphereGeometry args={[1, 10, 10]} />
                <meshStandardMaterial color={COL.tag} emissive={COL.tag} emissiveIntensity={1}
                  transparent opacity={op * tagged} />
              </mesh>
            )}
          </group>
        );
      })}
    </group>
  );
};

const Scene4: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const CANDIDATES = 6;
  return (
    <group position={[0, 0, 0]}>
      <Molecule progress={1} scale={1.15} />
      {Array.from({length: CANDIDATES}, (_, i) => {
        const fadeAt = S4 + 1.2 + i * 1.4;
        const op = smoothstep(S4, S4 + 0.6, t) * (1 - smoothstep(fadeAt, fadeAt + 1.4, t));
        if (op < 0.01) return null;
        const ang = (i / CANDIDATES) * Math.PI * 2 + t * 0.15;
        const r = 2.1;
        return (
          <mesh key={i} position={[Math.cos(ang) * r, Math.sin(ang) * r * 0.6, Math.sin(ang * 1.7) * 1.2]} scale={0.12}>
            <icosahedronGeometry args={[1, 0]} />
            <meshStandardMaterial color={COL.gold} emissive={COL.gold} emissiveIntensity={0.7}
              wireframe transparent opacity={op * 0.85} />
          </mesh>
        );
      })}
    </group>
  );
};

const Scene5: React.FC<{t: number; opacity: number}> = ({t, opacity}) => {
  const aOn = smoothstep(CUE.s5a - 0.5, CUE.s5a + 2, t);
  const bOn = smoothstep(CUE.s5b - 0.5, CUE.s5b + 2, t);
  const exOn = smoothstep(S5 + 1, S5 + 3, t) * (1 - smoothstep(CUE.s5b - 0.3, CUE.s5b + 0.8, t));
  const closeT = clamp((t - (S5 + 1)) / 11, 0, 1);
  const lockOn = smoothstep(S5 + 9, S5 + 12, t);
  const clampOn = smoothstep(S5, S5 + 2.5, t) * (1 - smoothstep(S5 + 15, S5 + 18, t));

  return (
    <group>
      <group position={[-3.4, -0.3, -1]}>
        <Cell radius={1.9} color={COL.cellA} opacity={aOn} />
      </group>
      <group position={[3.4, -0.2, -1]}>
        <Cell radius={1.7} color={COL.cellB} opacity={exOn * 0.4 + bOn * 0.9} />
      </group>
      {clampOn > 0.01 && (
        <group position={[0, 1.5, 1]} scale={0.9}>
          <Clamp closeAngle={lerp(0.9, 0.05, closeT * closeT)} lockOn={lockOn} color={COL.scaffold} radius={0.85} />
        </group>
      )}
    </group>
  );
};

const Caption: React.FC<{cap: {s: number; e: number; t: string}; t: number}> = ({cap, t}) => {
  let o = 1;
  if (t < cap.s + 0.45) o = (t - cap.s) / 0.45;
  else if (t > cap.e - 0.45) o = (cap.e - t) / 0.45;
  return (
    <div style={{
      position: 'absolute', left: '6%', right: '6%', bottom: '9%', textAlign: 'center',
      opacity: clamp(o, 0, 1), pointerEvents: 'none',
    }}>
      <span style={{
        background: 'rgba(2,4,12,.6)', color: '#fff', fontFamily: FONT, fontWeight: 600,
        fontSize: 'clamp(15px,3.4vw,30px)', padding: '0.35em 0.7em', borderRadius: 8, boxDecorationBreak: 'clone',
        WebkitBoxDecorationBreak: 'clone', lineHeight: 1.5,
      }}>{cap.t}</span>
    </div>
  );
};

export const Story3D: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  const caption = CAPTIONS.find((c: any) => t > c.s && t < c.e);
  const cite = CITES.find((c: any) => t > c.t0 && t < c.t1);
  const label = LABELS.find((l: any) => t > l.t0 && t < l.t1);
  const et = smoothstep(CUE.end + 0.3, CUE.end + 2, t);
  const sceneName = t < S2 ? 'シーン1・謎' : t < S3 ? 'シーン2・同じ年、別々の場所' : t < S4 ? 'シーン3・答えが見つかった'
    : t < S5 ? 'シーン4・二つの道' : t < S6 ? 'シーン5・二つの効果' : 'シーン6・新しい時代';
  const dawn = smoothstep(CUE.s6b, DURATION - 2, t);
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <Audio src={staticFile('score.wav')} />
      <ThreeCanvas width={width} height={height}>
        <CameraRig t={t} rig={rig} />
        <Scene t={t} />
      </ThreeCanvas>

      {/* CSS-only vignette + film grain — a WebGL EffectComposer pass here
          proved unreliable (intermittent full-black frames under this
          environment's software renderer) even with a single bare effect,
          so cinematic grading is faked with 2D overlays instead. */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 46%, transparent 42%, rgba(0,0,0,${0.5 - dawn * 0.22}) 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.05, mixBlendMode: 'overlay',
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>\")",
        backgroundSize: '180px 180px',
      }} />

      {t < CUE.end && (
        <div style={{
          position: 'absolute', top: 22, right: 28, color: 'rgba(255,255,255,.5)',
          fontFamily: FONT, fontSize: 13, letterSpacing: '0.08em',
        }}>{sceneName}</div>
      )}

      {label && (
        <div style={{
          position: 'absolute', left: 28, bottom: '17%', color: 'rgba(232,242,255,.92)',
          fontFamily: FONT, fontSize: 15, letterSpacing: '0.04em', textShadow: '0 1px 6px rgba(0,0,0,.8)',
          opacity: clamp(smoothstep(label.t0, label.t0 + 0.6, t) * (1 - smoothstep(label.t1 - 0.6, label.t1, t)), 0, 1),
        }}>{SCI_LABELS ? label.sci : label.abs}</div>
      )}

      {cite && (
        <div style={{
          position: 'absolute', top: 20, left: 28, color: 'rgba(158,208,255,.95)',
          fontFamily: FONT, fontSize: 13, fontWeight: 600, background: 'rgba(4,8,20,.55)',
          padding: '6px 14px', borderRadius: 6, border: '1px solid rgba(150,196,255,.26)',
          opacity: clamp(smoothstep(cite.t0, cite.t0 + 0.6, t) * (1 - smoothstep(cite.t1 - 0.6, cite.t1, t)), 0, 1),
        }}>{cite.s}</div>
      )}

      {caption && <Caption cap={caption} t={t} />}

      {et > 0.01 && (
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: F(et),
        }}>
          <div style={{color: '#2b2620', fontFamily: FONT, fontWeight: 700, fontSize: 52, letterSpacing: '0.08em'}}>
            {END_TITLE}
          </div>
        </div>
      )}
    </AbsoluteFill>
  );
};
