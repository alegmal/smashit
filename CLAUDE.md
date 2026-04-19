# SmashIt — AI Agent Instructions

## Project Overview

Single-page Next.js app for baby keyboard smashing. No DB, no auth, no AI. Pure client-side fun.

## Stack

- Next.js 15 (App Router, Turbopack)
- React 19
- TypeScript 5 (strict)
- Tailwind CSS 3

## Module Map

```
src/app/
├── types.ts                     # All TS interfaces (FloatingKey, BorderLetter, Particle, etc.)
├── constants.ts                 # COLORS, NOTES, STEP, MARGIN, CRITTERS, LINKEDIN_QUOTES
├── lib/
│   ├── audio.ts                 # Web Audio API: all play* functions + buffer caches
│   └── utils.ts                 # slotToPosition, getKeyLabel, randomColor
├── hooks/
│   ├── usePhysicsLoop.ts        # Particle RAF loop (owns particlesRef, rafRef)
│   ├── useIdleAnimation.ts      # sizing→falling→bouncing idle letter
│   ├── useEasterEggs.ts         # ALEG + AI egg sequences
│   ├── useCritters.ts           # 💩 scheduling
│   └── useLinkedinQuotes.ts     # Quote scheduling
├── components/
│   ├── Floaters.tsx             # Background burst letters
│   ├── BorderLetters.tsx        # Clockwise edge letters
│   ├── Particles.tsx            # Exploded bouncing particles
│   ├── IdleLetter.tsx           # DVD screensaver letter
│   ├── Critters.tsx             # 💩 emoji overlay
│   ├── LinkedinQuote.tsx        # Hebrew quote overlay
│   ├── AiFloodOverlay.tsx       # AI egg flood + message box
│   ├── AlegOverlay.tsx          # Aleg egg message box
│   ├── WpmCounter.tsx           # Bottom-left keys/min counter
│   └── LandingPage.tsx          # Landing screen
└── page.tsx                     # Thin orchestration: ~130 lines
```

## Key Behavior

- `startCapture()` → `requestFullscreen()` + `addEventListener('keydown', ..., true)` (capture phase)
- `stopCapture()` → `exitFullscreen()` + `removeEventListener` + clear timer + reset state
- ESC is NOT `preventDefault()`-ed — it exits fullscreen naturally; `stopCapture()` also fires
- All other keys → `e.preventDefault()` + `e.stopPropagation()` to block browser shortcuts
- Safety timer: `setTimeout(stopCapture, 15_000)` on start

## Dev

```bash
npm run dev        # port 3001
npm run type-check
npm run lint
```
