import type { ReactNode } from "react";

type Props = {
    userEmail: string;
    signOutAction: () => Promise<void>;
    themeSwitcher?: ReactNode;
};

export function Navbar({ userEmail, signOutAction, themeSwitcher }: Props) {
    return (
        <header className="navbar">
            <div className="nav-brand">Ledger</div>
            <div className="nav-divider" />
            <div className="nav-right">
                <div className="nav-user">
                    signed in as <span>{userEmail}</span>
                </div>
                {themeSwitcher}
                <form action={signOutAction}>
                    <button type="submit" className="btn-ghost">Sign out</button>
                </form>
            </div>
        </header>
    );
}
