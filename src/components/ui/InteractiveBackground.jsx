import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Particle Vortex Background.
 * Simulates a true gravitational force field where the mouse cursor acts
 * as a gravitational body (attracting particles with acceleration, causing
 * cometary slingshots and dynamic orbital paths).
 * 
 * Each particle's velocity vector determines its rendering heading, producing
 * beautifully aligned slanted dashes that curve organically.
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

    // Generate 180 physics-enabled particles
    const particleCount = 180;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      const radius = Math.random() * (maxDim * 0.65) + 30;
      const angle = Math.random() * Math.PI * 2;
      
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        // Default vortex speed
        speed: (0.0004 + Math.random() * 0.0008) * (radius < 350 ? 1.4 : 0.8),
        length: 5 + Math.random() * 6,
        thickness: 1.2 + Math.random() * 1.3,
        color: Math.random() > 0.45 
          ? 'rgba(37, 99, 235, 0.72)' // royal blue
          : 'rgba(30, 41, 59, 0.48)', // slate grey
        z: 0.4 + Math.random() * 0.6, // depth multiplier
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
        const defaultVx = (targetX - p.x) * 0.06;
        const defaultVy = (targetY - p.y) * 0.06;

        let ax = 0;
        let ay = 0;

        // 4. Newtonian Gravity Force: F = G * m1 * m2 / r^2
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          const dist = Math.sqrt(distSqr);

          if (dist > 8) {
            // Stronger pull for foreground particles
            const G = 180 * p.z; 
            // Softening factor (1200) prevents division by zero / infinite speed near cursor
            const accel = G / (distSqr + 1200);
            ax = (dx / dist) * accel;
            ay = (dy / dist) * accel;
          }
        }

        // 5. Blended Physics: 94% momentum + gravity, 6% return force to keep orbit structural
        p.vx = (p.vx + ax) * 0.94 + defaultVx * 0.06;
        p.vy = (p.vy + ay) * 0.94 + defaultVy * 0.06;

        // 6. Update position
        p.x += p.vx;
        p.y += p.vy;

        // 7. Calculate heading vector for slanted rendering along actual velocity
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
