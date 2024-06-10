import React, { useLayoutEffect, useState } from 'react';

export const useWindowSize = () => {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    const updateSize = () => {
      setSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    1000
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
};

export const useWindowSizeWidthOnly = () => {
  const [width, setWidth] = useState(0);
  useLayoutEffect(() => {
    const updateSize = () => {
      if (window.innerWidth != width){
        console.log("width",width,window.innerWidth);
        setWidth(window.innerWidth);
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    1000
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return width;
};


export const useWindowSizeHeightOnly = () => {
  const [height, setHeight] = useState(0);
  useLayoutEffect(() => {
    const updateSize = () => {
      if (window.innerHeight != height){
        console.log("height",height,window.innerHeight);
        setHeight(window.innerHeight);
      }
    };

    window.addEventListener('resize', updateSize);
    updateSize();
    1000
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return height;
};