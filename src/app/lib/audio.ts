/**
 * Singleton Web Audio context + decoded AudioBuffer cache.
 * All play* functions are safe to call before user gesture
 * (they resume the context automatically).
 */

import { NOTES } from '../constants';

let audioCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext {
    if (!audioCtx) audioCtx = new AudioContext();
    return audioCtx;
}

export function playLetterPop() {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') { void ctx.resume(); }
        const now = ctx.currentTime;

        const bufferSize = ctx.sampleRate * 0.3;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const noiseGain = ctx.createGain();
        noiseGain.gain.setValueAtTime(0.1, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        noise.connect(noiseGain);
        noiseGain.connect(ctx.destination);
        noise.start(now);

        const osc = ctx.createOscillator();
        const oscGain = ctx.createGain();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(250, now);
        osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
        oscGain.gain.setValueAtTime(0.0875, now);
        oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    } catch { /* audio not available */ }
}

// ── Blip ──────────────────────────────────────────────────────────────────

export function playBlip() {
    try {
        const ctx = getAudioCtx();
        if (ctx.state === 'suspended') { void ctx.resume(); }

        const freq = NOTES[Math.floor(Math.random() * NOTES.length)]!;
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.type = "square";
        osc.frequency.setValueAtTime(freq, now);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.3, now + 0.06);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

        osc.start(now);
        osc.stop(now + 0.15);
    } catch { /* audio not available */ }
}

// ── MP3-backed sounds ─────────────────────────────────────────────────────
// Shared buffer cache — preloadAllAudio() fills this; makeMp3Player reads it.

const bufferCache = new Map<string, AudioBuffer>();
const loadingMap  = new Map<string, Promise<AudioBuffer>>();

function loadBuffer(path: string, ctx: AudioContext): Promise<AudioBuffer> {
    const cached = bufferCache.get(path);
    if (cached) return Promise.resolve(cached);

    const inflight = loadingMap.get(path);
    if (inflight) return inflight;

    const p = fetch(path)
        .then(r => { if (!r.ok) throw new Error('missing'); return r.arrayBuffer(); })
        .then(ab => ctx.decodeAudioData(ab))
        .then(decoded => { bufferCache.set(path, decoded); loadingMap.delete(path); return decoded; });

    loadingMap.set(path, p);
    return p;
}

function makeMp3Player(path: string, gainValue: number) {
    return function play() {
        try {
            const ctx = getAudioCtx();
            if (ctx.state === 'suspended') { void ctx.resume(); }
            loadBuffer(path, ctx).then(decoded => {
                const src = ctx.createBufferSource();
                src.buffer = decoded;
                const gain = ctx.createGain();
                gain.gain.value = gainValue;
                src.connect(gain);
                gain.connect(ctx.destination);
                src.start();
            }).catch(() => { /* file missing — silent */ });
        } catch { /* audio not available */ }
    };
}

// ── Preloader ─────────────────────────────────────────────────────────────
// Call once on app load. Fetches + decodes every MP3 into the shared cache
// so first-play is instant. Progress callback fires after each file.

const ALL_MP3_PATHS = [
    '/fart.mp3', '/alien.mp3', '/quack.mp3', '/baby-cry.mp3',
    '/air-horn.mp3', '/gong.mp3', '/deploy.mp3', '/what.mp3',
    '/snore.mp3', '/sad-trombone.mp3', '/zoom-notify.mp3', '/roar.mp3',
    '/meow.mp3', '/woof.mp3', '/magic.mp3', '/train.mp3', '/hit.mp3',
];

export async function preloadAllAudio(
    onProgress: (loaded: number, total: number) => void,
): Promise<void> {
    const ctx = getAudioCtx();
    const total = ALL_MP3_PATHS.length;
    let loaded = 0;
    onProgress(0, total);
    await Promise.all(
        ALL_MP3_PATHS.map(path =>
            loadBuffer(path, ctx)
                .catch(() => null)
                .finally(() => { onProgress(++loaded, total); }),
        ),
    );
}

// ── Named players ─────────────────────────────────────────────────────────

export const playFart        = makeMp3Player('/fart.mp3',         1.05);
export const playLoudFart    = makeMp3Player('/fart.mp3',         1.5);
export const playCoin        = makeMp3Player('/alien.mp3',        1.0);
export const playQuack       = makeMp3Player('/quack.mp3',        0.7);

let sillyToggle = false;
export function playSillySound() {
    sillyToggle = !sillyToggle;
    if (sillyToggle) playFart(); else playQuack();
}
export const playBabyCry     = makeMp3Player('/baby-cry.mp3',     1.0);
export const playAirHorn     = makeMp3Player('/air-horn.mp3',     0.9);
export const playAirHornSoft = makeMp3Player('/air-horn.mp3',     0.144); // 84% quieter, for boost msgs
export const playGong        = makeMp3Player('/gong.mp3',         1.2);
export const playDeploy      = makeMp3Player('/deploy.mp3',       1.0);
export const playWhat        = makeMp3Player('/what.mp3',         1.0);
export const playSnore       = makeMp3Player('/snore.mp3',        1.0);
export const playSadTrombone = makeMp3Player('/sad-trombone.mp3', 0.9);
export const playZoomNotify  = makeMp3Player('/zoom-notify.mp3',  1.0);
export const playRoar        = makeMp3Player('/roar.mp3',         1.0);
export const playMeow        = makeMp3Player('/meow.mp3',         1.0);
export const playWoof        = makeMp3Player('/woof.mp3',         1.0);
export const playMagic       = makeMp3Player('/magic.mp3',        1.0);
export const playTrain       = makeMp3Player('/train.mp3',        1.0);
export const playHit         = makeMp3Player('/hit.mp3',          1.0);
