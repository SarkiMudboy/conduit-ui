export type APIResponse<T> = {
  body: T
  status?: number
}

export type PaginatedAPIResponse<T> = {
  count: number
  previous: string
  next: string
  results: T[]
}

export type RequestConfig = {
  root?: boolean
  withAuth?: boolean
}

//Drives

export type Asset = {
  uid: string
  name: string
  size: number
  created_at: string
}
