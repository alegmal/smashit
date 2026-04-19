"use client";

import { Dispatch, SetStateAction, useCallback, useRef } from 'react';
import type { Particle } from '../types';

export interface ImpactEvent {
    x: number;
    y: number;
    color: string;
    // which wall: 'left' | 'right' | 'top' | 'bottom'
    wall: 'left' | 'right' | 'top' | 'bottom';
}

export function usePhysicsLoop(setFrame: Dispatch<SetStateAction<number>>) {
    const particlesRef = useRef<Particle[]>([]);
    const rafRef = useRef<number | null>(null);
    const impactsRef = useRef<ImpactEvent[]>([]);

    const startPhysicsLoop = useCallback(() => {
        if (rafRef.current !== null) return; // already running

        const tick = () => {
            const now = performance.now();

            particlesRef.current = particlesRef.current
                .filter(p => (now - p.born) < p.life)
                .map(p => {
                    let { x, y, vx, vy, rot } = p;
                    x += vx;
                    y += vy;
                    vy += 0.35;

                    if (x < 20) {
                        x = 20; vx = Math.abs(vx) * 0.92;
                        impactsRef.current.push({ x, y, color: p.color, wall: 'left' });
                    }
                    if (x > window.innerWidth - 20) {
                        x = window.innerWidth - 20; vx = -Math.abs(vx) * 0.92;
                        impactsRef.current.push({ x, y, color: p.color, wall: 'right' });
                    }
                    if (y < 20) {
                        y = 20; vy = Math.abs(vy) * 0.92;
                        impactsRef.current.push({ x, y, color: p.color, wall: 'top' });
                    }
                    if (y > window.innerHeight - 20) {
                        y = window.innerHeight - 20; vy = -Math.abs(vy) * 0.92;
                        impactsRef.current.push({ x, y, color: p.color, wall: 'bottom' });
                    }

                    rot += p.rotV;
                    return { ...p, x, y, vx, vy, rot };
                });

            setFrame(f => f + 1);

            if (particlesRef.current.length > 0) {
                rafRef.current = requestAnimationFrame(tick);
            } else {
                rafRef.current = null;
            }
        };

        rafRef.current = requestAnimationFrame(tick);
    }, [setFrame]);

    return { particlesRef, rafRef, impactsRef, startPhysicsLoop };
}
