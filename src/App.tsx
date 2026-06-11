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
  <div className='flex flex-col items-center p-4 text-center'>
    <h1 className='text-3xl mb-4'>List of Names</h1>
    {error && <p className='text-red-500'>{error}</p>}
    {loading && (
      <svg className='animate-spin h-8 w-8 text-blue-500' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24'>
        <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4' />
        <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z' />
      </svg>
    )}
    <ul>
      {users.map(user => 
      <li key={user.id}>
        <p className='mb-2'>{user.first_name} {user.middle_name}</p>
      </li>
      )
      }
    </ul>
  </div>
  )
}

export default App