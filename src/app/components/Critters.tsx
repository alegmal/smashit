import type { CritterItem } from '../types';

interface Props {
    critters: CritterItem[];
}

export function Critters({ critters }: Props) {
    return (
        <>
            {critters.map((c) => (
                <span
                    key={c.id}
                    className="pointer-events-none absolute select-none animate-float-fade"
                    style={{
                        left: `${c.x}vw`,
                        top: `${c.y}vh`,
                        fontSize: `${c.size}rem`,
                        transform: 'translate(-50%, -50%)',
                        opacity: 0.55,
                        zIndex: 5,
                    }}
                >
                    {c.emoji}
                </span>
            ))}
        </>
    );
}
