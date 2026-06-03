import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getTransactions } from "@/lib/transactions";
import { TransactionList } from "@/components/TransactionList";
import { TransactionForm } from "@/components/TransactionForm";
import { SummaryCards } from "@/components/SummaryCards";

export default function Home() {
  return (
    <Suspense fallback={<p className="p-6 text-sm text-gray-500">Loading...</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const transactions = await getTransactions(session.user.id);

  return (
    <main className="max-w-2xl mx-auto p-6 flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Ledger</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600">{session.user.email}</span>
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/login" });
            }}
          >
            <button type="submit" className="border px-3 py-1 rounded text-sm">Sign out</button>
          </form>
        </div>
      </header>
      <SummaryCards filteredTransactions={transactions} />
      <TransactionForm />
      <section>
        <h2 className="text-sm font-medium mb-3 text-gray-600">{"// TRANSACTIONS"}</h2>
        <TransactionList transactions={transactions} />
      </section>
    </main>
  );
}
