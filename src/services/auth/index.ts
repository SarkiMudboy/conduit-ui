import getClient from '@/services/api'
import { type User, type RegisterData, type LoginCredentials } from './types'

async function register(data: RegisterData) {
  const config = { withAuth: true }
  const client = getClient(config)
  return client.post<User>('users/sign-up/', data)
}

async function login(data: LoginCredentials) {
  const config = { withAuth: true }
  const client = getClient(config)
  return client.post<User>('users/sign-in/', data)
}

async function logout() {
  const config = { withAuth: true }
  const client = getClient(config)
  return client.post<null>('users/sign-out/')
}

export default {
  register,
  login,
  logout
}
