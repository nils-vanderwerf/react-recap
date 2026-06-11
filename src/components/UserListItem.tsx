import { Timestamp, User } from '../types'

interface Props {
  user: User
  timestamp?: Timestamp
  onEdit: (user: User) => void
  onDelete: (user: User) => void
}

const formatTime = (date: Date) =>
  date.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

const UserListItem = ({ user, timestamp, onEdit, onDelete }: Props) => (
  <li className='flex items-center justify-between py-3 gap-4'>
    <span className='flex-1'>{user.first_name} {user.middle_name} {user.last_name}</span>
    {timestamp && (
      <span className='text-xs text-gray-400 whitespace-nowrap'>
        {timestamp.label} {formatTime(timestamp.time)}
      </span>
    )}
    <div className='flex gap-2'>
      <button
        className='bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm'
        onClick={() => onEdit(user)}
      >
        Edit
      </button>
      <button
        className='bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-700 text-sm'
        onClick={() => onDelete(user)}
      >
        Delete
      </button>
    </div>
  </li>
)

export default UserListItem
