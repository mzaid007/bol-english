import React, { useState, useEffect } from 'react';

/**
 * Interactive Background with Parallax Blobs that react to mouse movements.
 * Creates an elegant, high-fidelity depth effect reminiscent of the Google Antigravity theme.
 */
export default function InteractiveBackground() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only capture cursor coordinates on devices with pointing inputs (desktops)
    const isMobile = window.matchMedia('(max-width: 768px)').matches;
    if (isMobile) return;

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
        className="bg-blob blob-indigo"
        style={{
          transform: `translate(${coords.x * 40}px, ${coords.y * 40}px)`,
        }}
      />
      {/* Sky Blue Blob - Top Right */}
      <div
        className="bg-blob blob-sky"
        style={{
          transform: `translate(${coords.x * -60}px, ${coords.y * -60}px)`,
        }}
      />
      {/* Pink/Fuchsia Blob - Bottom Right */}
      <div
        className="bg-blob blob-pink"
        style={{
          transform: `translate(${coords.x * 30}px, ${coords.y * 30}px)`,
        }}
      />
    </div>
  );
}
