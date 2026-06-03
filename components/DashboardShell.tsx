"use client";

import { useState } from "react";
import type { Transaction } from "@/app/generated/prisma/client";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { SummaryCards } from "@/components/SummaryCards";
import { type Filter, FilterPills } from "@/components/FilterPills";
import { ThemeSwitcher } from "./ThemeSwitcher";

type Props = {
    transactions: Transaction[];
    userEmail: string;
    signOutAction: () => Promise<void>;
}

export function DashboardShell({ transactions, userEmail, signOutAction }: Props) {
    const [filter, setFilter] = useState<Filter>("ALL");

    const filteredTransactions =
        filter === "ALL"
            ? transactions
            : transactions.filter(t => t.type === filter);

    return (
        <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Ledger</h1>
                <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-600">{userEmail}</span>
                    <ThemeSwitcher />
                    <form action={signOutAction}>
                        <button type="submit" className="border px-3 py-1 rounded text-sm">Sign out</button>
                    </form>
                </div>
            </header>

            <SummaryCards filteredTransactions={filteredTransactions} />
            <TransactionForm />

            <section>
                <h2 className="text-sm font-medium mb-3 text-gray-600">{"// TRANSACTIONS"}</h2>
                <FilterPills value={filter} onChange={setFilter} />
                <TransactionList transactions={filteredTransactions} />
            </section>
        </main>
    );
}