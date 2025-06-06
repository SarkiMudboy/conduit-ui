import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { useCSRFTokenStore } from '@/stores/tokenStore'
import { useRouter } from 'vue-router'
import getClient from '@/services/api'

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
    credentials?: 'include'
    body?: string
  } = {
    method: options.method,
    headers: options.headers,
    credentials: 'include'
  }

  if (options.method != 'GET') {
    requestOptions.body = JSON.stringify(options.data)
  }
  if (options.method == 'POST' || options.method == 'PUT') {
    const tokenStore = useCSRFTokenStore()
    requestOptions.headers.append('X-CSRFToken', tokenStore.csrfToken)
  }

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
//
export async function protectedReq(params: reqOptions) {
  const router = useRouter()

  let response = await req(params)

  if (response.status == 401)
    await refreshToken().then(async (r) => {
      if (!r) router.push('/login')
      // else block that makes the request again
      else response = await req(params)
    })
  return response
}

// ---------------------------------

// tokens

// function that verifies tokens and
export async function verify(): Promise<Boolean> {
  const config = { withAuth: true, root: true }

  const http = getClient(config)
  try {
    const { status } = await http.post('token/verify/')
    if (status != 200) return false
    else return true
  } catch (error) {
    return false
  }
}

// refresh tokens
export async function refreshToken(): Promise<Boolean> {
  const config = { withAuth: true, root: true }

  const http = getClient(config)
  try {
    const { status } = await http.post('token/refresh/')
    if (status != 200) return false
    else return true
  } catch (error) {
    return false
  }
}

export const authGitHub = async () => {
  const options: reqOptions = {
    data: null,
    headers: new Headers(),
    url: 'http://localhost:8000/api/v1/users/oauth/github',
    method: 'GET'
  }
  const response = await req(options)
  if (response.status == 200) {
    const oauthCallbackURL = response.response.callback
    const oauthClientID = response.response.client_id
    const state = response.response.state
    const authURL = parseGithubAuthURL(oauthClientID, oauthCallbackURL, state)
    window.location.href = authURL
  } else console.log(response.response)
}

export function parseGithubAuthURL(clientID: string, callbackURL: string, state: string): string {
  const clientId = clientID
  const redirectUri = callbackURL
  const scope = 'read:user'
  const allowSignup = 'false'

  sessionStorage.setItem('oauth_state', state)

  const githubAuthUrl = new URL('https://github.com/login/oauth/authorize')

  githubAuthUrl.searchParams.append('client_id', clientId)
  githubAuthUrl.searchParams.append('redirect_uri', redirectUri)
  githubAuthUrl.searchParams.append('scope', scope)
  githubAuthUrl.searchParams.append('state', state)
  githubAuthUrl.searchParams.append('allow_signup', allowSignup)

  return githubAuthUrl.toString()
}

export const calculateFileSize = (size: number) => {
  let fileSize = ''

  if (size == 0.0) return '0.0KB'
  else if ((1024 <= size && size <= 1024 * 1024) || size < 1024) {
    fileSize = (size / 1024).toFixed(2) + 'KB'
  } else if (1024 * 1024 < size && size < 1024 * 1024 * 1024) {
    fileSize = (size / (1024 * 1024)).toFixed(2) + 'MB'
  } else if (size >= 1024 * 1024 * 1024) {
    fileSize = (size / (1024 * 1024 * 1024)).toFixed(2) + 'GB'
  }

  return fileSize
}

export const calculateDiskUsage = (used: number, totalAvailableSpace: number) => {
  return (used / totalAvailableSpace) * 100
}

export const AddAnimationEffectToElementOnLoad = (effect: string) => {
  const sections = document.querySelectorAll('section')
  const options = {
    root: null,
    threshold: 0.75,
    rootMargin: '-20px'
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add(effect)
    })
  }, options)

  sections.forEach((section) => observer.observe(section))
}
