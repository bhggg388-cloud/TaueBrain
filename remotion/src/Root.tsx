import React from 'react';
import {Composition} from 'remotion';
import {Story} from './Story';
import {Story3D} from './Story3D';
import {TestThree} from './TestThree';
// @ts-ignore - plain ESM module shared with the music renderer
import {DURATION, FPS} from './timeline.mjs';

export const RemotionRoot: React.FC = () => (
  <>
    <Composition
      id="Story"
      component={Story3D}
      durationInFrames={Math.round(DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="StoryClassic2D"
      component={Story}
      durationInFrames={Math.round(DURATION * FPS)}
      fps={FPS}
      width={1920}
      height={1080}
    />
    <Composition
      id="TestThree"
      component={TestThree}
      durationInFrames={30}
      fps={FPS}
      width={1280}
      height={720}
    />
  </>
);
