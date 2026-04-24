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

const LANG_FLAGS: Record<string, string> = {
    japanese: '🇯🇵',
    russian: '🇷🇺',
    hindi: '🇮🇳',
    greek: '🇬🇷',
    hebrew: '🇮🇱',
    english: '🇬🇧',
};

const LANG_ORDER = ['english', 'japanese', 'russian', 'hindi', 'greek', 'hebrew'];

const EGG_BUTTONS = [
    { name: 'DINO', emoji: '🦕' },
    { name: 'SHARK', emoji: '🦈' },
    { name: 'UNICORN', emoji: '🦄' },
    { name: 'POOP', emoji: '💩' },
    { name: 'BABY', emoji: '👶' },
    { name: 'DOG', emoji: '🐶' },
    { name: 'CAT', emoji: '🐱' },
    { name: 'AI', emoji: '🤖' },
    { name: 'BORING', emoji: '😴' },
    { name: 'LOL', emoji: '😂' },
    { name: 'DUCK', emoji: '🦆' },
    { name: 'TRAIN', emoji: '🚂' },
];

interface Props {
    totalKeys: number;
    activeLang: string | null;
    autoLang: boolean;
    autoLangCountdown: number;
    onToggleAutoLang: () => void;
    onSelectLang: (lang: string) => void;
    onFireEgg: (name: string) => void;
    isMobile?: boolean;
}

export function WpmCounter({ totalKeys, activeLang, autoLang, autoLangCountdown, onToggleAutoLang, onSelectLang, onFireEgg, isMobile = false }: Props) {
    const labelColor = activeLang ? LANG_COLORS[activeLang] ?? '#ffffff' : 'rgba(255,255,255,0.3)';
    const labelText = activeLang ? activeLang : 'letters';

    const [animKey, setAnimKey] = useState(0);
    const prevLangRef = useRef<string | null>(null);
    useEffect(() => {
        if (prevLangRef.current !== null && activeLang !== prevLangRef.current) {
            setAnimKey(k => k + 1);
        }
        prevLangRef.current = activeLang;
    }, [activeLang]);

    const [shuffleHinted, setShuffleHinted] = useState(true);
    const [flagHinted, setFlagHinted] = useState(true);

    const handleToggleAutoLang = () => { setShuffleHinted(false); onToggleAutoLang(); };
    const handleSelectLang = (lang: string) => { setFlagHinted(false); onSelectLang(lang); };

    // Mobile: just the counter, vertically centered on the left
    if (isMobile) {
        return (
            <div
                className="fixed flex flex-col items-start select-none"
                style={{ left: '0.75rem', top: '50%', transform: 'translateY(-50%)', zIndex: 90 }}
            >
                <span
                    className="font-black tabular-nums leading-none"
                    style={{
                        fontSize: '3.5rem',
                        color: totalKeys > 0 ? '#ffffff' : 'rgba(255,255,255,0.2)',
                        textShadow: totalKeys > 0
                            ? '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000'
                            : undefined,
                    }}
                >
                    {totalKeys}
                </span>
                <span
                    className="font-bold tracking-widest uppercase"
                    style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.35)' }}
                >
                    letters
                </span>
            </div>
        );
    }

    // Desktop: full layout
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
                    {shuffleHinted && (
                        <span style={{ position: 'absolute', left: '110%', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', opacity: 0.55, animation: 'hint-nudge-h 1.2s ease-in-out infinite', pointerEvents: 'none', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)' }}>
                            ← click for random languages
                        </span>
                    )}
                </div>

                {/* Language flag buttons */}
                <div className="relative flex items-center gap-1">
                    {LANG_ORDER.map(lang => (
                        <button
                            key={lang}
                            onClick={() => handleSelectLang(lang)}
                            title={lang}
                            style={{
                                background: 'none',
                                border: activeLang === lang ? '2px solid ' + (LANG_COLORS[lang] ?? '#fff') : '2px solid transparent',
                                borderRadius: '4px',
                                padding: '1px 2px',
                                cursor: 'pointer',
                                fontSize: '1.6rem',
                                lineHeight: 1,
                                opacity: activeLang === lang ? 1 : 0.45,
                                transition: 'opacity 0.15s, border-color 0.15s',
                            }}
                        >
                            {LANG_FLAGS[lang]}
                        </button>
                    ))}
                    {flagHinted && (
                        <span style={{ position: 'absolute', left: '105%', top: '50%', transform: 'translateY(-50%)', fontSize: '1.1rem', opacity: 0.55, animation: 'hint-nudge-h 1.2s ease-in-out infinite', animationDelay: '0.4s', pointerEvents: 'none', whiteSpace: 'nowrap', color: 'rgba(255,255,255,0.7)' }}>
                            ← click to change language
                        </span>
                    )}
                </div>

                {/* keys/min label row */}
                <div className="flex items-center">
                    <span
                        key={animKey}
                        className="font-bold tracking-widest uppercase"
                        style={{
                            fontSize: '2rem',
                            color: labelColor,
                            display: 'inline-block',
                            transformOrigin: 'bottom left',
                            animation: animKey > 0 ? 'lang-pop 2s cubic-bezier(0.22,1,0.36,1) forwards' : undefined,
                            '--lang-color': labelColor,
                        } as React.CSSProperties}
                    >
                        {labelText}
                    </span>
                </div>

                {/* Egg trigger buttons */}
                <div className="flex items-center gap-1">
                    {EGG_BUTTONS.map(({ name, emoji }) => (
                        <button
                            key={name}
                            onClick={() => onFireEgg(name)}
                            title={name.toLowerCase()}
                            style={{
                                background: 'none',
                                border: '2px solid transparent',
                                borderRadius: '4px',
                                padding: '1px 2px',
                                cursor: 'pointer',
                                fontSize: '1.6rem',
                                lineHeight: 1,
                                opacity: 0.55,
                                transition: 'opacity 0.15s',
                            }}
                            onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
                            onMouseLeave={e => (e.currentTarget.style.opacity = '0.55')}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
