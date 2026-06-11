import useFetchUsers from './useFetchUsers'
import useUserForm from './useUserForm'
import useUserMutations from './useUserMutations'

const useUsers = () => {
  const { users, setUsers, error, setError, loading } = useFetchUsers()
  const { form, editingId, isEditing, handleChange, startEdit, resetForm } = useUserForm()
  const { submitting, timestamps, addUser, updateUser, deleteUser } = useUserMutations({
    users, setUsers, setError, form, editingId, resetForm,
  })

  const handleSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault()
    isEditing ? updateUser() : addUser()
  }

  return {
    users, error, loading, form, submitting, isEditing, timestamps,
    handleSubmit, handleChange, startEdit, resetForm, deleteUser,
  }
}

export default useUsers
