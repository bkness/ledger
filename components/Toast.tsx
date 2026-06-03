"use client";

import { createContext, useCallback, useState, type ReactNode } from "react";

type ToastType = "success" | "error" | "info";
type ToastState = { message: string; type: ToastType } | null;

export type ToastContextValue = {
    success: (msg: string) => void;
    error: (msg: string) => void;
    info: (msg: string) => void;
};

export const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toast, setToast] = useState<ToastState>(null);

    const show = useCallback((message: string, type: ToastType) => {
        setToast({ message, type });
        // Set dismiss timer
        setTimeout(() => setToast(null), 3000);
    }, []);

    const value: ToastContextValue = {
        success: (msg) => show(msg, "success"),
        error: (msg) => show(msg, "error"),
        info: (msg) => show(msg, "info"),
    };

    return (
        <ToastContext.Provider value={value}>
            {children}
            {toast && (
                <div className={`toast toast-${toast.type}`} role="status" aria-live="polite">
                    {toast.message}
                </div>
            )}
        </ToastContext.Provider>
    )
}