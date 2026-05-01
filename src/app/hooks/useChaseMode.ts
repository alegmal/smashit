"use client";

import { RefObject, useCallback, useRef } from 'react';
import type { Particle } from '../types';
import type { ImpactEvent } from './usePhysicsLoop';
import { ORBIT_HIT_RADIUS } from '../constants';

interface OrbitLetter {
    label: string;
    color: string;
    angleOffset: number;
}

interface Deps {
    canvasRef: RefObject<HTMLCanvasElement | null>;
    particlesRef: RefObject<Particle[]>;
    impactsRef: RefObject<ImpactEvent[]>;
    startPhysicsLoop: () => void;
    onShake?: () => void;
}

const ORBIT_RADIUS = 80;
const ANGLE_SPEED = 0.15;

const SHAKE_WINDOW_MS = 5000;
const SHAKE_DIRECTION_CHANGES = 20;

export function useChaseMode({ canvasRef, particlesRef, impactsRef, startPhysicsLoop, onShake }: Deps) {
    const orbitLettersRef = useRef<OrbitLetter[]>([]);
    const cursorRef = useRef({ x: typeof window !== 'undefined' ? window.innerWidth / 2 : 400, y: typeof window !== 'undefined' ? window.innerHeight / 2 : 300 });
    const masterAngleRef = useRef(0);
    const chaseRafRef = useRef<number | null>(null);
    const mouseMoveCleanupRef = useRef<(() => void) | null>(null);

    const shakeHistoryRef = useRef<{ x: number; y: number; t: number }[]>([]);
    const lastDirRef = useRef<{ dx: number; dy: number } | null>(null);
    const dirChangeCountRef = useRef(0);
    const shakeWindowStartRef = useRef(0);

    const orbitPosRef = useRef<{ x: number; y: number; angle: number }[]>([]);

    const isOrbiting = () => orbitLettersRef.current.length > 0;

    const drawOrbit = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const positions = orbitPosRef.current;
        const letters = orbitLettersRef.current;
        for (let i = 0; i < letters.length; i++) {
            const l = letters[i]!;
            const pos = positions[i];
            if (!pos) continue;
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.font = 'bold 3rem system-ui';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillStyle = l.color;
            ctx.shadowColor = l.color + '99';
            ctx.shadowBlur = 20;
            ctx.fillText(l.label, 0, 0);
            ctx.restore();
        }
    }, [canvasRef]);

    const stopRaf = useCallback(() => {
        if (chaseRafRef.current !== null) {
            cancelAnimationFrame(chaseRafRef.current);
            chaseRafRef.current = null;
        }
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }, [canvasRef]);

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

            // Bounce particles off orbit letters — mutate in place
            const ops = orbitPosRef.current;
            const particles = particlesRef.current;
            if (ops.length > 0 && particles.length > 0) {
                for (let pi = 0; pi < particles.length; pi++) {
                    const p = particles[pi]!;
                    for (let oi = 0; oi < ops.length; oi++) {
                        const op = ops[oi]!;
                        const dx = p.x - op.x;
                        const dy = p.y - op.y;
                        const distSq = dx * dx + dy * dy;
                        if (distSq < ORBIT_HIT_RADIUS * ORBIT_HIT_RADIUS && distSq > 0) {
                            const dist = Math.sqrt(distSq);
                            const nx = dx / dist;
                            const ny = dy / dist;
                            const dot = p.vx * nx + p.vy * ny;
                            if (dot < 0) {
                                p.vx -= 2 * dot * nx;
                                p.vy -= 2 * dot * ny;
                                p.vx *= 1.15;
                                p.vy *= 1.15;
                                const wall = nx > 0 ? 'right' : nx < 0 ? 'left' : ny > 0 ? 'bottom' : 'top';
                                impactsRef.current.push({ x: op.x, y: op.y, color: p.color, wall: wall as 'left' | 'right' | 'top' | 'bottom' });
                            }
                            p.x = op.x + nx * (ORBIT_HIT_RADIUS + 1);
                            p.y = op.y + ny * (ORBIT_HIT_RADIUS + 1);
                        }
                    }
                }
            }

            drawOrbit();
            chaseRafRef.current = requestAnimationFrame(tick);
        };
        chaseRafRef.current = requestAnimationFrame(tick);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [drawOrbit]);

    const attachMouseMove = useCallback(() => {
        if (mouseMoveCleanupRef.current) return;

        const onMouseMove = (e: MouseEvent) => {
            const now = Date.now();
            const px = cursorRef.current.x;
            const py = cursorRef.current.y;
            cursorRef.current = { x: e.clientX, y: e.clientY };

            if (!isOrbiting()) return;

            const dx = e.clientX - px;
            const dy = e.clientY - py;
            shakeHistoryRef.current.push({ x: e.clientX, y: e.clientY, t: now });
            shakeHistoryRef.current = shakeHistoryRef.current.filter(p => now - p.t <= SHAKE_WINDOW_MS);

            const last = lastDirRef.current;
            if (last && (dx !== 0 || dy !== 0)) {
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

    const explodeOrbit = useCallback(() => {
        const letters = orbitLettersRef.current;
        const positions = orbitPosRef.current;

        for (let i = 0; i < letters.length; i++) {
            const l = letters[i]!;
            const pos = positions[i] ?? { x: cursorRef.current.x, y: cursorRef.current.y };
            const speed = 35 + Math.random() * 55;
            const angle = Math.random() * Math.PI * 2;
            particlesRef.current.push({
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
            });
        }
        startPhysicsLoop();

        orbitLettersRef.current = [];
        orbitPosRef.current = [];
        stopRaf();
        dirChangeCountRef.current = 0;
    }, [particlesRef, startPhysicsLoop, stopRaf]);

    const MAX_ORBIT = 5;

    const checkAndToggleChase = useCallback((label: string, color: string) => {
        const current = orbitLettersRef.current;
        const updated = [...current, { label, color, angleOffset: 0 }].slice(-MAX_ORBIT);
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

    return { orbitPosRef, checkAndToggleChase, resetChase, explodeOrbit };
}
