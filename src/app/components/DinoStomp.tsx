"use client";

import { useEffect, useState } from 'react';

interface Props { visible: boolean }

interface DinoItem {
    id: number;
    emoji: string;
    top: number;
    size: number;
    duration: number;
    delay: number;
}

const DINO_EMOJIS = ['🦕', '🦖'];

export function DinoStomp({ visible }: Props) {
    const [dinos, setDinos] = useState<DinoItem[]>([]);

    useEffect(() => {
        if (visible) {
            setDinos(Array.from({ length: 6 }, (_, i) => ({
                id: i,
                emoji: DINO_EMOJIS[i % 2]!,
                top: 10 + Math.random() * 70,
                size: 3 + Math.random() * 2,
                duration: 2 + Math.random() * 2,
                delay: Math.random() * 1,
            })));
        } else {
            setDinos([]);
        }
    }, [visible]);

    if (dinos.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {dinos.map(dino => (
                <span
                    key={dino.id}
                    className="absolute pointer-events-none select-none"
                    style={{
                        top: `${dino.top}%`,
                        fontSize: `${dino.size}rem`,
                        animation: `dino-stomp ${dino.duration}s linear ${dino.delay}s forwards`,
                    }}
                >
                    {dino.emoji}
                </span>
            ))}
        </div>
    );
}
