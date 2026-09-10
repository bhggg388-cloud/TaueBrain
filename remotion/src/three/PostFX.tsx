import React from 'react';
import {EffectComposer, Bloom, Vignette, Noise} from '@react-three/postprocessing';

/* Note: kept only for the TestThree scratch/validation composition. The
   main Story3D composition no longer uses this — a WebGL EffectComposer
   pass here proved unreliable (intermittent full-black frames on some
   scenes under this environment's software renderer, reproduced even with
   a single bare Bloom effect), so Story3D fakes grading with CSS overlays
   instead. See Story3D.tsx for details. */
export const PostFX: React.FC<{focusDistance?: number; bloomIntensity?: number}> = ({
  bloomIntensity = 0.65,
}) => (
  <EffectComposer multisampling={0}>
    <Bloom intensity={bloomIntensity} luminanceThreshold={0.28} luminanceSmoothing={0.35} mipmapBlur radius={0.7} />
    <Noise opacity={0.035} premultiply />
    <Vignette eskil={false} offset={0.18} darkness={0.85} />
  </EffectComposer>
);
