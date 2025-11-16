"use client";

import { useEffect, useRef } from "react";

const STAR_COUNT = 140;
const CLOUD_LAYERS = 3;

type Star = {
  x: number;
  y: number;
  size: number;
  twinkleOffset: number;
};

type Cloud = {
  y: number;
  amplitude: number;
  speed: number;
  seed: number;
};

export function SolarWingCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;
    const ctx = context;

    let animationFrame = 0;
    const ratio = window.devicePixelRatio || 1;
    const stars: Star[] = Array.from({ length: STAR_COUNT }, (_, i) => ({
      x: Math.random(),
      y: Math.random(),
      size: Math.random() * 1.2 + 0.3,
      twinkleOffset: (i / STAR_COUNT) * Math.PI * 2,
    }));

    const clouds: Cloud[] = Array.from({ length: CLOUD_LAYERS }, (_, i) => ({
      y: 0.45 + i * 0.12,
      amplitude: 0.008 + Math.random() * 0.01,
      speed: 0.0006 + i * 0.0002,
      seed: Math.random() * 1000,
    }));

    function resize() {
      if (!canvas) {
        return;
      }
      if (!ctx) {
        return;
      }
      const { clientWidth, clientHeight } = canvas;
      canvas.width = clientWidth * ratio;
      canvas.height = clientHeight * ratio;
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    }

    const observer = new ResizeObserver(resize);
    observer.observe(canvas);

    function drawSky(width: number, height: number) {
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, "#1b2760");
      gradient.addColorStop(0.45, "#162046");
      gradient.addColorStop(1, "#050911");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    }

    function drawSun(width: number, height: number, time: number) {
      const sunX = width * 0.15;
      const sunY = height * 0.22;
      const pulse = (Math.sin(time * 0.0008) + 1) * 0.5;
      const outerRadius = width * 0.22 + pulse * 18;
      const innerRadius = width * 0.06 + pulse * 6;

      const gradient = ctx.createRadialGradient(sunX, sunY, innerRadius * 0.2, sunX, sunY, outerRadius);
      gradient.addColorStop(0, "rgba(255, 255, 210, 0.92)");
      gradient.addColorStop(0.4, "rgba(255, 205, 115, 0.65)");
      gradient.addColorStop(1, "rgba(15, 26, 49, 0)");

      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(sunX, sunY, outerRadius, 0, Math.PI * 2);
      ctx.fill();
    }

    function drawStars(width: number, height: number, time: number) {
      ctx.save();
      ctx.fillStyle = "white";
      for (const star of stars) {
        const twinkle = (Math.sin(time * 0.002 + star.twinkleOffset) + 1) * 0.5;
        const opacity = 0.35 + twinkle * 0.5;
        ctx.globalAlpha = opacity;
        const x = star.x * width;
        const y = star.y * height * 0.5;
        ctx.beginPath();
        ctx.arc(x, y, star.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }

    function drawClouds(width: number, height: number, time: number) {
      ctx.save();
      ctx.filter = "blur(14px)";
      clouds.forEach((cloud, index) => {
        const baseY = height * cloud.y;
        const gradient = ctx.createLinearGradient(0, baseY, 0, baseY + height * 0.12);
        gradient.addColorStop(0, `rgba(120, 160, 215, ${0.12 - index * 0.02})`);
        gradient.addColorStop(1, "rgba(26, 38, 70, 0)");
        ctx.fillStyle = gradient;

        ctx.beginPath();
        const waveCount = 6 + index * 2;
        const amplitude = height * cloud.amplitude;
        const offset = ((time * cloud.speed + cloud.seed) % 1) * width;
        ctx.moveTo(-width, baseY + Math.sin(cloud.seed) * amplitude);
        for (let i = -waveCount; i <= waveCount + 2; i++) {
          const x = (i / waveCount) * width + offset;
          const angle = i * Math.PI * 0.5;
          ctx.quadraticCurveTo(
            x - width / waveCount / 2,
            baseY + Math.sin(angle + cloud.seed) * amplitude,
            x,
            baseY + Math.sin(angle + cloud.seed + 0.5) * amplitude
          );
        }
        ctx.lineTo(width * 2, height);
        ctx.lineTo(-width, height);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();
    }

    function drawWing(width: number, height: number, time: number) {
      ctx.save();
      const centerX = width * 0.54;
      const centerY = height * 0.46 + Math.sin(time * 0.0012) * 12;
      const span = width * 0.65;
      const chord = height * 0.14;

      ctx.translate(centerX, centerY);
      ctx.rotate(Math.sin(time * 0.0008) * 0.035);

      // Wing body
      const wingGradient = ctx.createLinearGradient(-span / 2, 0, span / 2, 0);
      wingGradient.addColorStop(0, "#0b1933");
      wingGradient.addColorStop(0.5, "#0f274a");
      wingGradient.addColorStop(1, "#08101f");
      ctx.fillStyle = wingGradient;

      ctx.beginPath();
      ctx.moveTo(-span / 2, 0);
      ctx.quadraticCurveTo(-span * 0.3, -chord * 1.1, 0, -chord * 1.35);
      ctx.quadraticCurveTo(span * 0.3, -chord * 1.1, span / 2, 0);
      ctx.quadraticCurveTo(span * 0.22, chord * 0.6, 0, chord * 0.8);
      ctx.quadraticCurveTo(-span * 0.22, chord * 0.6, -span / 2, 0);
      ctx.closePath();
      ctx.fill();

      // Solar cells grid
      const panelCount = 8;
      const panelPadding = chord * 0.1;
      const panelHeight = chord * 0.55;
      for (let i = 0; i < panelCount; i++) {
        const t = i / (panelCount - 1);
        const x = -span * 0.45 + t * span * 0.9;
        const tilt = Math.sin(t * Math.PI) * 0.15;
        ctx.save();
        ctx.translate(x, -panelHeight * 0.32 + panelPadding);
        ctx.rotate(tilt);
        const panelWidth = span * 0.08;
        const panelGradient = ctx.createLinearGradient(0, 0, panelWidth, panelHeight);
        panelGradient.addColorStop(0, "#14284f");
        panelGradient.addColorStop(1, "#1c3c6d");

        ctx.fillStyle = panelGradient;
        ctx.strokeStyle = "rgba(50, 120, 200, 0.6)";
        ctx.lineWidth = 1.4;
        const corner = 6;
        ctx.beginPath();
        ctx.moveTo(corner, 0);
        ctx.lineTo(panelWidth - corner, 0);
        ctx.quadraticCurveTo(panelWidth, 0, panelWidth, corner);
        ctx.lineTo(panelWidth, panelHeight - corner);
        ctx.quadraticCurveTo(panelWidth, panelHeight, panelWidth - corner, panelHeight);
        ctx.lineTo(corner, panelHeight);
        ctx.quadraticCurveTo(0, panelHeight, 0, panelHeight - corner);
        ctx.lineTo(0, corner);
        ctx.quadraticCurveTo(0, 0, corner, 0);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 0.6;
        ctx.stroke();
        ctx.globalAlpha = 1;

        // Cell divisions
        ctx.strokeStyle = "rgba(110, 170, 255, 0.4)";
        ctx.lineWidth = 0.6;
        ctx.beginPath();
        ctx.moveTo(panelWidth * 0.33, 6);
        ctx.lineTo(panelWidth * 0.33, panelHeight - 6);
        ctx.moveTo(panelWidth * 0.66, 6);
        ctx.lineTo(panelWidth * 0.66, panelHeight - 6);
        ctx.moveTo(6, panelHeight * 0.5);
        ctx.lineTo(panelWidth - 6, panelHeight * 0.5);
        ctx.stroke();
        ctx.restore();
      }

      // Leading edge highlight
      ctx.strokeStyle = "rgba(180, 220, 255, 0.18)";
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(-span / 2, 0);
      ctx.quadraticCurveTo(-span * 0.28, -chord * 1.05, 0, -chord * 1.3);
      ctx.quadraticCurveTo(span * 0.28, -chord * 1.05, span / 2, 0);
      ctx.stroke();

      // Cockpit glow
      ctx.fillStyle = "rgba(120, 200, 255, 0.28)";
      ctx.beginPath();
      ctx.ellipse(0, -chord * 0.6, span * 0.12, chord * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();

      // Underside reflection
      ctx.globalAlpha = 0.4;
      ctx.beginPath();
      ctx.moveTo(-span * 0.45, chord * 0.8);
      ctx.quadraticCurveTo(0, chord * 1.15, span * 0.45, chord * 0.8);
      ctx.lineTo(span * 0.35, chord * 1.15);
      ctx.quadraticCurveTo(0, chord * 1.35, -span * 0.35, chord * 1.15);
      ctx.closePath();
      ctx.fillStyle = "rgba(20, 45, 85, 0.55)";
      ctx.fill();
      ctx.globalAlpha = 1;

      // Wake trails
      ctx.strokeStyle = "rgba(100, 170, 255, 0.28)";
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-span * 0.1, chord * 0.85);
      ctx.quadraticCurveTo(-span * 0.28, chord * 1.2 + Math.sin(time * 0.002) * 12, -span * 0.34, chord * 1.6);
      ctx.moveTo(span * 0.1, chord * 0.85);
      ctx.quadraticCurveTo(span * 0.28, chord * 1.2 + Math.cos(time * 0.002) * 12, span * 0.34, chord * 1.55);
      ctx.stroke();

      ctx.restore();
    }

    function drawForeground(width: number, height: number) {
      const gradient = ctx.createLinearGradient(0, height * 0.8, 0, height);
      gradient.addColorStop(0, "rgba(10, 20, 40, 0)");
      gradient.addColorStop(1, "rgba(4, 8, 14, 0.85)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, height * 0.7, width, height * 0.3);
    }

    function render(time: number) {
      if (!canvas) {
        return;
      }
      if (!ctx) {
        return;
      }
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;

      ctx.clearRect(0, 0, width, height);
      drawSky(width, height);
      drawSun(width, height, time);
      drawStars(width, height, time);
      drawClouds(width, height, time);
      drawWing(width, height, time);
      drawForeground(width, height);

      animationFrame = window.requestAnimationFrame(render);
    }

    resize();
    animationFrame = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
}
