import type { ReactNode } from "react";

type Props = {
    label: string;
    children: ReactNode;
    className?: string;
};

export function FieldSelect({ label, children, className }: Props) {
    return (
        <div className={`field ${className ?? ""}`}>
            <label>{label}</label>
            <div className="field-select-wrap">
                {children}
            </div>
        </div>
    );
}
