import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// export async function req() {}

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
