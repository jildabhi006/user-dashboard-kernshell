import React, { useMemo, useEffect } from 'react';
import {
  Users,
  UserPlus,
  RefreshCw,
  AlertCircle,
  SearchX,
  RotateCcw,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import {
  useGetUsersQuery,
  resetLocalMockChanges,
  usersApi,
} from '../api/usersApi';
import {
  openCreateModal,
  clearToast,
  showToast,
  setSearchQuery,
  setCurrentPage,
  setPageSize,
} from '../store/usersUiSlice';
import { SearchInput } from './SearchInput';
import { ViewToggle } from './ViewToggle';
import { UserTable } from './UserTable';
import { UserGrid } from './UserGrid';
import { UserFormModal } from './UserFormModal';
import { DeleteUserDialog } from './DeleteUserDialog';
import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';
import { Toast } from '../../../components/ui/Toast';
import { Pagination } from '../../../components/ui/Pagination';

export const UserDashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const viewMode = useAppSelector((state) => state.usersUi.viewMode);
  const searchQuery = useAppSelector((state) => state.usersUi.searchQuery);
  const currentPage = useAppSelector((state) => state.usersUi.currentPage);
  const pageSize = useAppSelector((state) => state.usersUi.pageSize);
  const toast = useAppSelector((state) => state.usersUi.toast);

  const {
    data: users = [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetUsersQuery();

  const filteredUsers = useMemo(() => {
    if (!searchQuery.trim()) return users;
    const query = searchQuery.toLowerCase().trim();

    return users.filter((user) => {
      const matchName = user.name.toLowerCase().includes(query);
      const matchEmail = user.email.toLowerCase().includes(query);
      const matchPhone = user.phone.toLowerCase().includes(query);
      const matchCompany = (user.company?.name || '').toLowerCase().includes(query);
      const matchUsername = (user.username || '').toLowerCase().includes(query);

      return matchName || matchEmail || matchPhone || matchCompany || matchUsername;
    });
  }, [users, searchQuery]);

  const totalItems = filteredUsers.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  // Auto-correct page if current page exceeds total pages (e.g. after deletion or filter change)
  useEffect(() => {
    if (currentPage > totalPages) {
      dispatch(setCurrentPage(totalPages));
    }
  }, [currentPage, totalPages, dispatch]);

  const startIndex = (safeCurrentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedUsers = useMemo(() => {
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, startIndex, endIndex]);

  const handleResetMockData = () => {
    resetLocalMockChanges();
    dispatch(usersApi.util.invalidateTags([{ type: 'User', id: 'LIST' }]));
    dispatch(
      showToast({
        type: 'info',
        message: 'Reset data to original JSONPlaceholder state',
      })
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/70 text-slate-900 antialiased flex flex-col">
      <Toast toast={toast} onClose={() => dispatch(clearToast())} />

      {/* Top Bar Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-xs border-b border-slate-200/80 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-2xs">
              <Users className="w-4 h-4" aria-hidden="true" />
            </div>
            <span className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
              Enterprise Dashboard
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleResetMockData}
              title="Reset mock session changes to default API data"
              aria-label="Reset mock data"
              className="min-h-[44px] sm:min-h-[36px]"
              leftIcon={<RotateCcw className="w-3.5 h-3.5 text-slate-500" />}
            >
              Reset Data
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Title and Top Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              User Management
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              {isLoading
                ? 'Loading team members...'
                : searchQuery
                ? `Showing ${filteredUsers.length} of ${users.length} team members`
                : `${users.length} team members`}
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Button
              variant="primary"
              size="sm"
              onClick={() => dispatch(openCreateModal())}
              aria-label="Add member"
              leftIcon={<UserPlus className="w-4 h-4" />}
              className="min-h-[44px] md:min-h-[38px] px-4 font-semibold shadow-xs"
            >
              Add Member
            </Button>
          </div>
        </div>

        {/* Toolbar: Search, View Toggle, and Sync Status */}
        <section
          aria-label="Filter and View Controls"
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs"
        >
          <div className="w-full sm:w-auto flex-1 max-w-md">
            <SearchInput />
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
            {isFetching && !isLoading && (
              <div
                className="inline-flex items-center gap-1.5 text-xs text-indigo-600 font-medium px-2 py-1 bg-indigo-50 rounded-lg animate-pulse"
                role="status"
              >
                <Spinner size="sm" className="text-indigo-600" />
                <span>Syncing</span>
              </div>
            )}
            <ViewToggle />
          </div>
        </section>

        {/* State 1: Skeleton Loading Shimmer */}
        {isLoading && (
          <div
            role="status"
            aria-label="Loading member directory"
            className="space-y-4 animate-fade-in"
          >
            {viewMode === 'table' ? (
              <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xs">
                <div className="p-4 border-b border-slate-100 flex items-center gap-4">
                  <div className="h-4 w-24 rounded-md skeleton-shimmer" />
                  <div className="h-4 w-32 rounded-md skeleton-shimmer" />
                  <div className="h-4 w-28 rounded-md skeleton-shimmer" />
                </div>
                <div className="divide-y divide-slate-100 p-2">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="py-4 px-4 flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl skeleton-shimmer shrink-0" />
                        <div className="space-y-1.5">
                          <div className="h-3.5 w-32 rounded-md skeleton-shimmer" />
                          <div className="h-2.5 w-20 rounded-md skeleton-shimmer" />
                        </div>
                      </div>
                      <div className="h-3.5 w-40 rounded-md skeleton-shimmer hidden sm:block" />
                      <div className="h-3.5 w-28 rounded-md skeleton-shimmer hidden md:block" />
                      <div className="h-3.5 w-24 rounded-md skeleton-shimmer hidden lg:block" />
                      <div className="h-8 w-24 rounded-md skeleton-shimmer" />
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs space-y-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-xl skeleton-shimmer shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-4 w-3/4 rounded-md skeleton-shimmer" />
                        <div className="h-3 w-1/2 rounded-md skeleton-shimmer" />
                      </div>
                    </div>
                    <div className="space-y-2 pt-2">
                      <div className="h-3 w-4/5 rounded-md skeleton-shimmer" />
                      <div className="h-3 w-3/5 rounded-md skeleton-shimmer" />
                    </div>
                    <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                      <div className="h-8 w-16 rounded-md skeleton-shimmer" />
                      <div className="h-8 w-16 rounded-md skeleton-shimmer" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* State 2: Error State */}
        {!isLoading && isError && (
          <div
            role="alert"
            className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-red-200/80 shadow-2xs space-y-4 text-center animate-fade-in"
          >
            <div className="w-11 h-11 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center text-red-600">
              <AlertCircle className="w-6 h-6" aria-hidden="true" />
            </div>
            <div className="max-w-md">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                Failed to Retrieve Members
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {error && 'status' in error
                  ? `Server responded with HTTP ${(error as { status: number }).status}.`
                  : 'A network connectivity issue prevented loading the mock dataset.'}
              </p>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => refetch()}
              leftIcon={<RefreshCw className="w-4 h-4" />}
            >
              Retry Connection
            </Button>
          </div>
        )}

        {/* State 3: Empty State (Section 11 & 12 compliance) */}
        {!isLoading && !isError && filteredUsers.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 px-4 bg-white rounded-2xl border border-slate-200/80 shadow-2xs space-y-4 text-center animate-fade-in">
            <div className="w-11 h-11 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
              <SearchX className="w-5 h-5" aria-hidden="true" />
            </div>
            <div className="max-w-md">
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                No users found
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                {searchQuery
                  ? 'Try adjusting your search.'
                  : 'Try adjusting your search or add a new member.'}
              </p>
            </div>
            {searchQuery ? (
              <Button
                variant="outline"
                size="md"
                onClick={() => dispatch(setSearchQuery(''))}
              >
                Clear search
              </Button>
            ) : (
              <Button
                variant="primary"
                size="md"
                onClick={() => dispatch(openCreateModal())}
                leftIcon={<UserPlus className="w-4 h-4" />}
              >
                Add Member
              </Button>
            )}
          </div>
        )}

        {/* State 4: Populated Views */}
        {!isLoading && !isError && filteredUsers.length > 0 && (
          <section aria-label="Team Members List">
            <div key={viewMode} className="animate-fade-in">
              {viewMode === 'table' ? (
                <UserTable
                  users={paginatedUsers}
                  pagination={{
                    currentPage: safeCurrentPage,
                    totalPages,
                    totalItems,
                    pageSize,
                    onPageChange: (page) => dispatch(setCurrentPage(page)),
                    onPageSizeChange: (size) => dispatch(setPageSize(size)),
                  }}
                />
              ) : (
                <div className="space-y-6">
                  <UserGrid users={paginatedUsers} />
                  <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-4 shadow-2xs">
                    <Pagination
                      currentPage={safeCurrentPage}
                      totalPages={totalPages}
                      totalItems={totalItems}
                      pageSize={pageSize}
                      onPageChange={(page) => dispatch(setCurrentPage(page))}
                      onPageSizeChange={(size) => dispatch(setPageSize(size))}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
        )}
      </main>

      <UserFormModal />
      <DeleteUserDialog />
    </div>
  );
};
