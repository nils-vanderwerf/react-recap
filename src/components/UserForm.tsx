import { UserFormData } from '../types'

interface Props {
  form: UserFormData
  isEditing: boolean
  submitting: boolean
  /** Called with only the changed field so the parent can spread it into the existing form state */
  onChange: (updates: Partial<UserFormData>) => void
  /** Handles both add and update — the parent decides which based on whether editingId is set */
  onSubmit: (e: React.SyntheticEvent) => void
  /** Resets the form and clears editingId, returning the form to add mode */
  onCancel: () => void
}

const UserForm = ({ form, isEditing, submitting, onChange, onSubmit, onCancel }: Props) => (
  <form onSubmit={onSubmit} className='flex flex-col gap-2 mb-6'>
    <p className='text-sm font-medium text-gray-500'>{isEditing ? 'Edit user' : 'Add new user'}</p>
    <input
      className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
      placeholder='First name'
      value={form.first_name}
      onChange={e => onChange({ first_name: e.target.value })}
      required
    />
    <input
      className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
      placeholder='Middle name'
      value={form.middle_name}
      onChange={e => onChange({ middle_name: e.target.value })}
    />
    <input
      className='border border-gray-300 rounded-lg px-3 py-2 text-sm'
      placeholder='Last name'
      value={form.last_name}
      onChange={e => onChange({ last_name: e.target.value })}
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
        <button type='button' onClick={onCancel} className='bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 text-sm'>
          Cancel
        </button>
      )}
    </div>
  </form>
)

export default UserForm
