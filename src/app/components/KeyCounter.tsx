"use client";

interface Props {
    keyCounts: Record<string, number>;
}

export function KeyCounter({ keyCounts }: Props) {
    const entries = Object.entries(keyCounts);
    if (entries.length === 0) return null;

    return (
        <div
            className="absolute select-none flex flex-wrap gap-2"
            style={{ bottom: '5rem', left: '1.5rem', maxWidth: '70vw' }}
        >
            {entries.map(([key, count]) => (
                <div key={key} className="flex flex-col items-center gap-0.5">
                    <div
                        className="flex items-center justify-center font-black"
                        style={{
                            minWidth: '2rem',
                            height: '2rem',
                            padding: '0 0.35rem',
                            border: '2px solid rgba(255,255,255,0.6)',
                            borderRadius: '4px',
                            fontSize: '1rem',
                            color: '#ffffff',
                            background: 'rgba(255,255,255,0.07)',
                            textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {key}
                    </div>
                    <span
                        className="font-bold tabular-nums"
                        style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', lineHeight: 1 }}
                    >
                        {count}
                    </span>
                </div>
            ))}
        </div>
    );
}
