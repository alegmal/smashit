"use client";

import { useCallback, useRef, useState } from 'react';
import { CRITTERS } from '../constants';
import type { CritterItem } from '../types';

export function useCritters() {
    const [critters, setCritters] = useState<CritterItem[]>([]);
    const critterIntervalRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const critterCounterRef = useRef(0);

    const scheduleCritter = useCallback(() => {
        critterIntervalRef.current = setTimeout(() => {
            const emoji = CRITTERS[Math.floor(Math.random() * CRITTERS.length)]!;
            const id = ++critterCounterRef.current;
            setCritters([{ id, emoji, x: 5 + Math.random() * 90, y: 5 + Math.random() * 90, size: 2 + Math.random() * 4 }]);
            setTimeout(() => {
                setCritters(prev => prev.filter(c => c.id !== id));
                scheduleCritter();
            }, 1800);
        }, 800 + Math.random() * 1500);
    }, []);

    const startCritters = useCallback(() => {
        scheduleCritter();
    }, [scheduleCritter]);

    const stopCritters = useCallback(() => {
        if (critterIntervalRef.current) { clearTimeout(critterIntervalRef.current); critterIntervalRef.current = null; }
        setCritters([]);
    }, []);

    return { critters, critterIntervalRef, startCritters, stopCritters };
}
