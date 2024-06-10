
import React, { useMemo, useRef, useState } from 'react';
import { Stage, Sprite } from '@pixi/react';

import styled from 'styled-components';
import { useWindowSize, useWindowSizeHeightOnly, useWindowSizeWidthOnly } from './useWindowSize'
import { SnowParticleFactory } from './snowParticleFactory';

export const PixiJsBackgroundComponent = () => {

  const width = useWindowSizeWidthOnly();
  const [latestWidth, setLatestWidth] = useState(0);
  const [latestHeight, setLatestHeight] = useState(0);


  React.useEffect(() => {
    setLatestWidth(window.innerWidth);
    setLatestHeight(window.innerHeight);
  }, []);

  ///スマホのブラウザ対策、Heightはめっちゃ変わるため、
  //それをフックすると忙しくコンポーネントが再レンダリングされる
  React.useEffect(() => {
    setLatestWidth(width);
  }, [width]);


  const BackGroundCSS = styled.div`
  z-index: -1;
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100vw;
  height: 100vh;
  background: linear-gradient( #f69d3c,#fbf8e1);
`;
  return (
    <BackGroundCSS>

      <Stage x={1000} y={1000} options={{ backgroundAlpha: 0 }} width={latestWidth} height={latestHeight}>
        <SnowParticleFactory width={latestWidth} />
      </Stage>
    </BackGroundCSS>
  );
};