import { useMemo, useRef, useState } from 'react';

import { TextStyle, Point, filters } from 'pixi.js';
import { Stage, Container, useTick, Graphics, withFilters } from '@pixi/react';
import styled from 'styled-components';
import { useWindowSizeWidthOnly } from './useWindowSize'
import { SnowParticle } from './snowParticle';

export const SnowParticleFactory = ({ width }) => {
    const particleCount = 200;
    const [particles, setParticles] = useState(Array(particleCount).fill(0).map((p, i) => ({ baseX: width * Math.random(), initDelayMs: i * 500, initY: -100, rotation: Math.PI * Math.random() })));

    React.useEffect(() => {
        console.log('init onchange factory',  width)
        setParticles(Array(particleCount).fill(0).map((p, i) => ({ baseX: width * Math.random(), initDelayMs: i * 500, initY: -100, rotation: Math.PI * Math.random() })));
    }, [width]);


    React.useEffect(() => {
        console.log("Factory Component Init!");
    }, []);

    return (
        <Container
            interactive={true}
            pointerdown={() => setShowPoints(show => !show)}
            options={{ autoDensity: true }}>
            {particles.map((val, i) => {
                return (
                    <SnowParticle baseX={val.baseX} initY={val.initY} currentXBias={Math.random() * (Math.PI / 2)} rotation={val.rotation} initDelayMs={val.initDelayMs} />
                );
            })}
        </Container>
    );
};