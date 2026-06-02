"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { register } from "@/lib/auth-actions";

type Mode = "login" | "register";

export default function LoginPage() {
    const router = useRouter();
    const [mode, setMode] = useState<Mode>("login");
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        if (mode === "register") {
            if (password !== confirmPassword) {
                setError("Passwords do not match");
                setLoading(false);
                return;
            }

            const result = await register(email, name, password);
            if (result?.error) {
                setError(result.error);
                setLoading(false);
                return;
            }
        }

        const result = await signIn("credentials", {
            email,
            password,
            redirect: false,
        });

        if (result?.error) {
            setError("Invalid credentials");
            setLoading(false);
            return;
        }

        setLoading(false);
        router.push("/");
    }

    return (
        <main className="flex min-h-screen items-center justify-center p-6">
            <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-3">
                <h1 className="text-2xl font-bold mb-2">{mode === "login" ? "Sign in" : "Create account"}</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="border p-2 rounded"
                />

                {mode === "register" && (
                    <input
                        type="text"
                        placeholder="Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="border p-2 rounded"
                    />
                )}

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="border p-2 rounded"
                />

                {mode === "register" && (
                    <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="border p-2 rounded"
                    />
                )}

                {error && <p className="text-red-500 text-sm">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-black text-white p-2 rounded disabled:opacity-50"
                >
                    {loading ? "Loading..." : mode === "login" ? "Sign in" : "Create account"}
                </button>

                <button
                    type="button"
                    onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
                    className="text-sm text-gray-600 underline"
                >
                    {mode === "login" ? "Need an account? Register" : "Have an account? Sign in"}
                </button>
            </form>
        </main>
    )
}