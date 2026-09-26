import React, { useState, useCallback, useRef } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModals, showToast } from '../store/usersUiSlice';
import { useDeleteUserMutation } from '../api/usersApi';
import { AlertTriangle, AlertCircle, Mail, Phone, Building2 } from 'lucide-react';

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

export const DeleteUserDialog: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isOpen, user } = useAppSelector((state) => state.usersUi.deleteDialog);

  // Preserve user details during closing animation so UI does not abruptly disappear
  const lastUserRef = useRef(user);
  if (user) {
    lastUserRef.current = user;
  }
  const activeUser = user || lastUserRef.current;

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    if (isDeleting) return;
    setDeleteError(null);
    dispatch(closeModals());
  }, [isDeleting, dispatch]);

  const handleConfirmDelete = async () => {
    if (!activeUser || isDeleting) return;

    setDeleteError(null);

    try {
      await deleteUser(activeUser.id).unwrap();
      dispatch(
        showToast({
          type: 'success',
          message: `${activeUser.name} was successfully removed.`,
        })
      );
      handleClose();
    } catch (err: unknown) {
      const errorObj = err as {
        status?: number | string;
        data?: { message?: string } | string;
        error?: string;
        message?: string;
      };

      let errorMessage = 'Failed to delete user. Please try again.';
      if (typeof errorObj?.data === 'string' && errorObj.data.length < 200) {
        errorMessage = errorObj.data;
      } else if (errorObj?.data && typeof errorObj.data === 'object' && errorObj.data.message) {
        errorMessage = errorObj.data.message;
      } else if (errorObj?.error) {
        errorMessage = errorObj.error;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      }
      setDeleteError(errorMessage);
    }
  };

  return (
    <Modal
      isOpen={isOpen && Boolean(activeUser)}
      onClose={handleClose}
      title="Delete Member"
      description="Confirm removal of this member from the organization."
      maxWidth="sm"
    >
      <div className="space-y-4">
        {deleteError && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{deleteError}</div>
          </div>
        )}

        {/* Warning Alert Banner */}
        <div className="flex items-start gap-3 p-3.5 bg-amber-50/80 border border-amber-200/70 rounded-xl text-amber-900 text-xs">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="leading-relaxed">
            <span className="font-semibold text-amber-950">Warning: </span>
            This action cannot be undone. All dashboard associations for this user will be removed.
          </div>
        </div>

        {/* Member Details Card */}
        {activeUser && (
          <div className="bg-slate-50 border border-slate-200/90 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center gap-3">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs tracking-wider shrink-0 ${getAvatarColor(
                  activeUser.name
                )}`}
                aria-hidden="true"
              >
                {getInitials(activeUser.name)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-slate-900 truncate" title={activeUser.name}>
                  {activeUser.name}
                </p>
                {activeUser.username && (
                  <p className="text-xs text-slate-500 font-mono truncate">
                    @{activeUser.username}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200/70 space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-2 truncate">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate font-medium text-slate-700">
                  {activeUser.company?.name || 'Independent'}
                </span>
              </div>
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{activeUser.email}</span>
              </div>
              <div className="flex items-center gap-2 font-mono tabular-nums truncate">
                <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" aria-hidden="true" />
                <span className="truncate">{activeUser.phone}</span>
              </div>
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={isDeleting}
            loadingText="Deleting..."
            disabled={isDeleting}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Confirm Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};
