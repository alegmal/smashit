interface Props { visible: boolean }

export function RainbowOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[85] pointer-events-none"
            style={{
                background: 'linear-gradient(to top, #ff0000, #ff7700, #ffff00, #00ff00, #0000ff, #8b00ff)',
                animation: 'rainbow-sweep 3s ease-in-out forwards',
                opacity: 0.7,
            }}
        />
    );
}
