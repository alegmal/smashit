"use client";

import { useCallback, useEffect, useRef, useState } from 'react';

interface Props { visible: boolean; triggerCount: number }

type Side = 'top' | 'bottom' | 'left' | 'right';

interface DuckItem {
    id: number;
    side: Side;
    pos: number;      // % along the perpendicular edge axis
    size: number;
    duration: number;
}

const TOTAL = 200;
const BATCH = 8;
const INTERVAL_MS = 80;
const SIDES: Side[] = ['top', 'bottom', 'left', 'right'];

function makeItem(id: number): DuckItem {
    return {
        id,
        side: SIDES[id % SIDES.length]!,
        pos: 5 + Math.random() * 90,
        size: 1.5 + Math.random() * 3.5,
        duration: 2.5 + Math.random() * 2,
    };
}

// sepia + hue-rotate gives the duck emoji a vivid yellow rubber-duck tint
const YELLOW_FILTER = 'sepia(1) hue-rotate(5deg) saturate(4) brightness(1.15)';

function getStyle(item: DuckItem): React.CSSProperties {
    const base: React.CSSProperties = { position: 'absolute', fontSize: `${item.size}rem`, filter: YELLOW_FILTER };
    switch (item.side) {
        case 'top':
            return { ...base, left: `${item.pos}%`, top: 0, animation: `baby-fall ${item.duration}s ease-in forwards` };
        case 'bottom':
            return { ...base, left: `${item.pos}%`, bottom: 0, animation: `duck-rise ${item.duration}s ease-in forwards` };
        case 'left':
            return { ...base, top: `${item.pos}%`, left: 0, animation: `shark-swim ${item.duration}s linear forwards` };
        case 'right':
            return { ...base, top: `${item.pos}%`, right: 0, animation: `duck-swim-rtl ${item.duration}s linear forwards` };
    }
}

export function DuckRain({ visible, triggerCount }: Props) {
    const [items, setItems] = useState<DuckItem[]>([]);
    const idOffsetRef = useRef(0);

    const removeItem = useCallback((id: number) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []);

    useEffect(() => {
        if (!visible) return; // items drain naturally via onAnimationEnd — no abrupt clear
        idOffsetRef.current = Date.now();
        const idOffset = idOffsetRef.current;
        let localSpawned = 0;
        const interval = setInterval(() => {
            if (localSpawned >= TOTAL) { clearInterval(interval); return; }
            const batch = Array.from({ length: BATCH }, (_, i) => makeItem(idOffset + localSpawned + i));
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
                    className="pointer-events-none select-none"
                    style={getStyle(item)}
                    onAnimationEnd={() => removeItem(item.id)}
                >
                    🦆
                </span>
            ))}
        </div>
    );
}
