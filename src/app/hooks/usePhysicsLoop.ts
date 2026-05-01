"use client";

import { useCallback, useRef } from 'react';
import type { Particle } from '../types';

export interface ImpactEvent {
    x: number;
    y: number;
    color: string;
    wall: 'left' | 'right' | 'top' | 'bottom';
}

export function usePhysicsLoop() {
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number | null>(null);
    const impactsRef = useRef<ImpactEvent[]>([]);

    const startPhysicsLoop = useCallback(() => {
        if (rafRef.current !== null) return;

        const tick = () => {
            const now = performance.now();
            const particles = particlesRef.current;
            let write = 0;

            for (let i = 0; i < particles.length; i++) {
                const p = particles[i]!;
                if ((now - p.born) >= p.life) continue;

                p.x += p.vx;
                p.y += p.vy;
                p.vy += 0.35;

                if (p.x < 20) {
                    p.x = 20; p.vx = Math.abs(p.vx) * 0.92;
                    impactsRef.current.push({ x: p.x, y: p.y, color: p.color, wall: 'left' });
                }
                if (p.x > window.innerWidth - 20) {
                    p.x = window.innerWidth - 20; p.vx = -Math.abs(p.vx) * 0.92;
                    impactsRef.current.push({ x: p.x, y: p.y, color: p.color, wall: 'right' });
                }
                if (p.y < 20) {
                    p.y = 20; p.vy = Math.abs(p.vy) * 0.92;
                    impactsRef.current.push({ x: p.x, y: p.y, color: p.color, wall: 'top' });
                }
                if (p.y > window.innerHeight - 20) {
                    p.y = window.innerHeight - 20; p.vy = -Math.abs(p.vy) * 0.92;
                    impactsRef.current.push({ x: p.x, y: p.y, color: p.color, wall: 'bottom' });
                }

                p.rot += p.rotV;
                particles[write++] = p;
            }
            particles.length = write;

            if (particles.length > 0) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                rafRef.current = null;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, []);

    return { particlesRef, rafRef, impactsRef, startPhysicsLoop };
}
