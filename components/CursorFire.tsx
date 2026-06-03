"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  size: number;
  hue: number;      // 15-50  →  gold → orange → red
  saturation: number;
}

export default function CursorFire() {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const dotRef     = useRef<HTMLDivElement>(null);
  const particles  = useRef<Particle[]>([]);
  const mouse      = useRef({ x: -999, y: -999, moving: false });
  const raf        = useRef<number>(0);
  const lastSpawn  = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    /* ── resize ─────────────────────────────────────────────── */
    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    /* ── mouse tracking ──────────────────────────────────────── */
    const onMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY, moving: true };
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    /* ── spawn one fire particle ─────────────────────────────── */
    const spawn = (x: number, y: number) => {
      if (particles.current.length > 220) return;          // cap
      const angle  = Math.random() * Math.PI * 2;
      const spread = Math.random() * 6;
      particles.current.push({
        x: x + (Math.random() - 0.5) * 8,
        y: y + (Math.random() - 0.5) * 8,
        vx: Math.cos(angle) * spread * 0.3,
        vy: -(Math.random() * 3.5 + 1.2),                 // upward
        life:       1,
        maxLife:    Math.random() * 50 + 25,
        size:       Math.random() * 22 + 6,
        hue:        Math.random() * 35 + 18,               // 18-53
        saturation: Math.random() * 20 + 80,               // 80-100 %
      });
    };

    /* ── draw loop ───────────────────────────────────────────── */
    const draw = (ts: number) => {
      raf.current = requestAnimationFrame(draw);

      /* spawn rate — 4 particles every ~16 ms while moving */
      if (mouse.current.moving && ts - lastSpawn.current > 12) {
        for (let i = 0; i < 4; i++) spawn(mouse.current.x, mouse.current.y);
        lastSpawn.current = ts;
        mouse.current.moving = false;
      }

      /* clear with very slight trail for a "smear" glow */
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      /* additive blending = fire glow accumulates nicely */
      ctx.globalCompositeOperation = "lighter";

      particles.current = particles.current.filter((p) => {
        p.life--;
        p.x  += p.vx;
        p.y  += p.vy;
        p.vx *= 0.97;
        p.vy  = p.vy * 0.97 - 0.06;                       // gravity decel
        p.size *= 0.965;

        if (p.life <= 0 || p.size < 0.8) return false;

        const alpha = (p.life / p.maxLife) * 0.9;
        const r     = p.size;

        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, r);
        g.addColorStop(0,    `hsla(${p.hue + 20}, ${p.saturation}%, 90%, ${alpha})`);   // bright core
        g.addColorStop(0.35, `hsla(${p.hue},      ${p.saturation}%, 65%, ${alpha * 0.8})`);
        g.addColorStop(0.7,  `hsla(${p.hue - 15}, ${p.saturation}%, 45%, ${alpha * 0.4})`);
        g.addColorStop(1,    `hsla(${p.hue - 30}, 80%, 20%, 0)`);

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = g;
        ctx.fill();
        return true;
      });
    };

    raf.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMouseMove);
      cancelAnimationFrame(raf.current);
    };
  }, []);

  return (
    <>
      {/* Fire trail canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 9998,
        }}
      />

      {/* Precise cursor dot */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "10px",
          height: "10px",
          borderRadius: "50%",
          background: "#fff",
          boxShadow: "0 0 8px 2px rgba(232,180,0,0.9), 0 0 2px 1px #fff",
          pointerEvents: "none",
          zIndex: 9999,
          transition: "transform 0.05s linear",
          willChange: "transform",
        }}
      />
    </>
  );
}
