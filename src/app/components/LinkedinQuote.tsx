import { useEffect, useState } from 'react';

interface QuoteState {
    id: number;
    text: string;
    x: number;
    y: number;
}

interface Props {
    quote: QuoteState | null;
}

// Highlight tokens that are ALL-CAPS (2+ letters), ignoring surrounding punctuation/emoji
function renderHint(text: string) {
    return text.split(/(\s+)/).map((token, i) => {
        const letters = token.replace(/[^A-Za-z]/g, '');
        const isKeyword = letters.length >= 2 && letters === letters.toUpperCase();
        return isKeyword
            ? <span key={i} style={{ color: '#ffd32a', textShadow: '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000' }}>{token}</span>
            : <span key={i}>{token}</span>;
    });
}

export function LinkedinQuote({ quote }: Props) {
    // Keep the last hint mounted so the full float-fade animation can finish
    const [shown, setShown] = useState<QuoteState | null>(null);

    useEffect(() => {
        if (quote) setShown(quote);
        // When quote goes null, do nothing — onAnimationEnd will clear shown
    }, [quote]);

    if (!shown) return null;

    return (
        <div
            key={shown.id}
            className="pointer-events-none absolute select-none animate-float-fade-slow"
            style={{
                left: `${shown.x}vw`,
                top: `${shown.y}vh`,
                maxWidth: '480px',
                zIndex: 6,
            }}
            onAnimationEnd={() => setShown(null)}
        >
            <p className="text-white/65 font-semibold leading-snug italic" style={{ fontSize: '2.5rem' }}>
                {renderHint(shown.text)}
            </p>
        </div>
    );
}
