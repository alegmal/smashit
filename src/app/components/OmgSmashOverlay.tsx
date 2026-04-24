"use client";

import React, { useMemo } from 'react';
import { COLORS } from '../constants';

interface Props {
    msg: string | null;
    shake?: boolean;
}

interface FloodItem {
    id: number;
    x: number;
    y: number;
    size: number;
    rot: number;
    color: string;
}

function makeItems(count: number): FloodItem[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        x: 5 + Math.random() * 90,
        y: 5 + Math.random() * 90,
        size: 1.5 + Math.random() * 5,
        rot: (Math.random() - 0.5) * 30,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
    }));
}

export const OmgSmashOverlay = React.memo(function OmgSmashOverlay({ msg, shake }: Props) {
    const items = useMemo(() => (msg ? makeItems(50) : []), [msg]);

    if (!msg) return null;

    return (
        <div
            className="fixed inset-0 z-[92] pointer-events-none overflow-hidden"
            style={shake ? { animation: 'smash-shake 1.5s ease-out forwards' } : undefined}
        >
            {shake && (
                <div
                    className="fixed inset-0"
                    style={{
                        background: '#ff4757',
                        animation: 'smash-flash 1.5s ease-out forwards',
                        zIndex: -1,
                    }}
                />
            )}
            {items.map(item => (
                <span
                    key={item.id}
                    className="pointer-events-none absolute font-black leading-none select-none animate-pop-in"
                    style={{
                        left: `${item.x}vw`,
                        top: `${item.y}vh`,
                        fontSize: `${item.size}rem`,
                        color: item.color,
                        textShadow: `-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 0 20px ${item.color}88`,
                        transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {msg}
                </span>
            ))}
        </div>
    );
});
