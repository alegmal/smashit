"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BorderLetter, FloatingKey, LastKeyState } from "./types";
import { playAirHorn, playAirHornSoft, playBlip, playFart, playLetterPop, playSillySound } from "./lib/audio";
import { getKeyLabel, LANG_NAMES, randomColor, slotToPosition, transliterateLabel } from "./lib/utils";
import { downloadShareCard } from "./lib/shareCard";
import { MARGIN, ALL_EGG_NAMES, EGG_DISPLAY_LABELS, ORBIT_HIT_RADIUS } from "./constants";
import { usePhysicsLoop } from "./hooks/usePhysicsLoop";
import { useIsMobile } from "./hooks/useIsMobile";
import { ImpactCanvas } from "./components/ImpactCanvas";
import { useIdleAnimation } from "./hooks/useIdleAnimation";
import { useEasterEggs, TOTAL_EGGS } from "./hooks/useEasterEggs";
import { useCritters } from "./hooks/useCritters";
import { useMilestones } from "./hooks/useMilestones";
import { useChaseMode } from "./hooks/useChaseMode";
import { AiFloodOverlay } from "./components/AiFloodOverlay";
import { AlegOverlay } from "./components/AlegOverlay";
import { BabyRain } from "./components/BabyRain";
import { DevOpsFloodOverlay } from "./components/DevOpsFloodOverlay";
import { LolOverlay } from "./components/LolOverlay";
import { YesDoneOverlay } from "./components/YesDoneOverlay";
import { HireOverlay } from "./components/HireOverlay";
import { WtfOverlay } from "./components/WtfOverlay";
import { OmgSmashOverlay } from "./components/OmgSmashOverlay";
import { FailOverlay } from "./components/FailOverlay";
import { YoloOverlay } from "./components/YoloOverlay";
import { DiscoOverlay } from "./components/DiscoOverlay";
import { DeployOverlay } from "./components/DeployOverlay";
import { MeetingOverlay } from "./components/MeetingOverlay";
import { PizzaRain } from "./components/PizzaRain";
import { CoffeeRain } from "./components/CoffeeRain";
import { QwertyRain } from "./components/QwertyRain";
import { MatrixRain } from "./components/MatrixRain";
import { AnimalRain } from "./components/AnimalRain";
import { DuckRain } from "./components/DuckRain";
import { SpaceOverlay } from "./components/SpaceOverlay";
import { RocketLaunch } from "./components/RocketLaunch";
import { UnicornRain } from "./components/UnicornRain";
import { MagicOverlay } from "./components/MagicOverlay";
import { RainbowOverlay } from "./components/RainbowOverlay";
import { BorderLetters } from "./components/BorderLetters";
import { Critters } from "./components/Critters";
import { Floaters } from "./components/Floaters";
import { IdleLetter } from "./components/IdleLetter";
import { LandingPage } from "./components/LandingPage";
import { Particles } from "./components/Particles";
import { WpmCounter } from "./components/WpmCounter";
import { KeyCounter } from "./components/KeyCounter";

export default function SmashItPage() {
    const [isCapturing, setIsCapturing] = useState(false);
    const [lastKey, setLastKey] = useState<LastKeyState | null>(null);
    const [floaters, setFloaters] = useState<FloatingKey[]>([]);
    const [bgColor, setBgColor] = useState("#0a0a0f");
    const [totalKeys, setTotalKeys] = useState(0);
    const [borderLetters, setBorderLetters] = useState<BorderLetter[]>([]);
    const [_frame, setFrame] = useState(0);
    const [activeLang, setActiveLang] = useState<string | null>(null);
    const [autoLang, setAutoLang] = useState(false);
    const [autoLangCountdown, setAutoLangCountdown] = useState(5);
    const [poops, setPoops] = useState<{ id: number; x: number; y: number }[]>([]);
    const poopCounterRef = useRef(0);
    const [cornerFlash, setCornerFlash] = useState<{ id: number; color: string } | null>(null);
    const [cornerMsg, setCornerMsg] = useState<{ id: number } | null>(null);
    const cornerMsgIdRef = useRef(0);
    const [cornerHintSeen, setCornerHintSeen] = useState(false);

    const [keyCounts, setKeyCounts] = useState<Record<string, number>>({});
    const [bonusPopups, setBonusPopups] = useState<{ id: number; amount: number }[]>([]);
    const bonusPopupIdRef = useRef(0);

    const multiplierRef = useRef(1);
    const [multiplier, setMultiplier] = useState(1);
    const keystrokeCountRef = useRef(0);
    const [boostPopup, setBoostPopup] = useState<{ id: number; level: number } | null>(null);
    const boostPopupIdRef = useRef(0);
    const boostInactivityRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const maxRemRef = useRef(120); // shrinks 15% on each boost level-up, resets on inactivity
    const boostHornCountRef = useRef(0); // air horn plays only for first 5 boosts per streak

    const strokeCountRef = useRef(0);
    const cleanupRef = useRef<(() => void) | null>(null);
    const counterRef = useRef(0);

    const wpmIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const nextSlotRef = useRef(0);
    const timerMapRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(new Map());
    const explosionCountRef = useRef(0);
    const activeLangRef = useRef<string | null>(null);
    const autoLangRef = useRef(false);
    const autoLangIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Mirror activeLang / autoLang to refs so keydown closure can read without stale closure
    useEffect(() => { activeLangRef.current = activeLang; }, [activeLang]);
    useEffect(() => { autoLangRef.current = autoLang; }, [autoLang]);

    const isMobile = useIsMobile();

    const { particlesRef, rafRef, impactsRef, startPhysicsLoop } = usePhysicsLoop(setFrame);
    const discoverEggRef = useRef<((name: string) => void) | null>(null);
    const { orbitLettersRef, orbitPosRef, masterAngleRef, checkAndToggleChase, resetChase } = useChaseMode({
        setFrame, particlesRef, impactsRef, startPhysicsLoop,
        onShake: useCallback(() => {}, []),
    });

    const handleBonusKeys = useCallback((n: number) => {
        setTotalKeys(prev => prev + n);
        const id = ++bonusPopupIdRef.current;
        setBonusPopups(prev => [...prev, { id, amount: n }]);
        setTimeout(() => setBonusPopups(prev => prev.filter(p => p.id !== id)), 3000);
    }, []);

    const { idlePhase, idleFlyRef, idleRafRef, idleFallTimerRef, startIdleFlyLoop, clearIdleState } =
        useIdleAnimation({
            strokeCountRef, setFloaters, setFrame, impactsRef, orbitPosRef,
            onCornerHit: useCallback((x: number, y: number, color: string) => {
                setCornerHintSeen(true);
                handleBonusKeys(1000);
                playAirHorn();
                const walls = ['left', 'right', 'top', 'bottom'] as const;
                for (const wall of walls) {
                    for (let i = 0; i < 5; i++) {
                        impactsRef.current.push({ x, y, color, wall });
                    }
                }
                const id = ++cornerMsgIdRef.current;
                setCornerFlash({ id, color });
                setCornerMsg({ id });
                setTimeout(() => setCornerFlash(f => f?.id === id ? null : f), 700);
                setTimeout(() => setCornerMsg(m => m?.id === id ? null : m), 3500);
            }, [impactsRef, handleBonusKeys]),
        });

    const {
        activeEgg,
        discoveredEggs, discoverEgg, handleEggInput, resetEggs, fireEgg,
    } = useEasterEggs({ clearIdleState, onAddKeys: handleBonusKeys });
    // Wire action discoveries now that discoverEgg is available
    discoverEggRef.current = discoverEgg;
    const { critters, critterIntervalRef, startCritters, stopCritters } = useCritters();
    const { milestoneMessage, recordStroke, resetMilestones } = useMilestones({
        onAddKeys: handleBonusKeys,
    });

    const onSelectLang = useCallback((lang: string) => {
        setActiveLang(lang);
    }, []);

    const stopAutoLang = useCallback(() => {
        if (autoLangIntervalRef.current) { clearInterval(autoLangIntervalRef.current); autoLangIntervalRef.current = null; }
        autoLangRef.current = false;
        setAutoLang(false);
        setAutoLangCountdown(5);
    }, []);

    const startAutoLang = useCallback(() => {
        // Pick a language immediately if none active
        setActiveLang(cur => {
            if (cur) return cur;
            return LANG_NAMES[Math.floor(Math.random() * LANG_NAMES.length)] ?? null;
        });
        autoLangRef.current = true;
        setAutoLang(true);
        setAutoLangCountdown(5);

        let remaining = 5;
        autoLangIntervalRef.current = setInterval(() => {
            remaining -= 1;
            if (remaining <= 0) {
                remaining = 5;
                setActiveLang(cur => {
                    const others = LANG_NAMES.filter(l => l !== cur);
                    return others[Math.floor(Math.random() * others.length)] ?? cur;
                });
            }
            setAutoLangCountdown(remaining);
        }, 1000);
    }, []);

    const onToggleAutoLang = useCallback(() => {
        if (autoLangRef.current) { stopAutoLang(); } else { startAutoLang(); }
    }, [stopAutoLang, startAutoLang]);

    const stopCapture = useCallback(() => {
        if (wpmIntervalRef.current) { clearInterval(wpmIntervalRef.current); wpmIntervalRef.current = null; }
        if (boostInactivityRef.current) { clearTimeout(boostInactivityRef.current); boostInactivityRef.current = null; }
        keystrokeCountRef.current = 0;
        multiplierRef.current = 1;
        maxRemRef.current = 120;
        boostHornCountRef.current = 0;
        setMultiplier(1);
        setBoostPopup(null);
        if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
        if (idleFallTimerRef.current) { clearTimeout(idleFallTimerRef.current); idleFallTimerRef.current = null; }
        if (idleRafRef.current !== null) { cancelAnimationFrame(idleRafRef.current); idleRafRef.current = null; }
        idleFlyRef.current = null;
        stopCritters();
        timerMapRef.current.forEach(t => clearTimeout(t));
        timerMapRef.current.clear();
        particlesRef.current = [];
        nextSlotRef.current = 0;
        explosionCountRef.current = 0;
        strokeCountRef.current = 0;
        setTotalKeys(0);
        setKeyCounts({});
        setBonusPopups([]);
        setBorderLetters([]);
        setIsCapturing(false);
        setLastKey(null);
        setCornerHintSeen(false);
        setFloaters([]);
        setPoops([]);
        setBgColor("#0a0a0f");
        setFrame(0);
        setActiveLang(null);
        stopAutoLang();
        resetEggs();
        resetMilestones();
        resetChase();
        if (cleanupRef.current) { cleanupRef.current(); cleanupRef.current = null; }
        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (navigator as any).keyboard?.unlock();
        } catch { /* not supported */ }
        if (document.fullscreenElement) { document.exitFullscreen().catch(() => {}); }
    }, [rafRef, idleFallTimerRef, idleRafRef, idleFlyRef, particlesRef, stopCritters, stopAutoLang, resetEggs, resetMilestones, resetChase]);

    const RANDOM_LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ    ';
    const randomLetter = () => RANDOM_LETTERS[Math.floor(Math.random() * RANDOM_LETTERS.length)] ?? 'A';

    const startCapture = useCallback(async () => {
        try { await document.documentElement.requestFullscreen(); } catch { /* fullscreen denied — iOS Safari; proceed anyway */ }

        const processKey = (rawLabel: string) => {
            playBlip();
            keystrokeCountRef.current++;
            const newLevel = Math.min(100, Math.floor(keystrokeCountRef.current / 20) + 1);
            if (newLevel !== multiplierRef.current) {
                multiplierRef.current = newLevel;
                setMultiplier(newLevel);
                const pid = ++boostPopupIdRef.current;
                setBoostPopup({ id: pid, level: newLevel });
                setTimeout(() => setBoostPopup(prev => prev?.id === pid ? null : prev), 2500);
                if (boostHornCountRef.current < 5) { playAirHornSoft(); boostHornCountRef.current++; }
                maxRemRef.current = Math.max(30, maxRemRef.current * 0.85);
            }
            setTotalKeys(prev => prev + multiplierRef.current);

            // Reset boost if no key pressed for 1 second
            if (boostInactivityRef.current) clearTimeout(boostInactivityRef.current);
            boostInactivityRef.current = setTimeout(() => {
                boostInactivityRef.current = null;
                keystrokeCountRef.current = 0;
                multiplierRef.current = 1;
                maxRemRef.current = 120;
                boostHornCountRef.current = 0;
                setMultiplier(1);
            }, 1000);

            setKeyCounts(prev => ({ ...prev, [rawLabel]: (prev[rawLabel] ?? 0) + 1 }));
            const lang = activeLangRef.current;
            const label = lang ? transliterateLabel(rawLabel, lang) : rawLabel;
            const color = randomColor();
            const id = ++counterRef.current;

            recordStroke();

            strokeCountRef.current = Math.min(strokeCountRef.current + 1, 48);
            const MIN_REM = 1.5;
            const MAX_REM = maxRemRef.current;
            const t = strokeCountRef.current / 48;
            const remSize = MIN_REM + (MAX_REM - MIN_REM) * t;
            const fontSize = `clamp(1.5rem, ${remSize}rem, min(95vw, 90vh))`;

            setLastKey({ label, color, id, fontSize });
            setBgColor(color + "22");

            checkAndToggleChase(rawLabel, color);

            // Trigger impact sparks when the center key letter hits orbit letters
            const cx = window.innerWidth / 2;
            const cy = window.innerHeight / 2;
            for (const op of orbitPosRef.current) {
                const dx = cx - op.x;
                const dy = cy - op.y;
                if (dx * dx + dy * dy < ORBIT_HIT_RADIUS * ORBIT_HIT_RADIUS) {
                    const wall = dx > 0 ? 'right' : 'left';
                    impactsRef.current.push({ x: op.x, y: op.y, color, wall });
                }
            }

            clearIdleState();
            idleFallTimerRef.current = setTimeout(() => {
                startIdleFlyLoop(label, color, fontSize);
            }, 2000);

            const borderSize = 1.4 + Math.random() * 12.6;
            const pos = slotToPosition(nextSlotRef.current++);
            const isTopEdge = pos.y <= MARGIN + 2;
            const spawnY = isTopEdge ? window.innerHeight - MARGIN : pos.y;
            setBorderLetters(prev => [...prev, { id, label, color, x: pos.x, y: pos.y, size: borderSize, spawnY }]);

            const timer = setTimeout(() => {
                timerMapRef.current.delete(id);
                explosionCountRef.current++;
                if (explosionCountRef.current % 67 === 0) {
                    playSillySound();
                } else {
                    playLetterPop();
                }
                setBorderLetters(prev => prev.filter(l => l.id !== id));
                const speed = 30 + Math.random() * 45;
                const angle = Math.random() * Math.PI * 2;
                particlesRef.current = [...particlesRef.current, {
                    id, label, color,
                    x: pos.x, y: spawnY,
                    vx: Math.cos(angle) * speed,
                    vy: Math.sin(angle) * speed - 10,
                    rot: 0,
                    rotV: -18 + Math.random() * 36,
                    size: borderSize,
                    born: performance.now(),
                    life: 7000,
                }];
                startPhysicsLoop();
            }, 5000);
            timerMapRef.current.set(id, timer);

            const newFloaters = Array.from({ length: 3 }, (_, i) => ({
                id: id * 100 + i, label, color,
                x: 10 + Math.random() * 80,
                y: 10 + Math.random() * 70,
            }));
            setFloaters(prev => [...prev, ...newFloaters].slice(-60));
        };

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") return;
            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            // Easter egg input — never blocks typing; handleEggInput returns true but we continue
            if (e.key.length === 1) {
                handleEggInput(e.key.toUpperCase());
            }

            processKey(getKeyLabel(e));
        };

        const onKeyUp = (e: KeyboardEvent) => {
            if (e.key !== "Escape") {
                e.preventDefault();
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        };

        const onContextMenu = (e: Event) => { e.preventDefault(); e.stopImmediatePropagation(); };
        const onFullscreenChange = () => { if (!document.fullscreenElement) stopCapture(); };
        const onBeforeUnload = (e: BeforeUnloadEvent) => { e.preventDefault(); };

        try {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (navigator as any).keyboard?.lock();
        } catch { /* not supported */ }

        document.addEventListener("keydown", onKeyDown, true);
        document.addEventListener("keyup", onKeyUp, true);
        document.addEventListener("keypress", onKeyUp as EventListener, true);
        document.addEventListener("contextmenu", onContextMenu, true);
        document.addEventListener("fullscreenchange", onFullscreenChange);
        window.addEventListener("beforeunload", onBeforeUnload);

        const onMouseDown = (e: MouseEvent) => {
            playFart();
            const id = ++poopCounterRef.current;
            setPoops(prev => [...prev, { id, x: e.clientX, y: e.clientY }]);
            setTimeout(() => setPoops(prev => prev.filter(p => p.id !== id)), 1000);
        };
        document.addEventListener("mousedown", onMouseDown, true);

        const onTouchStart = (e: TouchEvent) => {
            // Let button taps through so egg buttons remain clickable
            if ((e.target as Element).closest('button')) return;
            e.preventDefault();
            // Each tap gets a random language so characters vary
            activeLangRef.current = LANG_NAMES[Math.floor(Math.random() * LANG_NAMES.length)] ?? null;
            processKey(randomLetter());
        };
        document.addEventListener("touchstart", onTouchStart, { passive: false });

        cleanupRef.current = () => {
            document.removeEventListener("keydown", onKeyDown, true);
            document.removeEventListener("keyup", onKeyUp, true);
            document.removeEventListener("keypress", onKeyUp as EventListener, true);
            document.removeEventListener("contextmenu", onContextMenu, true);
            document.removeEventListener("fullscreenchange", onFullscreenChange);
            document.removeEventListener("mousedown", onMouseDown, true);
            document.removeEventListener("touchstart", onTouchStart);
            window.removeEventListener("beforeunload", onBeforeUnload);
        };

        startCritters();
        setIsCapturing(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stopCapture, startPhysicsLoop, clearIdleState, startIdleFlyLoop,
        handleEggInput, recordStroke, checkAndToggleChase,
        idleFallTimerRef, particlesRef, startCritters]);

    // Clean up on unmount
    useEffect(() => {
        return () => {
            if (cleanupRef.current) cleanupRef.current();
            if (wpmIntervalRef.current) clearInterval(wpmIntervalRef.current);
            if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
            if (idleRafRef.current !== null) cancelAnimationFrame(idleRafRef.current);
            if (idleFallTimerRef.current) clearTimeout(idleFallTimerRef.current);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            if (critterIntervalRef.current) clearTimeout(critterIntervalRef.current);
            if (autoLangIntervalRef.current) clearInterval(autoLangIntervalRef.current);
            // eslint-disable-next-line react-hooks/exhaustive-deps
            timerMapRef.current.forEach(t => clearTimeout(t));
        };
    }, [rafRef, idleRafRef, idleFallTimerRef, critterIntervalRef]);

    // Remove floaters after animation completes (1.4s)
    useEffect(() => {
        if (floaters.length === 0) return;
        const ids = floaters.map(f => f.id);
        const timer = setTimeout(() => {
            setFloaters(prev => prev.filter(f => !ids.includes(f.id)));
        }, 1400);
        return () => clearTimeout(timer);
    }, [floaters]);

    if (!isCapturing) return <LandingPage onStart={startCapture} isMobile={isMobile} />;

    const orbitLetters = orbitLettersRef.current;
    const orbitPositions = orbitPosRef.current;
    const masterAngleDeg = (masterAngleRef.current * 180) / Math.PI;

    return (
        <div
            className="fixed inset-0 flex items-center justify-center overflow-hidden transition-colors duration-100"
            style={{
                backgroundColor: bgColor,
                ...(activeEgg?.name === 'YOLO' ? { animation: 'yolo-barrel-roll 2.5s ease-in-out forwards', transformOrigin: 'center center', perspective: '800px' } : {}),
            }}
        >
            <div className="absolute top-3 left-0 right-0 flex flex-col items-center gap-1 select-none">
                <span className="text-base font-medium tracking-widest uppercase text-white/20">
                    {isMobile ? 'Tap to smash!' : 'ESC 3 SEC \u00a0/\u00a0 ALT + TAB to exit'}
                </span>
                <div className="flex items-center gap-2">
                    {/* Arrow hint pointing at feature counter — desktop only */}
                    {!isMobile && discoveredEggs.size === 0 && (
                        <span
                            style={{
                                fontSize: '1.7rem',
                                opacity: 0.5,
                                color: 'rgba(255,255,255,0.7)',
                                animation: 'hint-nudge-h-r 1.2s ease-in-out infinite',
                                whiteSpace: 'nowrap',
                                pointerEvents: 'none',
                            }}
                        >
                            mouse over to see all there is →
                        </span>
                    )}
                    <span
                        className="font-bold tracking-wide cursor-default group relative"
                        style={{ fontSize: isMobile ? '0.75rem' : '1.5rem', color: discoveredEggs.size === TOTAL_EGGS ? '#2ed573' : 'rgba(255,255,255,0.25)' }}
                    >
                        🔍 {discoveredEggs.size}/{TOTAL_EGGS} MAGIC THINGS DISCOVERED
                        {discoveredEggs.size < TOTAL_EGGS && (
                            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-52 rounded-lg z-50 opacity-0 group-hover:opacity-100 transition-opacity duration-150"
                                style={{ background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div className="px-3 py-3 flex flex-col gap-0.5">
                                    {[...ALL_EGG_NAMES.filter(n => !discoveredEggs.has(n)), ...ALL_EGG_NAMES.filter(n => discoveredEggs.has(n))].map(name => {
                                        const label = EGG_DISPLAY_LABELS[name];
                                        const display = label ?? name;
                                        const isAction = !!label;
                                        const done = discoveredEggs.has(name);
                                        return (
                                            <div key={name} className="flex items-center gap-2 py-0.5">
                                                {done ? (
                                                    <span className={`text-sm text-white/25 ${isAction ? 'italic' : 'font-mono'}`}>{display}</span>
                                                ) : (
                                                    <span className={`text-sm text-white/80 font-bold ${isAction ? 'italic' : 'font-mono'}`}>{display}</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}
                    </span>
                </div>
            </div>

            <Floaters floaters={floaters} />
            <Critters critters={critters} />

            {lastKey && idlePhase === null && (
                <div key={`key-${lastKey.id}`} className="relative z-10 flex flex-col items-center animate-pop-in">
                    <span
                        className="leading-none select-none font-black"
                        style={{
                            fontSize: lastKey.fontSize,
                            color: lastKey.color,
                            textShadow: `0 0 60px ${lastKey.color}99, 0 0 120px ${lastKey.color}44`,
                        }}
                    >
                        {lastKey.label}
                    </span>
                </div>
            )}

            <IdleLetter idlePhase={idlePhase} idleFlyRef={idleFlyRef} />

            {!lastKey && (
                <div className="text-center select-none animate-pulse-big">
                    <div className="text-7xl mb-4">👶</div>
                    <p className="text-4xl font-bold text-white/60">{isMobile ? 'Start tapping!' : 'Smash those keys!'}</p>
                </div>
            )}

            {/* Orbit letters around cursor */}
            {orbitLetters.map((letter, i) => {
                const pos = orbitPositions[i];
                if (!pos) return null;
                const angleDeg = (pos.angle * 180) / Math.PI + masterAngleDeg * 0;
                return (
                    <span
                        key={`orbit-${i}-${letter.label}`}
                        className="pointer-events-none fixed select-none font-black leading-none"
                        style={{
                            left: pos.x,
                            top: pos.y,
                            fontSize: '3rem',
                            color: letter.color,
                            textShadow: `0 0 20px ${letter.color}99`,
                            transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
                            zIndex: 70,
                        }}
                    >
                        {letter.label}
                    </span>
                );
            })}

            {/* Milestone message — twist only for 200+ */}
            {milestoneMessage && (
                <div
                    key={`milestone-${milestoneMessage.id}`}
                    className="pointer-events-none fixed select-none"
                    style={{
                        left: '50%',
                        top: '50%',
                        zIndex: 82,
                        animation: milestoneMessage.milestone >= 200
                            ? 'milestone-200 4.5s ease-out forwards'
                            : 'milestone-pop 3.5s ease-out forwards',
                        ...(milestoneMessage.milestone >= 200 ? { perspective: '800px' } : {}),
                    }}
                >
                    <span
                        className="font-black"
                        style={{
                            fontSize: milestoneMessage.milestone >= 200
                                ? 'clamp(4.8rem, 12vw, 10.8rem)'
                                : 'clamp(2rem, 4.8vw, 4.4rem)',
                            color: milestoneMessage.milestone >= 200 ? '#ffffff' : milestoneMessage.color,
                            textShadow: milestoneMessage.milestone >= 200
                                ? '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 80px #fff6'
                                : '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        {milestoneMessage.text}
                    </span>
                </div>
            )}

            <BorderLetters letters={borderLetters} />
            <Particles particlesRef={particlesRef} _frame={_frame} />
            <ImpactCanvas impactsRef={impactsRef} />

            {/* Corner hit flash */}
            {cornerFlash && (
                <div
                    key={`flash-${cornerFlash.id}`}
                    className="fixed inset-0 pointer-events-none"
                    style={{
                        zIndex: 75,
                        background: cornerFlash.color,
                        animation: 'screen-flash 0.7s ease-out forwards',
                    }}
                />
            )}

            {/* Corner hit message */}
            {cornerMsg && (
                <div
                    key={`msg-${cornerMsg.id}`}
                    className="pointer-events-none fixed select-none"
                    style={{
                        left: '50%',
                        top: '50%',
                        zIndex: 82,
                        animation: 'milestone-pop 3.5s ease-out forwards',
                    }}
                >
                    <span
                        className="font-black"
                        style={{
                            fontSize: 'clamp(6rem, 15vw, 13.5rem)',
                            color: '#ffffff',
                            textShadow: '-3px -3px 0 #000, 3px -3px 0 #000, -3px 3px 0 #000, 3px 3px 0 #000, 0 0 80px #fff6',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        CORNER! 🎯
                    </span>
                </div>
            )}

            {/* Click poop */}
            {poops.map(p => (
                <span
                    key={p.id}
                    className="pointer-events-none fixed select-none"
                    style={{
                        left: p.x,
                        top: p.y,
                        fontSize: '2rem',
                        zIndex: 200,
                        animation: 'poop-pop 1s ease-out forwards',
                    }}
                >
                    💩
                </span>
            ))}

            {/* z-80 */}
            <PizzaRain visible={activeEgg?.name === 'PIZZA'} />
            <CoffeeRain visible={activeEgg?.name === 'COFFEE'} />
            <AnimalRain visible={activeEgg?.name === 'BUG'} emojis={['🐛']} />
            <DuckRain visible={activeEgg?.name === 'DUCK'} triggerCount={activeEgg?.name === 'DUCK' ? (activeEgg.gen ?? 0) : 0} />
            <QwertyRain visible={activeEgg?.name === 'QWERTY'} />
            <MatrixRain visible={activeEgg?.name === 'MATRIX'} triggerCount={activeEgg?.name === 'MATRIX' ? (activeEgg.gen ?? 0) : 0} />
            <LolOverlay visible={activeEgg?.name === 'LOL'} flood={activeEgg?.flood ?? []} />
            <AnimalRain visible={activeEgg?.name === 'LOL'} emojis={['😂']} />
            <MeetingOverlay visible={activeEgg?.name === 'MEETING'} flood={activeEgg?.flood ?? []} />
            <AnimalRain visible={activeEgg?.name === 'DINO'} emojis={['🦕', '🦖']} swim={true} minSize={8} maxSize={25} />
            <AnimalRain visible={activeEgg?.name === 'CAT'} emojis={['🐱']} />
            <AnimalRain visible={activeEgg?.name === 'DOG'} emojis={['🐶', '🦴']} />
            <AnimalRain visible={activeEgg?.name === 'FROG'} emojis={['🐸']} />
            <AnimalRain visible={activeEgg?.name === 'SHARK'} emojis={['🦈']} swim={true} minSize={4.8} maxSize={19.8} />
            <UnicornRain visible={activeEgg?.name === 'UNICORN'} />
            <AnimalRain visible={activeEgg?.name === 'TRAIN'} emojis={['🚂', '🚃', '🚄']} swim={true} />
            <BabyRain visible={activeEgg?.name === 'BABY'} />
            <DevOpsFloodOverlay visible={activeEgg?.name === 'DEVOPS'} flood={activeEgg?.flood ?? []} />
            {/* z-82 */}
            <YesDoneOverlay msg={activeEgg?.msg ?? null} />
            {/* z-85 */}
            <HireOverlay visible={activeEgg?.name === 'HIRE'} />
            <DeployOverlay visible={activeEgg?.name === 'DEPLOY'} />
            <SpaceOverlay visible={activeEgg?.name === 'SPACE'} />
            <RocketLaunch visible={activeEgg?.name === 'ROCKET'} />
            <MagicOverlay visible={activeEgg?.name === 'MAGIC'} />
            <RainbowOverlay visible={activeEgg?.name === 'RAINBOW'} />
            {/* z-88 */}
            <FailOverlay visible={activeEgg?.name === 'FAIL'} />
            <DiscoOverlay visible={activeEgg?.name === 'DISCO'} />
            <WtfOverlay visible={activeEgg?.name === 'WTF'} />
            {/* z-90 */}
            <AiFloodOverlay visible={activeEgg?.name === 'AI'} flood={activeEgg?.flood ?? []} />
            {/* z-92 */}
            <YoloOverlay visible={activeEgg?.name === 'YOLO'} />
            <OmgSmashOverlay msg={activeEgg?.name === 'OMG' ? 'OMG!' : null} shake={false} />
            {/* z-100 */}
            <AlegOverlay visible={activeEgg?.name === 'ALEG'} />
            {/* boring rain */}
            <AnimalRain visible={activeEgg?.name === 'BORING'} emojis={['😴']} />
            {/* poop / linkedin shower */}
            <AnimalRain visible={activeEgg?.name === 'POOP' || activeEgg?.name === 'LINKEDIN'} emojis={['💩']} total={250} minSize={2} maxSize={14} />
            {/* DVD corner hints — desktop only */}
            {!isMobile && idleFlyRef.current?.phase === 'bouncing' && !cornerHintSeen && (
                <>
                    {/* top-left */}
                    <div className="pointer-events-none fixed select-none flex items-center gap-2" style={{ top: '1rem', left: '1rem', opacity: 0.55, zIndex: 50, animation: 'hint-nudge-tl 1.3s ease-in-out infinite' }}>
                        <span style={{ fontSize: '6.6rem', lineHeight: 1 }}>↖</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000', whiteSpace: 'nowrap' }}>1,000 POINTS</span>
                    </div>
                    {/* top-right */}
                    <div className="pointer-events-none fixed select-none flex items-center gap-2" style={{ top: '1rem', right: '1rem', opacity: 0.55, zIndex: 50, animation: 'hint-nudge-tr 1.3s ease-in-out infinite', animationDelay: '0.32s' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000', whiteSpace: 'nowrap' }}>1,000 POINTS</span>
                        <span style={{ fontSize: '6.6rem', lineHeight: 1 }}>↗</span>
                    </div>
                    {/* bottom-left */}
                    <div className="pointer-events-none fixed select-none flex items-center gap-2" style={{ bottom: '1rem', left: '1rem', opacity: 0.55, zIndex: 50, animation: 'hint-nudge-bl 1.3s ease-in-out infinite', animationDelay: '0.65s' }}>
                        <span style={{ fontSize: '6.6rem', lineHeight: 1 }}>↙</span>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000', whiteSpace: 'nowrap' }}>1,000 POINTS</span>
                    </div>
                    {/* bottom-right */}
                    <div className="pointer-events-none fixed select-none flex items-center gap-2" style={{ bottom: '1rem', right: '1rem', opacity: 0.55, zIndex: 50, animation: 'hint-nudge-br 1.3s ease-in-out infinite', animationDelay: '0.97s' }}>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000', whiteSpace: 'nowrap' }}>1,000 POINTS</span>
                        <span style={{ fontSize: '6.6rem', lineHeight: 1 }}>↘</span>
                    </div>
                </>
            )}
            {!isMobile && <KeyCounter keyCounts={keyCounts} />}
            {/* Bonus point popups — float up above the counter */}
            {bonusPopups.map(popup => (
                <div
                    key={popup.id}
                    className="pointer-events-none fixed select-none"
                    style={{
                        bottom: isMobile ? '55%' : '23rem',
                        left: '1.5rem',
                        zIndex: 91,
                        transformOrigin: 'bottom left',
                        animation: 'bonus-float 3s ease-out forwards',
                    }}
                >
                    <span
                        className="font-black"
                        style={{
                            fontSize: isMobile ? '1rem' : '2rem',
                            color: '#ffffff',
                            textShadow: '-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        +{popup.amount} letters
                    </span>
                </div>
            ))}
            {multiplier > 1 && (
                <div className="pointer-events-none fixed select-none" style={{ top: '1.5rem', right: '1.5rem', zIndex: 90 }}>
                    <span className="font-black" style={{ fontSize: isMobile ? '1.1rem' : '2.2rem', color: '#ffd32a', textShadow: '0 0 20px #ffd32a88' }}>
                        ⚡ x{multiplier}
                    </span>
                </div>
            )}
            {boostPopup && (
                <div
                    key={`boost-${boostPopup.id}`}
                    className="pointer-events-none fixed select-none"
                    style={{ left: '50%', top: '28%', transform: 'translateX(-50%)', zIndex: 95 }}
                >
                    <span
                        className="font-black"
                        style={{
                            display: 'block',
                            fontSize: isMobile ? '1.8rem' : '3.5rem',
                            color: '#ffd32a',
                            textShadow: '0 0 40px #ffd32a99, -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000',
                            whiteSpace: 'nowrap',
                            animation: 'boost-pop 2.5s ease-out forwards',
                        }}
                    >
                        ⚡ x{boostPopup.level} word boost!!
                    </span>
                </div>
            )}
            <WpmCounter totalKeys={Math.floor(totalKeys)} activeLang={activeLang} autoLang={autoLang} autoLangCountdown={autoLangCountdown} onToggleAutoLang={onToggleAutoLang} onSelectLang={onSelectLang} onFireEgg={fireEgg} isMobile={isMobile} />
            {/* Mobile egg column — right edge, vertical, large */}
            {isMobile && (
                <div
                    className="fixed flex flex-col items-center select-none"
                    style={{ right: '0.4rem', top: '50%', transform: 'translateY(-50%)', gap: '0.2rem', zIndex: 90 }}
                >
                    {[
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
                    ].map(({ name, emoji }) => (
                        <button
                            key={name}
                            onClick={() => fireEgg(name)}
                            title={name.toLowerCase()}
                            style={{
                                background: 'rgba(0,0,0,0.35)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '7px',
                                padding: '0.2rem',
                                cursor: 'pointer',
                                fontSize: '1.7rem',
                                lineHeight: 1,
                                width: '2.6rem',
                                height: '2.6rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                opacity: 0.8,
                            }}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>
            )}
            <button
                className="absolute select-none transition-all duration-150 active:scale-95"
                style={{
                    bottom: '1rem',
                    left: '3rem',
                    background: 'linear-gradient(135deg, #ff4757 0%, #a29bfe 50%, #1e90ff 100%)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.45rem 1.1rem',
                    color: '#fff',
                    fontSize: '0.9rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    letterSpacing: '0.12em',
                    zIndex: 90,
                    boxShadow: '0 0 18px #a29bfe44',
                }}
                onClick={() => downloadShareCard(Math.floor(totalKeys), discoveredEggs.size, TOTAL_EGGS, window.location.hostname)}
            >
                SHARE
            </button>
        </div>
    );
}
