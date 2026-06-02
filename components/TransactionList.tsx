import type { Transaction } from "@/app/generated/prisma/client";

type Props = { transactions: Transaction[] };

const currencyFormat = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

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
                <li key={t.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="flex flex-col">
                        <span className="font-medium">{t.title}</span>
                        <span className="text-xs text-gray-500">
                            {t.category} · {new Date(t.date).toLocaleDateString()}
                        </span>
                    </div>
                    <span className={`font-mono ${t.type === "INCOME" ? "text-green-600" : "text-red-600"}`}>
                        {t.type === "INCOME" ? "+" : "-"}{currencyFormat.format(t.amount)}
                    </span>
                </li>
            ))}
        </ul>
    );
}