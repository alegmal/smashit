"use client";

import { Dispatch, RefObject, SetStateAction, useCallback, useRef, useState } from 'react';
import type { FloatingKey, IdleFlyState } from '../types';
import type { ImpactEvent } from './usePhysicsLoop';
import { ORBIT_HIT_RADIUS } from '../constants';
import { playHit } from '../lib/audio';

const IDLE_MEDIUM_SIZE = 8; // rem — the "settled" size before falling

interface Deps {
    strokeCountRef: RefObject<number>;
    setFloaters: Dispatch<SetStateAction<FloatingKey[]>>;
    setFrame: Dispatch<SetStateAction<number>>;
    impactsRef: RefObject<ImpactEvent[]>;
    orbitPosRef: RefObject<{ x: number; y: number; angle: number }[]>;
    onCornerHit?: (x: number, y: number, color: string) => void;
}

export function useIdleAnimation({ strokeCountRef, setFloaters, setFrame, impactsRef, orbitPosRef, onCornerHit }: Deps) {
    const [idlePhase, setIdlePhase] = useState<null | 'idle'>(null);
    const idleFlyRef = useRef<IdleFlyState | null>(null);
    const idleRafRef = useRef<number | null>(null);
    const idleFallTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const startIdleFlyLoop = useCallback((label: string, color: string, fontSize: string) => {
        if (idleRafRef.current !== null) return;

        // Reset stroke counter so next typing session starts from min size
        strokeCountRef.current = 0;

        // Parse current rendered size from fontSize string
        const remMatch = fontSize.match(/,\s*([\d.]+)rem/);
        const currentRem = remMatch ? parseFloat(remMatch[1]!) : 8;

        idleFlyRef.current = {
            phase: 'sizing',
            x: window.innerWidth / 2,
            y: window.innerHeight / 2,
            vx: 0,
            vy: 0,
            rot: 0,
            rotV: 0,
            size: currentRem,
            targetSize: IDLE_MEDIUM_SIZE,
            sizeChangeFrame: 999,
            label,
            color,
            frame: 0,
        };

        setIdlePhase('idle');

        const spawnIdleFloaters = (lbl: string, col: string) => {
            setFloaters(prev => [
                ...prev,
                ...Array.from({ length: 6 }, (_, i) => ({
                    id: Date.now() * 100 + i,
                    label: lbl,
                    color: col,
                    x: 10 + Math.random() * 80,
                    y: 10 + Math.random() * 70,
                })),
            ].slice(-60));
        };

        const tick = () => {
            const s = idleFlyRef.current;
            if (!s) return;

            s.frame++;

            if (s.phase === 'sizing') {
                // Lerp size toward medium — transition to falling once close enough
                s.size += (s.targetSize - s.size) * 0.06;
                if (Math.abs(s.size - s.targetSize) < 0.15) {
                    s.size = s.targetSize;
                    s.phase = 'falling';
                    s.vy = 1; // start with a slow drop
                }

            } else if (s.phase === 'falling') {
                // Slow gravity fall from center to floor
                s.vy += 0.18;
                s.y += s.vy;
                s.rot += 0.3; // gentle tilt while falling

                // Floor = viewport height - letter half-height (approx s.size * 8 px)
                const halfH = s.size * 8;
                const floor = window.innerHeight - halfH;
                if (s.y >= floor) {
                    s.y = floor;
                    s.phase = 'bouncing';
                    // DVD screensaver: constant diagonal velocity, no gravity, fixed size
                    const speed = 9 + Math.random() * 6; // 9-15 px/frame
                    const xDir = Math.random() < 0.5 ? -1 : 1;
                    s.vx = xDir * speed * (0.65 + Math.random() * 0.35);
                    s.vy = -speed * (0.65 + Math.random() * 0.35); // kick upward
                    s.rotV = -4 + Math.random() * 8;
                    spawnIdleFloaters(s.label, s.color);
                    impactsRef.current.push({ x: s.x, y: s.y, color: s.color, wall: 'bottom' });
                }

            } else {
                // DVD screensaver phase — no gravity, perfectly elastic wall bounces, fixed size
                s.x += s.vx;
                s.y += s.vy;

                const halfApprox = s.size * 8;
                const floor = window.innerHeight - halfApprox;
                const ceil = halfApprox;
                const left = halfApprox;
                const right = window.innerWidth - halfApprox;

                let xBounced = false;
                let yBounced = false;
                if (s.x < left)  { s.x = left;  s.vx =  Math.abs(s.vx); xBounced = true; impactsRef.current.push({ x: s.x, y: s.y, color: s.color, wall: 'left' }); }
                if (s.x > right) { s.x = right; s.vx = -Math.abs(s.vx); xBounced = true; impactsRef.current.push({ x: s.x, y: s.y, color: s.color, wall: 'right' }); }
                if (s.y < ceil)  { s.y = ceil;  s.vy =  Math.abs(s.vy); yBounced = true; impactsRef.current.push({ x: s.x, y: s.y, color: s.color, wall: 'top' }); }
                if (s.y > floor) { s.y = floor; s.vy = -Math.abs(s.vy); yBounced = true; impactsRef.current.push({ x: s.x, y: s.y, color: s.color, wall: 'bottom' }); }
                if (xBounced || yBounced) {
                    // Corner hit gets air horn; plain wall bounce gets hit sound
                    if (!(xBounced && yBounced)) playHit();
                    spawnIdleFloaters(s.label, s.color);
                }
                if (xBounced && yBounced) onCornerHit?.(s.x, s.y, s.color);

                // Bounce off orbiting letters
                for (const op of orbitPosRef.current) {
                    const dx = s.x - op.x;
                    const dy = s.y - op.y;
                    const distSq = dx * dx + dy * dy;
                    if (distSq < ORBIT_HIT_RADIUS * ORBIT_HIT_RADIUS && distSq > 0) {
                        const dist = Math.sqrt(distSq);
                        const nx = dx / dist;
                        const ny = dy / dist;
                        const dot = s.vx * nx + s.vy * ny;
                        if (dot < 0) {
                            s.vx -= 2 * dot * nx;
                            s.vy -= 2 * dot * ny;
                            const wall = nx > 0 ? 'right' : nx < 0 ? 'left' : ny > 0 ? 'bottom' : 'top';
                            impactsRef.current.push({ x: op.x, y: op.y, color: s.color, wall });
                        }
                        s.x = op.x + nx * (ORBIT_HIT_RADIUS + 1);
                        s.y = op.y + ny * (ORBIT_HIT_RADIUS + 1);
                    }
                }

                s.rot += s.rotV;
            }

            setFrame(f => f + 1);
            idleRafRef.current = requestAnimationFrame(tick);
        };

        idleRafRef.current = requestAnimationFrame(tick);
    }, [strokeCountRef, setFloaters, setFrame, impactsRef, orbitPosRef, onCornerHit]);

    const clearIdleState = useCallback(() => {
        if (idleFallTimerRef.current) { clearTimeout(idleFallTimerRef.current); idleFallTimerRef.current = null; }
        if (idleRafRef.current !== null) { cancelAnimationFrame(idleRafRef.current); idleRafRef.current = null; }
        idleFlyRef.current = null;
        setIdlePhase(null);
    }, []);

    return { idlePhase, setIdlePhase, idleFlyRef, idleRafRef, idleFallTimerRef, startIdleFlyLoop, clearIdleState };
}
