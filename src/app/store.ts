import { configureStore } from '@reduxjs/toolkit';
import { usersApi } from '../features/users/api/usersApi';
import usersUiReducer from '../features/users/store/usersUiSlice';

export const store = configureStore({
  reducer: {
    [usersApi.reducerPath]: usersApi.reducer,
    usersUi: usersUiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(usersApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
