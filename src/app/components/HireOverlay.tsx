import React from 'react';

interface Props { visible: boolean }

export const HireOverlay = React.memo(function HireOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center animate-gong-overlay"
            style={{ background: 'rgba(0,100,0,0.35)' }}
        >
            <span
                className="font-black animate-pop-in"
                style={{
                    fontSize: 'clamp(3rem, 10vw, 9rem)',
                    color: '#ffffff',
                    textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 80px #2ed573',
                    whiteSpace: 'nowrap',
                }}
            >
                You&apos;re hired! 🎉
            </span>
        </div>
    );
});
