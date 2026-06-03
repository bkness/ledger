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

    const balanceClass = balance >= 0 ? "text-green-600" : "text-red-600";

    return (
        <div className="grid grid-cols-3 gap-3">
            <StatCard
                label="Income"
                value={currencyFormat.format(income)}
                count={incomeTransactions.length}
                valueClass="text-green-600"
            />
            <StatCard
                label="Expense"
                value={currencyFormat.format(expense)}
                count={expenseTransactions.length}
                valueClass="text-red-600"
            />
            <StatCard
                label="Balance"
                value={currencyFormat.format(balance)}
                count={filteredTransactions.length}
                valueClass={balanceClass}
            />
        </div>
    );
}

type StatCardProps = {
    label: string;
    value: string;
    count: number;
    valueClass: string;
};

function StatCard({ label, value, count, valueClass }: StatCardProps) {
    return (
        <div className="border rounded p-3 flex flex-col gap-1">
            <span className="text-xs text-gray-500 uppercase tracking-wide font-semibold">{label}</span>
            <span className={`font-mono text-xl font-medium ${valueClass}`}>{value}</span>
            <span className="text-xs text-gray-400">
                {count === 1 ? "1 transaction" : `${count} transactions`}
            </span>
        </div>
    );
}
