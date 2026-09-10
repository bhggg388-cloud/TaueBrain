import React, {useMemo} from 'react';
import {PerspectiveCamera} from '@react-three/drei';
import * as THREE from 'three';

type KeyFrame = {t: number; pos: [number, number, number]; look: [number, number, number]; fov: number};

function smooth(e0: number, e1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - e0) / (e1 - e0), 0, 1);
  return t * t * (3 - 2 * t);
}

export function makeCameraRig(keys: KeyFrame[]) {
  return (t: number, driftAmp = 0.25) => {
    let i = 0;
    while (i < keys.length - 2 && t > keys[i + 1].t) i++;
    const a = keys[i], b = keys[i + 1];
    const q = smooth(a.t, b.t, t);
    const pos = new THREE.Vector3(...a.pos).lerp(new THREE.Vector3(...b.pos), q);
    const look = new THREE.Vector3(...a.look).lerp(new THREE.Vector3(...b.look), q);
    const fov = THREE.MathUtils.lerp(a.fov, b.fov, q);
    pos.x += Math.sin(t * 0.22) * driftAmp;
    pos.y += Math.cos(t * 0.17) * driftAmp * 0.6;
    return {pos, look, fov};
  };
}

export const CameraRig: React.FC<{t: number; rig: ReturnType<typeof makeCameraRig>; drift?: number}> = ({
  t,
  rig,
  drift,
}) => {
  const {pos, look, fov} = useMemo(() => rig(t, drift), [t, rig, drift]);
  return (
    <PerspectiveCamera makeDefault position={pos} fov={fov} near={0.1} far={60}
      onUpdate={(cam) => cam.lookAt(look)} />
  );
};
