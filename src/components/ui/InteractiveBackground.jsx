import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Swarm Background.
 * Renders 1200 particles swirling in a dense cosmic field.
 * The cursor acts as a massive gravity well: when particles draw near,
 * they decelerate (damped velocity) and suspend their default orbits to
 * cluster tightly around the cursor, forming a highly responsive physical swarm.
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

    // Ultra-dense particle count (increased to 1200 for a rich, swarming dust cloud)
    const particleCount = 1200;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      // Generate particles across a wide radius
      const radius = Math.random() * (maxDim * 0.72) + 15;
      const angle = Math.random() * Math.PI * 2;
      
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        speed: (0.0003 + Math.random() * 0.0007) * (radius < 350 ? 1.4 : 0.8),
        length: 3 + Math.random() * 5, // slightly shorter dashes for dense swarm cohesion
        thickness: 1.1 + Math.random() * 1.2,
        color: Math.random() > 0.45 
          ? 'rgba(37, 99, 235, 0.72)' // Royal Blue particles
          : 'rgba(30, 41, 59, 0.45)', // Slate Grey particles
        z: 0.35 + Math.random() * 0.65, // Depth multiplier
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
        const defaultVx = (targetX - p.x) * 0.05;
        const defaultVy = (targetY - p.y) * 0.05;

        let ax = 0;
        let ay = 0;
        let damping = 0.94;
        let returnWeight = 0.06;

        // 4. Newtonian Gravity Force with Dynamic Sticky-Damping
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          const dist = Math.sqrt(distSqr);

          if (dist > 5) {
            // Massive gravitational constants (G = 1600) to pull from far away
            const G = 1600 * p.z; 
            // Narrow softening factor (400) creates high acceleration near the center
            const accel = G / (distSqr + 400);
            ax = (dx / dist) * accel;
            ay = (dy / dist) * accel;

            // Swarm Attraction Mechanism:
            // When particles enter the cursor field (280px), we bleed their speed (damping)
            // and reduce their return-to-orbit force (returnWeight) so they stay clustered.
            if (dist < 280) {
              const ratio = dist / 280;
              damping = 0.81 + ratio * 0.13;      // 0.81 at cursor center (heavy stickiness)
              returnWeight = 0.008 + ratio * 0.052; // almost completely ignore default orbit near cursor
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
