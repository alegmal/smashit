import type { BorderLetter } from '../types';
import { MARGIN } from '../constants';

interface Props {
    letters: BorderLetter[];
}

export function BorderLetters({ letters }: Props) {
    return (
        <>
            {letters.map((l) => {
                const isTop = l.y <= MARGIN + 2;
                // Distance from current top position to floor (bottom edge minus current y)
                const fallDist = isTop
                    ? `${window.innerHeight - MARGIN - l.y}px`
                    : undefined;

                return (
                    <span
                        key={l.id}
                        className="pointer-events-none fixed font-black leading-none select-none"
                        style={{
                            left: l.x,
                            top: l.y,
                            color: l.color,
                            fontSize: `${l.size}rem`,
                            textShadow: `0 0 8px ${l.color}99`,
                            transform: 'translate(-50%, -50%)',
                            zIndex: 40,
                            ...(isTop && {
                                '--fall-dist': fallDist,
                                animation: 'border-letter-fall 2.8s cubic-bezier(0.4, 0, 1, 1) forwards',
                                animationDelay: '2s',
                            } as React.CSSProperties),
                        }}
                    >
                        {l.label}
                    </span>
                );
            })}
        </>
    );
}
