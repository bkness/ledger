"use client";

import { useState } from "react";
import { createTransaction } from "@/app/actions";

const today = () => new Date().toISOString().split("T")[0];

export function TransactionForm() {
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(today());
    const [error, setError] = useState<string | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        const numericAmount = parseFloat(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            setError("Amount must be greater than 0");
            return;
        }

        setIsCreating(true);
        try {
            const result = await createTransaction(title, numericAmount, type, category, date);
            if (result?.error) {
                setError(result.error);
                return;
            }
            setTitle("");
            setAmount("");
            setCategory("");
            setDate(today());
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4 border rounded">
            <h2 className="text-sm font-medium text-gray-600">{"// ADD TRANSACTION"}</h2>

            <input
                type="text"
                placeholder="Title"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                className="border p-2 rounded"
            />

            <div className="flex gap-2">
                <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="Amount"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}
                    required
                    className="border p-2 rounded flex-1"
                />
                <select
                    value={type}
                    onChange={e => setType(e.target.value as "INCOME" | "EXPENSE")}
                    className="border p-2 rounded"
                >
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>

            <input
                type="text"
                placeholder="Category"
                value={category}
                onChange={e => setCategory(e.target.value)}
                required
                className="border p-2 rounded"
            />

            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                required
                className="border p-2 rounded"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
                type="submit"
                disabled={isCreating}
                className="bg-black text-white p-2 rounded disabled:opacity-50"
            >
                {isCreating ? "Adding..." : "Add Transaction"}
            </button>
        </form>
    );
}