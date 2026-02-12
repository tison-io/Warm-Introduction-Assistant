'use client';
import { AlertTriangle, Loader2 } from "lucide-react";

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, isLoading, name }: any) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm" onClick={onClose} />
            <div className="relative bg-slate-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertTriangle className="text-red-500 w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold text-white text-center mb-2">Delete Request?</h3>
                <p className="text-gray-400 text-center text-sm mb-8">
                    Are you sure you want to remove <span className="text-white font-semibold">{name}</span>? This action cannot be undone.
                </p>
                <div className="flex gap-3">
                    <button onClick={onClose} className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-gray-300 hover:bg-white/10 transition-colors font-medium">
                        Cancel
                    </button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex-1 px-4 py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white transition-all font-bold flex items-center justify-center">
                        {isLoading ? <Loader2 className="animate-spin w-5 h-5" /> : "Delete"}
                    </button>
                </div>
            </div>
        </div>
    );
}