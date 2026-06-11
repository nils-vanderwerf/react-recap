import { useEffect, useState } from 'react'
import axios, { CanceledError } from 'axios'

interface User {
  id: string
  first_name: string
  middle_name: string
  last_name: string
}

// Default form state extracted so we can reuse it when resetting after submit
const emptyForm = { first_name: '', middle_name: '', last_name: '' }

const App = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  // Start as true so the spinner shows immediately on first render before useEffect runs
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(emptyForm)
  const [submitting, setSubmitting] = useState(false)

  const addUser = (e: React.SyntheticEvent) => {
    e.preventDefault()
    setSubmitting(true)
    axios.post<User>('https://jsonfakery.com/users', form)
      // Prepend the new user to the top of the list
      .then(response => setUsers([response.data, ...users]))
      .catch(error => setError(error.message))
      .finally(() => {
        setSubmitting(false)
        setForm(emptyForm)
      })
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
    <div className='max-w-lg mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6'>List of Names</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <form onSubmit={addUser} className='flex flex-col gap-2 mb-6'>
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
        <button
          type='submit'
          disabled={submitting}
          className='bg-green-700 text-white px-3 py-2 rounded-lg hover:bg-green-800 text-sm disabled:opacity-50'
        >
          {submitting ? 'Adding...' : 'Add User'}
        </button>
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
          <li key={user.id} className='flex items-center justify-between py-3'>
            <span>{user.first_name} {user.middle_name} {user.last_name}</span>
            <button
              className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm'
              onClick={() => deleteUser(user)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
