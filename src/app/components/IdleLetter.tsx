import { RefObject } from 'react';
import type { IdleFlyState } from '../types';

interface Props {
    idlePhase: 'idle' | null;
    idleFlyRef: RefObject<IdleFlyState | null>;
}

export function IdleLetter({ idlePhase, idleFlyRef }: Props) {
    if (idlePhase !== 'idle' || !idleFlyRef.current) return null;

    const s = idleFlyRef.current;
    return (
        <span
            className="pointer-events-none fixed font-black leading-none select-none"
            style={{
                left: s.x,
                top: s.y,
                fontSize: `${s.size}rem`,
                color: s.color,
                textShadow: `0 0 40px ${s.color}99`,
                transform: `translate(-50%, -50%) rotate(${s.rot}deg)`,
                zIndex: 30,
            }}
        >
            {s.label}
        </span>
    );
}
