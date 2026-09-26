import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import { ToastMessage } from '../../features/users/types/user.types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
  autoCloseDuration?: number;
}

export const Toast: React.FC<ToastProps> = ({
  toast,
  onClose,
  autoCloseDuration = 4000,
}) => {
  useEffect(() => {
    if (!toast) return;

    const timer = setTimeout(() => {
      onClose();
    }, autoCloseDuration);

    return () => clearTimeout(timer);
  }, [toast, onClose, autoCloseDuration]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const bgStyles = {
    success: 'bg-white border-emerald-200 text-slate-800 shadow-lg shadow-emerald-500/5',
    error: 'bg-white border-red-200 text-slate-800 shadow-lg shadow-red-500/5',
    info: 'bg-white border-indigo-200 text-slate-800 shadow-lg shadow-indigo-500/5',
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-4 right-4 z-50 max-w-sm w-full mx-auto px-4 pointer-events-none"
    >
      <div
        className={`pointer-events-auto flex items-center justify-between gap-3 p-3.5 sm:p-4 rounded-xl border ${bgStyles[toast.type]} animate-slide-up`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {icons[toast.type]}
          <p className="text-xs sm:text-sm font-medium text-slate-800 truncate">{toast.message}</p>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Dismiss notification"
          className="min-w-[44px] min-h-[44px] p-2 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
