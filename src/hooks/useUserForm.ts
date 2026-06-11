import { useState } from 'react'
import { emptyForm } from '../types'
import type { User, UserFormData } from '../types'

const useUserForm = () => {
  const [form, setForm] = useState(emptyForm)
  // When set, the form is in edit mode for that user's id — null means add mode
  const [editingId, setEditingId] = useState<string | null>(null)

  const isEditing = editingId !== null

  const handleChange = (updates: Partial<UserFormData>) => setForm({ ...form, ...updates })

  const startEdit = (user: User) => {
    setEditingId(user.id)
    setForm({ first_name: user.first_name, middle_name: user.middle_name, last_name: user.last_name })
  }

  const resetForm = () => {
    setEditingId(null)
    setForm(emptyForm)
  }

  return { form, editingId, isEditing, handleChange, startEdit, resetForm }
}

export default useUserForm
