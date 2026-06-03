"use client";

import { useRef } from "react";

export type Filter = "ALL" | "INCOME" | "EXPENSE";

const FILTERS: { value: Filter; label: string }[] = [
    { value: "ALL", label: "All" },
    { value: "INCOME", label: "Income" },
    { value: "EXPENSE", label: "Expense" },
];

type Props = {
    value: Filter;
    onChange: (value: Filter) => void;
};

export function FilterPills({ value, onChange }: Props) {
    const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
        const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
        if (!delta) return;

        const currentIndex = FILTERS.findIndex(f => f.value === value);
        if (currentIndex === -1) return;

        e.preventDefault();
        const newIndex = (currentIndex + delta + FILTERS.length) % FILTERS.length;
        onChange(FILTERS[newIndex].value);
        buttonsRef.current[newIndex]?.focus();
    }

    return (
        <div
            role="radiogroup"
            aria-label="Filter transactions"
            className="inline-flex rounded bg-gray-200 p-1"
            onKeyDown={handleKeyDown}
        >
            {FILTERS.map((filter, index) => (
                <button
                    key={filter.value}
                    ref={el => { buttonsRef.current[index] = el; }}
                    type="button"
                    role="radio"
                    aria-checked={value === filter.value}
                    onClick={() => onChange(filter.value)}
                    className={`px-3 py-1 rounded text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                        value === filter.value ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-300"
                    }`}
                    tabIndex={value === filter.value ? 0 : -1}
                >
                    {filter.label}
                </button>
            )
            )}
        </div>
    );
}