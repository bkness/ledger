import type { ReactNode } from "react";
import type { Transaction } from "@/app/generated/prisma/client";
import { TransactionRow } from "./TransactionRow";

type Props = {
    transactions: Transaction[];
    filterPills?: ReactNode;
};

export function TransactionList({ transactions, filterPills }: Props) {
    return (
        <div className="section">
            <div className="section-header">
                <div className="section-title">{"// TRANSACTIONS"}</div>
                <div className="section-count">{transactions.length}</div>
                {filterPills}
            </div>

            {transactions.length === 0 ? (
                <div className="tx-empty">
                    <div className="tx-empty-icon">{" "}</div>
                    <div className="tx-empty-text">{"// no transactions yet"}</div>
                </div>
            ) : (
                <>
                    <div className="tx-row tx-header">
                        <span>Description</span>
                        <span>Date</span>
                        <span>Type</span>
                        <span style={{ textAlign: "right" }}>Amount</span>
                        <span></span>
                    </div>
                    <ul>
                        {transactions.map(t => (
                            <TransactionRow key={t.id} transaction={t} />
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}
