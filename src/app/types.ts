// ── Shared TypeScript interfaces ───────────────────────────────────────────

export interface FloatingKey {
    id: number;
    label: string;
    color: string;
    x: number; // vw percent
    y: number; // vh percent
    fontSize: string; // computed once at creation to avoid inline Math.random() on every render
}

export interface BorderLetter {
    id: number;
    label: string;
    color: string;
    x: number;    // px, precomputed at add time
    y: number;    // px, precomputed at add time
    size: number; // rem
    spawnY: number; // px — where to launch the particle (floor for top-edge letters)
}

export interface Particle {
    id: number;
    label: string;
    color: string;
    x: number; y: number;   // current position px
    vx: number; vy: number; // velocity px/frame
    rot: number;             // current rotation deg
    rotV: number;            // rotation velocity deg/frame
    size: number;            // rem
    born: number;            // performance.now() at creation
    life: number;            // total lifetime ms
}

export interface LastKeyState {
    label: string;
    color: string;
    id: number;
    fontSize: string;
}

export interface CritterItem {
    id: number;
    emoji: string;
    x: number;
    y: number;
    size: number;
}

export interface AiFloodItem {
    id: number;
    label: string;
    color: string;
    x: number;
    y: number;
    size: number;
    rot: number;
}

export interface MilestoneMessage {
    id: number;
    text: string;
    color: string;
    milestone: number;
}

export interface IdleFlyState {
    phase: 'sizing' | 'falling' | 'bouncing';
    x: number; y: number; vx: number; vy: number;
    rot: number; rotV: number;
    size: number; targetSize: number; sizeChangeFrame: number;
    label: string; color: string;
    frame: number;
}
