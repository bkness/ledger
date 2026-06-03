"use client";

import { useState } from "react";
import type { Transaction } from "@/app/generated/prisma/client";
import { clearSingleTransaction, updateTransaction } from "@/app/actions";
import { useToast } from "@/lib/useToast";

const currencyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type Props = { transaction: Transaction };

export function TransactionRow({ transaction }: Props) {
    const toast = useToast();
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(transaction.title);
    const [amount, setAmount] = useState(transaction.amount.toString());
    const [type, setType] = useState<"INCOME" | "EXPENSE">(transaction.type);
    const [category, setCategory] = useState(transaction.category);
    const [date, setDate] = useState(transaction.date.toISOString().split("T")[0]);
    const [isSaving, setIsSaving] = useState(false);
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    function startEdit() {
        setTitle(transaction.title);
        setAmount(transaction.amount.toString());
        setType(transaction.type);
        setCategory(transaction.category);
        setDate(transaction.date.toISOString().split("T")[0]);
        setIsEditing(true);
    }

    function cancelEdit() {
        setIsEditing(false);
    }

    async function handleDelete() {
        setIsDeleting(true);
        try {
            const result = await clearSingleTransaction(transaction.id);
            if (result.error) {
                toast.error(result.error);
                return;
            }

            toast.success("Transaction deleted");
            setConfirmDelete(false);
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsDeleting(false);
        }
    }

    async function save() {
        const numericAmount = parseFloat(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }
        setIsSaving(true);
        try {
            const result = await updateTransaction(transaction.id, title, numericAmount, type, category,
                date);
            if (result?.error) {
                toast.error(result.error);
                return;
            }
            toast.success("Transaction updated");
            setIsEditing(false);
        } finally {
            setIsSaving(false);
        }
    }

    if (confirmDelete) {
        return (
            <li className="flex items-center justify-between p-3 border rounded">
                <span className="font-mono text-sm text-gray-500">{"// delete?"}</span>
                <div className="flex items-center gap-2">
                    <button type="button" onClick={handleDelete} disabled={isDeleting}
                        className="text-sm border px-2 py-1 rounded text-red-600 border-red-300 hover:bg-red-50 disabled:opacity-50">
                        {isDeleting ? "..." : "Yes, delete"}
                    </button>
                    <button type="button" onClick={() => setConfirmDelete(false)} disabled={isDeleting}
                        className="text-sm border px-2 py-1 rounded disabled:opacity-50">
                        Cancel
                    </button>
                </div>
            </li>
        );
    }

    if (!isEditing) {
        return (
            <li className="flex items-center justify-between p-3 border rounded">
                <div className="flex flex-col">
                    <span className="font-medium">{transaction.title}</span>
                    <span className="text-xs text-gray-500">
                        {transaction.category} · {new Date(transaction.date).toLocaleDateString()}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className={`font-mono ${transaction.type === "INCOME" ? "text-green-600" :
                        "text-red-600"}`}>
                        {transaction.type === "INCOME" ? "+" : "-"}{currencyFormat.format(transaction.amount)}
                    </span>
                    <button type="button" onClick={startEdit} aria-label="Edit" className="text-gray-500 hover:text-black">
                        ✎
                    </button>
                    <button type="button" onClick={() => { setConfirmDelete(true); }} aria-label="Delete" className="text-gray-500 hover:text-red-600">
                        🗑
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li className="flex flex-col gap-2 p-3 border rounded">
            <input type="text" value={title} onChange={e => setTitle(e.target.value)} autoFocus
                className="border p-1 rounded text-sm" />
            <div className="flex gap-2">
                <input type="number" step="0.01" min="0.01" value={amount} onChange={e =>
                    setAmount(e.target.value)} className="border p-1 rounded text-sm flex-1" />
                <select value={type} onChange={e => setType(e.target.value as "INCOME" | "EXPENSE")}
                    className="border p-1 rounded text-sm">
                    <option value="EXPENSE">Expense</option>
                    <option value="INCOME">Income</option>
                </select>
            </div>
            <input type="text" value={category} onChange={e => setCategory(e.target.value)}
                className="border p-1 rounded text-sm" />
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className="border p-1
  rounded text-sm" />
            <div className="flex gap-2 justify-end">
                <button type="button" onClick={save} disabled={isSaving} className="text-sm border px-2 py-1
  rounded disabled:opacity-50">
                    {isSaving ? "..." : "✓"}
                </button>
                <button type="button" onClick={cancelEdit} disabled={isSaving} className="text-sm border px-2
  py-1 rounded disabled:opacity-50">
                    ✗
                </button>
            </div>
        </li>
    );
}