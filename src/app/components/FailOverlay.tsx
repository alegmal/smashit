interface Props { visible: boolean }

export function FailOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[88] pointer-events-none">
            <span
                className="pointer-events-none absolute select-none font-black"
                style={{
                    left: '50%',
                    top: '50%',
                    fontSize: 'clamp(6rem, 18vw, 16rem)',
                    color: '#ff4757',
                    textShadow: '-4px -4px 0 #800, 4px -4px 0 #800, -4px 4px 0 #800, 4px 4px 0 #800, 0 0 80px #ff475799',
                    animation: 'fail-stamp 2.5s ease-out forwards',
                    whiteSpace: 'nowrap',
                }}
            >
                FAIL
            </span>
        </div>
    );
}
