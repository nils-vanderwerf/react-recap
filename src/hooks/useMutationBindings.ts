import { buildTempUser, prependUser, swapUser, applyEdits, removeUser, migrateTimestamp } from './userMutationHelpers'
import type { Timestamp, User, UserFormData } from '../types'

interface Args {
  users: User[]
  form: UserFormData
  setUsers: React.Dispatch<React.SetStateAction<User[]>>
  setTimestamps: React.Dispatch<React.SetStateAction<Record<string, Timestamp>>>
  setSubmitting: (value: boolean) => void
  resetForm: () => void
}

// Factory that closes over current state, returning helpers with minimal call-site arguments
const useMutationBindings = ({ users, form, setUsers, setTimestamps, setSubmitting, resetForm }: Args) => ({
  tempUser:           (tempId: string)              => buildTempUser(form, tempId),
  prepend:            (user: User)                  => setUsers(prependUser(users, user)),
  swap:               (id: string, user: User)      => setUsers(curr => swapUser(curr, id, user)),
  applyEditsTo:       (id: string)                  => setUsers(applyEdits(users, id, form)),
  remove:             (id: string)                  => setUsers(removeUser(users, id)),
  setTimestamp:       (id: string, label: Timestamp['label']) =>
    setTimestamps(curr => ({ ...curr, [id]: { label, time: new Date() } })),
  migrateTimestampTo: (fromId: string, toId: string) =>
    setTimestamps(curr => migrateTimestamp(curr, fromId, toId)),
  finishSubmit:       ()                            => { setSubmitting(false); resetForm() },
})

export default useMutationBindings
