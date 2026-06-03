"use client";

import type { Transaction } from "@/app/generated/prisma/client";

const currencyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

type Props = { filteredTransactions: Transaction[] };

export function SummaryCards({ filteredTransactions }: Props) {
    const incomeTransactions = filteredTransactions.filter(t => t.type === "INCOME");
    const expenseTransactions = filteredTransactions.filter(t => t.type === "EXPENSE");

    const income = incomeTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const expense = expenseTransactions.reduce((sum, t) => sum + Number(t.amount), 0);
    const balance = income - expense;

    return (
        <div className="stats-grid">
            <StatCard label="Income" value={currencyFormat.format(income)} count={incomeTransactions.length} variant="income" />
            <StatCard label="Expense" value={currencyFormat.format(expense)} count={expenseTransactions.length} variant="expense" />
            <StatCard label="Balance" value={currencyFormat.format(balance)} count={filteredTransactions.length} variant={balance >= 0 ? "income" : "expense"} highlight />
        </div>
    );
}

type StatCardProps = {
    label: string;
    value: string;
    count: number;
    variant?: "income" | "expense";
    highlight?: boolean;
};

function StatCard({ label, value, count, variant, highlight }: StatCardProps) {
    const cardClass = highlight ? "stat-card highlight" : "stat-card";
    const valueClass = variant ? `stat-value ${variant}` : "stat-value";
    return (
        <div className={cardClass}>
            <div className="stat-label">{label}</div>
            <div className={valueClass}>{value}</div>
            <div className="stat-delta">
                {count === 1 ? "1 transaction" : `${count} transactions`}
            </div>
        </div>
    );
}
