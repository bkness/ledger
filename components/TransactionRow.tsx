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

    const variant = transaction.type === "INCOME" ? "income" : "expense";

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
            const result = await updateTransaction(transaction.id, title, numericAmount, type, category, date);
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
            <li className="tx-row" style={{ gridTemplateColumns: "1fr auto" }}>
                <div
                    className="tx-date"
                    style={{ color: "var(--text-dim)" }}
                >
                    {"// delete?"}
                </div>
                <div className="tx-actions">
                    <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="save-btn"
                        style={{
                            width: "auto",
                            padding: "0 12px",
                            borderColor: "var(--expense)",
                            color: "var(--expense)",
                        }}
                    >
                        {isDeleting ? "..." : "Yes, delete"}
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(false)}
                        disabled={isDeleting}
                        className="cancel-btn"
                        style={{ width: "auto", padding: "0 12px" }}
                    >
                        Cancel
                    </button>
                </div>
            </li>
        );
    }

    if (!isEditing) {
        return (
            <li className="tx-row">
                <div>
                    <div className="tx-title">{transaction.title}</div>
                    <div className="tx-cat">{transaction.category}</div>
                </div>
                <div className="tx-date">
                    {new Date(transaction.date).toLocaleDateString()}
                </div>
                <div>
                    <span className={`tx-badge ${variant}`}>{transaction.type}</span>
                </div>
                <div className={`tx-amount ${variant}`}>
                    {transaction.type === "INCOME" ? "+" : "-"}{currencyFormat.format(transaction.amount)}
                </div>
                <div className="tx-actions">
                    <button
                        type="button"
                        onClick={startEdit}
                        aria-label="Edit"
                        className="edit-btn"
                    >
                        ✎
                    </button>
                    <button
                        type="button"
                        onClick={() => setConfirmDelete(true)}
                        aria-label="Delete"
                        className="delete-btn"
                    >
                        🗑
                    </button>
                </div>
            </li>
        );
    }

    return (
        <li className="tx-row">
            <div className="tx-edit-fields">
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    autoFocus
                    className="edit-field"
                    placeholder="Title"
                />
                <input
                    type="text"
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="edit-field"
                    placeholder="Category"
                />
            </div>
            <input
                type="date"
                value={date}
                onChange={e => setDate(e.target.value)}
                className="edit-field"
            />
            <select
                value={type}
                onChange={e => setType(e.target.value as "INCOME" | "EXPENSE")}
                className="edit-field edit-type"
            >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
            </select>
            <input
                type="number"
                step="0.01"
                min="0.01"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="edit-field edit-amount"
            />
            <div className="tx-actions">
                <button
                    type="button"
                    onClick={save}
                    disabled={isSaving}
                    className="save-btn"
                >
                    {isSaving ? "..." : "✓"}
                </button>
                <button
                    type="button"
                    onClick={cancelEdit}
                    disabled={isSaving}
                    className="cancel-btn"
                >
                    ✗
                </button>
            </div>
        </li>
    );
}
