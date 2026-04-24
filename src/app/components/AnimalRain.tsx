"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props {
    visible: boolean;
    emojis: string[];
    total?: number;
    swim?: boolean;
    minSize?: number;
    maxSize?: number;
    isMobile?: boolean;
}

interface RainItem {
    id: number;
    emoji: string;
    left: number;
    top: number;
    size: number;
    duration: number;
}

const BATCH = 10;
const INTERVAL_MS = 80;

export const AnimalRain = React.memo(function AnimalRain({ visible, emojis, total = 400, swim = false, minSize = 1.6, maxSize = 6.6, isMobile = false }: Props) {
    const [items, setItems] = useState<RainItem[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const spawnedRef = useRef(0);

    const emojisRef = useRef(emojis);
    emojisRef.current = emojis;
    const swimRef = useRef(swim);
    swimRef.current = swim;
    const totalRef = useRef(total);
    totalRef.current = isMobile ? Math.ceil(total / 2) : total;
    const minSizeRef = useRef(minSize);
    minSizeRef.current = minSize;
    const maxSizeRef = useRef(maxSize);
    maxSizeRef.current = maxSize;

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    useEffect(() => {
        if (visible) {
            setItems([]);
            spawnedRef.current = 0;

            intervalRef.current = setInterval(() => {
                const start = spawnedRef.current;
                if (start >= totalRef.current) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    return;
                }
                const batch = Array.from({ length: BATCH }, (_, i) => {
                    const id = start + i;
                    const em = emojisRef.current;
                    const sw = swimRef.current;
                    const mn = minSizeRef.current;
                    const mx = maxSizeRef.current;
                    return {
                        id,
                        emoji: em[Math.floor(Math.random() * em.length)]!,
                        left: sw ? 0 : Math.random() * 100,
                        top: sw ? 10 + Math.random() * 70 : 0,
                        size: mn + Math.random() * (mx - mn),
                        duration: sw ? 2 + Math.random() * 3 : 1.5 + Math.random() * 1.5,
                    };
                });
                spawnedRef.current += BATCH;
                setItems(prev => [...prev, ...batch]);
            }, INTERVAL_MS);
        } else {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        }
        return () => {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        };
    }, [visible]);

    if (items.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {items.map(item => (
                swim
                    ? (
                        <span
                            key={item.id}
                            className="pointer-events-none absolute select-none"
                            style={{
                                top: `${item.top}%`,
                                fontSize: `${item.size}rem`,
                                animation: `shark-swim ${item.duration}s linear forwards`,
                            }}
                            onAnimationEnd={() => removeItem(item.id)}
                        >
                            {item.emoji}
                        </span>
                    ) : (
                        <span
                            key={item.id}
                            className="pointer-events-none absolute animate-baby-fall select-none"
                            style={{
                                left: `${item.left}%`,
                                top: 0,
                                fontSize: `${item.size}rem`,
                                '--fall-duration': `${item.duration}s`,
                                '--fall-delay': '0s',
                            } as React.CSSProperties}
                            onAnimationEnd={() => removeItem(item.id)}
                        >
                            {item.emoji}
                        </span>
                    )
            ))}
        </div>
    );
});
