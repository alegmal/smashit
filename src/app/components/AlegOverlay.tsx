import React from 'react';
import Image from 'next/image';

interface Props {
    visible: boolean;
}

export const AlegOverlay = React.memo(function AlegOverlay({ visible }: Props) {
    if (!visible) return null;

    return (
        <div className="fixed inset-0 z-[100] pointer-events-none flex flex-col items-center justify-center gap-4">
            <div className="animate-pop-in">
                <Image
                    src="/me.jpeg"
                    alt="Aleg"
                    width={640}
                    height={640}
                    priority
                />
            </div>
            <p className="text-white font-bold text-3xl tracking-wide" style={{ textShadow: '0 2px 12px #000' }}>
                🥚 The creator&apos;s name...
            </p>
        </div>
    );
});
