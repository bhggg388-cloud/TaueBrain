import React, {useMemo} from 'react';
import * as THREE from 'three';

/* Three light sources (research teams) with comet trails converging on
   the origin — reused concept from the 2D "Sources" scene. */
const POINTS: [number, number, number][] = [[-4.2, 2.4, -1], [4.2, 2.6, -1.5], [0, -3.2, 0.5]];

export const Beacons: React.FC<{progress: number; color?: string}> = ({progress, color = '#bfe4ff'}) => {
  const lines = useMemo(
    () =>
      POINTS.map((p) => {
        const curve = new THREE.QuadraticBezierCurve3(
          new THREE.Vector3(...p),
          new THREE.Vector3(p[0] * 0.4, p[1] * 0.4 + 0.6, p[2] * 0.4),
          new THREE.Vector3(0, 0, 0),
        );
        return curve.getPoints(60);
      }),
    [],
  );

  return (
    <group>
      {POINTS.map((p, i) => {
        const on = THREE.MathUtils.clamp(progress * 3 - i, 0, 1);
        if (on < 0.01) return null;
        return (
          <mesh key={i} position={p} scale={on}>
            <sphereGeometry args={[0.22, 20, 20]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} />
          </mesh>
        );
      })}
      {lines.map((pts, i) => {
        const dp = THREE.MathUtils.clamp(progress * 3 - i - 0.3, 0, 1);
        if (dp < 0.02) return null;
        const count = Math.max(2, Math.round(pts.length * dp));
        const visible = pts.slice(0, count);
        const geom = new THREE.BufferGeometry().setFromPoints(visible);
        const lineObj = new THREE.Line(geom, new THREE.LineBasicMaterial({color, transparent: true, opacity: 0.75}));
        return <primitive key={'l' + i} object={lineObj} />;
      })}
    </group>
  );
};
