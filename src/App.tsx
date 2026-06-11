import { useEffect, useState } from 'react'
import axios, { CanceledError } from 'axios'

interface User {
  id: string
  first_name: string
  middle_name: string
  last_name: string
}

interface Timestamp {
  label: 'Added' | 'Edited'
  time: Date
}

// Default form state extracted so we can reuse it when resetting after submit
const emptyForm = { first_name: '', middle_name: '', last_name: '' }

const formatTime = (date: Date) =>
  date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

const App = () => {
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

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    isEditing ? updateUser() : addUser()
  }

  const addUser = () => {
    const originalUsers = users
    // Use a temp id until the server responds with the real one
    const tempId = Date.now().toString()
    const newUser = { ...form, id: tempId }
    setUsers([newUser, ...users])
    setTimestamp(tempId, 'Added')

    setSubmitting(true)
    axios.post<User>('https://jsonfakery.com/users', form)
      .then(response => {
        // Swap the temp user out for the real server response (with the real id)
        setUsers(current => current.map(u => u.id === tempId ? response.data : u))
        // Move the timestamp from the temp id to the real id
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
    axios.patch<User>(`https://jsonfakery.com/users/${editingId}`, form)
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
    axios.delete('https://jsonfakery.com/user/' + user.id)
      .catch(error => console.log('errors', error.message))
  }

  useEffect(() => {
    // AbortController lets us cancel the in-flight request if the component unmounts
    const controller = new AbortController()

    setLoading(true)
    axios.get<User[]>('https://jsonfakery.com/users/random/10', {
      signal: controller.signal
    })
      .then(response => setUsers(response.data))
      .catch(error => {
        // Ignore the error thrown when we intentionally abort the request
        if (error instanceof CanceledError) return
        setError(error.message)
      })
      .finally(() => setLoading(false))

    // Cleanup: abort the request if the component unmounts mid-fetch
    return () => controller.abort()
  }, [])

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6'>List of Names</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <form onSubmit={handleSubmit} className='flex flex-col gap-2 mb-6'>
        <p className='text-sm font-medium text-gray-500'>{isEditing ? 'Edit user' : 'Add new user'}</p>
        <input
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
          placeholder='First name'
          value={form.first_name}
          onChange={e => setForm({ ...form, first_name: e.target.value })}
          required
        />
        <input
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
          placeholder='Middle name'
          value={form.middle_name}
          onChange={e => setForm({ ...form, middle_name: e.target.value })}
        />
        <input
          className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
          placeholder='Last name'
          value={form.last_name}
          onChange={e => setForm({ ...form, last_name: e.target.value })}
          required
        />
        <div className='flex gap-2'>
          <button
            type='submit'
            disabled={submitting}
            className='bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800 text-sm disabled:opacity-50'
          >
            {isEditing ? 'Save changes' : 'Add user'}
          </button>
          {isEditing && (
            <button type='button' onClick={resetForm} className='bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm'>
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading && (
        <div className='flex justify-center'>
          <svg className='animate-spin h-8 w-8 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
            <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
            <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
          </svg>
        </div>
      )}

      <ul className='divide-y divide-gray-200'>
        {users.map(user => (
          <li key={user.id} className='flex items-center justify-between py-3 gap-4'>
            <span className='flex-1'>{user.first_name} {user.middle_name} {user.last_name}</span>
            {timestamps[user.id] && (
              <span className='text-xs text-gray-400 whitespace-nowrap'>
                {timestamps[user.id].label} {formatTime(timestamps[user.id].time)}
              </span>
            )}
            <div className='flex gap-2'>
              <button
                className='bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm'
                onClick={() => startEdit(user)}
              >
                Edit
              </button>
              <button
                className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm'
                onClick={() => deleteUser(user)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
