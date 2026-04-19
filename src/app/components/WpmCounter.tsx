"use client";

import { useEffect, useRef, useState } from 'react';

const LANG_COLORS: Record<string, string> = {
    japanese: '#a29bfe',
    russian: '#2ed573',
    hindi: '#00cec9',
    greek: '#fd79a8',
    hebrew: '#fdcb6e',
    english: '#ff4757',
};

interface Props {
    totalKeys: number;
    activeLang: string | null;
    onCycleLang: () => void;
    autoLang: boolean;
    autoLangCountdown: number;
    onToggleAutoLang: () => void;
}

export function WpmCounter({ totalKeys, activeLang, onCycleLang, autoLang, autoLangCountdown, onToggleAutoLang }: Props) {
    const labelColor = activeLang ? LANG_COLORS[activeLang] ?? '#ffffff' : 'rgba(255,255,255,0.3)';
    const labelText = activeLang ? activeLang : 'letters';

    // Bump animKey on every language change (but not on first mount)
    const [animKey, setAnimKey] = useState(0);
    const prevLangRef = useRef<string | null>(null);
    useEffect(() => {
        if (prevLangRef.current !== null && activeLang !== prevLangRef.current) {
            setAnimKey(k => k + 1);
        }
        prevLangRef.current = activeLang;
    }, [activeLang]);

    // Hide hints once user has interacted
    const [shuffleHinted, setShuffleHinted] = useState(true);
    const [langHinted, setLangHinted] = useState(true);

    const handleToggleAutoLang = () => {
        setShuffleHinted(false);
        onToggleAutoLang();
    };

    const handleCycleLang = () => {
        setLangHinted(false);
        onCycleLang();
    };

    return (
        <div className="absolute bottom-80 left-12 flex items-end gap-3 select-none">
            <span
                className="font-black tabular-nums leading-none"
                style={{
                    fontSize: '6rem',
                    color: totalKeys > 0 ? '#ffffff' : 'rgba(255,255,255,0.2)',
                    textShadow: totalKeys > 0
                        ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                        : undefined,
                }}
            >
                {totalKeys}
            </span>

            <div className="flex flex-col items-start gap-1">
                {/* Shuffle button row */}
                <div className="relative flex items-center">
                    <button
                        onClick={handleToggleAutoLang}
                        title="Auto-cycle language every 5 seconds"
                        style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem',
                            opacity: autoLang ? 1 : 0.35,
                            transition: 'opacity 0.2s',
                        }}
                    >
                        <span style={{ fontSize: '1.6rem', lineHeight: 1 }}>🔀</span>
                        <span
                            className="font-black tabular-nums"
                            style={{
                                fontSize: '1.6rem',
                                lineHeight: 1,
                                color: autoLang ? '#ffd32a' : 'rgba(255,255,255,0.5)',
                                minWidth: '1.2ch',
                            }}
                        >
                            {autoLang ? autoLangCountdown : ''}
                        </span>
                    </button>
                    {/* Arrow hint for shuffle button */}
                    {shuffleHinted && (
                        <span
                            style={{
                                position: 'absolute',
                                left: '110%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.1rem',
                                opacity: 0.55,
                                animation: 'hint-nudge-h 1.2s ease-in-out infinite',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                color: 'rgba(255,255,255,0.7)',
                            }}
                        >
                            ← click for random languages
                        </span>
                    )}
                </div>

                {/* keys/min label row */}
                <div className="relative flex items-center">
                    <span
                        key={animKey}
                        className="font-bold tracking-widest uppercase cursor-pointer"
                        style={{
                            fontSize: '2rem',
                            color: labelColor,
                            display: 'inline-block',
                            transformOrigin: 'bottom left',
                            animation: animKey > 0 ? 'lang-pop 2s cubic-bezier(0.22,1,0.36,1) forwards' : undefined,
                            '--lang-color': labelColor,
                        } as React.CSSProperties}
                        onClick={handleCycleLang}
                        title="Click to change language"
                    >
                        {labelText}
                    </span>
                    {/* Arrow hint for keys/min */}
                    {langHinted && (
                        <span
                            style={{
                                position: 'absolute',
                                left: '105%',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                fontSize: '1.1rem',
                                opacity: 0.55,
                                animation: 'hint-nudge-h 1.2s ease-in-out infinite',
                                animationDelay: '0.4s',
                                pointerEvents: 'none',
                                whiteSpace: 'nowrap',
                                color: 'rgba(255,255,255,0.7)',
                            }}
                        >
                            ← click to change language
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
