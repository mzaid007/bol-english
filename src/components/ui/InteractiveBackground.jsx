import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Particle Vortex Background.
 * Expanded to 450 particles with a highly intensified gravitational field
 * centered around the cursor, creating dramatic cosmic slingshots and orbits.
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

    // Dense particle count (increased to 450 for a rich starry field)
    const particleCount = 450;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      const radius = Math.random() * (maxDim * 0.7) + 20;
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
        length: 4 + Math.random() * 6,
        thickness: 1.1 + Math.random() * 1.3,
        color: Math.random() > 0.45 
          ? 'rgba(37, 99, 235, 0.72)' // Royal Blue specks
          : 'rgba(30, 41, 59, 0.48)', // Slate Grey specks
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

        // 4. Newtonian Gravity Force: F = G * m1 * m2 / r^2
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          const dist = Math.sqrt(distSqr);

          if (dist > 6) {
            // Intensified Gravitational Constant (increased from 180 to 480)
            const G = 480 * p.z; 
            // Reduced softening factor (800) makes the gravitational pull much tighter and stronger
            const accel = G / (distSqr + 800);
            ax = (dx / dist) * accel;
            ay = (dy / dist) * accel;
          }
        }

        // 5. Blended Physics: 93% momentum + gravity, 7% return force for clean orbit recovery
        p.vx = (p.vx + ax) * 0.93 + defaultVx * 0.07;
        p.vy = (p.vy + ay) * 0.93 + defaultVy * 0.07;

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
