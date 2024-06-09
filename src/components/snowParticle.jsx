import { useMemo, useRef, useState } from 'react';
import { useWindowSize } from './useWindowSize'

import { TextStyle, Point, filters } from 'pixi.js';
import { Stage, Container, useTick, Sprite } from '@pixi/react';

import snowParticleImage from "../images/snowParticle.png"



export const SnowParticle = ({ baseX, initY, currentXBias, rotation, initDelayMs }) => {

    const [width, height] = useWindowSize();

    const [currentX, setCurrentX] = useState(0);
    const [currentY, setCurrentY] = useState(initY);

    const [sumElpsMs, setSumElpsMs] = useState(0);
    const [sumElpsMsForInitDelay, setSumElpsMsForInitDelay] = useState(0);
    const [isInitEnd, setIsInitEnd] = useState(false);

    const maxYPos = height + 100;

    let count = 0;

    useTick((delta, ticker) => {

        if (!isInitEnd) {
            setSumElpsMsForInitDelay(ticker.elapsedMS + sumElpsMsForInitDelay);
            if (sumElpsMsForInitDelay > initDelayMs)
                setIsInitEnd(true);
        } else {

            setSumElpsMs(ticker.elapsedMS + sumElpsMs);
            if (sumElpsMs > 32) {
                setSumElpsMs(ticker.elapsedMS + sumElpsMs);
                count += 0.01;
                setCurrentY(currentY + 1);

                if (currentY > (maxYPos))
                    setCurrentY(initY);
                setCurrentX(baseX + 10 * Math.cos(currentY * 0.1 + currentXBias))
                setSumElpsMs(0);
            }
        }
    });


    return (
        <Sprite x={currentX} y={currentY} rotation={rotation} image={snowParticleImage} scale={1 - (currentY / maxYPos)} />
    );
};