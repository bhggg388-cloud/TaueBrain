import React from 'react';
import {Composition} from 'remotion';
import {Story} from './Story';
// @ts-ignore - plain ESM module shared with the music renderer
import {DURATION, FPS} from './timeline.mjs';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Story"
    component={Story}
    durationInFrames={Math.round(DURATION * FPS)}
    fps={FPS}
    width={1920}
    height={1080}
  />
);
