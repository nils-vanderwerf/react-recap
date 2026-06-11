# react-recap

A React + TypeScript learning project for practising CRUD patterns, custom hooks, and layered architecture. Uses [jsonfakery.com](https://jsonfakery.com) as a fake REST API.

## Getting started

```bash
npm install
npm run dev
```

## What it does

Fetches a list of random users and lets you add, edit, and delete them. All mutations are optimistic — the UI updates immediately and rolls back if the request fails.

## Project structure

```
src/
  App.tsx                        # UI only — renders components, calls useUsers
  types.ts                       # Shared interfaces (User, Timestamp, UserFormData)

  components/
    UserForm.tsx                 # Shared form for both adding and editing a user
    UserListItem.tsx             # Single user row with Edit/Delete buttons and timestamp

  hooks/
    useUsers.ts                  # Composition layer — wires the three hooks below together
    useFetchUsers.ts             # Initial data load, AbortController, loading state
    useUserForm.ts               # Form values, edit mode, startEdit/resetForm
    useUserMutations.ts          # Add/update/delete with optimistic updates and rollback
    useMutationBindings.ts       # Binds current state into minimal-argument helpers
    userMutationHelpers.ts       # Pure state transformation functions (no side effects)

  services/
    api-client.ts                # Axios instance with base URL pointing to jsonfakery
    userService.ts               # Named API functions: createUser, updateUser, deleteUser, getUsers
```

## Key patterns

**Optimistic updates** — every mutation applies the change to local state first, then fires the request. If the request fails, state is rolled back to the snapshot taken before the change.

**Layered hooks** — `useUsers` is just a composition of three focused hooks. Each hook has one job: fetch, form, or mutate.

**Service layer** — `useUserMutations` never calls axios directly. It calls named functions from `userService`, which calls `api-client`. Swapping the API only requires changing the service layer.

**Pure helpers** — `userMutationHelpers.ts` contains functions that take data and return data. No state, no side effects, easy to unit test.

## Tech

- React 19
- TypeScript
- Tailwind CSS v4
- Axios
- Vite
