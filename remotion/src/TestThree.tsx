import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {ThreeCanvas} from '@remotion/three';
import {Starfield} from './three/Starfield';
import {Molecule} from './three/Molecule';
import {Ribbon} from './three/Ribbon';
import {SpikySphere} from './three/SpikySphere';
import {Proteasome} from './three/Proteasome';
import {Cell} from './three/Cell';
import {Clamp} from './three/Clamp';
import {PostFX} from './three/PostFX';
import {COL} from './three/palette';

const Scene: React.FC<{t: number}> = ({t}) => {
  return (
    <>
      <color attach="background" args={[COL.bg]} />
      <fog attach="fog" args={[COL.bg, 4, 16]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[3, 2, 4]} intensity={35} color="#8fd8ff" />
      <pointLight position={[-3, -1.5, 3]} intensity={22} color="#ffb347" />
      <Starfield />

      <group position={[-2.4, 0.3, 0]}>
        <Ribbon points={[[0, -0.8, 0], [0.3, 0, 0.4], [-0.2, 0.9, 0.2], [0.4, 1.6, -0.1]]}
          reveal={1} color={COL.scaffold} />
      </group>

      <group position={[0, 0.2, 0]}>
        <Molecule progress={1} scale={1.2} />
      </group>

      <group position={[2.6, 0, 0]}>
        <SpikySphere radius={0.6} color={COL.target} />
      </group>
      <group position={[2.6, -1.6, 0]}>
        <Proteasome pulse={(Math.sin(t * 2) + 1) / 2} />
      </group>

      <group position={[-4.6, -2.4, -2]}>
        <Cell radius={1.4} color={COL.cellA} opacity={0.8} />
      </group>
      <group position={[4.6, 2.2, -2]}>
        <Clamp closeAngle={(Math.sin(t * 0.8) * 0.5 + 0.5) * 1.2} lockOn={0.6} color={COL.cellB} radius={0.7} />
      </group>

      <PostFX />
    </>
  );
};

export const TestThree: React.FC = () => {
  const frame = useCurrentFrame();
  const {fps, width, height} = useVideoConfig();
  const t = frame / fps;
  return (
    <AbsoluteFill style={{backgroundColor: '#000'}}>
      <ThreeCanvas width={width} height={height} camera={{position: [0, 0, 6.5], fov: 38}}>
        <Scene t={t} />
      </ThreeCanvas>
    </AbsoluteFill>
  );
};
