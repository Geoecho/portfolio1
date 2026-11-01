import { useEffect, useRef } from 'react';
import { useMotionPreference } from '../hooks/useMotionPreference';

type Point = { x: number; y: number };
type Ripple = Point & { born: number; radius: number; opacity: number };
type GridPoint = Point & { proximity: number };

const RED = '214,0,0';
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

export default function KineticGrid() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const reducedMotion = useMotionPreference();

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext('2d');
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let frame = 0;
    let lastFrame = 0;
    let pointer: Point | null = null;
    let target: Point | null = null;
    let pointerStrength = 0;
    let ripples: Ripple[] = [];

    const draw = (now: number) => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = '#ffffff';
      context.fillRect(0, 0, width, height);

      ripples = ripples.filter(ripple => {
        const age = Math.max(0, (now - ripple.born) / 1000);
        ripple.radius = age * 400;
        ripple.opacity = Math.max(0, 1 - age * 1.2);
        return ripple.opacity > 0;
      });

      const cellSize = width < 640 ? 52 : 64;
      const cols = Math.max(2, Math.ceil(width / cellSize)) + 1;
      const rows = Math.max(2, Math.ceil(height / cellSize)) + 1;
      const cellWidth = width / (cols - 1);
      const cellHeight = height / (rows - 1);
      const influence = width < 640 ? 180 : 260;
      const points: GridPoint[][] = [];

      // Small red dots sit between the larger, elastic grid intersections.
      context.fillStyle = `rgba(${RED},0.045)`;
      for (let x = 14; x < width; x += 28) {
        for (let y = 14; y < height; y += 28) {
          context.beginPath();
          context.arc(x, y, 0.6, 0, Math.PI * 2);
          context.fill();
        }
      }

      for (let row = 0; row < rows; row++) {
        points[row] = [];
        for (let col = 0; col < cols; col++) {
          const x = col * cellWidth;
          const y = row * cellHeight;
          const colPin = Math.min(col / 1.5, (cols - 1 - col) / 1.5, 1);
          const rowPin = Math.min(row / 1.5, (rows - 1 - row) / 1.5, 1);
          const pin = colPin ** 2 * rowPin ** 2;
          const dx = pointer ? x - pointer.x : 0;
          const dy = pointer ? y - pointer.y : 0;
          const distance = Math.hypot(dx, dy);
          let proximity = pointer ? Math.max(0, 1 - distance / influence) * pin * pointerStrength : 0;
          let offsetX = 0;
          let offsetY = 0;

          if (pointer && distance > 0 && distance < influence) {
            const falloff = (1 - distance / influence) ** 2 * Math.min(1, distance / 60);
            const warp = falloff * 24 * pin * pointerStrength;
            offsetX -= dx / distance * warp;
            offsetY -= dy / distance * warp;
          }

          for (const ripple of ripples) {
            const rx = x - ripple.x;
            const ry = y - ripple.y;
            const rippleDistance = Math.hypot(rx, ry);
            const difference = rippleDistance - ripple.radius;
            if (Math.abs(difference) >= 55 || rippleDistance === 0) continue;
            const wave = (1 - Math.abs(difference) / 55) * ripple.opacity * pin;
            const displacement = wave * 18 * (difference < 0 ? 1 : -1);
            offsetX += rx / rippleDistance * displacement;
            offsetY += ry / rippleDistance * displacement;
            proximity = Math.max(proximity, wave * 0.8);
          }

          points[row][col] = { x: x + offsetX, y: y + offsetY, proximity };
        }
      }

      const drawSegment = (from: GridPoint, to: GridPoint) => {
        const average = (from.proximity + to.proximity) / 2;
        const active = average * average * (3 - 2 * average);
        context.beginPath();
        context.moveTo(from.x, from.y);
        context.lineTo(to.x, to.y);
        context.strokeStyle = `rgba(${RED},${lerp(0.075, 0.85, active)})`;
        context.lineWidth = lerp(0.65, 1.35, active);
        context.stroke();
      };

      for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
          const point = points[row][col];
          if (col < cols - 1) drawSegment(point, points[row][col + 1]);
          if (row < rows - 1) drawSegment(point, points[row + 1][col]);
        }
      }

      for (const row of points) {
        for (const point of row) {
          const active = point.proximity ** 2 * (3 - 2 * point.proximity);
          const radius = lerp(1.1, 3.2, active);
          if (active > 0.3) {
            const glowRadius = radius + (active - 0.3) / 0.7 * 6;
            const glow = context.createRadialGradient(point.x, point.y, radius / 2, point.x, point.y, glowRadius);
            glow.addColorStop(0, `rgba(${RED},${active * 0.22})`);
            glow.addColorStop(1, `rgba(${RED},0)`);
            context.beginPath();
            context.arc(point.x, point.y, glowRadius, 0, Math.PI * 2);
            context.fillStyle = glow;
            context.fill();
          }
          context.beginPath();
          context.arc(point.x, point.y, radius, 0, Math.PI * 2);
          context.fillStyle = `rgba(${RED},${lerp(0.17, 1, active)})`;
          context.fill();
        }
      }

      for (const ripple of ripples) {
        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.strokeStyle = `rgba(${RED},${ripple.opacity * 0.28})`;
        context.lineWidth = 1.5;
        context.stroke();
      }
    };

    // Render only while the grid is responding, then let the canvas rest.
    const animate = (now: number) => {
      frame = 0;
      const elapsed = lastFrame ? Math.min(64, now - lastFrame) : 16.67;
      lastFrame = now;
      const amount = 1 - (1 - 0.08) ** (elapsed / 16.67);
      if (pointer && target) {
        pointer.x = lerp(pointer.x, target.x, amount);
        pointer.y = lerp(pointer.y, target.y, amount);
      }
      pointerStrength = lerp(pointerStrength, target ? 1 : 0, amount);
      const moving = Boolean(pointer && target && Math.hypot(pointer.x - target.x, pointer.y - target.y) > 0.1);
      const fading = Math.abs(pointerStrength - (target ? 1 : 0)) > 0.001;
      if (!moving && !fading) {
        pointerStrength = target ? 1 : 0;
        if (pointer && target) pointer = { ...target };
        if (!target) pointer = null;
      }
      draw(now);
      if (moving || fading || ripples.length) frame = requestAnimationFrame(animate);
    };

    const requestDraw = () => {
      if (frame || document.hidden || reducedMotion) return;
      lastFrame = 0;
      frame = requestAnimationFrame(animate);
    };

    const resize = () => {
      const bounds = canvas.getBoundingClientRect();
      width = bounds.width;
      height = bounds.height;
      if (!width || !height) return;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 2, Math.max(1, Math.sqrt(5_000_000 / Math.max(1, width * height))));
      canvas.width = Math.round(width * pixelRatio);
      canvas.height = Math.round(height * pixelRatio);
      context.setTransform(canvas.width / width, 0, 0, canvas.height / height, 0, 0);
      draw(performance.now());
    };

    const leave = () => { target = null; requestDraw(); };
    const isCovered = (element: EventTarget | null) => element instanceof Element && element.closest('[role="dialog"], [aria-modal="true"]');
    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === 'touch' || isCovered(event.target)) return;
      if (event.clientX < 0 || event.clientY < 0 || event.clientX >= width || event.clientY >= height) {
        leave();
        return;
      }
      target = { x: event.clientX, y: event.clientY };
      if (!pointer) pointer = { ...target };
      requestDraw();
    };
    const onPointerOut = (event: PointerEvent) => { if (!event.relatedTarget) leave(); };
    const onClick = (event: MouseEvent) => {
      if (!event.detail || isCovered(event.target)) return;
      ripples.push({ x: event.clientX, y: event.clientY, radius: 0, opacity: 1, born: performance.now() });
      ripples = ripples.slice(-6);
      requestDraw();
    };
    const onVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(frame);
        frame = 0;
        target = null;
        pointer = null;
        pointerStrength = 0;
        ripples = [];
      } else {
        draw(performance.now());
      }
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    if (!reducedMotion) {
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerout', onPointerOut, { passive: true });
      window.addEventListener('click', onClick, { passive: true });
      window.addEventListener('blur', leave);
      document.addEventListener('visibilitychange', onVisibilityChange);
    }

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerout', onPointerOut);
      window.removeEventListener('click', onClick);
      window.removeEventListener('blur', leave);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [reducedMotion]);

  return <canvas ref={canvasRef} className="kinetic-grid" aria-hidden="true" />;
}
