export type APIResponse<T> = {
  body: T
  status?: number
}

export type RequestConfig = {
  root?: boolean
  withAuth?: boolean
}
