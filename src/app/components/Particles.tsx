import { RefObject } from 'react';
import type { Particle } from '../types';

interface Props {
    particlesRef: RefObject<Particle[]>;
    _frame: number; // drives re-render
}

export function Particles({ particlesRef }: Props) {
    return (
        <>
            {particlesRef.current.map((p) => {
                const elapsed = performance.now() - p.born;
                const progress = Math.min(elapsed / p.life, 1);
                const opacity = progress < 0.7 ? 1 : Math.max(0, 1 - (progress - 0.7) / 0.3);
                return (
                    <span
                        key={p.id}
                        className="pointer-events-none leading-none select-none"
                        style={{
                            position: "fixed",
                            left: p.x,
                            top: p.y,
                            color: p.color,
                            fontSize: `${p.size}rem`,
                            textShadow: `0 0 12px ${p.color}bb`,
                            transform: `translate(-50%, -50%) rotate(${p.rot}deg)`,
                            opacity,
                            zIndex: 50,
                        }}
                    >
                        {p.label}
                    </span>
                );
            })}
        </>
    );
}
