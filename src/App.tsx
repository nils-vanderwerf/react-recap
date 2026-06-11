import { useEffect, useState } from 'react'
import axios, { CanceledError } from 'axios'

interface User {
  id: string
  first_name: string
  middle_name: string
  last_name: string
}

const App = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)

  const deleteUser = (user: User) => {
    setUsers(users.filter(u => u.id !== user.id ))
    axios.delete('https://jsonfakery.com/uber/' + user.id)
         .then(response => {
            console.log(response.data)
         })
         .catch(error => {
            console.log('errors', console.log(error.message))
         })
  }

  useEffect(() => {
    const controller = new AbortController()

    setLoading(true)
    axios.get<User[]>('https://jsonfakery.com/users/random/10', {
      signal: controller.signal
    }) // A PROMISE - holds the async result or failure of a request

         .then(response => setUsers(response.data))
         .catch(error => {
            if(error instanceof CanceledError) return
            setError(error.message)
         } )
         .finally(() => setLoading(false))

      return () => controller.abort()
  }, [])

  return (
  <div className='max-w-lg mx-auto p-6'>
    <h1 className='text-3xl font-semibold mb-6'>List of Names</h1>
    {error && <p className='text-red-500 mb-4'>{error}</p>}
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
          <button className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm' onClick={() => deleteUser(user)}>
            Delete
          </button>
        </li>
      ))}
    </ul>
  </div>
  )
}

export default App