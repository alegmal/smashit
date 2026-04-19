"use client";

import { Dispatch, RefObject, SetStateAction, useCallback, useRef } from 'react';
import type { Particle } from '../types';
import type { ImpactEvent } from './usePhysicsLoop';
import { ORBIT_HIT_RADIUS } from '../constants';

interface OrbitLetter {
    label: string;
    color: string;
    angleOffset: number; // each letter has its own phase offset
}

interface Deps {
    setFrame: Dispatch<SetStateAction<number>>;
    particlesRef: RefObject<Particle[]>;
    impactsRef: RefObject<ImpactEvent[]>;
    startPhysicsLoop: () => void;
    onShake?: () => void;
}

const ORBIT_RADIUS = 80;
const ANGLE_SPEED = 0.15; // radians per frame

// Shake detection: track cursor movement deltas over a short window
const SHAKE_WINDOW_MS = 5000;
const SHAKE_DIRECTION_CHANGES = 20; // direction reversals in window → shake

export function useChaseMode({ setFrame, particlesRef, impactsRef, startPhysicsLoop, onShake }: Deps) {
    // Array of orbiting letters (grows as player hits same key 10× more)
    const orbitLettersRef = useRef<OrbitLetter[]>([]);
    const cursorRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300 });
    const masterAngleRef = useRef(0); // single master angle; each letter = masterAngle + offset
    const chaseRafRef = useRef<number | null>(null);
    const mouseMoveCleanupRef = useRef<(() => void) | null>(null);

    // Shake detection state
    const shakeHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
    const lastDirRef = useRef<{ dx: number; dy: number } | null>(null);
    const dirChangeCountRef = useRef(0);
    const shakeWindowStartRef = useRef(0);

    // Per-letter orbit positions (updated each frame)
    const orbitPosRef = useRef<{ x: number; y: number; angle: number }[]>([]);

    const isOrbiting = () => orbitLettersRef.current.length > 0;

    const stopRaf = useCallback(() => {
        if (chaseRafRef.current !== null) {
            cancelAnimationFrame(chaseRafRef.current);
            chaseRafRef.current = null;
        }
    }, []);

    const startRaf = useCallback(() => {
        if (chaseRafRef.current !== null) return;
        const tick = () => {
            masterAngleRef.current += ANGLE_SPEED;
            const cx = cursorRef.current.x;
            const cy = cursorRef.current.y;
            const letters = orbitLettersRef.current;
            orbitPosRef.current = letters.map(l => {
                const a = masterAngleRef.current + l.angleOffset;
                return {
                    x: cx + Math.cos(a) * ORBIT_RADIUS,
                    y: cy + Math.sin(a) * ORBIT_RADIUS,
                    angle: a,
                };
            });

            // Bounce particles off orbit letters
            const ops = orbitPosRef.current;
            if (ops.length > 0 && particlesRef.current.length > 0) {
                particlesRef.current = particlesRef.current.map(p => {
                    let { x, y, vx, vy } = p;
                    for (const op of ops) {
                        const dx = x - op.x;
                        const dy = y - op.y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < ORBIT_HIT_RADIUS * ORBIT_HIT_RADIUS && distSq > 0) {
                            const dist = Math.sqrt(distSq);
                            const nx = dx / dist;
                            const ny = dy / dist;
                            // Only react if particle is moving toward the orbit letter
                            const dot = vx * nx + vy * ny;
                            if (dot < 0) {
                                vx -= 2 * dot * nx;
                                vy -= 2 * dot * ny;
                                vx *= 1.15; // small speed boost on impact
                                vy *= 1.15;
                                // Visual spark at collision point
                                const wall = nx > 0 ? 'right' : nx < 0 ? 'left' : ny > 0 ? 'bottom' : 'top';
                                impactsRef.current.push({ x: op.x, y: op.y, color: p.color, wall });
                            }
                            // Push particle outside collision zone
                            x = op.x + nx * (ORBIT_HIT_RADIUS + 1);
                            y = op.y + ny * (ORBIT_HIT_RADIUS + 1);
                        }
                    }
                    return { ...p, x, y, vx, vy };
                });
            }

            setFrame(f => f + 1);
            chaseRafRef.current = requestAnimationFrame(tick);
        };
        chaseRafRef.current = requestAnimationFrame(tick);
    }, [setFrame]);

    const attachMouseMove = useCallback(() => {
        if (mouseMoveCleanupRef.current) return; // already attached

        const onMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const px = cursorRef.current.x;
            const py = cursorRef.current.y;
            cursorRef.current = { x: e.clientX, y: e.clientY };

            if (!isOrbiting()) return;

            // Shake detection
            const dx = e.clientX - px;
            const dy = e.clientY - py;
            shakeHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: now });
            // Prune old entries
            shakeHistoryRef.current = shakeHistoryRef.current.filter(p => now - p.t <= SHAKE_WINDOW_MS);

            const last = lastDirRef.current;
            if (last && (dx !== 0 || dy !== 0)) {
                // Check for sign reversal on either axis
                const xFlip = (last.dx > 0 && dx < 0) || (last.dx < 0 && dx > 0);
                const yFlip = (last.dy > 0 && dy < 0) || (last.dy < 0 && dy > 0);
                if (xFlip || yFlip) {
                    if (now - shakeWindowStartRef.current > SHAKE_WINDOW_MS) {
                        dirChangeCountRef.current = 0;
                        shakeWindowStartRef.current = now;
                    }
                    dirChangeCountRef.current++;
                    if (dirChangeCountRef.current >= SHAKE_DIRECTION_CHANGES) {
                        dirChangeCountRef.current = 0;
                        // Trigger explosion of all orbit letters
                        onShake?.();
                        explodeOrbit();
                    }
                }
            }
            if (dx !== 0 || dy !== 0) lastDirRef.current = { dx, dy };
        };

        window.addEventListener('mousemove', onMouseMove);
        mouseMoveCleanupRef.current = () => window.removeEventListener('mousemove', onMouseMove);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // explodeOrbit: launch all orbit letters as particles and clear orbit
    const explodeOrbit = useCallback(() => {
        const letters = orbitLettersRef.current;
        const positions = orbitPosRef.current;

        letters.forEach((l, i) => {
            const pos = positions[i] ?? { x: cursorRef.current.x, y: cursorRef.current.y };
            const speed = 35 + Math.random() * 55;
            const angle = Math.random() * Math.PI * 2;
            particlesRef.current = [...particlesRef.current, {
                id: Date.now() * 1000 + i,
                label: l.label,
                color: l.color,
                x: pos.x, y: pos.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed - 12,
                rot: 0,
                rotV: -20 + Math.random() * 40,
                size: 3,
                born: performance.now(),
                life: 5000,
            }];
        });
        startPhysicsLoop();

        orbitLettersRef.current = [];
        orbitPosRef.current = [];
        stopRaf();
        dirChangeCountRef.current = 0;
        setFrame(f => f + 1);
    }, [particlesRef, startPhysicsLoop, stopRaf, setFrame]);

    const MAX_ORBIT = 5;

    const checkAndToggleChase = useCallback((label: string, color: string) => {
        // Always keep last 5 typed letters orbiting
        const current = orbitLettersRef.current;
        const updated = [...current, { label, color, angleOffset: 0 }].slice(-MAX_ORBIT);
        // Re-assign evenly spaced offsets
        orbitLettersRef.current = updated.map((l, i) => ({
            ...l,
            angleOffset: (2 * Math.PI * i) / updated.length,
        }));

        attachMouseMove();
        startRaf();
    }, [attachMouseMove, startRaf]);

    const resetChase = useCallback(() => {
        stopRaf();
        if (mouseMoveCleanupRef.current) { mouseMoveCleanupRef.current(); mouseMoveCleanupRef.current = null; }
        orbitLettersRef.current = [];
        orbitPosRef.current = [];
        dirChangeCountRef.current = 0;
        masterAngleRef.current = 0;
    }, [stopRaf]);

    return { orbitLettersRef, orbitPosRef, masterAngleRef, checkAndToggleChase, resetChase, explodeOrbit };
}
