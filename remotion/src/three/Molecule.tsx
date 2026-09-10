import React, {useMemo} from 'react';
import * as THREE from 'three';
import {COL} from './palette';

/* Procedural ball-and-stick molecule. Not a real CELMoD structure — a
   stylised skeleton, same disclaimer as the 2D version. */
const ATOMS: [number, number, number][] = [
  [-1.6, 0.2, 0], [-0.9, -0.3, 0.2], [-0.2, 0.3, -0.1], [0.3, -0.4, 0.3],
  [1.0, 0.1, 0], [1.6, -0.3, -0.3], [0.9, 0.9, 0.2], [1.8, 0.6, 0.5],
];
const BONDS: [number, number][] = [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [4, 6], [6, 7]];

function bondTransform(a: THREE.Vector3, b: THREE.Vector3) {
  const mid = a.clone().add(b).multiplyScalar(0.5);
  const dir = b.clone().sub(a);
  const len = dir.length();
  const quat = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    dir.clone().normalize(),
  );
  return {mid, len, quat};
}

export const Molecule: React.FC<{progress: number; scale?: number; color?: string}> = ({
  progress,
  scale = 1,
  color = COL.molecule,
}) => {
  const n = ATOMS.length;
  const atomOn = ATOMS.map((_, i) => THREE.MathUtils.clamp((progress * n - i) * 2, 0, 1));
  const bondOn = BONDS.map(([a, b], i) =>
    THREE.MathUtils.clamp((progress * BONDS.length - i) * 2 - 0.3, 0, 1),
  );

  const bondData = useMemo(
    () => BONDS.map(([a, b]) => bondTransform(new THREE.Vector3(...ATOMS[a]), new THREE.Vector3(...ATOMS[b]))),
    [],
  );

  return (
    <group scale={scale}>
      {ATOMS.map((p, i) => (
        <mesh key={i} position={p} scale={atomOn[i]}>
          <sphereGeometry args={[0.16, 20, 20]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.1}
            roughness={0.25} metalness={0.1} transparent opacity={0.95} />
        </mesh>
      ))}
      {BONDS.map(([a, b], i) => {
        const {mid, len, quat} = bondData[i];
        return (
          <mesh key={i} position={mid} quaternion={quat} scale={[1, bondOn[i], 1]}>
            <cylinderGeometry args={[0.045, 0.045, len, 10]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.5}
              roughness={0.4} transparent opacity={0.85} />
          </mesh>
        );
      })}
    </group>
  );
};
