import React, { useEffect, useRef } from 'react';

/**
 * Interactive Particle Vortex Background (Google Antigravity style).
 * Renders a dynamic field of tiny, slanted blue and dark specks/dashes
 * orbiting in a swirling vortex. When the mouse moves, the particles distort
 * organically relative to the cursor position.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Re-initialize dimensions on resize
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse inputs
    const handleMouseMove = (e) => {
      mouseRef.current.x = e.clientX;
      mouseRef.current.y = e.clientY;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Generate ~180 vortex particles (mix of royal blue and slate grey dashes)
    const particleCount = 180;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      // Scatter starting radiuses across a broad vortex field
      const radius = Math.random() * (maxDim * 0.65) + 30;
      particles.push({
        radius,
        angle: Math.random() * Math.PI * 2,
        // Orbital speed: inner orbits move faster than outer ones
        speed: (0.0004 + Math.random() * 0.0008) * (radius < 350 ? 1.4 : 0.8),
        length: 4 + Math.random() * 6, // dash length
        thickness: 1.2 + Math.random() * 1.3, // dash thickness
        color: Math.random() > 0.45 
          ? 'rgba(37, 99, 235, 0.72)' // Royal Blue specks
          : 'rgba(30, 41, 59, 0.48)', // Slate Grey specks
        z: 0.4 + Math.random() * 0.6, // depth multiplier (3D parallax effect)
      });
    }

    // Animation Loop
    const render = () => {
      // Clear viewport
      ctx.clearRect(0, 0, width, height);

      const centerX = width / 2;
      const centerY = height / 2;
      const mouse = mouseRef.current;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // 1. Advance orbital angle
        p.angle += p.speed;

        // 2. Compute base Cartesian coordinates
        const bx = centerX + Math.cos(p.angle) * p.radius;
        const by = centerY + Math.sin(p.angle) * p.radius;

        let rx = bx;
        let ry = by;

        // 3. Apply Mouse Gravitational Distortion (swirl attraction)
        if (mouse.active) {
          const dx = mouse.x - bx;
          const dy = mouse.y - by;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < 260) {
            // Decay curve: force is strongest when close to cursor
            const force = (260 - dist) / 260;
            // Displace particles smoothly toward cursor (scaled by depth factor)
            rx += dx * force * 0.24 * p.z;
            ry += dy * force * 0.24 * p.z;
          }
        }

        // 4. Calculate dash heading (orbital tangent with a slight outward spiral)
        const heading = p.angle + Math.PI / 2 + 0.05;

        // 5. Render particle dash
        ctx.lineWidth = p.thickness * p.z;
        ctx.strokeStyle = p.color;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(
          rx + Math.cos(heading) * p.length * p.z,
          ry + Math.sin(heading) * p.length * p.z
        );
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    // Cleanup
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
