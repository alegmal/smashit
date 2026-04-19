"use client";

import { useEffect, useState } from 'react';

interface Props { visible: boolean }

interface BugItem {
    id: number;
    top: number;
    duration: number;
    delay: number;
}

export function BugCrawl({ visible }: Props) {
    const [bugs, setBugs] = useState<BugItem[]>([]);

    useEffect(() => {
        if (visible) {
            setBugs(Array.from({ length: 8 }, (_, i) => ({
                id: i,
                top: 20 + Math.random() * 60,
                duration: 2 + Math.random() * 3,
                delay: Math.random() * 2,
            })));
        } else {
            setBugs([]);
        }
    }, [visible]);

    if (bugs.length === 0) return null;

    return (
        <div className="fixed inset-0 z-[80] pointer-events-none overflow-hidden">
            {bugs.map(bug => (
                <span
                    key={bug.id}
                    className="absolute pointer-events-none select-none"
                    style={{
                        top: `${bug.top}%`,
                        fontSize: '2rem',
                        animation: `bug-crawl ${bug.duration}s linear ${bug.delay}s forwards`,
                    }}
                >
                    🐛
                </span>
            ))}
        </div>
    );
}
