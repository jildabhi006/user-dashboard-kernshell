import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  itemLabel?: string;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
  onPageSizeChange,
  className = '',
  itemLabel = 'members',
}) => {
  if (totalItems === 0) return null;

  const startItem = Math.min((currentPage - 1) * pageSize + 1, totalItems);
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with clean windowing if totalPages is large
  const getPageNumbers = () => {
    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages);
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
    }
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav
      role="navigation"
      aria-label="Pagination"
      className={`flex flex-col sm:flex-row items-center justify-between gap-3.5 w-full select-none ${className}`}
    >
      {/* Left: Live Record Count & Segmented Rows-Per-Page Selector */}
      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 sm:gap-4 text-xs">
        <p className="text-slate-500 font-medium tabular-nums">
          Showing <span className="font-semibold text-slate-900">{startItem}</span>–
          <span className="font-semibold text-slate-900">{endItem}</span> of{' '}
          <span className="font-semibold text-slate-900">{totalItems}</span> {itemLabel}
        </p>

        {onPageSizeChange && totalItems > 5 && (
          <div className="flex items-center gap-1.5 pl-3 border-l border-slate-200">
            <span className="text-slate-400 font-medium">Rows:</span>
            <div className="inline-flex p-0.5 rounded-lg bg-slate-100 border border-slate-200/80">
              {[5, 10].map((size) => {
                const isActive = pageSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    onClick={() => onPageSizeChange(size)}
                    className={`px-2.5 py-0.5 text-xs font-semibold rounded-md transition-all ${
                      isActive
                        ? 'bg-white text-indigo-600 shadow-2xs font-bold'
                        : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Right: Modern Pill Pagination Navigation */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label="Previous page"
          className={`inline-flex items-center justify-center gap-1 h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all ${
            currentPage <= 1
              ? 'text-slate-400 bg-slate-50/80 border border-slate-200/60 cursor-not-allowed opacity-50'
              : 'text-slate-700 bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300 active:scale-95 cursor-pointer'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        {/* Numeric Page Buttons */}
        <div className="flex items-center gap-1 bg-slate-50/80 p-0.5 rounded-lg border border-slate-200/60">
          {pageNumbers.map((page, index) => {
            if (page === '...') {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="w-7 h-7 inline-flex items-center justify-center text-xs text-slate-400"
                >
                  …
                </span>
              );
            }

            const pageNum = page as number;
            const isCurrent = pageNum === currentPage;

            return (
              <button
                key={`page-${pageNum}`}
                type="button"
                onClick={() => onPageChange(pageNum)}
                aria-label={`Page ${pageNum}`}
                aria-current={isCurrent ? 'page' : undefined}
                className={`w-7 h-7 text-xs font-semibold rounded-md inline-flex items-center justify-center transition-all ${
                  isCurrent
                    ? 'bg-indigo-600 text-white font-bold shadow-xs cursor-default'
                    : 'text-slate-600 hover:text-indigo-600 hover:bg-white/80 active:scale-95 cursor-pointer'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label="Next page"
          className={`inline-flex items-center justify-center gap-1 h-8 px-2.5 sm:px-3 text-xs font-semibold rounded-lg transition-all ${
            currentPage >= totalPages
              ? 'text-slate-400 bg-slate-50/80 border border-slate-200/60 cursor-not-allowed opacity-50'
              : 'text-slate-700 bg-white border border-slate-200/90 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 hover:border-slate-300 active:scale-95 cursor-pointer'
          }`}
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
        </button>
      </div>
    </nav>
  );
};
