interface Props { visible: boolean }

export function LinkedInOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[88] pointer-events-none flex items-center justify-center animate-gong-overlay"
            style={{ background: 'rgba(0,119,181,0.5)' }}
        >
            <span
                className="font-black animate-pop-in text-center"
                style={{
                    fontSize: 'clamp(2.5rem, 7vw, 6rem)',
                    color: '#ffffff',
                    textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000',
                    whiteSpace: 'nowrap',
                }}
            >
                act professional 💼
            </span>
        </div>
    );
}
