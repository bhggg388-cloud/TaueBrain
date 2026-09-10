import React from 'react';

/* Two partial-torus jaws that rotate from open to closed around a locked
   bead — CRBN's open -> closed conformational change (Watson et al.
   Science 2022 Fig.3). `closeAngle` in radians: how far each jaw has
   rotated from its open position toward 0 (closed). */
export const Clamp: React.FC<{
  closeAngle: number;
  lockOn: number;
  color: string;
  radius?: number;
}> = ({closeAngle, lockOn, color, radius = 0.9}) => {
  return (
    <group>
      <mesh rotation={[0, 0, -closeAngle]}>
        <torusGeometry args={[radius, 0.06, 12, 40, Math.PI * 0.74]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9}
          roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh rotation={[0, 0, Math.PI + closeAngle]}>
        <torusGeometry args={[radius, 0.06, 12, 40, Math.PI * 0.74]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.9}
          roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh scale={0.5 + lockOn * 0.25}>
        <sphereGeometry args={[0.22, 20, 20]} />
        <meshStandardMaterial color="#bfe4ff" emissive="#bfe4ff" emissiveIntensity={0.5 + lockOn * 1.2} />
      </mesh>
    </group>
  );
};
