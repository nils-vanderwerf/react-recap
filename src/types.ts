export interface User {
  id: string
  first_name: string
  middle_name: string
  last_name: string
}

export interface Timestamp {
  label: 'Added' | 'Edited'
  time: Date
}

export interface UserFormData {
  first_name: string
  middle_name: string
  last_name: string
}

export const emptyForm: UserFormData = { first_name: '', middle_name: '', last_name: '' }
