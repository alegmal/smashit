"use client";

import { useEffect, useState } from "react";
import { preloadAllAudio } from "../lib/audio";

interface Props {
    onStart: () => void;
}

export function LandingPage({ onStart }: Props) {
    const [loaded, setLoaded] = useState(0);
    const [total, setTotal] = useState(0);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const safety = setTimeout(() => setReady(true), 8000);
        preloadAllAudio((l, t) => {
            setTotal(t);
            setLoaded(l);
        }).then(() => setReady(true));
        return () => clearTimeout(safety);
    }, []);

    const pct = total > 0 ? Math.round((loaded / total) * 100) : 0;

    return (
        <div
            className="min-h-screen flex flex-col items-center justify-center gap-10 px-6 text-center"
            style={{ background: "radial-gradient(ellipse at 50% 40%, #1a0a2e 0%, #0a0a0f 70%)" }}
        >
            <div className="flex flex-col items-center gap-3">
                <div className="text-8xl">👶</div>
                <h1
                    className="font-black text-7xl sm:text-8xl tracking-tight"
                    style={{
                        background: "linear-gradient(135deg, #ff4757, #ffd32a, #2ed573, #1e90ff, #a29bfe)",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    SmashIt
                </h1>
                <p className="text-xl text-white/50 max-w-sm">
                    Let the baby smash the keyboard — totally safe, totally fun!
                </p>
            </div>

            <div className="flex flex-col items-center gap-4 h-24 justify-center">
                {ready ? (
                    <button
                        onClick={onStart}
                        className="relative group font-black text-3xl px-16 py-6 rounded-3xl transition-all duration-150 active:scale-95 animate-pop-in"
                        style={{
                            background: "linear-gradient(135deg, #ff4757 0%, #a29bfe 50%, #1e90ff 100%)",
                            boxShadow: "0 0 40px #ff475766, 0 0 80px #a29bfe33",
                        }}
                    >
                        <span className="relative z-10 text-white drop-shadow-lg">START 🚀</span>
                        <div
                            className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity"
                            style={{
                                background: "linear-gradient(135deg, #ff6b35 0%, #fd79a8 50%, #7bed9f 100%)",
                            }}
                        />
                    </button>
                ) : (
                    <div className="flex flex-col items-center gap-2 w-56">
                        <span className="text-white/35 text-sm font-mono tracking-widest">
                            loading sounds... {pct}%
                        </span>
                        <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-300 ease-out"
                                style={{
                                    width: `${pct}%`,
                                    background: 'linear-gradient(90deg, #ff4757, #ffd32a, #2ed573, #1e90ff)',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="text-white/30 text-sm space-y-1">
                <p>Goes fullscreen • every key makes a colorful burst</p>
                <p>Press <kbd className="bg-white/10 px-2 py-0.5 rounded font-mono text-white/60">ESC</kbd> to exit</p>
            </div>
        </div>
    );
}
