"use client";

import { useState } from "react";
import { createTransaction } from "@/app/actions";
import { useToast } from "@/lib/useToast";
import { Field } from "@/components/Field";
import { FieldSelect } from "@/components/FieldSelect";

const today = () => new Date().toISOString().split("T")[0];

export function TransactionForm() {
    const toast = useToast();
    const [title, setTitle] = useState("");
    const [amount, setAmount] = useState("");
    const [type, setType] = useState<"INCOME" | "EXPENSE">("EXPENSE");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState(today());
    const [isCreating, setIsCreating] = useState(false);

    function clearForm() {
        setTitle("");
        setAmount("");
        setType("EXPENSE");
        setCategory("");
        setDate(today());
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        const numericAmount = parseFloat(amount);
        if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
            toast.error("Amount must be greater than 0");
            return;
        }

        setIsCreating(true);
        try {
            const result = await createTransaction(title, numericAmount, type, category, date);
            if (result?.error) {
                toast.error(result.error);
                return;
            }
            toast.success("Transaction added");
            clearForm();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsCreating(false);
        }
    }

    return (
        <div className="section">
            <div className="section-header">
                <div className="section-title">{"// ADD TRANSACTION"}</div>
            </div>
            <form onSubmit={handleSubmit}>
                <div className="form-grid">
                    <Field label="Title" className="form-field-full">
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="e.g. Paycheck, Groceries"
                        />
                    </Field>
                    <Field label="Amount">
                        <input
                            type="number"
                            step="0.01"
                            min="0.01"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            required
                            placeholder="0.00"
                        />
                    </Field>
                    <FieldSelect label="Type">
                        <select
                            value={type}
                            onChange={e => setType(e.target.value as "INCOME" | "EXPENSE")}
                        >
                            <option value="EXPENSE">Expense</option>
                            <option value="INCOME">Income</option>
                        </select>
                    </FieldSelect>
                    <Field label="Category">
                        <input
                            type="text"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            required
                            placeholder="e.g. Food, Rent"
                        />
                    </Field>
                    <Field label="Date">
                        <input
                            type="date"
                            value={date}
                            onChange={e => setDate(e.target.value)}
                            required
                        />
                    </Field>
                </div>
                <div className="form-actions">
                    <button
                        type="button"
                        onClick={clearForm}
                        className="btn-secondary"
                        disabled={isCreating}
                    >
                        Clear
                    </button>
                    <button
                        type="submit"
                        disabled={isCreating}
                        className="btn-add"
                    >
                        <span className="btn-add-icon">+</span>
                        {isCreating ? "Adding..." : "Add Transaction"}
                    </button>
                </div>
            </form>
        </div>
    );
}
