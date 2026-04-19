"use client";

import { RefObject, useEffect, useRef } from 'react';
import type { ImpactEvent } from '../hooks/usePhysicsLoop';

interface Props {
    impactsRef: RefObject<ImpactEvent[]>;
}

interface Pixel {
    x: number; y: number;
    vx: number; vy: number;
    size: number;
    color: string;
    born: number;
    life: number; // ms
}

// Velocity bias per wall: pixels scatter away from the surface
function wallBias(wall: ImpactEvent['wall']): { vxMin: number; vxMax: number; vyMin: number; vyMax: number } {
    switch (wall) {
        case 'left':   return { vxMin: 1,  vxMax: 8,  vyMin: -5, vyMax: 5 };
        case 'right':  return { vxMin: -8, vxMax: -1, vyMin: -5, vyMax: 5 };
        case 'top':    return { vxMin: -5, vxMax: 5,  vyMin: 1,  vyMax: 8 };
        case 'bottom': return { vxMin: -5, vxMax: 5,  vyMin: -8, vyMax: -1 };
    }
}

const PIXELS_PER_IMPACT = 10;

export function ImpactCanvas({ impactsRef }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pixelsRef = useRef<Pixel[]>([]);
    const rafRef = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
        resize();
        window.addEventListener('resize', resize);

        const ctx = canvas.getContext('2d')!;

        const tick = () => {
            // Drain pending impacts → spawn pixels
            const incoming = impactsRef.current.splice(0);
            for (const impact of incoming) {
                const bias = wallBias(impact.wall);
                for (let i = 0; i < PIXELS_PER_IMPACT; i++) {
                    pixelsRef.current.push({
                        x: impact.x + (Math.random() - 0.5) * 12,
                        y: impact.y + (Math.random() - 0.5) * 12,
                        vx: bias.vxMin + Math.random() * (bias.vxMax - bias.vxMin),
                        vy: bias.vyMin + Math.random() * (bias.vyMax - bias.vyMin),
                        size: 2 + Math.random() * 4,
                        color: impact.color,
                        born: performance.now(),
                        life: 350 + Math.random() * 250,
                    });
                }
            }

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const now = performance.now();
            pixelsRef.current = pixelsRef.current.filter(px => {
                const elapsed = now - px.born;
                if (elapsed >= px.life) return false;

                px.x += px.vx;
                px.y += px.vy;
                px.vy += 0.4; // gravity

                const alpha = 1 - elapsed / px.life;
                ctx.globalAlpha = alpha;
                ctx.fillStyle = px.color;
                ctx.fillRect(px.x - px.size / 2, px.y - px.size / 2, px.size, px.size);
                return true;
            });
            ctx.globalAlpha = 1;

            rafRef.current = requestAnimationFrame(tick);
        };

        rafRef.current = requestAnimationFrame(tick);
        return () => {
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            window.removeEventListener('resize', resize);
        };
    }, [impactsRef]);

    return (
        <canvas
            ref={canvasRef}
            className="fixed inset-0 pointer-events-none"
            style={{ zIndex: 55 }}
        />
    );
}
