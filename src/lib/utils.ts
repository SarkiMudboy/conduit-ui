import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useTokenStore } from '@/stores/userStore'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type reqOptions = {
  data: any
  headers: Headers
  url: string
  method: 'POST' | 'GET' | 'PUT'
}

export async function req(options: reqOptions) {
  const requestOptions: {
    method: string
    headers: Headers
    body?: string
  } = {
    method: options.method,
    headers: options.headers
  }

  if (options.method != 'GET') requestOptions.body = JSON.stringify(options.data)

  const responseData = await fetch(options.url, requestOptions)
    .then(async (response) => {
      const data = Number(response.headers.get('content-length'))
      const json = data > 0 ? await response.json() : {}
      return { status: response.status, response: json }
    })
    .catch((error) => {
      return { status: 0, response: error }
    })

  return responseData
}

export async function protectedReq(params: reqOptions) {
  const router = useRouter()
  const tokenStore = useTokenStore()

  params.headers.append('Authorization', `Bearer ${tokenStore.tokens.access}`)
  const response = await req(params)

  if (response.status == 401)
    await tokenStore.refreshToken().then((r) => {
      if (!r) router.push('/login')
    })
  return response
}

export function validatePassword(password: string) {
  const minLength = 4
  const hasLetter = /[a-zA-Z]/
  const hasNumber = /\d/

  if (password.length < minLength) {
    return 'Password must be at least 4 characters long.'
  }

  if (!hasLetter.test(password)) {
    return 'Password must contain at least one letter.'
  }

  if (!hasNumber.test(password)) {
    return 'Password must contain at least one number.'
  }

  return 'Password is valid.'
}
