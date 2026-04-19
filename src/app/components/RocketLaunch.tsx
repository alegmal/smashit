interface Props { visible: boolean }

export function RocketLaunch({ visible }: Props) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[85] pointer-events-none overflow-hidden">
            <span
                className="absolute pointer-events-none select-none"
                style={{
                    left: '50%',
                    bottom: 0,
                    fontSize: '20rem',
                    animation: 'rocket-launch 3s ease-in forwards',
                }}
            >
                🚀
            </span>
            <span
                className="absolute pointer-events-none select-none"
                style={{ left: 'calc(50% - 2rem)', bottom: '-2rem', fontSize: '7.5rem', opacity: 0.9, animation: 'rocket-launch 3s ease-in 0.1s forwards' }}
            >
                🔥
            </span>
            <span
                className="absolute pointer-events-none select-none"
                style={{ left: 'calc(50% + 2rem)', bottom: '-4rem', fontSize: '6rem', opacity: 0.7, animation: 'rocket-launch 3s ease-in 0.2s forwards' }}
            >
                🔥
            </span>
            <span
                className="absolute pointer-events-none select-none"
                style={{ left: 'calc(50% - 4rem)', bottom: '-6rem', fontSize: '5rem', opacity: 0.5, animation: 'rocket-launch 3s ease-in 0.3s forwards' }}
            >
                🔥
            </span>
        </div>
    );
}
