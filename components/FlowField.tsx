"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  prevX: number;
  prevY: number;
  speed: number;
  life: number;
  maxLife: number;
  colorIdx: number;
  wrapped: boolean;
}

// Màu đậm hơn để nổi bật trên nền sáng
const COLORS: [number, number, number][] = [
  [79, 70, 229],   // deep indigo  #4F46E5
  [124, 58, 237],  // deep violet  #7C3AED
  [6, 182, 212],   // deep cyan    #06B6D4
  [16, 185, 129],  // emerald      #10B981
];

function fieldNoise(x: number, y: number, t: number): number {
  const a = Math.sin(x * 0.0035 + t * 0.28) * Math.cos(y * 0.003 + t * 0.18);
  const b = Math.cos(x * 0.007 - y * 0.005 + t * 0.44) * 0.52;
  const c = Math.sin((x + y) * 0.003 + t * 0.12) * 0.3;
  const d = Math.cos(x * 0.002 + y * 0.008 - t * 0.09) * 0.18;
  return a + b + c + d;
}

function getAngle(x: number, y: number, t: number): number {
  return fieldNoise(x, y, t) * Math.PI * 1.85;
}

function makeParticle(w: number, h: number, stagger = false): Particle {
  const maxLife = 200 + Math.random() * 280;
  const x = Math.random() * w;
  const y = Math.random() * h;
  return {
    x,
    y,
    prevX: x,
    prevY: y,
    speed: 0.45 + Math.random() * 0.55,
    life: stagger ? Math.random() * maxLife : 0,
    maxLife,
    colorIdx: Math.floor(Math.random() * COLORS.length),
    wrapped: true,
  };
}

export default function FlowField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas: HTMLCanvasElement = canvasRef.current;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // alpha: true — canvas trong suốt, nền gradient CSS hiển thị phía sau
    const ctxOrNull = canvas.getContext("2d", { alpha: true });
    if (!ctxOrNull) return;
    const ctx: CanvasRenderingContext2D = ctxOrNull;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    let w = 0;
    let h = 0;
    let particles: Particle[] = [];
    let rafId = 0;
    let t = 0;

    function setup() {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = Math.floor(w * DPR);
      canvas.height = Math.floor(h * DPR);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

      // Canvas trong suốt — không fill màu nền
      ctx.clearRect(0, 0, w, h);

      const count = Math.max(80, Math.min(240, Math.floor((w * h) / 5500)));
      particles = Array.from({ length: count }, () => makeParticle(w, h, true));
    }

    function frame() {
      t += 0.007;

      // Dùng destination-out để fade trail về transparent
      // → nền gradient CSS hiện ra phía sau trail cũ
      ctx.save();
      ctx.globalCompositeOperation = "destination-out";
      ctx.fillStyle = "rgba(0,0,0,0.07)"; // tốc độ fade: 7%/frame
      ctx.fillRect(0, 0, w, h);
      ctx.restore();

      ctx.lineWidth = 1;
      ctx.lineCap = "round";

      for (const p of particles) {
        p.life += 1;

        // Envelope fade in/out theo vòng đời
        const r = p.life / p.maxLife;
        const alpha = r < 0.1 ? r / 0.1 : r > 0.86 ? (1 - r) / 0.14 : 1;

        if (!p.wrapped) {
          const [cr, cg, cb] = COLORS[p.colorIdx];
          ctx.beginPath();
          // Opacity cao hơn so với dark theme để nổi bật trên nền sáng
          ctx.strokeStyle = `rgba(${cr},${cg},${cb},${(alpha * 0.5).toFixed(3)})`;
          ctx.moveTo(p.prevX, p.prevY);
          ctx.lineTo(p.x, p.y);
          ctx.stroke();
        }

        p.prevX = p.x;
        p.prevY = p.y;
        p.wrapped = false;

        const angle = getAngle(p.x, p.y, t);
        p.x += Math.cos(angle) * p.speed;
        p.y += Math.sin(angle) * p.speed;

        if (p.life >= p.maxLife) {
          const nx = Math.random() * w;
          const ny = Math.random() * h;
          p.x = nx; p.y = ny; p.prevX = nx; p.prevY = ny;
          p.life = 0;
          p.maxLife = 200 + Math.random() * 280;
          p.colorIdx = Math.floor(Math.random() * COLORS.length);
          p.wrapped = true;
          continue;
        }

        const pad = 12;
        if (p.x < -pad)     { p.x = w + pad; p.prevX = p.x; p.wrapped = true; }
        else if (p.x > w + pad) { p.x = -pad; p.prevX = p.x; p.wrapped = true; }
        if (p.y < -pad)     { p.y = h + pad; p.prevY = p.y; p.wrapped = true; }
        else if (p.y > h + pad) { p.y = -pad; p.prevY = p.y; p.wrapped = true; }
      }

      rafId = requestAnimationFrame(frame);
    }

    setup();
    rafId = requestAnimationFrame(frame);

    function onResize() {
      cancelAnimationFrame(rafId);
      setup();
      rafId = requestAnimationFrame(frame);
    }

    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
      }}
    />
  );
}
