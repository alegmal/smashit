interface Props { visible: boolean }

export function WtfOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[88] pointer-events-none"
        >
            <span
                className="pointer-events-none absolute select-none"
                style={{
                    left: '50%',
                    top: '50%',
                    fontSize: '4rem',
                    animation: 'wtf-grow 2s ease-out forwards',
                }}
            >
                😱
            </span>
        </div>
    );
}
