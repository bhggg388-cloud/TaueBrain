import React, {useMemo} from 'react';
import * as THREE from 'three';

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* An icosphere studded with small cones — the target protein
   (Aiolos/Ikaros) / a generic "spiky particle". Deterministic layout so
   parallel render workers stay pixel-identical. */
export const SpikySphere: React.FC<{
  radius?: number;
  color: string;
  spikes?: number;
  opacity?: number;
}> = ({radius = 0.55, color, spikes = 22, opacity = 1}) => {
  const spikePositions = useMemo(() => {
    const rnd = mulberry32(7331);
    const pts: {pos: THREE.Vector3; quat: THREE.Quaternion}[] = [];
    for (let i = 0; i < spikes; i++) {
      const u = rnd(), v = rnd();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const dir = new THREE.Vector3(
        Math.sin(phi) * Math.cos(theta),
        Math.sin(phi) * Math.sin(theta),
        Math.cos(phi),
      );
      const pos = dir.clone().multiplyScalar(radius);
      const quat = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      pts.push({pos, quat});
    }
    return pts;
  }, [radius, spikes]);

  return (
    <group>
      <mesh>
        <icosahedronGeometry args={[radius * 0.92, 3]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.55}
          roughness={0.4} metalness={0.15} transparent opacity={opacity} />
      </mesh>
      {spikePositions.map((s, i) => (
        <mesh key={i} position={s.pos} quaternion={s.quat}>
          <coneGeometry args={[radius * 0.16, radius * 0.5, 8]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.7}
            roughness={0.35} transparent opacity={opacity} />
        </mesh>
      ))}
    </group>
  );
};
