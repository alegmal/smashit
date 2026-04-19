import Image from 'next/image';

interface Props { visible: boolean }

export function GongOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div
            className="fixed inset-0 z-[88] pointer-events-none flex items-center justify-center animate-gong-overlay"
            style={{ background: 'rgba(100,0,200,0.4)' }}
        >
            <div className="animate-pop-in" style={{ width: 320, height: 320, position: 'relative' }}>
                <Image
                    src="/gong-logo.jpg"
                    alt="Gong"
                    fill
                    style={{ objectFit: 'contain', borderRadius: '50%', boxShadow: '0 0 80px rgba(180,0,255,0.8)' }}
                    priority
                />
            </div>
        </div>
    );
}
