"use client";

import { useCallback, useRef, useState } from 'react';
import { COLORS, MILESTONE_LABELS } from '../constants';
import { playAirHorn } from '../lib/audio';
import type { MilestoneMessage } from '../types';

interface Deps {
    onAddKeys: (n: number) => void;
}

const MILESTONES = [10, 40, 100, 200, 500, 1000, 2000, 3000, 4000, 5000, 6000, 7000, 8000, 9000, 10000] as const;

export function useMilestones({ onAddKeys }: Deps) {
    const [milestoneMessage, setMilestoneMessage] = useState<MilestoneMessage | null>(null);
    const totalStrokesRef = useRef(0);
    const triggeredRef = useRef<Set<number>>(new Set());
    const msgIdRef = useRef(0);
    const onAddKeysRef = useRef(onAddKeys);
    onAddKeysRef.current = onAddKeys;

    const recordStroke = useCallback(() => {
        totalStrokesRef.current++;
        const total = totalStrokesRef.current;

        for (const milestone of MILESTONES) {
            if (total === milestone && !triggeredRef.current.has(milestone)) {
                triggeredRef.current.add(milestone);

                const color = COLORS[Math.floor(Math.random() * COLORS.length)]!;
                const msgId = ++msgIdRef.current;
                setMilestoneMessage({ id: msgId, text: MILESTONE_LABELS[milestone]!, color, milestone });
                onAddKeysRef.current(milestone);

                setTimeout(() => {
                    setMilestoneMessage(prev => (prev?.id === msgId ? null : prev));
                }, 4500);

                if (milestone >= 200) playAirHorn();

                break;
            }
        }
    }, []);

    const resetMilestones = useCallback(() => {
        triggeredRef.current.clear();
        totalStrokesRef.current = 0;
        setMilestoneMessage(null);
    }, []);

    return { totalStrokesRef, milestoneMessage, recordStroke, resetMilestones };
}
