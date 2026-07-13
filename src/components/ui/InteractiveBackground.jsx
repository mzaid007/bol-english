import React, { useState, useEffect } from 'react';

/**
 * Simplified, hardware-accelerated Interactive Background.
 * Tracks mouse movements dynamically without state-dependency loops,
 * translating wrappers using translate3d for smooth rendering performance.
 */
export default function InteractiveBackground() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      {/* Indigo Blob - Top Left */}
      <div
        className="blob-wrapper"
        style={{
          transform: `translate3d(${coords.x * 140}px, ${coords.y * 140}px, 0)`,
        }}
      >
        <div className="bg-blob blob-indigo" />
      </div>

      {/* Sky Blue Blob - Top Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: `translate3d(${coords.x * -190}px, ${coords.y * -190}px, 0)`,
        }}
      >
        <div className="bg-blob blob-sky" />
      </div>

      {/* Pink/Fuchsia Blob - Bottom Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: `translate3d(${coords.x * 160}px, ${coords.y * 160}px, 0)`,
        }}
      >
        <div className="bg-blob blob-pink" />
      </div>
    </div>
  );
}
