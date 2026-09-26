import React, { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  maxWidth = 'md',
}) => {
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isExiting, setIsExiting] = useState(false);

  const modalRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const hasOpenedRef = useRef(false);

  const titleId = useRef(`modal-title-${Math.random().toString(36).substring(2, 9)}`).current;
  const descId = useRef(`modal-desc-${Math.random().toString(36).substring(2, 9)}`).current;

  // Handle open / close lifecycle cleanly
  useEffect(() => {
    let exitTimer: ReturnType<typeof setTimeout> | undefined;

    if (isOpen) {
      hasOpenedRef.current = true;
      previousActiveElement.current = document.activeElement as HTMLElement | null;
      document.body.style.overflow = 'hidden';
      setIsRendered(true);
      setIsExiting(false);

      const focusTimer = setTimeout(() => {
        if (!modalRef.current) return;
        if (modalRef.current.contains(document.activeElement)) return;

        const contentInput = modalRef.current.querySelector<HTMLElement>(
          '.modal-body input:not([disabled]):not([type="hidden"]), input:not([disabled]):not([type="hidden"])'
        );
        if (contentInput) {
          contentInput.focus();
        } else {
          const primaryButton = modalRef.current.querySelector<HTMLElement>(
            'button[type="submit"]:not([disabled]), .modal-body button:not([disabled])'
          );
          if (primaryButton) {
            primaryButton.focus();
          }
        }
      }, 50);

      return () => {
        clearTimeout(focusTimer);
      };
    } else if (hasOpenedRef.current) {
      // Modal just closed
      document.body.style.overflow = '';
      setIsExiting(true);

      exitTimer = setTimeout(() => {
        setIsRendered(false);
        setIsExiting(false);
        if (document.activeElement === document.body || !document.activeElement) {
          previousActiveElement.current?.focus?.();
        }
      }, 160);
    }

    return () => {
      if (exitTimer) {
        clearTimeout(exitTimer);
      }
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen && !isExiting) {
        onCloseRef.current();
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isOpen, isExiting]);

  // Always reset body overflow when unmounted
  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  if (!isRendered) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isExiting) {
      onCloseRef.current();
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto ${
        isExiting ? 'pointer-events-none' : ''
      }`}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={description ? descId : undefined}
      onClick={handleBackdropClick}
    >
      {/* Professional subtle backdrop with blur */}
      <div
        className={`fixed inset-0 bg-slate-950/45 backdrop-blur-[2px] transition-opacity ${
          isExiting ? 'animate-backdrop-exit' : 'animate-backdrop-enter'
        }`}
        aria-hidden="true"
      />

      {/* Modal Dialog Card */}
      <div
        ref={modalRef}
        className={`relative w-full ${maxWidthClasses[maxWidth]} bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden z-10 my-auto ${
          isExiting ? 'animate-modal-exit' : 'animate-modal-enter'
        }`}
      >
        <div className="flex items-start justify-between border-b border-slate-100 px-4.5 py-4 sm:px-6 sm:py-5 bg-slate-50/70">
          <div className="pr-3 min-w-0">
            <h2 id={titleId} className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug truncate">
              {title}
            </h2>
            {description && (
              <p id={descId} className="text-xs text-slate-500 mt-1 leading-relaxed">
                {description}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="min-w-[44px] min-h-[44px] -mr-1.5 -mt-1 p-2.5 inline-flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 active:scale-95 cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <div className="p-4.5 sm:p-6 modal-body">{children}</div>
      </div>
    </div>
  );
};
