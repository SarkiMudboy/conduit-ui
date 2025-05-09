import getClient from '@/services/api'
import { type User, type RegisterData, type LoginCredentials } from './types'

async function register(data: RegisterData) {
  const config = { withAuth: false }
  const client = getClient(config)
  return client.post<User>('users/sign-up/', data)
}

async function login(data: LoginCredentials) {
  const config = { withAuth: true }
  const client = getClient(config)
  return client.post<User>('users/sign-in/', data)
}

export default {
  register,
  login
}
