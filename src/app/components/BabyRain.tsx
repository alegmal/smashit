"use client";

import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Props { visible: boolean }

interface RainItem {
    id: number;
    emoji: string;
    left: number;
    size: number;
    duration: number;
}

const BABY_EMOJIS = ['👶', '🍼'];
const TOTAL = 400;
const BATCH = 10;
const INTERVAL_MS = 80;

function makeItem(id: number): RainItem {
    return {
        id,
        emoji: BABY_EMOJIS[Math.floor(Math.random() * BABY_EMOJIS.length)]!,
        left: Math.random() * 100,
        size: 0.8 + Math.random() * 2.5,
        duration: 1.5 + Math.random() * 1.5,
    };
}

export const BabyRain = React.memo(function BabyRain({ visible }: Props) {
    const [items, setItems] = useState<RainItem[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const spawnedRef = useRef(0);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    useEffect(() => {
        if (visible) {
            setItems([]);
            spawnedRef.current = 0;

            intervalRef.current = setInterval(() => {
                const start = spawnedRef.current;
                if (start >= TOTAL) {
                    clearInterval(intervalRef.current!);
                    intervalRef.current = null;
                    return;
                }
                const batch = Array.from({ length: BATCH }, (_, i) => makeItem(start + i));
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
            ))}
        </div>
    );
});
