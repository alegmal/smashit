"use client";

import { useEffect, useState } from 'react';
import { SPACE_EMOJIS } from '../constants';

interface Props { visible: boolean }

interface StarItem {
    id: number;
    emoji: string;
    left: number;
    top: number;
    size: number;
    delay: number;
}

export function SpaceOverlay({ visible }: Props) {
    const [stars, setStars] = useState<StarItem[]>([]);

    useEffect(() => {
        if (visible) {
            setStars(Array.from({ length: 40 }, (_, i) => ({
                id: i,
                emoji: SPACE_EMOJIS[Math.floor(Math.random() * SPACE_EMOJIS.length)]!,
                left: Math.random() * 100,
                top: Math.random() * 100,
                size: 0.8 + Math.random() * 2,
                delay: Math.random() * 1.5,
            })));
        } else {
            setStars([]);
        }
    }, [visible]);

    if (!visible && stars.length === 0) return null;

    return (
        <div
            className="fixed inset-0 z-[85] pointer-events-none overflow-hidden"
            style={{ background: 'rgba(0,0,20,0.7)' }}
        >
            {stars.map(star => (
                <span
                    key={star.id}
                    className="absolute pointer-events-none select-none"
                    style={{
                        left: `${star.left}%`,
                        top: `${star.top}%`,
                        fontSize: `${star.size}rem`,
                        animation: `space-appear 3s ease-out ${star.delay}s forwards`,
                        opacity: 0,
                    }}
                >
                    {star.emoji}
                </span>
            ))}
            {visible && (
                <span
                    className="absolute pointer-events-none select-none"
                    style={{
                        left: '50%',
                        bottom: '5%',
                        fontSize: '12rem',
                        animation: 'rocket-launch 3s ease-in forwards',
                    }}
                >
                    🚀
                </span>
            )}
        </div>
    );
}
