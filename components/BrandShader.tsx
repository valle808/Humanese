'use client';

import { ColorPanels } from '@paper-design/shaders-react';
import { useEffect, useState } from 'react';

interface BrandShaderProps {
  size?: 'small' | 'large';
}

export function BrandShader({ size = 'large' }: BrandShaderProps) {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };

    checkTheme();

    const observer = new MutationObserver(checkTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    });

    return () => observer.disconnect();
  }, []);

  const dimensions = size === 'small'
    ? { height: '50px', width: '50px' }
    : { height: '320px', width: '480px' };

  const backgroundColor = isDark ? '#000000' : '#FFFFFF';

  return (
    <ColorPanels
      // FLAGSHIP INTENSE ORANGE PALETTE
      colors={['#ff6b2b', '#ff4500', '#ff8c00', '#ff6b2b', '#e65100', '#ff6b2b']}
      colorBack="#00000000"
      speed={0.4}
      scale={0.9}
      density={4}
      angle1={0}
      angle2={0}
      length={1.2}
      edges={false}
      blur={0}
      fadeIn={1.2}
      fadeOut={0.4}
      gradient={0.1}
      rotation={0}
      offsetX={0}
      offsetY={0}
      style={{
        backgroundColor,
        ...dimensions,
        borderRadius: size === 'small' ? '20px' : '40px'
      }}
    />
  );
}
