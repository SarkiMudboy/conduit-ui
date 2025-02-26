import axios, { type AxiosInstance } from 'axios'
import { useCSRFTokenStore } from '@/stores/tokenStore'
import { type RequestConfig } from './types'

const getHTTPClient = (config: RequestConfig): AxiosInstance => {
  const tokenStore = useCSRFTokenStore()
  const client = axios.create({
    baseURL: config.root
      ? import.meta.env.VITE_CONDUIT_BASE_URL
      : import.meta.env.VITE_CONDUIT_API_BASE_URL
  })
  if (config.withAuth) {
    client.defaults.headers.common['X-CSRFToken'] = tokenStore.csrfToken
    client.defaults.withCredentials = true
  }
  return client
}

export default getHTTPClient
