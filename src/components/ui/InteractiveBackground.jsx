import React, { useState, useEffect } from 'react';

/**
 * Simplified, hardware-accelerated Interactive Background.
 * Tracks mouse movements dynamically and renders:
 * 1. Three blurred background blobs.
 * 2. A sharp red debug dot in the top-left corner to scientifically verify if transforms are executing.
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
      {/* Scientific Debug Dot: Sharp, solid, and high z-index to isolate animation rendering. */}
      <div
        style={{
          position: 'fixed',
          top: '30px',
          left: '30px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#ef4444',
          zIndex: '999999',
          transform: `translate3d(${coords.x * 300}px, ${coords.y * 300}px, 0)`,
          pointerEvents: 'none',
          boxShadow: '0 0 10px rgba(239, 68, 68, 0.8)',
        }}
      />

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
