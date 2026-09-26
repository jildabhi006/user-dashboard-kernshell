import React from 'react';
import { Mail, Phone, Building2, Edit2, Trash2 } from 'lucide-react';
import { User } from '../types/user.types';
import { Button } from '../../../components/ui/Button';
import { Tooltip } from '../../../components/ui/Tooltip';
import { Pagination } from '../../../components/ui/Pagination';
import { useAppDispatch } from '../../../app/hooks';
import { openEditModal, openDeleteDialog } from '../store/usersUiSlice';
import { getTelHref, getMailtoHref } from '../utils/contactUtils';

export interface UserTablePagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

interface UserTableProps {
  users: User[];
  pagination?: UserTablePagination;
}

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-blue-600 text-white',
    'bg-indigo-600 text-white',
    'bg-violet-600 text-white',
    'bg-purple-600 text-white',
    'bg-emerald-600 text-white',
    'bg-teal-600 text-white',
    'bg-amber-600 text-white',
    'bg-rose-600 text-white',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

export const UserTable: React.FC<UserTableProps> = ({ users, pagination }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="w-full max-w-full animate-fade-in overflow-hidden">
      {/* Desktop & tablet table view (screens >= 768px) */}
      <div className="hidden md:block bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left border-collapse min-w-[680px]">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/70 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th scope="col" className="py-4 pl-6 pr-4">
                  NAME
                </th>
                <th scope="col" className="py-4 px-4">
                  EMAIL
                </th>
                <th scope="col" className="py-4 px-4">
                  PHONE
                </th>
                <th scope="col" className="py-4 px-4">
                  COMPANY
                </th>
                <th scope="col" className="py-4 pl-4 pr-6 text-right">
                  ACTIONS
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-slate-50/80 transition-colors duration-150 group"
                >
                  <td className="py-4 pl-6 pr-4 font-semibold text-slate-900">
                    <span
                      className="block max-w-[180px] lg:max-w-[240px] truncate"
                      title={user.name}
                    >
                      {user.name}
                    </span>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <a
                      href={getMailtoHref(user.email)}
                      className="group/link inline-flex items-center gap-1.5 max-w-[190px] lg:max-w-[260px] text-slate-700 hover:text-indigo-600 font-medium transition-colors cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      title={`Send email to ${user.email}`}
                      aria-label={`Send email to ${user.email}`}
                    >
                      <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
                      <span className="truncate group-hover/link:underline">{user.email}</span>
                    </a>
                  </td>

                  <td className="py-4 px-4 text-slate-600 font-mono tabular-nums">
                    <a
                      href={getTelHref(user.phone)}
                      className="group/link inline-flex items-center gap-1.5 max-w-[160px] lg:max-w-[200px] text-slate-700 hover:text-indigo-600 font-medium transition-colors cursor-pointer rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      title={`Call ${user.phone}`}
                      aria-label={`Call ${user.phone}`}
                    >
                      <Phone className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
                      <span className="truncate group-hover/link:underline">{user.phone}</span>
                    </a>
                  </td>

                  <td className="py-4 px-4 text-slate-600">
                    <span
                      className="inline-block max-w-[160px] lg:max-w-[220px] truncate"
                      title={user.company?.name || 'Independent'}
                    >
                      {user.company?.name || 'Independent'}
                    </span>
                  </td>

                  <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                    <div className="inline-flex items-center justify-end gap-1">
                      <Tooltip content="Edit">
                        <button
                          type="button"
                          onClick={() => dispatch(openEditModal(user))}
                          aria-label={`Edit ${user.name}`}
                          className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/80 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 cursor-pointer active:scale-95"
                        >
                          <Edit2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </Tooltip>
                      <Tooltip content="Delete">
                        <button
                          type="button"
                          onClick={() => dispatch(openDeleteDialog(user))}
                          aria-label={`Delete ${user.name}`}
                          className="w-11 h-11 inline-flex items-center justify-center rounded-lg text-slate-500 hover:text-red-600 hover:bg-red-50 transition-all duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 cursor-pointer active:scale-95"
                        >
                          <Trash2 className="w-4 h-4 text-red-500/80 hover:text-red-600" aria-hidden="true" />
                        </button>
                      </Tooltip>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {pagination && (
          <div className="border-t border-slate-200/80 px-5 sm:px-6 py-3.5 bg-white">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
            />
          </div>
        )}
      </div>

      {/* Mobile stacked view (< 768px): clean card layout with full accessibility and >= 44x44px touch targets */}
      <div className="block md:hidden space-y-3.5 w-full">
        {users.map((user) => {
          const initials = getInitials(user.name);
          const avatarClass = getAvatarColor(user.name);

          return (
            <article
              key={user.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-2xs space-y-3.5 w-full max-w-full overflow-hidden"
              aria-label={`User card for ${user.name}`}
            >
              {/* Header: Avatar, Name, Company */}
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-2xs ${avatarClass}`}
                  aria-hidden="true"
                >
                  {initials}
                </div>
                <div className="min-w-0 flex-1">
                  <h3
                    className="font-bold text-slate-900 text-sm truncate leading-snug"
                    title={user.name}
                  >
                    {user.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-xs text-indigo-600 font-medium mt-0.5 min-w-0">
                    <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
                    <span
                      className="truncate"
                      title={user.company?.name || 'Independent'}
                    >
                      {user.company?.name || 'Independent'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Information block */}
              <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50/80 p-3 rounded-xl border border-slate-100 min-w-0">
                <a
                  href={getMailtoHref(user.email)}
                  className="flex items-center gap-2.5 min-w-0 py-1 text-slate-700 hover:text-indigo-600 transition-colors group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md cursor-pointer"
                  title={`Send email to ${user.email}`}
                  aria-label={`Email ${user.name} at ${user.email}`}
                >
                  <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
                  <span className="truncate group-hover/item:underline font-medium min-w-0 flex-1">{user.email}</span>
                </a>
                <a
                  href={getTelHref(user.phone)}
                  className="flex items-center gap-2.5 min-w-0 py-1 text-slate-700 hover:text-indigo-600 transition-colors group/item focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md cursor-pointer"
                  title={`Call ${user.phone}`}
                  aria-label={`Call ${user.name} at ${user.phone}`}
                >
                  <Phone className="w-3.5 h-3.5 text-slate-400 group-hover/item:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
                  <span className="truncate group-hover/item:underline font-mono tabular-nums min-w-0 flex-1">{user.phone}</span>
                </a>
              </div>

              {/* Action Buttons: Guaranteed 44x44px touch targets without horizontal overflow */}
              <div className="flex items-center gap-2 pt-1 border-t border-slate-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => dispatch(openEditModal(user))}
                  aria-label={`Edit ${user.name}`}
                  className="flex-1 min-w-[44px] min-h-[44px] text-xs font-semibold"
                  leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-600" />}
                >
                  Edit
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => dispatch(openDeleteDialog(user))}
                  aria-label={`Delete ${user.name}`}
                  className="flex-1 min-w-[44px] min-h-[44px] text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border border-slate-200/80 hover:border-red-200"
                  leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
                >
                  Delete
                </Button>
              </div>
            </article>
          );
        })}

        {pagination && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 shadow-2xs mt-4">
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              totalItems={pagination.totalItems}
              pageSize={pagination.pageSize}
              onPageChange={pagination.onPageChange}
              onPageSizeChange={pagination.onPageSizeChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};
