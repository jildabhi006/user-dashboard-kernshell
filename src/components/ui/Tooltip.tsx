import React from 'react';

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom';
  className?: string;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  className = '',
}) => {
  const positionClass = position === 'bottom' ? 'custom-tooltip-bottom' : 'custom-tooltip-top';

  return (
    <div className={`custom-tooltip-trigger ${className}`}>
      {children}
      <span role="tooltip" aria-hidden="true" className={`custom-tooltip ${positionClass}`}>
        {content}
      </span>
    </div>
  );
};
