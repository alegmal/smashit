interface Props { visible: boolean }

export function DiscoOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[88] pointer-events-none"
            style={{
                animation: 'disco-flash 0.17s linear infinite',
                opacity: 0.6,
            }}
        />
    );
}
