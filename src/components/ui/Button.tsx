import React from 'react';
import { Spinner } from './Spinner';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      loadingText,
      leftIcon,
      rightIcon,
      className = '',
      disabled,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-150 select-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100';

    const variantClasses = {
      primary:
        'bg-indigo-600 hover:bg-indigo-700 text-white focus-visible:ring-indigo-500 shadow-xs hover:shadow-sm active:bg-indigo-800',
      secondary:
        'bg-slate-100 hover:bg-slate-200/80 text-slate-800 focus-visible:ring-slate-400 active:bg-slate-200',
      danger:
        'bg-red-600 hover:bg-red-700 text-white focus-visible:ring-red-500 shadow-xs hover:shadow-sm active:bg-red-800',
      outline:
        'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 focus-visible:ring-indigo-500 hover:border-slate-300 shadow-2xs active:bg-slate-100',
      ghost:
        'bg-transparent hover:bg-slate-100 text-slate-600 hover:text-slate-900 focus-visible:ring-slate-400',
    };

    const sizeClasses = {
      sm: 'text-xs px-3 py-2 min-h-[44px] md:min-h-[36px] gap-1.5',
      md: 'text-sm px-4 py-2 min-h-[44px] md:min-h-[40px] gap-2',
      lg: 'text-base px-5 py-2.5 min-h-[48px] gap-2.5',
      icon: 'min-w-[44px] min-h-[44px] p-2.5 md:p-2',
    };

    return (
      <button
        ref={ref}
        type={type}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <>
            <Spinner size="sm" className="text-current" />
            <span>{loadingText || children}</span>
          </>
        ) : (
          <>
            {leftIcon && <span className="inline-flex shrink-0 transition-transform">{leftIcon}</span>}
            {children}
            {rightIcon && <span className="inline-flex shrink-0 transition-transform">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
