"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { X } from "lucide-react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
    id: number;
    type: ToastType;
    message: string;
}

interface ToastContextProps {
    showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextProps | undefined>(undefined);

export const useToast = () => {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);

    const showToast = useCallback((message: string, type: ToastType = "info") => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, type, message }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 4000); // slightly longer visibility
    }, []);

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container - top right */}
            <div className="fixed top-5 right-5 flex flex-col items-end space-y-3 z-50 pointer-events-none">
                {toasts.map(toast => (
                    <div
                        key={toast.id}
                        className={`
                            relative w-80 max-w-xs px-5 py-3 rounded-lg shadow-lg text-white text-sm animate-slide-in pointer-events-auto flex items-center justify-between
                            ${toast.type === "success" && "bg-green-600"}
                            ${toast.type === "error" && "bg-red-600"}
                            ${toast.type === "info" && "bg-blue-600"}
                        `}
                    >
                        <span>{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-4 text-white hover:text-gray-200"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            {/* Animations */}
            <style>{`
                .animate-slide-in {
                    animation: slide-in 0.35s ease forwards;
                }

                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateX(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </ToastContext.Provider>
    );
};
