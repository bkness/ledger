import type { Transaction } from "@/app/generated/prisma/client";
import { TransactionRow } from "./TransactionRow";

type Props = { transactions: Transaction[] };

export function TransactionList({ transactions }: Props) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
                <p className="text-sm text-gray-500 font-mono">{"// no transactions yet"}</p>
                <p className="text-xs text-gray-400">add your first below</p>
            </div>
        );
    }

    return (
        <ul className="flex flex-col gap-1">
            {transactions.map(t => (
                <TransactionRow key={t.id} transaction={t} />
            ))}
        </ul>
    );
}