"use client";

import { useEffect, useState } from "react";

const THEMES = [
    { name: "Light", className: "" },
    { name: "Blue", className: "theme-b" },
    { name: "Forest", className: "theme-c" },
    { name: "Amber", className: "theme-d" },
    { name: "Frost", className: "theme-e" },
] as const;

const STORAGE_KEY = "ledger-theme";

export function ThemeSwitcher() {
    const [index, setIndex] = useState(0);

    // Restore on mount — client-only to avoid SSR mismatch
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        const savedIndex = THEMES.findIndex(t => t.name === saved);
        if (savedIndex !== -1) setIndex(savedIndex);
    }, []);

    // Apply class to <html> + persist on every change
    useEffect(() => {
        const html = document.documentElement;
        THEMES.forEach(t => t.className && html.classList.remove(t.className));
        const current = THEMES[index];
        if (current.className) html.classList.add(current.className);
        localStorage.setItem(STORAGE_KEY, current.name);
    }, [index]);

    function cycle() {
        setIndex(i => (i + 1) % THEMES.length);
    }

    const current = THEMES[index];

    return (
        <button
            type="button"
            onClick={cycle}
            aria-label={`Theme: ${current.name}. Click to cycle.`}
            title={`Theme: ${current.name}`}
            className="text-sm border px-2 py-1 rounded hover:bg-gray-100"
        >
            🎨 {current.name}
        </button>
    );
}