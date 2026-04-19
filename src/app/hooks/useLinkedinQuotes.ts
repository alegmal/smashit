"use client";

import { useCallback, useRef, useState } from 'react';
import { HINTS } from '../constants';

interface QuoteState {
    id: number;
    text: string;
    x: number;
    y: number;
}

export function useLinkedinQuotes() {
    const [linkedinQuote, setLinkedinQuote] = useState<QuoteState | null>(null);
    const quoteTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const quoteCounterRef = useRef(0);
    const hintIndexRef = useRef(0);

    const showQuote = useCallback(() => {
        // Cycle sequentially through all hints
        const text = HINTS[hintIndexRef.current % HINTS.length]!;
        hintIndexRef.current++;
        const id = ++quoteCounterRef.current;
        // Left band: 2–20vw, right band: 65–83vw — never in the middle
        const onLeft = Math.random() < 0.5;
        const x = onLeft ? 2 + Math.random() * 18 : 65 + Math.random() * 18;
        setLinkedinQuote({ id, text, x, y: 10 + Math.random() * 75 });
        quoteTimerRef.current = setTimeout(() => {
            setLinkedinQuote(prev => prev?.id === id ? null : prev);
            scheduleQuote();
        }, 4000);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const scheduleQuote = useCallback(() => {
        quoteTimerRef.current = setTimeout(showQuote, 1500 + Math.random() * 1500);
    }, [showQuote]);

    const startQuotes = useCallback(() => {
        showQuote();
    }, [showQuote]);

    const stopQuotes = useCallback(() => {
        if (quoteTimerRef.current) { clearTimeout(quoteTimerRef.current); quoteTimerRef.current = null; }
        setLinkedinQuote(null);
    }, []);

    return { linkedinQuote, quoteTimerRef, startQuotes, stopQuotes };
}
