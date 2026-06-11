import { useEffect, useState } from 'react'
import { CanceledError } from 'axios'
import { getUsers as fetchUsers } from '../services/userService'
import type { User } from '../types'

const useFetchUsers = () => {
  const [users, setUsers] = useState<User[]>([])
  const [error, setError] = useState('')
  // Start as true so the spinner shows immediately on first render before useEffect runs
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // AbortController lets us cancel the in-flight request if the component unmounts
    const controller = new AbortController()

    fetchUsers(controller.signal)
      .then(response => setUsers(response.data))
      .catch(error => {
        if (error instanceof CanceledError) return
        setError(error.message)
      })
      .finally(() => setLoading(false))

    return () => controller.abort()
  }, [])

  return { users, setUsers, error, setError, loading }
}

export default useFetchUsers
