import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
  User,
  CreateUserInput,
  UpdateUserInput,
} from '../types/user.types';

const STORAGE_PREFIX = 'users_dir_';
const ADDED_KEY = `${STORAGE_PREFIX}added`;
const UPDATED_KEY = `${STORAGE_PREFIX}updated`;
const DELETED_KEY = `${STORAGE_PREFIX}deleted`;

export const getLocalAdded = (): User[] => {
  try {
    const raw = sessionStorage.getItem(ADDED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getLocalUpdated = (): Record<number, Partial<User>> => {
  try {
    const raw = sessionStorage.getItem(UPDATED_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

export const getLocalDeleted = (): number[] => {
  try {
    const raw = sessionStorage.getItem(DELETED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveLocalAdded = (users: User[]) => {
  try {
    sessionStorage.setItem(ADDED_KEY, JSON.stringify(users));
  } catch {}
};

const saveLocalUpdated = (updates: Record<number, Partial<User>>) => {
  try {
    sessionStorage.setItem(UPDATED_KEY, JSON.stringify(updates));
  } catch {}
};

const saveLocalDeleted = (ids: number[]) => {
  try {
    sessionStorage.setItem(DELETED_KEY, JSON.stringify(ids));
  } catch {}
};

export const resetLocalMockChanges = () => {
  sessionStorage.removeItem(ADDED_KEY);
  sessionStorage.removeItem(UPDATED_KEY);
  sessionStorage.removeItem(DELETED_KEY);
};

export const usersApi = createApi({
  reducerPath: 'usersApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://jsonplaceholder.typicode.com',// API Endpoint export from .env file in production
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      transformResponse: (baseUsers: User[]) => {
        const added = getLocalAdded();
        const updated = getLocalUpdated();
        const deleted = new Set(getLocalDeleted());

        const filteredServerUsers = baseUsers
          .filter((user) => !deleted.has(user.id))
          .map((user) => {
            const update = updated[user.id] ?? updated[Number(user.id)];
            if (update) {
              return {
                ...user,
                ...update,
                company: {
                  ...user.company,
                  ...(update.company || {}),
                },
              };
            }
            return user;
          });

        const filteredAdded = added
          .filter((user) => !deleted.has(user.id))
          .map((user) => {
            const update = updated[user.id] ?? updated[Number(user.id)];
            if (update) {
              return {
                ...user,
                ...update,
                company: {
                  ...user.company,
                  ...(update.company || {}),
                },
              };
            }
            return user;
          });

        return [...filteredAdded, ...filteredServerUsers];
      },
      providesTags: (result) =>
        result
          ? [
              { type: 'User' as const, id: 'LIST' },
              ...result.map(({ id }) => ({ type: 'User' as const, id })),
            ]
          : [{ type: 'User' as const, id: 'LIST' }],
    }),

    createUser: builder.mutation<User, CreateUserInput>({
      query: (newUserData) => ({
        url: '/users',
        method: 'POST',
        body: {
          name: newUserData.name,
          email: newUserData.email,
          phone: newUserData.phone,
          company: {
            name: newUserData.companyName,
          },
        },
      }),
      invalidatesTags: [{ type: 'User', id: 'LIST' }],
      async onQueryStarted(newUserData, { dispatch, queryFulfilled }) {
        try {
          const { data: serverResult } = await queryFulfilled;
          const existingAdded = getLocalAdded();
          const maxAddedId = existingAdded.reduce((max, u) => Math.max(max, u.id), 10);
          const assignedId =
            serverResult.id && serverResult.id > 10 ? Math.max(serverResult.id, maxAddedId + 1) : maxAddedId + 1;

          const createdUser: User = {
            id: assignedId,
            name: newUserData.name,
            email: newUserData.email,
            phone: newUserData.phone,
            username: newUserData.name.toLowerCase().replace(/\s+/g, '_'),
            website: `${newUserData.companyName.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
            company: {
              name: newUserData.companyName,
            },
          };

          saveLocalAdded([createdUser, ...existingAdded]);

          dispatch(
            usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
              const alreadyExists = draft.some((u) => u.id === createdUser.id);
              if (!alreadyExists) {
                draft.unshift(createdUser);
              }
            })
          );
        } catch {}
      },
    }),

    updateUser: builder.mutation<User, UpdateUserInput>({
      query: ({ id, ...patch }) => ({
        url: `/users/${id}`,
        method: 'PATCH',
        body: {
          id,
          name: patch.name,
          email: patch.email,
          phone: patch.phone,
          company: {
            name: patch.companyName,
          },
        },
      }),
      invalidatesTags: (_result, _error, { id }) => [{ type: 'User', id }],
      async onQueryStarted(updatedInput, { dispatch, queryFulfilled }) {
        const numericId = Number(updatedInput.id);

        // Optimistic UI cache update for instant response
        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const target = draft.find((u) => u.id === numericId);
            if (target) {
              target.name = updatedInput.name;
              target.email = updatedInput.email;
              target.phone = updatedInput.phone;
              target.company = {
                ...target.company,
                name: updatedInput.companyName,
              };
            }
          })
        );

        try {
          await queryFulfilled;

          // Persist update in local session state so it survives refetches
          const updates = getLocalUpdated();
          updates[numericId] = {
            name: updatedInput.name,
            email: updatedInput.email,
            phone: updatedInput.phone,
            company: {
              name: updatedInput.companyName,
            },
          };
          saveLocalUpdated(updates);

          // If this was a locally created user, also update the record in added list
          const existingAdded = getLocalAdded();
          const updatedAdded = existingAdded.map((u) =>
            u.id === numericId
              ? {
                  ...u,
                  name: updatedInput.name,
                  email: updatedInput.email,
                  phone: updatedInput.phone,
                  company: { ...u.company, name: updatedInput.companyName },
                }
              : u
          );
          saveLocalAdded(updatedAdded);
        } catch {
          patchResult.undo();
        }
      },
    }),

    deleteUser: builder.mutation<{ success: boolean; id: number }, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'User', id },
        { type: 'User', id: 'LIST' },
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        const numericId = Number(id);

        const patchResult = dispatch(
          usersApi.util.updateQueryData('getUsers', undefined, (draft) => {
            const index = draft.findIndex((u) => u.id === numericId);
            if (index !== -1) {
              draft.splice(index, 1);
            }
          })
        );

        try {
          await queryFulfilled;

          const deleted = getLocalDeleted();
          if (!deleted.includes(numericId)) {
            saveLocalDeleted([...deleted, numericId]);
          }
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useGetUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = usersApi;
