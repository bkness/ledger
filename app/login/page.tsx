"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { register } from "@/lib/auth-actions";
import { Field } from "@/components/Field";

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

    function toggleMode() {
        setMode(mode === "login" ? "register" : "login");
        setError(null);
    }

    return (
        <main className="login-page">
            <div className="login-card">
                <div className="brand">
                    <div className="brand-name">Ledger</div>
                    <div className="brand-sub">Track your budget</div>
                </div>

                <form onSubmit={handleSubmit}>
                    <Field label="Email">
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            required
                            autoComplete="email"
                        />
                    </Field>

                    {mode === "register" && (
                        <Field label="Name">
                            <input
                                type="text"
                                value={name}
                                onChange={e => setName(e.target.value)}
                                required
                                autoComplete="name"
                            />
                        </Field>
                    )}

                    <Field label="Password">
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            required
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                        />
                    </Field>

                    {mode === "register" && (
                        <Field label="Confirm password">
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </Field>
                    )}

                    {error && <p className="login-error">{error}</p>}

                    <button type="submit" disabled={loading} className="btn-primary">
                        {loading ? "Loading..." : mode === "login" ? "Sign in" : "Create account"}
                    </button>
                </form>

                <div className="login-footer">
                    {mode === "login" ? "Need an account?" : "Have an account?"}{" "}
                    <button type="button" onClick={toggleMode}>
                        {mode === "login" ? "Register" : "Sign in"}
                    </button>
                </div>
            </div>
        </main>
    );
}
