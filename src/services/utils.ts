import { type AxiosResponse, AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { refreshToken } from '@/lib/utils'

const router = useRouter()

export async function must<T>(
  callback: (...args: any[]) => Promise<AxiosResponse<T>>,
  args: Parameters<typeof callback>
): Promise<AxiosResponse<T>> {
  try {
    return await callback(...args)
  } catch (error) {
    const _error = error as AxiosError<string>
    if (_error.response && _error.response.status === 401) {
      // we try to refresh the access token and retry the request
      await refreshToken().then(async (r) => {
        if (!r) router.push('/login')
        else {
          return await callback(...args)
        }
      })
    }
    throw error
  }
}
