import React, { useState, useEffect, useCallback } from 'react';
import { Modal } from '../../../components/ui/Modal';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { closeModals, showToast } from '../store/usersUiSlice';
import {
  useCreateUserMutation,
  useUpdateUserMutation,
} from '../api/usersApi';
import { AlertCircle } from 'lucide-react';

interface FormData {
  name: string;
  email: string;
  phone: string;
  companyName: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
  companyName?: string;
}

const initialForm: FormData = {
  name: '',
  email: '',
  phone: '',
  companyName: '',
};

export const UserFormModal: React.FC = () => {
  const dispatch = useAppDispatch();
  const createModalOpen = useAppSelector((state) => state.usersUi.createModal.isOpen);
  const editModal = useAppSelector((state) => state.usersUi.editModal);

  const isEdit = Boolean(editModal.isOpen && editModal.user);
  const isOpen = createModalOpen || editModal.isOpen;

  const [formData, setFormData] = useState<FormData>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const [createUser, { isLoading: isCreating }] = useCreateUserMutation();
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  const isSubmitting = isCreating || isUpdating;

  useEffect(() => {
    if (isEdit && editModal.user) {
      setFormData({
        name: editModal.user.name || '',
        email: editModal.user.email || '',
        phone: editModal.user.phone || '',
        companyName: editModal.user.company?.name || '',
      });
    } else if (createModalOpen) {
      setFormData(initialForm);
    }
    setErrors({});
    setApiError(null);
  }, [isEdit, editModal.user, createModalOpen]);

  const handleClose = useCallback(() => {
    if (isSubmitting) return;
    dispatch(closeModals());
    setFormData(initialForm);
    setErrors({});
    setApiError(null);
  }, [isSubmitting, dispatch]);

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (formData.phone.trim().length < 5) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    } else if (formData.companyName.trim().length < 2) {
      newErrors.companyName = 'Company name must be at least 2 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (isSubmitting) return;
    if (!validate()) return;

    try {
      if (isEdit && editModal.user) {
        await updateUser({
          id: editModal.user.id,
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          companyName: formData.companyName.trim(),
        }).unwrap();

        dispatch(
          showToast({
            type: 'success',
            message: 'User updated successfully.',
          })
        );
        handleClose();
      } else {
        await createUser({
          name: formData.name.trim(),
          email: formData.email.trim(),
          phone: formData.phone.trim(),
          companyName: formData.companyName.trim(),
        }).unwrap();

        dispatch(
          showToast({
            type: 'success',
            message: 'User created successfully.',
          })
        );
        handleClose();
      }
    } catch (err: unknown) {
      const errorObj = err as {
        status?: number | string;
        data?: { message?: string } | string;
        error?: string;
        message?: string;
      };

      let errorMessage = 'An error occurred while saving user. Please try again.';
      if (typeof errorObj?.data === 'string' && errorObj.data.length < 200) {
        errorMessage = errorObj.data;
      } else if (errorObj?.data && typeof errorObj.data === 'object' && errorObj.data.message) {
        errorMessage = errorObj.data.message;
      } else if (errorObj?.error) {
        errorMessage = errorObj.error;
      } else if (errorObj?.message) {
        errorMessage = errorObj.message;
      } else if (errorObj?.status) {
        errorMessage = `Request failed (status ${errorObj.status}). Please try again.`;
      }
      setApiError(errorMessage);
    }
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
    if (apiError) setApiError(null);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEdit ? 'Edit Member' : 'Add Member'}
      description={
        isEdit
          ? 'Modify contact details and company designation.'
          : 'Enter contact and company information for the new member.'
      }
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {apiError && (
          <div
            role="alert"
            className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 animate-fade-in"
          >
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{apiError}</div>
          </div>
        )}

        <Input
          label="Full Name"
          required
          placeholder="e.g. Sarah Connor"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          error={errors.name}
          disabled={isSubmitting}
        />

        <Input
          label="Email Address"
          type="email"
          required
          placeholder="e.g. sarah.connor@example.com"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          error={errors.email}
          disabled={isSubmitting}
        />

        <Input
          label="Phone Number"
          type="tel"
          required
          placeholder="e.g. (555) 019-2834"
          value={formData.phone}
          onChange={(e) => handleChange('phone', e.target.value)}
          error={errors.phone}
          disabled={isSubmitting}
        />

        <Input
          label="Company Name"
          required
          placeholder="e.g. Cyberdyne Systems"
          value={formData.companyName}
          onChange={(e) => handleChange('companyName', e.target.value)}
          error={errors.companyName}
          disabled={isSubmitting}
        />

        <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-end gap-2.5">
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[44px]"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            loadingText="Saving..."
            disabled={isSubmitting}
            className="w-full sm:w-auto min-h-[44px]"
          >
            {isEdit ? 'Save Changes' : 'Save Member'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
