import { auth, signOut } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 gap-4">
      <h1 className="text-2xl font-bold">Ledger</h1>
      <p className="text-sm text-gray-600">Signed in as {session?.user?.email}</p>
      <form 
        action={async () => {
          "use server";
          await signOut({ redirectTo: "/login" });
        }}
        >
        <button type="submit" className="border px-3 py-1 rounded">Sign out</button>
        </form>
    </main>
  )
}