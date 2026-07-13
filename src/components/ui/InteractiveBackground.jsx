import React, { useEffect, useRef } from 'react';

/**
 * High-Fidelity Google Antigravity Particle Vortex Background.
 * Renders particles swirling in a structural vortex where:
 * 1. Particles default to circular/spiral orbits around the vortex center.
 * 2. The cursor exerts a powerful Newtonian gravitational pull (attracting
 *    particles toward it with speed accumulation and slingshot orbits).
 * 3. Each particle's velocity vector dynamically determines its heading angle,
 *    aligning the dashes along their actual path of movement.
 * 4. Critical Fix: Velocity limits (capping speed) are applied to prevent 
 *    particles from building up extreme speed and escaping the viewport permanently.
 * 5. Screen boundary wrapping ensures that if any particle escapes due to gravity,
 *    it is gently wrapped back into the active screen canvas, maintaining density.
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

    // Generate 1200 physics-enabled particles
    const particleCount = 1200;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      // Orbit radiuses starting from 25px out to 75% of viewport size
      const radius = Math.random() * (maxDim * 0.75) + 25;
      const angle = Math.random() * Math.PI * 2;
      
      let color = 'rgba(37, 99, 235, 0.82)'; // Royal Blue
      const roll = Math.random();
      if (roll < 0.25) {
        color = 'rgba(79, 70, 229, 0.8)'; // Indigo
      } else if (roll < 0.45) {
        color = 'rgba(124, 58, 237, 0.78)'; // Purple
      } else if (roll < 0.7) {
        color = 'rgba(15, 23, 42, 0.52)'; // Slate Charcoal for contrast
      }

      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        speed: (0.0003 + Math.random() * 0.0006) * (radius < 350 ? 1.4 : 0.8),
        length: 4 + Math.random() * 5.5,
        thickness: 1.2 + Math.random() * 1.3,
        color,
        z: 0.35 + Math.random() * 0.65, // depth factor
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

        // 2. Default target position in the background vortex
        const targetX = centerX + Math.cos(p.angle) * p.radius;
        const targetY = centerY + Math.sin(p.angle) * p.radius;

        // 3. Default velocity vector pointing towards the target vortex path
        const defaultVx = (targetX - p.x) * 0.055;
        const defaultVy = (targetY - p.y) * 0.055;

        let ax = 0;
        let ay = 0;
        let damping = 0.94;
        let returnWeight = 0.06;

        // 4. Newtonian Gravity Force: F = G * m1 * m2 / r^2
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;
          const dist = Math.sqrt(distSqr);

          if (dist > 5) {
            // Strong Newtonian gravitational pull
            const G = 1500 * p.z; 
            const accel = G / (distSqr + 500);
            ax = (dx / dist) * accel;
            ay = (dy / dist) * accel;

            // Swarm capturing: Damp velocities and reduce return weight near cursor
            if (dist < 280) {
              const ratio = dist / 280;
              damping = 0.74 + ratio * 0.2;
              returnWeight = 0.005 + ratio * 0.055;
            }
          }
        }

        // 5. Apply blended physics
        p.vx = (p.vx + ax) * damping + defaultVx * returnWeight;
        p.vy = (p.vy + ay) * damping + defaultVy * returnWeight;

        // Velocity Speed Limiter: Caps maximum movement vector to keep particles bounded
        const maxSpeed = 16 * p.z;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        // 6. Update position
        p.x += p.vx;
        p.y += p.vy;

        // Boundary Wrap-Around: If a particle shoots completely off-screen,
        // wrap it around to the opposite side to maintain field density.
        const margin = 50;
        if (p.x < -margin) { p.x = width + margin; p.vx *= -0.2; }
        else if (p.x > width + margin) { p.x = -margin; p.vx *= -0.2; }
        
        if (p.y < -margin) { p.y = height + margin; p.vy *= -0.2; }
        else if (p.y > height + margin) { p.y = -margin; p.vy *= -0.2; }

        // 7. Heading vector along physical motion
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
