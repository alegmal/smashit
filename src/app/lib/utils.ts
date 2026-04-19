// ── Pure utility functions ─────────────────────────────────────────────────

// ── Language transliteration ─────────────────────────────────────────────

const LANG_MAPS: Record<string, Record<string, string>> = {
    japanese: { A:'ア',B:'イ',C:'ウ',D:'エ',E:'オ',F:'カ',G:'キ',H:'ク',I:'ケ',J:'コ',
                K:'サ',L:'シ',M:'ス',N:'セ',O:'ソ',P:'タ',Q:'チ',R:'ツ',S:'テ',T:'ト',
                U:'ナ',V:'ニ',W:'ヌ',X:'ネ',Y:'ノ',Z:'ハ' },
    russian:  { A:'А',B:'Б',C:'В',D:'Г',E:'Д',F:'Е',G:'Ж',H:'З',I:'И',J:'К',
                K:'Л',L:'М',M:'Н',N:'О',O:'П',P:'Р',Q:'С',R:'Т',S:'У',T:'Ф',
                U:'Х',V:'Ц',W:'Ч',X:'Ш',Y:'Щ',Z:'Я' },
    hindi:    { A:'क',B:'ख',C:'ग',D:'घ',E:'च',F:'छ',G:'ज',H:'झ',I:'ट',J:'ठ',
                K:'ड',L:'ढ',M:'त',N:'थ',O:'द',P:'ध',Q:'न',R:'प',S:'फ',T:'ब',
                U:'भ',V:'म',W:'य',X:'र',Y:'ल',Z:'व' },
    greek:    { A:'α',B:'β',C:'γ',D:'δ',E:'ε',F:'ζ',G:'η',H:'θ',I:'ι',J:'κ',
                K:'λ',L:'μ',M:'ν',N:'ξ',O:'ο',P:'π',Q:'ρ',R:'σ',S:'τ',T:'υ',
                U:'φ',V:'χ',W:'ψ',X:'ω',Y:'α',Z:'β' },
    hebrew:   { A:'א',B:'ב',C:'ג',D:'ד',E:'ה',F:'ו',G:'ז',H:'ח',I:'ט',J:'י',
                K:'כ',L:'ל',M:'מ',N:'נ',O:'ס',P:'ע',Q:'פ',R:'צ',S:'ק',T:'ר',
                U:'ש',V:'ת',W:'ך',X:'ם',Y:'ן',Z:'ף' },
    english:  { A:'A',B:'B',C:'C',D:'D',E:'E',F:'F',G:'G',H:'H',I:'I',J:'J',
                K:'K',L:'L',M:'M',N:'N',O:'O',P:'P',Q:'Q',R:'R',S:'S',T:'T',
                U:'U',V:'V',W:'W',X:'X',Y:'Y',Z:'Z' },
};

export const LANG_NAMES = Object.keys(LANG_MAPS);

export function transliterateLabel(label: string, lang: string): string {
    const map = LANG_MAPS[lang];
    if (!map) return label;
    return (label.length === 1 && map[label]) ? map[label]! : label;
}

import { COLORS, STEP, MARGIN } from '../constants';

export function slotToPosition(slot: number): { x: number; y: number } {
    const W = window.innerWidth;
    const H = window.innerHeight;
    const bCount = Math.max(1, Math.floor((W - 2 * MARGIN) / STEP));
    const rCount = Math.max(1, Math.floor((H - 2 * MARGIN) / STEP));
    const tCount = bCount;
    const lCount = rCount;
    const total = bCount + rCount + tCount + lCount;
    const s = slot % total;

    if (s < bCount) {
        return { x: MARGIN + s * STEP, y: H - MARGIN };
    } else if (s < bCount + rCount) {
        const i = s - bCount;
        return { x: W - MARGIN, y: H - MARGIN - i * STEP };
    } else if (s < bCount + rCount + tCount) {
        const i = s - bCount - rCount;
        return { x: W - MARGIN - i * STEP, y: MARGIN };
    } else {
        const i = s - bCount - rCount - tCount;
        return { x: MARGIN, y: MARGIN + i * STEP };
    }
}

export function getKeyLabel(e: KeyboardEvent): string {
    const map: Record<string, string> = {
        " ": "SPACE", Enter: "ENTER", Backspace: "⌫", Tab: "TAB",
        Escape: "ESC", ArrowUp: "↑", ArrowDown: "↓", ArrowLeft: "←", ArrowRight: "→",
        CapsLock: "CAPS", Shift: "SHIFT", Control: "CTRL", Alt: "ALT", Meta: "CMD",
        Delete: "DEL", Home: "HOME", End: "END", PageUp: "PG↑", PageDown: "PG↓",
        Insert: "INS", PrintScreen: "PRNT", ScrollLock: "SCRL", Pause: "PAUSE", NumLock: "NUM",
    };
    if (map[e.key]) return map[e.key]!;
    if (/^F\d{1,2}$/.test(e.key)) return e.key;
    if (e.key.length === 1) return e.key.toUpperCase();
    return e.key.toUpperCase();
}

export function randomColor(): string {
    return COLORS[Math.floor(Math.random() * COLORS.length)]!;
}
