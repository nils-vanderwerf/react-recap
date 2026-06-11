import axios, {AxiosError} from 'axios'
import { useEffect, useState } from 'react'

interface User {
  id: string
  first_name: string
  middle_name: string
  last_name: string
}

const App = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  useEffect(() => {
    const fetchUsers = async () => {
      try { 
        const response = await axios.get<User[]>(
          'https://jsonfakery.com/users/random/10'
        )
        setUsers(response.data)
      } catch(error) {
        setError((error as AxiosError).message)
      }
    }

    fetchUsers()
  }, [])

  return (
  <div className='flex flex-col items-center p-4 text-center'>
    <h1 className='text-3xl mb-4'>List of Names</h1>
    {error && <p className='text-red-500'>{error}</p>}
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