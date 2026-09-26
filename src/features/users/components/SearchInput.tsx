import React from 'react';
import { Search, X } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setSearchQuery } from '../store/usersUiSlice';

export const SearchInput: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchQuery = useAppSelector((state) => state.usersUi.searchQuery);

  const handleClear = () => {
    dispatch(setSearchQuery(''));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && searchQuery) {
      handleClear();
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <label htmlFor="user-search-input" className="sr-only">
        Search members by name, email, phone, or company
      </label>
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" aria-hidden="true" />
      </div>
      <input
        id="user-search-input"
        type="search"
        value={searchQuery}
        onChange={(e) => dispatch(setSearchQuery(e.target.value))}
        onKeyDown={handleKeyDown}
        placeholder="Search by name, email, company..."
        className="w-full pl-10 pr-10 py-2 sm:py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-indigo-600 focus:ring-3 focus:ring-indigo-100/70 transition-all shadow-2xs"
      />
      {searchQuery && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search query"
          className="min-w-[44px] min-h-[44px] absolute inset-y-0 right-0 pr-2 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors cursor-pointer active:scale-95"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      )}
    </div>
  );
};
