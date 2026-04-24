import React from 'react';
import type { AiFloodItem } from '../types';

interface Props {
    visible: boolean;
    flood: AiFloodItem[];
}

export const AiFloodOverlay = React.memo(
    function AiFloodOverlay({ visible, flood }: Props) {
        if (!visible) return null;

        return (
            <div className="fixed inset-0 z-[90] pointer-events-none overflow-hidden" style={{ background: 'rgba(0,0,0,0.6)' }}>
                {flood.map((item) => (
                    <span
                        key={item.id}
                        className="pointer-events-none absolute font-black leading-none select-none animate-pop-in"
                        style={{
                            left: `${item.x}vw`,
                            top: `${item.y}vh`,
                            fontSize: `${item.size}rem`,
                            color: item.color,
                            textShadow: `0 0 20px ${item.color}99`,
                            transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
                        }}
                    >
                        {item.label}
                    </span>
                ))}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div
                        className="text-center select-none animate-pop-in rounded-2xl px-10 py-8"
                        style={{ zIndex: 95, background: 'rgba(0,0,0,0.92)', border: '2px solid rgba(255,255,255,0.1)' }}
                    >
                        <p
                            className="font-black text-5xl"
                            style={{
                                background: 'linear-gradient(135deg, #ffd32a, #ff4757, #a29bfe)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            Easter Egg:
                        </p>
                        <p
                            className="font-black text-5xl mt-2"
                            style={{
                                background: 'linear-gradient(135deg, #a29bfe, #2ed573, #ffd32a)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}
                        >
                            You typed AI!
                        </p>
                    </div>
                </div>
            </div>
        );
    },
    (prev, next) => !next.visible && !prev.visible,
);
