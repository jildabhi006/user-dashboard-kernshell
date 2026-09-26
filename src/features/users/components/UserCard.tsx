import React from 'react';
import { Mail, Phone, Building2, Edit2, Trash2 } from 'lucide-react';
import { User } from '../types/user.types';
import { Button } from '../../../components/ui/Button';
import { Tooltip } from '../../../components/ui/Tooltip';
import { useAppDispatch } from '../../../app/hooks';
import { openEditModal, openDeleteDialog } from '../store/usersUiSlice';
import { getTelHref, getMailtoHref } from '../utils/contactUtils';

interface UserCardProps {
  user: User;
}

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

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

export const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const dispatch = useAppDispatch();
  const initials = getInitials(user.name);
  const avatarClass = getAvatarColor(user.name);

  return (
    <article className="flex flex-col justify-between h-full bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5 transition-all duration-200 group">
      <div>
        <div className="flex items-start gap-3.5 mb-3.5">
          <div
            className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-xs tracking-wider shrink-0 shadow-2xs ${avatarClass}`}
            aria-hidden="true"
          >
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <h3
              className="text-sm font-bold text-slate-900 truncate leading-snug group-hover:text-indigo-600 transition-colors"
              title={user.name}
            >
              {user.name}
            </h3>
            <p className="text-xs text-slate-500 truncate mt-0.5 font-mono" title={user.username ? `@${user.username}` : user.email}>
              {user.username ? `@${user.username}` : user.email}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium mb-4">
          <Building2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" aria-hidden="true" />
          <span className="truncate" title={user.company?.name || 'Independent'}>
            {user.company?.name || 'Independent'}
          </span>
        </div>

        <div className="space-y-2 text-xs text-slate-600 mb-5">
          <a
            href={getMailtoHref(user.email)}
            className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 transition-colors group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md cursor-pointer"
            title={`Send email to ${user.email}`}
            aria-label={`Email ${user.name} at ${user.email}`}
          >
            <Mail className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
            <span className="truncate group-hover/link:underline">{user.email}</span>
          </a>
          <a
            href={getTelHref(user.phone)}
            className="flex items-center gap-2 font-mono tabular-nums text-slate-600 hover:text-indigo-600 transition-colors group/link focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 rounded-md cursor-pointer"
            title={`Call ${user.phone}`}
            aria-label={`Call ${user.name} at ${user.phone}`}
          >
            <Phone className="w-3.5 h-3.5 text-slate-400 group-hover/link:text-indigo-500 shrink-0 transition-colors" aria-hidden="true" />
            <span className="truncate group-hover/link:underline">{user.phone}</span>
          </a>
        </div>
      </div>

      <div className="pt-3.5 border-t border-slate-100 flex items-center justify-end gap-2">
        <Tooltip content="Edit" className="flex-1 sm:flex-initial">
          <Button
            variant="outline"
            size="sm"
            onClick={() => dispatch(openEditModal(user))}
            aria-label={`Edit ${user.name}`}
            className="w-full sm:w-auto min-w-[44px] min-h-[44px]"
            leftIcon={<Edit2 className="w-3.5 h-3.5 text-slate-500" />}
          >
            Edit
          </Button>
        </Tooltip>
        <Tooltip content="Delete" className="flex-1 sm:flex-initial">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => dispatch(openDeleteDialog(user))}
            aria-label={`Delete ${user.name}`}
            className="w-full sm:w-auto min-w-[44px] min-h-[44px] text-red-600 hover:text-red-700 hover:bg-red-50 border border-transparent hover:border-red-200"
            leftIcon={<Trash2 className="w-3.5 h-3.5 text-red-500" />}
          >
            Delete
          </Button>
        </Tooltip>
      </div>
    </article>
  );
};
