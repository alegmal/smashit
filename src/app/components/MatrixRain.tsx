"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface Props { visible: boolean; triggerCount: number }

interface RainItem {
    id: number;
    label: string;
    left: number;
    size: number;
    duration: number;
}

const CHARS = ['0','1','0','1','0','0','1'];
const MATRIX_GREEN = '#2ed573';
const TOTAL = 1200;
const BATCH = 8;
const INTERVAL_MS = 60;

function makeItem(id: number, bonusDuration: number): RainItem {
    return {
        id,
        label: CHARS[Math.floor(Math.random() * CHARS.length)]!,
        left: Math.random() * 100,
        size: 0.6 + Math.random() * 1.4,
        duration: 2.25 + Math.random() * 2.25 + bonusDuration,
    };
}

export function MatrixRain({ visible, triggerCount }: Props) {
    const [items, setItems] = useState<RainItem[]>([]);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    useEffect(() => {
        if (!visible) return; // items drain naturally via onAnimationEnd — no abrupt clear
        const idOffset = Date.now();
        let localSpawned = 0;
        const interval = setInterval(() => {
            if (localSpawned >= TOTAL) { clearInterval(interval); return; }
            const batch = Array.from({ length: BATCH }, (_, i) => makeItem(idOffset + localSpawned + i, 3));
            localSpawned += BATCH;
            setItems(prev => [...prev, ...batch]);
        }, INTERVAL_MS);
        return () => clearInterval(interval);
    }, [visible, triggerCount]);

    if (items.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {items.map(item => (
                <span
                    key={item.id}
                    className="pointer-events-none absolute font-mono font-black animate-baby-fall select-none"
                    style={{
                        left: `${item.left}%`,
                        top: 0,
                        fontSize: `${item.size}rem`,
                        color: MATRIX_GREEN,
                        textShadow: `0 0 8px ${MATRIX_GREEN}88`,
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
