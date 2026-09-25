import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-[999999] flex flex-col gap-2.5 pointer-events-none max-w-sm w-full px-4 select-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto p-3.5 rounded-xl border shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3 text-xs font-mono animate-scale-up ${
              toast.type === "error"
                ? "bg-[var(--theme-panel)]/95 border-rose-500/40 text-rose-400 shadow-[0_8px_30px_rgba(244,63,94,0.15)]"
                : toast.type === "success"
                ? "bg-[var(--theme-panel)]/95 border-emerald-500/40 text-emerald-400 shadow-[0_8px_30px_rgba(16,185,129,0.15)]"
                : "bg-[var(--theme-panel)]/95 border-[var(--theme-accent)]/40 text-[var(--theme-text)] shadow-[0_8px_30px_rgba(197,160,89,0.15)]"
            }`}
          >
            <div className="flex items-start gap-2.5 min-w-0 flex-1">
              <span
                className={`w-2 h-2 rounded-full shrink-0 mt-1 ${
                  toast.type === "error"
                    ? "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.8)]"
                    : toast.type === "success"
                    ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-[var(--theme-accent)] shadow-[0_0_8px_rgba(197,160,89,0.8)]"
                }`}
              />
              <span className="break-words leading-relaxed flex-1">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="text-[var(--theme-text-muted)] hover:text-[var(--theme-text)] p-1 cursor-pointer transition-colors"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
