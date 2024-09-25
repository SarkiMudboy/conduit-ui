import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type reqOptions = {
  data: any
  headers: Headers
  url: string
  method: 'POST' | 'GET'
}

export async function req(options: reqOptions) {
  const raw = JSON.stringify(options.data)

  const requestOptions = {
    method: options.method,
    headers: options.headers,
    body: raw
  }

  await fetch(options.url, requestOptions)
    .then((response) => {
      if (response.ok) return response.json()
      else throw new Error('An error occured')
    })
    .catch((error) => console.error(error))
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
