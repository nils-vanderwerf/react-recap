import { useState } from 'react'
import { createUser, updateUser as patchUser, deleteUser as removeUserRequest } from '../services/userService'
import useMutationBindings from './useMutationBindings'
import type { Timestamp, User, UserFormData } from '../types'

interface Deps {
  users: User[]
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  setError: React.Dispatch<React.SetStateAction<string>>
  form: UserFormData
  editingId: string | null
  resetForm: () => void
}

const useUserMutations = ({ users, setUsers, setError, form, editingId, resetForm }: Deps) => {
  const [submitting, setSubmitting] = useState(false)
  // Tracks when each user was last added or edited (keyed by user id)
  const [timestamps, setTimestamps] = useState<Record<string, Timestamp>>({})

  // Applies an optimistic state change, then rolls back + surfaces the error if the request fails
  const withRollback = async <T>(apply: () => void, request: Promise<T>): Promise<T> => {
    const snapshot = users
    apply()
    try {
      return await request
    } catch (err) {
      setError((err as Error).message)
      setUsers(snapshot)
      throw err
    }
  }

  const { tempUser, prepend, swap, applyEditsTo, remove, setTimestamp, migrateTimestampTo, finishSubmit } =
    useMutationBindings({ users, form, setUsers, setTimestamps, setSubmitting, resetForm })

  // ─── CRUD operations ──────────────────────────────────────────────────────────

  const addUser = () => {
    const tempId = Date.now().toString()
    setTimestamp(tempId, 'Added')
    setSubmitting(true)

    withRollback(
      () => prepend(tempUser(tempId)),
      createUser(form)
    )
      .then(({ data: saved }) => { swap(tempId, saved); migrateTimestampTo(tempId, saved.id) })
      .finally(finishSubmit)
  }

  const updateUser = () => {
    const id = editingId!  // capture before resetForm clears it
    setTimestamp(id, 'Edited')
    setSubmitting(true)

    withRollback(
      () => applyEditsTo(id),
      patchUser(id, form)
    )
      .then(({ data: saved }) => swap(id, saved))
      .finally(finishSubmit)
  }

  const deleteUser = (user: User) => withRollback(
    () => remove(user.id),
    removeUserRequest(user.id)
  )

  return { submitting, timestamps, addUser, updateUser, deleteUser }
}

export default useUserMutations
