import React, { useEffect } from 'react';

/**
 * High-performance, pure CSS-driven Interactive Background.
 * Listens to mouse movement and writes coordinates directly to document.documentElement
 * as CSS Custom Properties (--mouse-x, --mouse-y).
 * 
 * Bypasses React state rendering updates completely for ultra-fast, smooth,
 * hardware-accelerated CSS transitions on all screen refreshes.
 */
export default function InteractiveBackground() {
  useEffect(() => {
    const handleMouseMove = (e) => {
      // Calculate normalized vector offset from the center of the viewport
      const x = (e.clientX / window.innerWidth) - 0.5;
      const y = (e.clientY / window.innerHeight) - 0.5;
      
      // Update global document styles directly
      document.documentElement.style.setProperty('--mouse-x', x.toString());
      document.documentElement.style.setProperty('--mouse-y', y.toString());
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      // Clean up variables on unmount
      document.documentElement.style.removeProperty('--mouse-x');
      document.documentElement.style.removeProperty('--mouse-y');
    };
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      {/* 1. Indigo Blob - Top Left */}
      <div className="blob-wrapper-1">
        <div className="bg-blob blob-indigo" />
      </div>

      {/* 2. Sky Blue Blob - Top Right */}
      <div className="blob-wrapper-2">
        <div className="bg-blob blob-sky" />
      </div>

      {/* 3. Pink/Fuchsia Blob - Bottom Right */}
      <div className="blob-wrapper-3">
        <div className="bg-blob blob-pink" />
      </div>

      {/* 4. Purple Blob - Bottom Left */}
      <div className="blob-wrapper-4">
        <div className="bg-blob blob-purple" />
      </div>

      {/* 5. Emerald Green Blob - Center Left */}
      <div className="blob-wrapper-5">
        <div className="bg-blob blob-emerald" />
      </div>

      {/* 6. Amber Orange Blob - Center Right */}
      <div className="blob-wrapper-6">
        <div className="bg-blob blob-amber" />
      </div>
    </div>
  );
}
