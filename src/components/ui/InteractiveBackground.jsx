import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Swarm Background (Google Antigravity style).
 * Simulates a particle vortex where the cursor acts as the center of gravity.
 * The entire vortex center eases smoothly toward the cursor (or resets to center-screen),
 * while particles maintain orbital paths at their respective radiuses,
 * leaving a clean "eye" around the cursor and creating fluid trail animations.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const vortexCenterRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

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
    
    // Initialize vortex center at center-screen
    vortexCenterRef.current.x = centerX;
    vortexCenterRef.current.y = centerY;

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

    // Dense particle count (1500 particles for high-fidelity vortex)
    const particleCount = 1500;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      // Orbit radiuses starting from 25px out to 70% of viewport size
      const radius = Math.random() * (maxDim * 0.7) + 25;
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
        // Orbital speed
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
      const vortex = vortexCenterRef.current;

      // 1. Ease the vortex center towards its target (cursor or screen center)
      const targetCenterX = mouse.active ? mouse.x : centerX;
      const targetCenterY = mouse.active ? mouse.y : centerY;

      // Smooth lag interpolation
      vortex.x = vortex.x * 0.91 + targetCenterX * 0.09;
      vortex.y = vortex.y * 0.91 + targetCenterY * 0.09;

      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        // 2. Advance orbital angle
        p.angle += p.speed;

        // 3. Compute target coordinates relative to the moving vortex center
        const tx = vortex.x + Math.cos(p.angle) * p.radius;
        const ty = vortex.y + Math.sin(p.angle) * p.radius;

        // 4. Update velocities (spring easing with 92% momentum)
        p.vx = p.vx * 0.92 + (tx - p.x) * 0.08;
        p.vy = p.vy * 0.92 + (ty - p.y) * 0.08;

        // 5. Update positions
        p.x += p.vx;
        p.y += p.vy;

        // 6. Heading vector along physical motion
        const heading = Math.atan2(p.vy, p.vx);

        // 7. Paint particles
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
