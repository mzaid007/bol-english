import React, { useEffect, useRef } from 'react';

/**
 * Newtonian Gravitational Solar System Background (Redesigned for premium aesthetics).
 * Renders floating bubbles and twinkling stars swirling in a gravity-well vortex,
 * responsive to mouse clicks, mouse moves, and touch taps.
 * 
 * Improvements:
 * 1. Soft Circular Bubbles & Stars: Replaces sharp dark dashes with gentle, breathing shapes.
 * 2. Playful Burst Particles: Taps/clicks spawn a brief splash of expanding bubbles.
 * 3. Dynamic Scaling: Planet orbits scale relative to viewport width, preventing off-screen loss on mobile.
 * 4. Lower Density: Count reduced (200 desktop, 80 mobile) to prevent clutter and preserve readability.
 */
export default function InteractiveBackground() {
  const canvasRef = useRef(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const lastMouseRef = useRef({ x: 0, y: 0, time: 0 });
  const ripplesRef = useRef([]);
  const burstParticlesRef = useRef([]);
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

    // Click/Touch particle burst emitter
    const spawnBurst = (x, y) => {
      const count = 12 + Math.floor(Math.random() * 8);
      const colorOptions = [
        'rgba(99, 102, 241, OPACITY)', // Soft Indigo
        'rgba(45, 212, 191, OPACITY)',  // Soft Teal
        'rgba(251, 113, 133, OPACITY)', // Soft Rose
        'rgba(251, 191, 36, OPACITY)',  // Warm Amber
        'rgba(167, 139, 250, OPACITY)', // Soft Lavender
      ];

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.0 + Math.random() * 3.0;
        const size = 3 + Math.random() * 5;
        const color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        
        burstParticlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size,
          life: 1.0,
          decay: 0.02 + Math.random() * 0.02,
          color,
        });
      }
    };

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
            maxR: 260,
            speed: 8,
            intensity: 12,
          });
        }
        lastMouseRef.current = { x: mx, y: my, time: now };
      }

      mouseRef.current.x = mx;
      mouseRef.current.y = my;
      mouseRef.current.active = true;
    };

    const handleMouseDown = (e) => {
      spawnBurst(e.clientX, e.clientY);
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
        
        spawnBurst(mx, my);
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
          if (speed > 4.0 && ripplesRef.current.length < 2) {
            ripplesRef.current.push({
              x: mx,
              y: my,
              r: 0,
              maxR: 180,
              speed: 7,
              intensity: 10,
            });
            // Occasional drag bubble bubbles
            if (Math.random() < 0.3) {
              spawnBurst(mx, my);
            }
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
    window.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseleave', handleMouseLeave);
    
    // Touch support
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd);
    window.addEventListener('touchcancel', handleTouchEnd);

    // Orbiting planets (Radii will be scaled dynamically inside render)
    const planets = [
      {
        name: 'Inner',
        color: 'rgba(244, 63, 94, 0.95)', // Rose
        mass: 8,
        orbitRadius: 100,
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
        orbitRadius: 180,
        angle: Math.random() * Math.PI * 2,
        speed: 0.002,
        size: 7.5,
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
        orbitRadius: 280,
        angle: Math.random() * Math.PI * 2,
        speed: 0.001,
        size: 10.0,
        x: 0,
        y: 0,
        trail: [],
        maxTrailLen: 32,
      }
    ];

    // Moderate-density soft particles configuration (bubbles & stars)
    const isMobile = width < 768;
    const particleCount = isMobile ? 120 : 300;
    const particles = [];

    // Soft palette for floaters
    const floaterColors = [
      'rgba(99, 102, 241, OPACITY)', // Soft Indigo
      'rgba(45, 212, 191, OPACITY)',  // Soft Teal
      'rgba(251, 113, 133, OPACITY)', // Soft Rose
      'rgba(251, 191, 36, OPACITY)',  // Warm Amber
      'rgba(167, 139, 250, OPACITY)', // Soft Lavender
    ];

    for (let i = 0; i < particleCount; i++) {
      const maxDim = Math.max(width, height);
      // Keep floaters slightly dispersed from very close orbits to avoid center crowding
      const radius = Math.random() * (maxDim * 0.72) + 30;
      const angle = Math.random() * Math.PI * 2;
      const color = floaterColors[Math.floor(Math.random() * floaterColors.length)];

      particles.push({
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
        vx: 0,
        vy: 0,
        radius,
        angle,
        speed: (0.0002 + Math.random() * 0.0004) * (radius < 350 ? 1.3 : 0.8),
        size: 3 + Math.random() * 7, // Bubble radius or star arm length
        thickness: 1.0 + Math.random() * 1.0,
        color,
        z: 0.35 + Math.random() * 0.65,
        isStar: Math.random() < 0.25, // 25% twinkling stars, 75% soft bubbles
        pulseSpeed: 0.8 + Math.random() * 1.5,
        pulsePhase: Math.random() * Math.PI * 2,
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
        const pulse = 15 + Math.sin(Date.now() * 0.004) * 2.5;
        const radialGrad = ctx.createRadialGradient(
          mouse.x, mouse.y, 0,
          mouse.x, mouse.y, pulse + 15
        );
        radialGrad.addColorStop(0, 'rgba(99, 102, 241, 0.12)');
        radialGrad.addColorStop(0.5, 'rgba(99, 102, 241, 0.06)');
        radialGrad.addColorStop(1, 'rgba(99, 102, 241, 0)');
        ctx.fillStyle = radialGrad;
        ctx.beginPath();
        ctx.arc(mouse.x, mouse.y, pulse + 15, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Update & Paint Orbiting Planets (Responsive scaling)
      planets.forEach((p, idx) => {
        // Dynamically scale orbit radii based on viewport size
        if (idx === 0) p.orbitRadius = Math.max(60, width * 0.14);
        else if (idx === 1) p.orbitRadius = Math.max(110, width * 0.26);
        else p.orbitRadius = Math.max(160, width * 0.38);

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
        ctx.strokeStyle = p.color.replace('0.95', '0.08').replace('0.9', '0.08');
        ctx.lineWidth = p.size * 0.35;
        ctx.stroke();

        // Draw rings
        if (p.hasRing) {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(-Math.PI / 6);
          ctx.beginPath();
          ctx.ellipse(0, 0, p.size * 1.8, p.size * 0.45, 0, 0, Math.PI * 2);
          ctx.strokeStyle = 'rgba(20, 184, 166, 0.35)';
          ctx.lineWidth = 1.8;
          ctx.stroke();
          ctx.restore();
        }

        // Draw bodies
        ctx.fillStyle = p.color.replace('0.95', '0.7').replace('0.9', '0.7'); // make slightly translucent
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Update & Render expanding ripples (waves)
      for (let rIdx = ripples.length - 1; rIdx >= 0; rIdx--) {
        const rip = ripples[rIdx];
        rip.r += rip.speed;
        if (rip.r > rip.maxR) {
          ripples.splice(rIdx, 1);
          continue;
        }

        const opacity = 0.08 * (1 - rip.r / rip.maxR);
        ctx.strokeStyle = `rgba(99, 102, 241, ${opacity})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(rip.x, rip.y, rip.r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // 5. Update & Paint Click/Touch Burst Particles
      const burstParticles = burstParticlesRef.current;
      for (let bIdx = burstParticles.length - 1; bIdx >= 0; bIdx--) {
        const bp = burstParticles[bIdx];
        bp.x += bp.vx;
        bp.y += bp.vy;
        bp.vx *= 0.96; // air resistance
        bp.vy *= 0.96;
        bp.life -= bp.decay;

        if (bp.life <= 0) {
          burstParticles.splice(bIdx, 1);
          continue;
        }

        // Render burst particle
        const opacity = (bp.life * 0.45).toFixed(3);
        ctx.fillStyle = bp.color.replace('OPACITY', opacity);
        ctx.beginPath();
        ctx.arc(bp.x, bp.y, bp.size * bp.life, 0, Math.PI * 2);
        ctx.fill();
      }

      // 6. Update & Paint Ambient Particles (bubbles & stars)
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

        // Mouse attraction
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const distSqr = dx * dx + dy * dy;

          if (distSqr < 200000 && distSqr > 64) {
            const dist = Math.sqrt(distSqr);
            const G = 1500 * p.z; 
            const accel = G / (distSqr + 500);
            ax += (dx / dist) * accel;
            ay += (dy / dist) * accel;

            if (distSqr < 60000) {
              const ratio = dist / 245;
              damping = 0.70 + ratio * 0.24;
              returnWeight = 0.005 + ratio * 0.055;
            }
          }
        }

        // Planet deflection wakes
        for (let k = 0; k < 3; k++) {
          const pl = planets[k];
          const pdx = pl.x - p.x;
          const pdy = pl.y - p.y;
          const pDistSqr = pdx * pdx + pdy * pdy;

          if (pDistSqr < 4900 && pDistSqr > 36) {
            const pDist = Math.sqrt(pDistSqr);
            const G_planet = 120 * pl.mass * p.z;
            const pAccel = G_planet / (pDistSqr + 100);
            ax += (pdx / pDist) * pAccel;
            ay += (pdy / pDist) * pAccel;
          }
        }

        // Ripple pushing forces
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

        const maxSpeed = 14 * p.z;
        const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
        if (speed > maxSpeed) {
          p.vx = (p.vx / speed) * maxSpeed;
          p.vy = (p.vy / speed) * maxSpeed;
        }

        p.x += p.vx;
        p.y += p.vy;

        // Wrap boundaries
        const margin = 40;
        if (p.x < -margin) { p.x = width + margin; p.vx *= -0.2; }
        else if (p.x > width + margin) { p.x = -margin; p.vx *= -0.2; }
        
        if (p.y < -margin) { p.y = height + margin; p.vy *= -0.2; }
        else if (p.y > height + margin) { p.y = -margin; p.vy *= -0.2; }

        p.vx = (p.vx + ax) * damping + defaultVx * returnWeight;
        p.vy = (p.vy + ay) * damping + defaultVy * returnWeight;

        // Dynamic pulsing opacity calculations (highly translucent)
        const currentOpacity = (0.05 + Math.sin(Date.now() * 0.001 * p.pulseSpeed + p.pulsePhase) * 0.04) * p.z;
        const drawOpacity = Math.max(0.015, Math.min(0.18, currentOpacity));

        if (p.isStar) {
          // Render twinkling star (small cross)
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle * 0.15); // gentle spin
          ctx.strokeStyle = p.color.replace('OPACITY', drawOpacity.toFixed(3));
          ctx.lineWidth = p.thickness * p.z;
          ctx.beginPath();
          ctx.moveTo(-p.size, 0);
          ctx.lineTo(p.size, 0);
          ctx.moveTo(0, -p.size);
          ctx.lineTo(0, p.size);
          ctx.stroke();
          ctx.restore();
        } else {
          // Render soft floating bubble
          ctx.fillStyle = p.color.replace('OPACITY', drawOpacity.toFixed(3));
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size * p.z, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      animationId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
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
