"use client";

import { RefObject, useEffect, useRef } from 'react';
import type { Particle } from '../types';

interface Props {
    particlesRef: RefObject<Particle[]>;
    isMobile: boolean;
}

export function Particles({ particlesRef, isMobile }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resize();
        window.addEventListener('resize', resize);

        const maxVisible = isMobile ? 8 : 20;

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const particles = particlesRef.current;
            const now = performance.now();
            const start = Math.max(0, particles.length - maxVisible);

            for (let i = start; i < particles.length; i++) {
                const p = particles[i]!;
                const elapsed = now - p.born;
                const progress = Math.min(elapsed / p.life, 1);
                const opacity = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.3);

                ctx.save();
                ctx.globalAlpha = opacity;
                ctx.translate(p.x, p.y);
                ctx.rotate((p.rot * Math.PI) / 180);
                ctx.font = `bold ${p.size}rem system-ui`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillStyle = p.color;
                if (!isMobile) {
                    ctx.shadowColor = p.color + 'bb';
                    ctx.shadowBlur = 12;
                }
                ctx.fillText(p.label, 0, 0);
                ctx.restore();
            }

            rafRef.current = requestAnimationFrame(draw);
        };

        rafRef.current = requestAnimationFrame(draw);

        return () => {
            window.removeEventListener('resize', resize);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
        };
    }, [particlesRef, isMobile]);

    return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none" style={{ zIndex: 50 }} />;
}
