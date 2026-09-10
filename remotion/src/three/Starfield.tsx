import React from 'react';
import {Sparkles} from '@react-three/drei';

export const Starfield: React.FC<{color?: string; count?: number}> = ({
  color = '#cfe4ff',
  count = 260,
}) => (
  <>
    <Sparkles count={count} scale={[26, 16, 26]} size={2.4} speed={0.15} opacity={0.7} color={color} noise={0.3} />
    <Sparkles count={40} scale={[10, 7, 6]} size={1.6} speed={0.1} opacity={0.5} color="#ffe0a6" />
  </>
);
