"use client";

import { useCallback, useRef, useState } from 'react';

export const TOTAL_EGGS = 34; // 34 typed keywords
import { COLORS, YAML_SNIPPETS, MEETING_PHRASES } from '../constants';
import {
    playCoin, playFart, playLoudFart, playBlip, playBabyCry,
    playAirHorn, playQuack,
    playDeploy, playWhat, playSnore, playZoomNotify,
    playRoar, playMeow, playWoof, playMagic, playTrain,
} from '../lib/audio';
import type { AiFloodItem } from '../types';

export interface ActiveEggState {
    name: string;
    flood?: AiFloodItem[];
    msg?: string;
    gen?: number; // increments each trigger; used as React key to force component remount
}

interface Deps {
    clearIdleState: () => void;
    onAddKeys: (n: number) => void;
}

function makeFlood(count: number, labels: string[]): AiFloodItem[] {
    return Array.from({ length: count }, (_, i) => ({
        id: i,
        label: labels[i % labels.length]!,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        rot: (Math.random() - 0.5) * 30,
    }));
}

export function useEasterEggs({ clearIdleState, onAddKeys }: Deps) {
    const [discoveredEggs, setDiscoveredEggs] = useState<Set<string>>(new Set());
    const [activeEgg, setActiveEgg] = useState<ActiveEggState | null>(null);
    // Generation counter — each trigger increments; stale timeouts skip their clear
    const eggGenRef = useRef(0);

    // Sequence refs — one per egg keyword
    const eggSequenceRef = useRef('');
    const aiSeqRef = useRef('');
    const babySeqRef = useRef('');
    const devopsSeqRef = useRef('');
    const lolSeqRef = useRef('');
    const yesSeqRef = useRef('');
    const doneSeqRef = useRef('');
    const wtfSeqRef = useRef('');
    const omgSeqRef = useRef('');
    const hireSeqRef = useRef('');
    const pizzaSeqRef = useRef('');
    const coffeeSeqRef = useRef('');
    const boringSeqRef = useRef('');
    const deploySeqRef = useRef('');
    const yoloSeqRef = useRef('');
    const discoSeqRef = useRef('');
    const failSeqRef = useRef('');
    const bugSeqRef = useRef('');
    const meetingSeqRef = useRef('');
    const qwertySeqRef = useRef('');
    const matrixSeqRef = useRef('');
    const zoomSeqRef = useRef(''); // alias for MEETING
    const dinoSeqRef = useRef('');
    const catSeqRef = useRef('');
    const dogSeqRef = useRef('');
    const spaceSeqRef = useRef('');
    const sharkSeqRef = useRef('');
    const frogSeqRef = useRef('');
    const rocketSeqRef = useRef('');
    const unicornSeqRef = useRef('');
    const magicSeqRef = useRef('');
    const rainbowSeqRef = useRef('');
    const trainSeqRef = useRef('');
    const poopSeqRef = useRef('');
    const linkedinSeqRef = useRef('');
    const duckSeqRef = useRef('');
    const moreSeqRef = useRef(''); // hidden: typing MORE silently awards +5000 points

    // Shared lifecycle for POOP + LINKEDIN — same poop shower, either keyword extends it
    const poopShowerTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const poopShowerFartRef = useRef<ReturnType<typeof setInterval> | null>(null);

    // Helper for simple triggered eggs — captures a generation so stale timeouts don't
    // clear a newer egg that fired while this one was still running.
    function trigger(
        name: string,
        seqRef: React.MutableRefObject<string>,
        duration: number,
        egg?: Partial<ActiveEggState>,
        onStart?: () => void,
        onEnd?: () => void,
    ): boolean {
        seqRef.current = '';
        const gen = ++eggGenRef.current;
        clearIdleState();
        onAddKeys(100);
        setDiscoveredEggs(prev => new Set(prev).add(name));
        setActiveEgg({ name, gen, ...egg });
        onStart?.();
        setTimeout(() => {
            if (eggGenRef.current === gen) {
                setActiveEgg(null);
                onEnd?.();
            }
        }, duration);
        return true;
    }

    const handleEggInput = useCallback((ch: string): boolean => {
        // Update TRAIN, RAINBOW, FAIL seqs first so the AI check can use them as guards
        trainSeqRef.current = (trainSeqRef.current + ch).slice(-5);
        rainbowSeqRef.current = (rainbowSeqRef.current + ch).slice(-7);
        failSeqRef.current = (failSeqRef.current + ch).slice(-4);

        // ── ALEG ──────────────────────────────────────────────────────────────
        const next = eggSequenceRef.current + ch;
        eggSequenceRef.current = next.length > 4 ? next.slice(-4) : next;
        if (eggSequenceRef.current === 'ALEG') {
            eggSequenceRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState();
            onAddKeys(100);
            playLoudFart();
            setDiscoveredEggs(prev => new Set(prev).add('ALEG'));
            setActiveEgg({ name: 'ALEG' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 500);
            return true;
        }

        // ── AI ─────────────────────────────────────────────────────────────────
        aiSeqRef.current = (aiSeqRef.current + ch).slice(-2);
        if (aiSeqRef.current === 'AI' && !trainSeqRef.current.endsWith('TRAI') && !rainbowSeqRef.current.endsWith('RAI') && !failSeqRef.current.endsWith('FAI')) {
            aiSeqRef.current = '';
            const gen = ++eggGenRef.current;
            eggSequenceRef.current = '';
            clearIdleState();
            onAddKeys(100);
            playCoin();
            onAddKeys(1800);
            setDiscoveredEggs(prev => new Set(prev).add('AI'));
            setActiveEgg({ name: 'AI', flood: [{ id: 0, label: 'AI', color: COLORS[Math.floor(Math.random() * COLORS.length)]!, x: 50, y: 50, size: 14, rot: 0 }] });
            let counter = 1;
            const floodInterval = setInterval(() => {
                const batch = Array.from({ length: 100 }, (_, i) => ({
                    id: counter + i, label: 'AI',
                    color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
                    x: Math.random() * 100, y: Math.random() * 100,
                    size: 1.5 + Math.random() * 10, rot: Math.random() * 360,
                }));
                counter += 100;
                setActiveEgg(prev => prev?.name === 'AI' ? { ...prev, flood: [...(prev.flood ?? []), ...batch] } : prev);
                if (counter >= 1800) clearInterval(floodInterval);
            }, 160);
            setTimeout(() => { clearInterval(floodInterval); if (eggGenRef.current === gen) setActiveEgg(null); }, 1500);
            return true;
        }

        // ── BABY ───────────────────────────────────────────────────────────────
        babySeqRef.current = (babySeqRef.current + ch).slice(-4);
        if (babySeqRef.current === 'BABY') {
            babySeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playBabyCry();
            setDiscoveredEggs(prev => new Set(prev).add('BABY'));
            setActiveEgg({ name: 'BABY' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 4000);
            return true;
        }

        // ── DEVOPS ─────────────────────────────────────────────────────────────
        devopsSeqRef.current = (devopsSeqRef.current + ch).slice(-6);
        if (devopsSeqRef.current === 'DEVOPS') {
            devopsSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playBlip();
            onAddKeys(60);
            setDiscoveredEggs(prev => new Set(prev).add('DEVOPS'));
            const flood: AiFloodItem[] = Array.from({ length: 60 }, (_, i) => ({
                id: i, label: YAML_SNIPPETS[i % YAML_SNIPPETS.length]!,
                color: COLORS[Math.floor(Math.random() * COLORS.length)]!,
                x: Math.random() * 100, y: Math.random() * 100,
                size: 0.75 + Math.random() * 1.5, rot: (Math.random() - 0.5) * 20,
            }));
            setActiveEgg({ name: 'DEVOPS', flood });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 3000);
            return true;
        }


        // ── LOL ────────────────────────────────────────────────────────────────
        lolSeqRef.current = (lolSeqRef.current + ch).slice(-3);
        if (lolSeqRef.current === 'LOL') {
            lolSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playQuack();
            onAddKeys(180);
            setDiscoveredEggs(prev => new Set(prev).add('LOL'));
            setActiveEgg({ name: 'LOL', flood: makeFlood(180, ['LOL', '😂', 'LOL', '😂', '😂']) });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 2500);
            return true;
        }

        // ── YES ────────────────────────────────────────────────────────────────
        yesSeqRef.current = (yesSeqRef.current + ch).slice(-3);
        if (yesSeqRef.current === 'YES') {
            yesSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playAirHorn();
            setDiscoveredEggs(prev => new Set(prev).add('YES'));
            setActiveEgg({ name: 'YES', msg: '✅ Yes!' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 2000);
            return true;
        }

        // ── DONE ───────────────────────────────────────────────────────────────
        doneSeqRef.current = (doneSeqRef.current + ch).slice(-4);
        if (doneSeqRef.current === 'DONE') {
            doneSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playAirHorn();
            setDiscoveredEggs(prev => new Set(prev).add('DONE'));
            setActiveEgg({ name: 'DONE', msg: '✅ Done!' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 2000);
            return true;
        }

        // ── WTF ────────────────────────────────────────────────────────────────
        wtfSeqRef.current = (wtfSeqRef.current + ch).slice(-3);
        if (wtfSeqRef.current === 'WTF') {
            return trigger('WTF', wtfSeqRef, 2000, undefined, () => playWhat());
        }

        // ── OMG ────────────────────────────────────────────────────────────────
        omgSeqRef.current = (omgSeqRef.current + ch).slice(-3);
        if (omgSeqRef.current === 'OMG') {
            omgSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playAirHorn();
            setDiscoveredEggs(prev => new Set(prev).add('OMG'));
            setActiveEgg({ name: 'OMG' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 1500);
            return true;
        }

        // ── HIRE ───────────────────────────────────────────────────────────────
        hireSeqRef.current = (hireSeqRef.current + ch).slice(-4);
        if (hireSeqRef.current === 'HIRE') {
            return trigger('HIRE', hireSeqRef, 3000, undefined, () => playAirHorn());
        }


        // ── PIZZA ──────────────────────────────────────────────────────────────
        pizzaSeqRef.current = (pizzaSeqRef.current + ch).slice(-5);
        if (pizzaSeqRef.current === 'PIZZA') {
            return trigger('PIZZA', pizzaSeqRef, 4000, undefined, () => playBlip());
        }

        // ── COFFEE ─────────────────────────────────────────────────────────────
        coffeeSeqRef.current = (coffeeSeqRef.current + ch).slice(-6);
        if (coffeeSeqRef.current === 'COFFEE') {
            return trigger('COFFEE', coffeeSeqRef, 4000, undefined, () => playBlip());
        }

        // ── BORING ─────────────────────────────────────────────────────────────
        boringSeqRef.current = (boringSeqRef.current + ch).slice(-6);
        if (boringSeqRef.current === 'BORING') {
            return trigger('BORING', boringSeqRef, 4000, undefined, () => playSnore());
        }

        // ── DEPLOY ─────────────────────────────────────────────────────────────
        deploySeqRef.current = (deploySeqRef.current + ch).slice(-6);
        if (deploySeqRef.current === 'DEPLOY') {
            return trigger('DEPLOY', deploySeqRef, 5500, undefined, () => playDeploy());
        }

        // ── YOLO ───────────────────────────────────────────────────────────────
        yoloSeqRef.current = (yoloSeqRef.current + ch).slice(-4);
        if (yoloSeqRef.current === 'YOLO') {
            return trigger('YOLO', yoloSeqRef, 2500, undefined, () => playAirHorn());
        }

        // ── DISCO ──────────────────────────────────────────────────────────────
        discoSeqRef.current = (discoSeqRef.current + ch).slice(-5);
        if (discoSeqRef.current === 'DISCO') {
            discoSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState();
            setDiscoveredEggs(prev => new Set(prev).add('DISCO'));
            let n = 0;
            const blipInterval = setInterval(() => { playBlip(); if (++n >= 8) clearInterval(blipInterval); }, 100);
            setActiveEgg({ name: 'DISCO' });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 333);
            return true;
        }

        // ── FAIL ───────────────────────────────────────────────────────────────
        if (failSeqRef.current === 'FAIL') {
            return trigger('FAIL', failSeqRef, 2500, undefined, () => playQuack());
        }

        // ── BUG ────────────────────────────────────────────────────────────────
        bugSeqRef.current = (bugSeqRef.current + ch).slice(-3);
        if (bugSeqRef.current === 'BUG') {
            return trigger('BUG', bugSeqRef, 4000, undefined, () => playBlip());
        }

        // ── MEETING ────────────────────────────────────────────────────────────
        meetingSeqRef.current = (meetingSeqRef.current + ch).slice(-7);
        if (meetingSeqRef.current === 'MEETING') {
            meetingSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playZoomNotify();
            onAddKeys(60);
            setDiscoveredEggs(prev => new Set(prev).add('MEETING'));
            setActiveEgg({ name: 'MEETING', flood: makeFlood(60, [...MEETING_PHRASES, ...MEETING_PHRASES]) });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 4000);
            return true;
        }

        // ── ZOOM (alias for MEETING) ────────────────────────────────────────────
        zoomSeqRef.current = (zoomSeqRef.current + ch).slice(-4);
        if (zoomSeqRef.current === 'ZOOM') {
            zoomSeqRef.current = '';
            const gen = ++eggGenRef.current;
            clearIdleState(); playZoomNotify();
            onAddKeys(60);
            setDiscoveredEggs(prev => new Set(prev).add('MEETING'));
            setActiveEgg({ name: 'MEETING', flood: makeFlood(60, [...MEETING_PHRASES, ...MEETING_PHRASES]) });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 4000);
            return true;
        }

        // ── QWERTY ─────────────────────────────────────────────────────────────
        qwertySeqRef.current = (qwertySeqRef.current + ch).slice(-6);
        if (qwertySeqRef.current === 'QWERTY') {
            return trigger('QWERTY', qwertySeqRef, 4000, undefined, () => {
                onAddKeys(26);
                playAirHorn();
                setTimeout(() => playAirHorn(), 500);
                setTimeout(() => playAirHorn(), 1000);
            });
        }

        // ── MATRIX ─────────────────────────────────────────────────────────────
        matrixSeqRef.current = (matrixSeqRef.current + ch).slice(-6);
        if (matrixSeqRef.current === 'MATRIX') {
            return trigger('MATRIX', matrixSeqRef, 17000, undefined, () => playBlip());
        }

        // ── DINO ───────────────────────────────────────────────────────────────
        dinoSeqRef.current = (dinoSeqRef.current + ch).slice(-4);
        if (dinoSeqRef.current === 'DINO') {
            return trigger('DINO', dinoSeqRef, 4000, undefined, () => playRoar());
        }

        // ── CAT ────────────────────────────────────────────────────────────────
        catSeqRef.current = (catSeqRef.current + ch).slice(-3);
        if (catSeqRef.current === 'CAT') {
            return trigger('CAT', catSeqRef, 4000, undefined, () => playMeow());
        }

        // ── DOG ────────────────────────────────────────────────────────────────
        dogSeqRef.current = (dogSeqRef.current + ch).slice(-3);
        if (dogSeqRef.current === 'DOG') {
            return trigger('DOG', dogSeqRef, 4000, undefined, () => playWoof());
        }

        // ── SPACE ──────────────────────────────────────────────────────────────
        spaceSeqRef.current = (spaceSeqRef.current + ch).slice(-5);
        if (spaceSeqRef.current === 'SPACE') {
            return trigger('SPACE', spaceSeqRef, 4000, undefined, () => playBlip());
        }

        // ── SHARK ──────────────────────────────────────────────────────────────
        sharkSeqRef.current = (sharkSeqRef.current + ch).slice(-5);
        if (sharkSeqRef.current === 'SHARK') {
            return trigger('SHARK', sharkSeqRef, 4000, undefined, () => playBlip());
        }

        // ── FROG ───────────────────────────────────────────────────────────────
        frogSeqRef.current = (frogSeqRef.current + ch).slice(-4);
        if (frogSeqRef.current === 'FROG') {
            return trigger('FROG', frogSeqRef, 4000, undefined, () => playBlip());
        }

        // ── ROCKET ─────────────────────────────────────────────────────────────
        rocketSeqRef.current = (rocketSeqRef.current + ch).slice(-6);
        if (rocketSeqRef.current === 'ROCKET') {
            return trigger('ROCKET', rocketSeqRef, 3000, undefined, () => playAirHorn());
        }

        // ── UNICORN ────────────────────────────────────────────────────────────
        unicornSeqRef.current = (unicornSeqRef.current + ch).slice(-7);
        if (unicornSeqRef.current === 'UNICORN') {
            return trigger('UNICORN', unicornSeqRef, 4000, undefined, () => playBlip());
        }

        // ── MAGIC ──────────────────────────────────────────────────────────────
        magicSeqRef.current = (magicSeqRef.current + ch).slice(-5);
        if (magicSeqRef.current === 'MAGIC') {
            return trigger('MAGIC', magicSeqRef, 2000, undefined, () => playMagic());
        }

        // ── RAINBOW ────────────────────────────────────────────────────────────
        if (rainbowSeqRef.current === 'RAINBOW') {
            return trigger('RAINBOW', rainbowSeqRef, 3000, undefined, () => playBlip());
        }

        // ── TRAIN ──────────────────────────────────────────────────────────────
        // (trainSeqRef already updated at top of this function)
        if (trainSeqRef.current === 'TRAIN') {
            return trigger('TRAIN', trainSeqRef, 4000, undefined, () => playTrain());
        }

        // ── MORE (hidden) — silently awards +5000 points, no egg discovery ──────
        moreSeqRef.current = (moreSeqRef.current + ch).slice(-4);
        if (moreSeqRef.current === 'MORE') {
            moreSeqRef.current = '';
            onAddKeys(5000);
        }

        // ── DUCK ───────────────────────────────────────────────────────────────
        duckSeqRef.current = (duckSeqRef.current + ch).slice(-4);
        if (duckSeqRef.current === 'DUCK') {
            return trigger('DUCK', duckSeqRef, 4500, undefined, () => {
                let n = 0;
                const qi = setInterval(() => { playQuack(); if (++n >= 12) clearInterval(qi); }, 350);
                void qi; // suppress unused var warning
            });
        }

        // ── POOP / LINKEDIN — shared poop shower; either keyword extends it ────
        poopSeqRef.current = (poopSeqRef.current + ch).slice(-4);
        linkedinSeqRef.current = (linkedinSeqRef.current + ch).slice(-8);
        if (poopSeqRef.current === 'POOP' || linkedinSeqRef.current === 'LINKEDIN') {
            const triggeredName = linkedinSeqRef.current === 'LINKEDIN' ? 'LINKEDIN' : 'POOP';
            poopSeqRef.current = ''; linkedinSeqRef.current = '';
            ++eggGenRef.current; // invalidate any previous egg's gen-based timeout
            clearIdleState();
            onAddKeys(100);
            setDiscoveredEggs(prev => new Set(prev).add(triggeredName));
            setActiveEgg({ name: triggeredName });
            // Restart fart loop from scratch — no double-farting on retrigger
            if (poopShowerFartRef.current) clearInterval(poopShowerFartRef.current);
            let fartCount = 0;
            poopShowerFartRef.current = setInterval(() => {
                if (fartCount % 3 === 0) { playLoudFart(); } else { playFart(); }
                fartCount++;
            }, 380);
            // Reset shared timer — clears when either name is active
            if (poopShowerTimerRef.current) clearTimeout(poopShowerTimerRef.current);
            poopShowerTimerRef.current = setTimeout(() => {
                poopShowerTimerRef.current = null;
                if (poopShowerFartRef.current) { clearInterval(poopShowerFartRef.current); poopShowerFartRef.current = null; }
                setActiveEgg(prev => (prev?.name === 'POOP' || prev?.name === 'LINKEDIN') ? null : prev);
            }, 1500);
            return true;
        }

        return false;
    }, [clearIdleState]);

    const resetEggs = useCallback(() => {
        setDiscoveredEggs(new Set());
        setActiveEgg(null);
        eggGenRef.current = 0;
        // Stop any in-flight poop shower
        if (poopShowerTimerRef.current) { clearTimeout(poopShowerTimerRef.current); poopShowerTimerRef.current = null; }
        if (poopShowerFartRef.current) { clearInterval(poopShowerFartRef.current); poopShowerFartRef.current = null; }
        // Reset all seq refs
        eggSequenceRef.current = ''; aiSeqRef.current = ''; babySeqRef.current = '';
        devopsSeqRef.current = '';
        lolSeqRef.current = ''; yesSeqRef.current = ''; doneSeqRef.current = '';
        wtfSeqRef.current = ''; omgSeqRef.current = ''; hireSeqRef.current = '';
        pizzaSeqRef.current = ''; coffeeSeqRef.current = '';
        boringSeqRef.current = ''; deploySeqRef.current = ''; yoloSeqRef.current = '';
        discoSeqRef.current = ''; failSeqRef.current = ''; bugSeqRef.current = '';
        meetingSeqRef.current = ''; qwertySeqRef.current = ''; matrixSeqRef.current = '';
        zoomSeqRef.current = ''; dinoSeqRef.current = ''; catSeqRef.current = '';
        dogSeqRef.current = ''; spaceSeqRef.current = ''; sharkSeqRef.current = '';
        frogSeqRef.current = ''; rocketSeqRef.current = ''; unicornSeqRef.current = '';
        magicSeqRef.current = ''; rainbowSeqRef.current = ''; trainSeqRef.current = '';
        poopSeqRef.current = ''; linkedinSeqRef.current = ''; duckSeqRef.current = ''; moreSeqRef.current = '';
    }, []);

    const fireEgg = useCallback((name: string) => {
        clearIdleState();
        onAddKeys(100);
        setDiscoveredEggs(prev => new Set(prev).add(name));
        if (name === 'POOP') {
            ++eggGenRef.current;
            setActiveEgg({ name });
            if (poopShowerFartRef.current) clearInterval(poopShowerFartRef.current);
            let fartCount = 0;
            poopShowerFartRef.current = setInterval(() => {
                if (fartCount % 3 === 0) { playLoudFart(); } else { playFart(); }
                fartCount++;
            }, 380);
            if (poopShowerTimerRef.current) clearTimeout(poopShowerTimerRef.current);
            poopShowerTimerRef.current = setTimeout(() => {
                poopShowerTimerRef.current = null;
                if (poopShowerFartRef.current) { clearInterval(poopShowerFartRef.current); poopShowerFartRef.current = null; }
                setActiveEgg(prev => prev?.name === 'POOP' ? null : prev);
            }, 1500);
        } else if (name === 'BABY') {
            const gen = ++eggGenRef.current;
            playBabyCry();
            setActiveEgg({ name });
            setTimeout(() => { if (eggGenRef.current === gen) setActiveEgg(null); }, 4000);
        } else if (name === 'DINO') {
            playRoar();
            trigger(name, dinoSeqRef, 4000);
        } else if (name === 'SHARK') {
            playBlip();
            trigger(name, sharkSeqRef, 4000);
        } else if (name === 'UNICORN') {
            playBlip();
            trigger(name, unicornSeqRef, 4000);
        } else if (name === 'CAT') {
            playMeow();
            trigger(name, catSeqRef, 4000);
        } else if (name === 'DOG') {
            playWoof();
            trigger(name, dogSeqRef, 4000);
        }
    }, [clearIdleState, onAddKeys]);

    return {
        activeEgg,
        discoveredEggs,
        discoverEgg: (name: string) => setDiscoveredEggs(prev => new Set(prev).add(name)),
        handleEggInput, resetEggs, fireEgg,
    };
}
