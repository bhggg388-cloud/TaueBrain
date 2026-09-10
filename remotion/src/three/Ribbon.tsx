import React, {useMemo} from 'react';
import * as THREE from 'three';
import {MeshDistortMaterial} from '@react-three/drei';

/* A tube along a hand-placed spline — the CRBN scaffold / a protein
   ribbon. `reveal` (0-1) progressively draws the tube along its length. */
export const Ribbon: React.FC<{
  points: [number, number, number][];
  reveal: number;
  color: string;
  radius?: number;
  distort?: number;
}> = ({points, reveal, color, radius = 0.09, distort = 0.15}) => {
  const curve = useMemo(() => new THREE.CatmullRomCurve3(points.map((p) => new THREE.Vector3(...p))), [points]);
  const geometry = useMemo(() => {
    const segs = Math.max(2, Math.round(120 * THREE.MathUtils.clamp(reveal, 0.02, 1)));
    const sub = new THREE.CatmullRomCurve3(
      curve.getPoints(140).slice(0, Math.max(2, Math.round(140 * THREE.MathUtils.clamp(reveal, 0.02, 1)))),
    );
    return new THREE.TubeGeometry(sub, segs, radius, 12, false);
  }, [curve, reveal, radius]);

  if (reveal < 0.01) return null;
  return (
    <mesh geometry={geometry}>
      <MeshDistortMaterial color={color} emissive={color} emissiveIntensity={0.9}
        roughness={0.3} metalness={0.1} distort={distort} speed={1.4} transparent opacity={0.95} />
    </mesh>
  );
};
