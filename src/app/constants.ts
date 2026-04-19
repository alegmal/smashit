// ── Shared constants ───────────────────────────────────────────────────────

export const ALL_EGG_NAMES = [
    'ALEG', 'AI', 'BABY', 'BORING', 'BUG',
    'CAT', 'COFFEE', 'DEPLOY', 'DEVOPS', 'DINO',
    'DISCO', 'DOG', 'DONE', 'FAIL', 'FROG',
    'DUCK', 'HIRE', 'LOL', 'MAGIC', 'MATRIX',
    'MEETING', 'OMG', 'PIZZA', 'QWERTY', 'RAINBOW',
    'ROCKET', 'SHARK', 'SPACE', 'TRAIN',
    'UNICORN', 'WTF', 'YES', 'YOLO', 'POOP', 'LINKEDIN',
];

// Human-readable labels for action-based and secret discoveries
export const EGG_DISPLAY_LABELS: Record<string, string> = {
    ALEG: "🥚 the creator's name...",
    DISCO: 'DISCO ⚠️ (epileptic seizure)',
};

export const NOTES = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00];

export const COLORS = [
    "#ff4757", "#ff6b35", "#ffd32a", "#2ed573", "#1e90ff",
    "#7bed9f", "#a29bfe", "#fd79a8", "#00cec9", "#fdcb6e",
];

export const STEP = 36;   // px between letter centers on edge
export const MARGIN = 20; // px from screen edge inward

export const ORBIT_HIT_RADIUS = 70; // px — collision zone around each orbit letter

export const CRITTERS = ['💩'];

export const YAML_SNIPPETS = [
    'apiVersion: apps/v1', 'kind: Deployment', 'replicas: 3',
    'kubectl get pods', 'image: nginx:latest', 'kubectl apply -f .',
    'containerPort: 8080', 'namespace: default', 'kubectl logs -f',
    'resources: limits:', 'memory: "256Mi"', 'cpu: "500m"',
    'livenessProbe:', 'readinessProbe:', 'helm upgrade --install',
    'kubectl rollout status', 'imagePullPolicy: Always',
    'envFrom: configMapRef:', 'kubectl describe pod', 'serviceAccountName:',
];

export const MILESTONE_LABELS: Record<number, string> = {
    10: '10 KEYS PRESSED!',
    40: '40 KEYS PRESSED!',
    100: '100 KEYS PRESSED!',
    200: '200 KEYS PRESSED!',
    500: '500 KEYS PRESSED!',
    1000: '1000 KEYS PRESSED!',
    2000: '2000 KEYS PRESSED!',
    3000: '3000 KEYS PRESSED!',
    4000: '4000 KEYS PRESSED!',
    5000: '5000 KEYS PRESSED!',
    6000: '6000 KEYS PRESSED!',
    7000: '7000 KEYS PRESSED!',
    8000: '8000 KEYS PRESSED!',
    9000: '9000 KEYS PRESSED!',
    10000: '10000 KEYS PRESSED!',
};

export const KEYBOARD_KEYS = [
    'Q','W','E','R','T','Y','U','I','O','P',
    'A','S','D','F','G','H','J','K','L',
    'Z','X','C','V','B','N','M',
];

export const MEETING_PHRASES = [
    "you're on mute",
    "can you hear me?",
    "I can't hear you",
    "sorry, go ahead",
    "you're breaking up",
    "let me share my screen",
    "who just joined?",
    "quick sync 🙃",
    "can you see my screen?",
    "be there in 5 min",
];

export const MAGIC_EMOJIS = ['✨','🪄','⭐','🌟','💫','🎇','🎆','🌈','🦄','🔮'];
export const SPACE_EMOJIS  = ['⭐','🌟','✨','💫','🌙','🪐','☄️','🌌'];

export const DEPLOY_LINES = [
    '> git push origin main',
    '> deploying to production...',
    "> it's friday night btw 💀",
    '> running tests... ✓ (skipped)',
    '> pushing to prod... ██████ 100%',
    '> CRITICAL ERROR: undefined',
    '> rollback? (y/n): _',
    '> No backup found. Proceeding with deployment... 💀',
];

export const HINTS = [
    // kids — obvious
    "have you tried typing DOG? 🐶",
    "what about CAT? give it a try!",
    "type DINO and see what happens...",
    "something is swimming if you type SHARK 🦈",
    "try typing FROG! 🐸",
    "type SPACE for something out of this world 🚀",
    "ROCKET is a fun one...",
    "have you typed UNICORN yet? ✨",
    "TRAIN is coming — type it! 🚂",
    // others — subtle
    "hmm... I'm so hungry, could really go for some PIZZA right now...",
    "I need COFFEE. desperately.",
    "...this is getting BORING",
    "I think there might be a BUG somewhere in here...",
    "sounds like a BABY crying in the distance...",
    "time to DEPLOY something into production...",
    "well... that was a FAIL.",
    "feeling like DISCO tonight...",
    "we need to schedule a MEETING about this",
    "ugh, another ZOOM call...",
    "LOL at this whole situation",
    "OMG did you see that?!",
    "YES! finally!",
    "DONE. finally done.",
    "YOLO, just go for it",
    "honestly someone should HIRE you for this",
    "QWERTY... a classic",
    "the MATRIX has you",
    "it's pure MAGIC, I tell you",
    "somewhere over the RAINBOW...",
    "the sound of a GONG echoes through the room",
    "welcome to DEVOPS hell",
    "SMASH it. just SMASH it",
    "WTF is even going on right now",
    "AI is going to take over everything...",
    "RAINBOW after the storm",
    "sometimes more is more...."
];
