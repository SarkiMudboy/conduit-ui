export type APIResponse<T> = {
  body: T
  status?: number
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
