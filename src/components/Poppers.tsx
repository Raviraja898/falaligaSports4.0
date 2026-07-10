import React, { useEffect, useRef } from "react";

interface ConfettiParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  alpha: number;
  decay: number;
  gravity: number;
}

interface PoppersProps {
  active: boolean;
  accentColor?: string;
}

const BASE_COLORS = ["#22d3ee", "#facc15", "#f97316", "#34d399", "#ffffff", "#fb7185"];

export const Poppers: React.FC<PoppersProps> = ({ active, accentColor }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId = 0;
    const particles: ConfettiParticle[] = [];
    const colors = accentColor ? [accentColor, ...BASE_COLORS] : BASE_COLORS;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const spawnBurst = (originX: number, direction: 1 | -1) => {
      const count = 45;
      for (let i = 0; i < count; i += 1) {
        const spread = Math.PI / 3;
        const baseAngle = direction === 1 ? -Math.PI / 3 : -2 * Math.PI / 3;
        const angle = baseAngle + (Math.random() - 0.5) * spread;
        const speed = 6 + Math.random() * 6;

        particles.push({
          x: originX,
          y: canvas.height - 32,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: 3 + Math.random() * 5,
          rotation: Math.random() * Math.PI,
          rotationSpeed: (Math.random() - 0.5) * 0.25,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 1,
          decay: 0.009 + Math.random() * 0.012,
          gravity: 0.14 + Math.random() * 0.06,
        });
      }
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    spawnBurst(80, 1);
    spawnBurst(canvas.width - 80, -1);

    let frameCount = 0;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      frameCount += 1;
      if (frameCount % 20 === 0) {
        spawnBurst(80, 1);
        spawnBurst(canvas.width - 80, -1);
      }

      for (let i = particles.length - 1; i >= 0; i -= 1) {
        const particle = particles[i];

        particle.x += particle.vx;
        particle.y += particle.vy;
        particle.vy += particle.gravity;
        particle.vx *= 0.985;
        particle.vy *= 0.99;
        particle.rotation += particle.rotationSpeed;
        particle.alpha -= particle.decay;

        if (particle.alpha <= 0 || particle.y > canvas.height + 24) {
          particles.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = particle.alpha;
        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillStyle = particle.color;
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size * 1.6);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [active, accentColor]);

  if (!active) return null;

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 z-40" />;
};
