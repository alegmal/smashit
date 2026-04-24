import React, { useEffect, useState } from 'react';
import { DEPLOY_LINES } from '../constants';

interface Props { visible: boolean }

export const DeployOverlay = React.memo(function DeployOverlay({ visible }: Props) {
    const [shown, setShown] = useState(false);
    const [fadingOut, setFadingOut] = useState(false);

    useEffect(() => {
        if (visible) {
            setShown(true);
            setFadingOut(false);
        } else if (shown) {
            setFadingOut(true);
            const t = setTimeout(() => { setShown(false); setFadingOut(false); }, 800);
            return () => clearTimeout(t);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visible]);

    if (!shown) return null;

    return (
        <div
            className="fixed inset-0 z-[85] pointer-events-none flex items-center justify-center"
            style={{ transition: 'opacity 0.8s ease', opacity: fadingOut ? 0 : 1 }}
        >
            <div
                className="font-mono text-left overflow-hidden rounded-xl border border-green-700"
                style={{
                    maxWidth: '520px',
                    width: '90vw',
                    maxHeight: '30vh',
                    background: 'rgba(0,20,0,0.95)',
                    padding: '1.5rem',
                }}
            >
                <div
                    style={{
                        animation: 'deploy-scroll 9s linear forwards',
                        color: '#2ed573',
                        fontSize: '1rem',
                        lineHeight: 1.7,
                    }}
                >
                    <div style={{ height: '27vh' }} />
                    {DEPLOY_LINES.map((line, i) => (
                        <div key={i}>{line}</div>
                    ))}
                    <span style={{ animation: 'terminal-blink 0.7s infinite' }}>█</span>
                </div>
            </div>
        </div>
    );
});
