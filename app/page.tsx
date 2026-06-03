import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth, signOut } from "@/auth";
import { getTransactions } from "@/lib/transactions";
import { DashboardShell } from "@/components/DashboardShell";

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

  async function signOutAction() {
    "use server";
    await signOut({ redirectTo: "/login" });
  }

  return (
    <DashboardShell
      transactions={transactions}
      userEmail={session.user.email ?? ""}
      signOutAction={signOutAction}
    />
  );
}