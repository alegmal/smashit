import type { FloatingKey } from '../types';

interface Props {
    floaters: FloatingKey[];
}

export function Floaters({ floaters }: Props) {
    return (
        <>
            {floaters.map((f) => (
                <span
                    key={f.id}
                    className="pointer-events-none absolute select-none animate-float-fade"
                    style={{
                        left: `${f.x}vw`,
                        top: `${f.y}vh`,
                        color: f.color,
                        fontSize: f.fontSize,
                        textShadow: `0 0 20px ${f.color}88`,
                        transform: "translate(-50%, -50%)",
                    }}
                >
                    {f.label}
                </span>
            ))}
        </>
    );
}
