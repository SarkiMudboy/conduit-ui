export type User = {
  uid: string
  email?: string
  tag: string
  avatar: string | null
  drive?: {
    uid: string
    name: string
    size: string
  }
}

export type RegisterData = {
  email: string
  password: string
  tag: string
}

export type LoginCredentials = {
  email?: string
  tag?: string
  password: string
}
