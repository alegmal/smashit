import React, { useMemo } from 'react';
import { COLORS, MAGIC_EMOJIS } from '../constants';
import type { AiFloodItem } from '../types';

interface Props { visible: boolean }

export const MagicOverlay = React.memo(function MagicOverlay({ visible }: Props) {
    const items = useMemo<AiFloodItem[]>(() => Array.from({ length: 80 }, (_, i) => ({
        id: i,
        label: MAGIC_EMOJIS[i % MAGIC_EMOJIS.length]!,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 4,
        rot: (Math.random() - 0.5) * 30,
    })), []);

    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden">
            {items.map((item) => (
                <span
                    key={item.id}
                    className="pointer-events-none absolute select-none animate-pop-in"
                    style={{
                        left: `${item.x}vw`,
                        top: `${item.y}vh`,
                        fontSize: `${item.size}rem`,
                        color: item.color,
                        textShadow: `0 0 12px ${item.color}88`,
                        transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
                    }}
                >
                    {item.label}
                </span>
            ))}
        </div>
    );
});
