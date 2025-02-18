export interface Drive {
  uid: string
  name: string
  size: number
  used: number
  type: 'personal' | 'shared'
  created_at: string
}
