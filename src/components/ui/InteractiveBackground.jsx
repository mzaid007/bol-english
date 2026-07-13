import React, { useState, useEffect } from 'react';

/**
 * Interactive Background with dual-layer animations:
 * 1. An outer wrapper that shifts with cursor movements (parallax vectors).
 * 2. An inner blob that slowly drifts using CSS keyframes (universal floating support, including mobile).
 */
export default function InteractiveBackground() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    // Only capture coordinates on devices with cursor pointing capability
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsDesktop(media.matches);

    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setCoords({ x, y });
    };

    if (media.matches) {
      window.addEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      {/* Indigo Blob - Top Left */}
      <div
        className="blob-wrapper"
        style={{
          transform: isDesktop ? `translate(${coords.x * 45}px, ${coords.y * 45}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-indigo" />
      </div>

      {/* Sky Blue Blob - Top Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: isDesktop ? `translate(${coords.x * -70}px, ${coords.y * -70}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-sky" />
      </div>

      {/* Pink/Fuchsia Blob - Bottom Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: isDesktop ? `translate(${coords.x * 35}px, ${coords.y * 35}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-pink" />
      </div>
    </div>
  );
}
