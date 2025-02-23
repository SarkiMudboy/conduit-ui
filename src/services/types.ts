export type APIResponse<T> = {
  success: boolean
  body: T
  status?: number
}
