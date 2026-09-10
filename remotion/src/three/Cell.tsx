import React from 'react';
import * as THREE from 'three';
import {MeshDistortMaterial} from '@react-three/drei';

/* A large organic cell membrane: a distorted sphere body plus a thin,
   brighter rim shell (cheap fresnel-style glow via additive blending). */
export const Cell: React.FC<{
  radius?: number;
  color: string;
  opacity?: number;
  distort?: number;
}> = ({radius = 1.6, color, opacity = 1, distort = 0.32}) => {
  if (opacity < 0.01) return null;
  return (
    <group>
      <mesh>
        <sphereGeometry args={[radius, 48, 48]} />
        <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.35}
          roughness={0.5} metalness={0.05} distort={distort} speed={0.6}
          transparent opacity={opacity * 0.4} />
      </mesh>
      <mesh scale={1.02}>
        <sphereGeometry args={[radius, 48, 48]} />
        <meshBasicMaterial color={color} transparent opacity={opacity * 0.5}
          side={THREE.BackSide} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
};
