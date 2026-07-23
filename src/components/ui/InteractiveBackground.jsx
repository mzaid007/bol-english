import React, { useEffect, useRef } from 'react';

/**
 * CreativeGlu AI-inspired Iridescent Liquid Mesh Background.
 * Renders glowing ambient liquid nebulae and interactive gravity-driven iridescent particles
 * using canvas screen blending (`mix-blend-screen`).
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

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        mouseRef.current.x = e.touches[0].clientX;
        mouseRef.current.y = e.touches[0].clientY;
        mouseRef.current.active = true;
      }
    };

    const handleLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleLeave);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleLeave);

    // Iridescent Palette
    const colors = [
      'rgba(213, 134, 225, OPACITY)', // Rose Purple
      'rgba(111, 117, 228, OPACITY)', // Indigo Blue
      'rgba(111, 228, 183, OPACITY)', // Teal Mint
      'rgba(222, 228, 111, OPACITY)', // Golden Lime
    ];

    const particleCount = width < 768 ? 60 : 150;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * (Math.max(width, height) * 0.4) + 40;
      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius,
        angle,
        speed: 0.0003 + Math.random() * 0.0006,
        size: 3 + Math.random() * 9,
        color: colors[Math.floor(Math.random() * colors.length)],
        z: 0.4 + Math.random() * 0.6,
      });
    }

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Render Liquid Central Mesh Glow
      ctx.save();
      ctx.globalCompositeOperation = 'screen';

      const time = Date.now() * 0.0008;
      const glowX = mouseRef.current.active ? mouseRef.current.x : centerX + Math.sin(time) * 60;
      const glowY = mouseRef.current.active ? mouseRef.current.y : centerY + Math.cos(time) * 40;

      const grad = ctx.createRadialGradient(glowX, glowY, 10, glowX, glowY, Math.max(width, height) * 0.45);
      grad.addColorStop(0, 'rgba(168, 85, 247, 0.18)');
      grad.addColorStop(0.35, 'rgba(99, 102, 241, 0.09)');
      grad.addColorStop(0.7, 'rgba(56, 189, 248, 0.04)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(glowX, glowY, Math.max(width, height) * 0.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Render Iridescent Swirl Particles
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];
        p.angle += p.speed;

        const targetX = centerX + Math.cos(p.angle) * p.radius;
        const targetY = centerY + Math.sin(p.angle) * p.radius;

        let dx = targetX - p.x;
        let dy = targetY - p.y;

        if (mouseRef.current.active) {
          const mdx = mouseRef.current.x - p.x;
          const mdy = mouseRef.current.y - p.y;
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy);
          if (mDist < 250) {
            dx += (mdx / mDist) * 12;
            dy += (mdy / mDist) * 12;
          }
        }

        p.vx = p.vx * 0.95 + dx * 0.02;
        p.vy = p.vy * 0.95 + dy * 0.02;

        p.x += p.vx;
        p.y += p.vy;

        const opacity = (0.12 + Math.sin(time + i) * 0.06) * p.z;
        ctx.fillStyle = p.color.replace('OPACITY', opacity.toFixed(3));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
        ctx.fill();
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleLeave);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleLeave);
    };
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
