import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Solar System Background.
 * Renders a high-density asteroid field (5,000 particles) swirling in a vortex
 * centered around a dynamically easing gravity well (mouse cursor or touch finger).
 * 
 * Features:
 * 1. Gravity Center (Cursor & Touch): Mouse cursor or finger touch drag acts as the Sun,
 *    attracting all planets and asteroids.
 * 2. Mobile Touch Integration: Captures touchstart, touchmove, and touchend coordinates
 *    to make the canvas fully interactive and responsive to mobile swipes and drags.
 * 3. 3 Orbiting Planets: Inner (Rose), Middle (Teal with Saturn-style rings), 
 *    and Outer (Sky Blue), each leaving fading trails and deflecting asteroids (wakes).
 * 4. Gravitational Waves: Fast sweeps/swipes release expanding ripples, pushing asteroids.
 * 5. Performance Optimizations: Employs squared-distance range checks to bypass
 *    unnecessary square-root computations, keeping 5,000 items buttery smooth on mobile chips.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });
  const ripplesRef = useRef([]);
  const systemCenterRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

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
    
    systemCenterRef.current.x = centerX;
    systemCenterRef.current.y = centerY;

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      centerX = width / 2;
      centerY = height / 2;
    };
    window.addEventListener('resize', handleResize);

    // Track mouse inputs
    const handleMouseMove = (e) => {
      const now = Date.now();
      const mx = e.clientX;
      const my = e.clientY;
      
      const dx = mx - lastMouseRef.current.x;
      const dy = my - lastMouseRef.current.y;
      const dt = now - lastMouseRef.current.time;

      if (dt > 10) {
        const speed = Math.sqrt(dx * dx + dy * dy) / dt;
        if (speed > 4.5 && ripplesRef.current.length < 3) {
          ripplesRef.current.push({
            x: mx,
            y: my,
            r: 0,
            maxR: 320,
            speed: 10,
            intensity: 18,
          });
        }
        lastMouseRef.current = { x: mx, y: my, time: now };
      }

      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.active = true;
    };

    const handleMouseLeave = () => {
      mouseRef.current.active = false;
    };

    // Track touch gestures for mobile screens
    const handleTouchStart = (e) => {
      if (e.touches.length > 0) {
        const mx = e.touches[0].clientX;
        const my = e.touches[0].clientY;
        mouseRef.current.x = mx;
        mouseRef.current.y = my;
        mouseRef.current.active = true;
        lastMouseRef.current = { x: mx, y: my, time: Date.now() };
      }
    };

    const handleTouchMove = (e) => {
      if (e.touches.length > 0) {
        const mx = e.touches[0].clientX;
        const my = e.touches[0].clientY;
        
        const now = Date.now();
        const dx = mx - lastMouseRef.current.x;
        const dy = my - lastMouseRef.current.y;
        const dt = now - lastMouseRef.current.time;

        if (dt > 10) {
          const speed = Math.sqrt(dx * dx + dy * dy) / dt;
          // Spawn smaller, fast shockwaves for mobile drags
          if (speed > 4.0 && ripplesRef.current.length < 2) {
            ripplesRef.current.push({
              x: mx,
              y: my,
              r: 0,
              maxR: 240,
              speed: 9,
              intensity: 15,
            });
          }
          lastMouseRef.current = { x: mx, y: my, time: now };
        }

        mouseRef.current.x = mx;
        mouseRef.current.y = my;
        mouseRef.current.active = true;
      }
    };

    const handleTouchEnd = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Add touch support (passive: true ensures page scrolling stays responsive)
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Initialize 3 orbiting planets
    const planets = [
      {
        name: 'Inner',
        color: 'rgba(244, 63, 94, 0.95)', // Rose
        mass: 8,
        orbitRadius: 130, // closer orbits for mobile layouts
        angle: Math.random() * Math.PI * 2,
        speed: 0.0035,
        size: 5.2,
        x: 0,
        y: 0,
        trail: [],
        maxTrailLen: 12,
      },
      {
        name: 'Middle',
        color: 'rgba(20, 184, 166, 0.95)', // Teal
        mass: 14,
        orbitRadius: 240,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002,
        size: 8.0,
        x: 0,
        y: 0,
        hasRing: true,
        trail: [],
        maxTrailLen: 22,
      },
      {
        name: 'Outer',
        color: 'rgba(14, 165, 233, 0.9)', // Sky Blue
        mass: 22,
        orbitRadius: 380,
        angle: Math.random() * Math.PI * 2,
        speed: 0.001,
        size: 10.5,
        x: 0,
        y: 0,
        trail: [],
        maxTrailLen: 32,
      }
    ];

    // Set particle count dynamically: 1200 on mobile viewports (<768px), 5000 on desktop
    const isMobile = width < 768;
    const particleCount = isMobile ? 1200 : 5000;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      const radius = Math.random() * (maxDim * 0.72) + 20;
      const angle = Math.random() * Math.PI * 2;
      
      let color = 'rgba(37, 99, 235, 0.8)'; // Royal Blue
      const roll = Math.random();
      if (roll < 0.25) {
        color = 'rgba(79, 70, 229, 0.78)';
      } else if (roll < 0.45) {
        color = 'rgba(124, 58, 237, 0.76)';
      } else if (roll < 0.7) {
        color = 'rgba(15, 23, 42, 0.5)';
      }

      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        speed: (0.0003 + Math.random() * 0.0006) * (radius < 350 ? 1.4 : 0.8),
        length: 3 + Math.random() * 4.5,
        thickness: 1.1 + Math.random() * 1.1,
        color,
        z: 0.35 + Math.random() * 0.65,
      });
    }

    // Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      
      const mouse = mouseRef.current;
      const systemCenter = systemCenterRef.current;
      const ripples = ripplesRef.current;

      // 1. Interpolate Solar Center
      const targetCenterX = mouse.active ? mouse.x : centerX;
      const targetCenterY = mouse.active ? mouse.y : centerY;
      systemCenter.x = systemCenter.x * 0.92 + targetCenterX * 0.08;
      systemCenter.y = systemCenter.y * 0.92 + targetCenterY * 0.08;

      // 2. Render Solar Corona
      if (mouse.active) {
        ctx.save();
        const pulse = 20 + Math.sin(Date.now() * 0.004) * 3.5;
        const radialGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, pulse + 22
        );
        radialGrad.addColorStop(0, 'rgba(59, 130, 246, 0.16)');
        radialGrad.addColorStop(0.4, 'rgba(59, 130, 246, 0.08)');
        radialGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pulse + 22, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Update & Paint Orbiting Planets
      planets.forEach((p) => {
        p.angle += p.speed;
        p.x = systemCenter.x + Math.cos(p.angle) * p.orbitRadius;
        p.y = systemCenter.y + Math.sin(p.angle) * p.orbitRadius;

        // Record trails
        p.trail.push({ x: p.x, y: p.y });
        if (p.trail.length > p.maxTrailLen) p.trail.shift();

        // Draw trails
        ctx.beginPath();
        for (let j = 0; j < p.trail.length; j++) {
          const pt = p.trail[j];
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.strokeStyle = p.color.replace('0.95', '0.12').replace('0.9', '0.12');
        ctx.lineWidth = p.size * 0.35;
        ctx.stroke();

        // Draw rings
        if (p.hasRing) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(-Math.PI / 6);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.9, p.size * 0.48, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(20, 184, 166, 0.5)';
          ctx.lineWidth = 2.2;
          ctx.stroke();
          ctx.restore();
        }

        // Draw bodies
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update & Render ripples
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.r += rip.speed;
        if (rip.r > rip.maxR) {
          ripples.splice(rIdx, 1);
          continue;
        }

        const opacity = 0.14 * (1 - rip.r / rip.maxR);
        ctx.strokeStyle = `rgba(59, 130, 246, ${opacity})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Update & Paint Asteroids
      for (let i = 0; i < particleCount; i++) {
        const p = particles[i];

        p.angle += p.speed;

        const targetX = systemCenter.x + Math.cos(p.angle) * p.radius;
        const targetY = systemCenter.y + Math.sin(p.angle) * p.radius;

        const defaultVx = (targetX - p.x) * 0.055;
        const defaultVy = (targetY - p.y) * 0.055;

        let ax = 0;
        let ay = 0;
        let damping = 0.94;
        let returnWeight = 0.06;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;

          if (distSqr < 230400 && distSqr > 64) {
            const dist = Math.sqrt(distSqr);
            const G = 1800 * p.z; 
            const accel = G / (distSqr + 500);
            ax += (dx / dist) * accel;
            ay += (dy / dist) * accel;

            if (distSqr < 67600) {
              const ratio = dist / 260;
              damping = 0.68 + ratio * 0.26;
              returnWeight = 0.002 + ratio * 0.058;
            }
          }
        }

        for (let k = 0; k < 3; k++) {
          const pl = planets[k];
          const pdx = pl.x - p.x;
          const pdy = pl.y - p.y;
          const pDistSqr = pdx * pdx + pdy * pdy;

          if (pDistSqr < 5625 && pDistSqr > 36) {
            const pDist = Math.sqrt(pDistSqr);
            const G_planet = 160 * pl.mass * p.z;
            const pAccel = G_planet / (pDistSqr + 120);
            ax += (pdx / pDist) * pAccel;
            ay += (pdy / pDist) * pAccel;
          }
        }

        p.vx = (p.vx + ax) * damping + defaultVx * returnWeight;
        p.vy = (p.vy + ay) * damping + defaultVy * returnWeight;

        for (let rIdx = 0; rIdx < ripples.length; rIdx++) {
          const rip = ripples[rIdx];
          const rdx = p.x - rip.x;
          const rdy = p.y - rip.y;
          const rDist = Math.sqrt(rdx * rdx + rdy * rdy);
          const rDiff = Math.abs(rDist - rip.r);

          if (rDiff < 30) {
            const force = (1 - rDiff / 30) * rip.intensity * (1 - rip.r / rip.maxR);
            p.vx += (rdx / (rDist + 0.1)) * force * p.z * 0.18;
            p.vy += (rdy / (rDist + 0.1)) * force * p.z * 0.18;
          }
        }

        const maxSpeed = 16 * p.z;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        const margin = 40;
        if (p.x < -margin) { p.x = width + margin; p.vx *= -0.2; }
        else if (p.x > width + margin) { p.x = -margin; p.vx *= -0.2; }
        
        if (p.y < -margin) { p.y = height + margin; p.vy *= -0.2; }
        else if (p.y > height + margin) { p.y = -margin; p.vy *= -0.2; }

        const heading = Math.atan2(p.vy, p.vx);

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
      
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
      window.removeEventListener('touchcancel', handleTouchEnd);
    };
  }, []);

  return (
    <div className="interactive-bg" aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
