import React, { useEffect, useRef } from 'react';

/**
 * High-Density Newtonian Gravitational Swarm Background.
 * Renders 1500 physics-enabled particles in a cosmic field.
 * 
 * Implements an intense gravitational pull and deep damping when particles are near 
 * the cursor, forcing them to decelerate rapidly and cluster tightly around the mouse 
 * like a highly responsive organic swarm.
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

    let centerX = width / 2;
    let centerY = height / 2;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };
    window.addEventListener('resize', handleResize);

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

    // Highly dense swarm count (1500 particles)
    const particleCount = 1500;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      const radius = Math.random() * (maxDim * 0.75) + 10;
      const angle = Math.random() * Math.PI * 2;
      
      // Determine a rich, high-contrast color palette visible on light backgrounds
      let color = 'rgba(37, 99, 235, 0.85)'; // Royal Blue (default)
      const roll = Math.random();
      if (roll < 0.25) {
        color = 'rgba(79, 70, 229, 0.82)'; // Indigo
      } else if (roll < 0.45) {
        color = 'rgba(124, 58, 237, 0.8)'; // Purple
      } else if (roll < 0.7) {
        color = 'rgba(15, 23, 42, 0.55)'; // Deep Slate/Charcoal for contrast
      }

      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        speed: (0.0003 + Math.random() * 0.0006) * (radius < 350 ? 1.4 : 0.8),
        length: 3.5 + Math.random() * 5.5, // dash length
        thickness: 1.3 + Math.random() * 1.3, // dash thickness
        color,
        z: 0.35 + Math.random() * 0.65, // depth multiplier
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const mouse = mouseRef.current;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // 1. Advance the particle's default orbital angle
        p.angle += p.speed;

        // 2. Default target position in the vortex
        const targetX = centerX + Math.cos(p.angle) * p.radius;
        const targetY = centerY + Math.sin(p.angle) * p.radius;

        // 3. Default velocity vector pointing towards the target vortex path
        const defaultVx = (targetX - p.x) * 0.055;
        const defaultVy = (targetY - p.y) * 0.055;

        let ax = 0;
        let ay = 0;
        let damping = 0.94;
        let returnWeight = 0.06;

        // 4. Newtonian Gravity Force with Dynamic Swarm Cohesion
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          const dist = Math.sqrt(distSqr);

          if (dist > 5) {
            // Massive gravitational pull (G = 2400) to capture distant particles
            const G = 2400 * p.z; 
            // Narrow softening factor (300) produces sharp, tight acceleration near the cursor
            const accel = G / (distSqr + 300);
            ax = (dx / dist) * accel;
            ay = (dy / dist) * accel;

            // Swarm Attraction & Capture:
            // When particles enter the cursor field (280px), we bleed their velocity (damping)
            // and suppress their returning vortex force so they swarm directly on the cursor.
            if (dist < 280) {
              const ratio = dist / 280;
              damping = 0.68 + ratio * 0.26;        // 0.68 at cursor center (extremely sticky)
              returnWeight = 0.002 + ratio * 0.058;  // almost completely ignore default orbit near cursor
            }
          }
        }

        // 5. Apply blended physics
        p.vx = (p.vx + ax) * damping + defaultVx * returnWeight;
        p.vy = (p.vy + ay) * damping + defaultVy * returnWeight;

        // 6. Update position
        p.x += p.vx;
        p.y += p.vy;

        // 7. Calculate heading vector along actual velocity
        const heading = Math.atan2(p.vy, p.vx);

        // 8. Paint particles
        ctx.lineWidth = p.thickness * p.z;
        ctx.strokeStyle = p.color;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(
          p.x + Math.cos(heading) * p.length * p.z,
          p.y + Math.sin(heading) * p.length * p.z
        );
        ctx.stroke();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

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
