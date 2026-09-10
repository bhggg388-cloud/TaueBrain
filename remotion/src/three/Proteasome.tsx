import React from 'react';
import {COL} from './palette';

/* The proteasome barrel that receives ubiquitinated targets. */
export const Proteasome: React.FC<{opacity?: number; pulse?: number}> = ({opacity = 1, pulse = 0}) => {
  return (
    <group>
      <mesh>
        <cylinderGeometry args={[0.5, 0.5, 1.1, 8, 1, true]} />
        <meshStandardMaterial color="#16294f" emissive={COL.proteasome} emissiveIntensity={0.25}
          roughness={0.55} metalness={0.4} transparent opacity={opacity * 0.92} side={2} />
      </mesh>
      {[-0.42, -0.14, 0.14, 0.42].map((y, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.5, 0.045, 10, 24]} />
          <meshStandardMaterial color={COL.proteasome} emissive={COL.proteasome} emissiveIntensity={0.8}
            roughness={0.3} transparent opacity={opacity} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[0.16 + pulse * 0.1, 16, 16]} />
        <meshStandardMaterial color="#bfe4ff" emissive="#bfe4ff"
          emissiveIntensity={0.6 + pulse * 1.2} transparent opacity={(0.35 + pulse * 0.4) * opacity} />
      </mesh>
    </group>
  );
};
