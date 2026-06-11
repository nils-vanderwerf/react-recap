import apiClient from './api-client'
import type { User, UserFormData } from '../types'

const getUsers = (signal: AbortSignal) =>
  apiClient.get<User[]>('/users/random/10', { signal })

const createUser = (data: UserFormData) =>
  apiClient.post<User>('/users', data)

const updateUser = (id: string, data: UserFormData) =>
  apiClient.patch<User>(`/users/${id}`, data)

const deleteUser = (id: string) =>
  apiClient.delete(`/user/${id}`)

export { getUsers, createUser, updateUser, deleteUser }
