import type { Timestamp, User, UserFormData } from '../types'

export const buildTempUser = (form: UserFormData, tempId: string): User =>
  ({ ...form, id: tempId })

export const prependUser = (users: User[], user: User): User[] =>
  [user, ...users]

export const swapUser = (users: User[], id: string, replacement: User): User[] =>
  users.map(u => u.id === id ? replacement : u)

export const applyEdits = (users: User[], id: string, form: UserFormData): User[] =>
  users.map(u => u.id === id ? { ...u, ...form } : u)

export const removeUser = (users: User[], id: string): User[] =>
  users.filter(u => u.id !== id)

// Move the timestamp from the temp id to the real id assigned by jsonfakery
export const migrateTimestamp = (
  timestamps: Record<string, Timestamp>,
  fromId: string,
  toId: string
): Record<string, Timestamp> => {
  const { [fromId]: entry, ...rest } = timestamps
  return { ...rest, [toId]: entry }
}
