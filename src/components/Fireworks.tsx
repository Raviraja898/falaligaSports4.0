import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  alpha: number;
  decay: number;
}

export const Fireworks: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const colors = ["#ff0055", "#00ffcc", "#ffcc00", "#ff6600", "#9900ff", "#00ff00", "#ffffff"];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const createFirework = (x: number, y: number) => {
      const count = 80 + Math.random() * 40;
      const baseColor = colors[Math.floor(Math.random() * colors.length)];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 2 + Math.random() * 8;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          color: Math.random() > 0.5 ? baseColor : colors[Math.floor(Math.random() * colors.length)],
          radius: 1.5 + Math.random() * 3,
          alpha: 1,
          decay: 0.01 + Math.random() * 0.015,
        });
      }
    };

    // Auto trigger random fireworks
    let timer = 0;

    const render = () => {
      ctx.fillStyle = "rgba(10, 15, 30, 0.25)"; // semi-transparent background for trails
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      timer++;
      if (timer % 25 === 0) {
        // Explode firework at random location
        const rx = 100 + Math.random() * (canvas.width - 200);
        const ry = 100 + Math.random() * (canvas.height / 2);
        createFirework(rx, ry);
      }

      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.vx *= 0.98; // drag
        p.vy *= 0.98;
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particles.splice(idx, 1);
          return;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    // Initial bursts
    createFirework(canvas.width / 4, canvas.height / 3);
    createFirework(canvas.width / 2, canvas.height / 4);
    createFirework((canvas.width * 3) / 4, canvas.height / 3);

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-50"
    />
  );
};
