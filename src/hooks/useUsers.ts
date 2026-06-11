import { useEffect, useState } from 'react'
import { CanceledError } from 'axios'
import apiClient from '../services/api-client'
import { emptyForm } from '../types'
import type { Timestamp, User, UserFormData } from '../types'

const useUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  // Start as true so the spinner shows immediately on first render before useEffect runs
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  // When set, the form is in edit mode for that user's id — null means add mode
  const [editingId, setEditingId] = useState<string | null>(null)
  // Tracks when each user was last added or edited (keyed by user id)
  const [timestamps, setTimestamps] = useState<Record<string, Timestamp>>({})

  const isEditing = editingId !== null

  const setTimestamp = (id: string, label: Timestamp['label']) =>
    setTimestamps(current => ({ ...current, [id]: { label, time: new Date() } }))

  const addUser = () => {
    const originalUsers = users
    // Use a temp id until the server responds with the real one
    const tempId = Date.now().toString()
    const newUser = { ...form, id: tempId }
    setUsers([newUser, ...users])
    setTimestamp(tempId, 'Added')

    setSubmitting(true)
    apiClient.post<User>('/users', form)
      .then(response => {
        // Swap the temp user out for the real server response (with the real id)
        setUsers(current => current.map(u => u.id === tempId ? response.data : u))
        // Move the timestamp from the temp id to the real id assigned by jsonfakery
        setTimestamps(current => {
          const { [tempId]: entry, ...rest } = current
          return { ...rest, [response.data.id]: entry }
        })
      })
      .catch(error => {
        setError(error.message)
        // Roll back to the original list if the request failed
        setUsers(originalUsers)
      })
      .finally(() => {
        setSubmitting(false)
        resetForm()
      })
  }

  const updateUser = () => {
    const originalUsers = users
    // Optimistically apply the edit in the UI before the server responds
    setUsers(current => current.map(u => u.id === editingId ? { ...u, ...form } : u))
    setTimestamp(editingId!, 'Edited')
    resetForm()

    setSubmitting(true)
    apiClient.patch<User>(`/users/${editingId}`, form)
      // Replace with the real server response in case the server changes any fields
      .then(response => setUsers(current => current.map(u => u.id === editingId ? response.data : u)))
      .catch(error => {
        setError(error.message)
        // Roll back if the patch failed
        setUsers(originalUsers)
      })
      .finally(() => setSubmitting(false))
  }

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setForm({ first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  const deleteUser = (user: User) => {
    // Optimistic update — remove from UI immediately, then sync with the server
    setUsers(users.filter(u => u.id !== user.id))
    apiClient.delete(`/user/${user.id}`)
      .catch(error => console.log('errors', error.message))
  }

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    isEditing ? updateUser() : addUser()
  }

  const handleChange = (updates: Partial<UserFormData>) => setForm({ ...form, ...updates })

  useEffect(() => {
    const controller = new AbortController()

    apiClient.get<User[]>('/users/random/10', { signal: controller.signal })
      .then(response => setUsers(response.data))
      .catch(error => {
        if (error instanceof CanceledError) return
        setError(error.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return {
    users, error, loading, form, submitting, isEditing, timestamps,
    handleSubmit, handleChange, startEdit, resetForm, deleteUser,
  }
}

export default useUsers
