import type { ReactNode } from "react";

type Props = {
    label: string;
    children: ReactNode;
    className?: string;
};

export function Field({ label, children, className }: Props) {
    return (
        <div className={`field ${className ?? ""}`}>
            <label>{label}</label>
            {children}
        </div>
    )
}