import React, { useState, useEffect } from 'react';

/**
 * Interactive Background with progressive mouse-detection:
 * Activates mouse movement parallax tracking dynamically upon the first cursor movement,
 * resolving compatibility issues on touchscreen-enabled Windows desktops.
 */
export default function InteractiveBackground() {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [hasMouse, setHasMouse] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      // Once mouse movement is detected, enable the parallax calculations
      if (!hasMouse) {
        console.log("InteractiveBackground: First mousemove detected! hasMouse => true");
        setHasMouse(true);
      }
      
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      console.log("InteractiveBackground: mousemove", { x, y });
      setCoords({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [hasMouse]);

  return (
    <div className="interactive-bg" aria-hidden="true">
      {/* Indigo Blob - Top Left */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * 50}px, ${coords.y * 50}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-indigo" />
      </div>

      {/* Sky Blue Blob - Top Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * -75}px, ${coords.y * -75}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-sky" />
      </div>

      {/* Pink/Fuchsia Blob - Bottom Right */}
      <div
        className="blob-wrapper"
        style={{
          transform: hasMouse ? `translate(${coords.x * 40}px, ${coords.y * 40}px)` : 'none',
        }}
      >
        <div className="bg-blob blob-pink" />
      </div>
    </div>
  );
}
