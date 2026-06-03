"use client";

import { useState } from "react";
import type { Transaction } from "@/app/generated/prisma/client";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { SummaryCards } from "@/components/SummaryCards";
import { type Filter, FilterPills } from "@/components/FilterPills";
import { ThemeSwitcher } from "./ThemeSwitcher";
import { Navbar } from "@/components/Navbar";

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
        <>
            <Navbar
                userEmail={userEmail}
                signOutAction={signOutAction}
                themeSwitcher={<ThemeSwitcher />}
            />
            <main className="max-w-4xl mx-auto p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 w-full">
                <SummaryCards filteredTransactions={filteredTransactions} />
                <TransactionForm />
                <TransactionList
                    transactions={filteredTransactions}
                    filterPills={<FilterPills value={filter} onChange={setFilter} />}
                />
            </main>
        </>
    );
}
