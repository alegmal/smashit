import type { AiFloodItem } from '../types';

interface Props {
    visible: boolean;
    flood: AiFloodItem[];
}

export function DevOpsFloodOverlay({ visible, flood }: Props) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {flood.map((item) => (
                <span
                    key={item.id}
                    className="pointer-events-none absolute font-mono font-bold leading-none select-none animate-pop-in"
                    style={{
                        left: `${item.x}vw`,
                        top: `${item.y}vh`,
                        fontSize: `${item.size}rem`,
                        color: item.color,
                        textShadow: `0 0 12px ${item.color}88`,
                        transform: `translate(-50%, -50%) rotate(${item.rot}deg)`,
                        whiteSpace: 'nowrap',
                    }}
                >
                    {item.label}
                </span>
            ))}
        </div>
    );
}
