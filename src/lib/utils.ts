import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type reqOptions = {
  data: any
  headers: Headers
  url: string
  method: 'POST' | 'GET' | 'PUT'
}

export async function req(options: reqOptions): Promise<any> {
  const raw = JSON.stringify(options.data)

  const requestOptions = {
    method: options.method,
    headers: options.headers,
    body: raw
  }

  const responseData = await fetch(options.url, requestOptions)
    .then((response) => {
      if (response.ok)
        return response.json() // change this to return {status: response.statusCode, response: response.json()}
      else throw new Error('An error occured')
    })
    .catch((error) => console.error(error))

  return responseData
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
