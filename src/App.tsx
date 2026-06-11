import useUsers from './hooks/useUsers'
import UserForm from './components/UserForm'
import UserListItem from './components/UserListItem'

const App = () => {
  const {
    users, error, loading, form, submitting, isEditing, timestamps,
    handleSubmit, handleChange, startEdit, resetForm, deleteUser,
  } = useUsers()

  return (
    <div className='max-w-2xl mx-auto p-6'>
      <h1 className='text-3xl font-semibold mb-6'>List of Names</h1>
      {error && <p className='text-red-500 mb-4'>{error}</p>}

      <UserForm
        form={form}
        isEditing={isEditing}
        submitting={submitting}
        onChange={handleChange}
        onSubmit={handleSubmit}
        onCancel={resetForm}
      />

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
          <UserListItem
            key={user.id}
            user={user}
            timestamp={timestamps[user.id]}
            onEdit={startEdit}
            onDelete={deleteUser}
          />
        ))}
      </ul>
    </div>
  )
}

export default App
