import React, { useState, useEffect } from 'react';

/**
 * Interactive Background with dual-layer animations:
 * 1. An outer wrapper that shifts dynamically with cursor movements.
 *    Increased parallax multipliers to make the motion visually prominent on large viewports.
 * 2. An inner blob that slowly drifts using CSS keyframes.
 */
export default function InteractiveBackground() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!hasMouse) setHasMouse(true);
      
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse]);

  return (
    <div className="interactive-bg" aria-hidden="true">
      {/* Indigo Blob - Top Left (Large direct parallax translation) */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * 130}px, ${coords.y * 130}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-indigo" />
      </div>

      {/* Sky Blue Blob - Top Right (Large opposite parallax translation for depth) */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * -190}px, ${coords.y * -190}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-sky" />
      </div>

      {/* Pink/Fuchsia Blob - Bottom Right (Medium direct parallax translation) */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * 150}px, ${coords.y * 150}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-pink" />
      </div>
    </div>
  );
}
