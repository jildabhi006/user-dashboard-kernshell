import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User, ViewMode, ToastMessage } from '../types/user.types';

export interface UsersUiState {
  viewMode: ViewMode;
  searchQuery: string;
  currentPage: number;
  pageSize: number;
  createModal: {
    isOpen: boolean;
  };
  editModal: {
    isOpen: boolean;
    user: User | null;
  };
  deleteDialog: {
    isOpen: boolean;
    user: User | null;
  };
  toast: ToastMessage | null;
}

const initialState: UsersUiState = {
  viewMode: 'table',
  searchQuery: '',
  currentPage: 1,
  pageSize: 5,
  createModal: {
    isOpen: false,
  },
  editModal: {
    isOpen: false,
    user: null,
  },
  deleteDialog: {
    isOpen: false,
    user: null,
  },
  toast: null,
};

export const usersUiSlice = createSlice({
  name: 'usersUi',
  initialState,
  reducers: {
    setViewMode: (state, action: PayloadAction<ViewMode>) => {
      state.viewMode = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.pageSize = action.payload;
      state.currentPage = 1;
    },
    openCreateModal: (state) => {
      state.createModal.isOpen = true;
      state.editModal = { isOpen: false, user: null };
      state.deleteDialog = { isOpen: false, user: null };
    },
    openEditModal: (state, action: PayloadAction<User>) => {
      state.editModal = {
        isOpen: true,
        user: action.payload,
      };
      state.createModal.isOpen = false;
      state.deleteDialog = { isOpen: false, user: null };
    },
    openDeleteDialog: (state, action: PayloadAction<User>) => {
      state.deleteDialog = {
        isOpen: true,
        user: action.payload,
      };
      state.createModal.isOpen = false;
      state.editModal = { isOpen: false, user: null };
    },
    closeModals: (state) => {
      state.createModal.isOpen = false;
      state.editModal = { isOpen: false, user: null };
      state.deleteDialog = { isOpen: false, user: null };
    },
    showToast: (
      state,
      action: PayloadAction<{ type: 'success' | 'error' | 'info'; message: string }>
    ) => {
      state.toast = {
        id: Math.random().toString(36).substring(2, 9),
        type: action.payload.type,
        message: action.payload.message,
      };
    },
    clearToast: (state) => {
      state.toast = null;
    },
  },
});

export const {
  setViewMode,
  setSearchQuery,
  setCurrentPage,
  setPageSize,
  openCreateModal,
  openEditModal,
  openDeleteDialog,
  closeModals,
  showToast,
  clearToast,
} = usersUiSlice.actions;

export default usersUiSlice.reducer;
