import React from 'react';
import { LayoutGrid, Table } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setViewMode } from '../store/usersUiSlice';
import { ViewMode } from '../types/user.types';

export const ViewToggle: React.FC = () => {
  const dispatch = useAppDispatch();
  const currentView = useAppSelector((state) => state.usersUi.viewMode);

  const handleToggle = (mode: ViewMode) => {
    dispatch(setViewMode(mode));
  };

  return (
    <div
      role="group"
      aria-label="View layout switch"
      className="inline-flex items-center p-1 bg-slate-100/90 rounded-xl border border-slate-200/70"
    >
      <button
        type="button"
        onClick={() => handleToggle('table')}
        aria-pressed={currentView === 'table'}
        className={`min-h-[44px] sm:min-h-[36px] px-3.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all duration-150 cursor-pointer select-none ${
          currentView === 'table'
            ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
            : 'text-slate-600 hover:text-slate-900 active:scale-95'
        }`}
      >
        <Table className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">Table</span>
      </button>

      <button
        type="button"
        onClick={() => handleToggle('grid')}
        aria-pressed={currentView === 'grid'}
        className={`min-h-[44px] sm:min-h-[36px] px-3.5 sm:px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium inline-flex items-center gap-2 transition-all duration-150 cursor-pointer select-none ${
          currentView === 'grid'
            ? 'bg-white text-indigo-700 shadow-2xs font-semibold'
            : 'text-slate-600 hover:text-slate-900 active:scale-95'
        }`}
      >
        <LayoutGrid className="w-4 h-4 shrink-0" aria-hidden="true" />
        <span className="whitespace-nowrap">Grid</span>
      </button>
    </div>
  );
};
