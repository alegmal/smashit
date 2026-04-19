"use client";

import { useCallback, useEffect, useRef, useState } from 'react';
import { COLORS, KEYBOARD_KEYS } from '../constants';

interface Props { visible: boolean }

interface RainItem {
    id: number;
    label: string;
    color: string;
    left: number;
    size: number;
    duration: number;
}

const TOTAL = 150;
const BATCH = 8;
const INTERVAL_MS = 60;

function makeItem(id: number): RainItem {
    return {
        id,
        label: KEYBOARD_KEYS[Math.floor(Math.random() * KEYBOARD_KEYS.length)]!,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        left: Math.random() * 100,
        size: 0.8 + Math.random() * 2.5,
        duration: 2.25 + Math.random() * 2.25,
    };
}

export function QwertyRain({ visible }: Props) {
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
                if (start >= TOTAL) { clearInterval(intervalRef.current!); intervalRef.current = null; return; }
                const batch = Array.from({ length: BATCH }, (_, i) => makeItem(start + i));
                spawnedRef.current += BATCH;
                setItems(prev => [...prev, ...batch]);
            }, INTERVAL_MS);
        } else {
            if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; }
        }
        return () => { if (intervalRef.current) { clearInterval(intervalRef.current); intervalRef.current = null; } };
    }, [visible]);

    if (items.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {items.map(item => (
                <span
                    key={item.id}
                    className="pointer-events-none absolute font-black animate-baby-fall select-none"
                    style={{
                        left: `${item.left}%`,
                        top: 0,
                        fontSize: `${item.size}rem`,
                        color: item.color,
                        '--fall-duration': `${item.duration}s`,
                        '--fall-delay': '0s',
                    } as React.CSSProperties}
                    onAnimationEnd={() => removeItem(item.id)}
                >
                    {item.label}
                </span>
            ))}
        </div>
    );
}
