import { type AxiosResponse, AxiosError } from 'axios'
import { useRouter } from 'vue-router'
import { refreshToken } from '@/lib/utils'
import { h, markRaw, type Ref } from 'vue'
import ToastProgress from '@/components/ui/ToastProgress/ToastProgress.vue'
import { useToast } from '@/components/ui/toast'

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

export function getUploadToast(filename: string, fileUploadProgress: Ref<number>) {
  const { toast } = useToast()

  return toast({
    title: 'File Upload',
    description: h('div', { class: 'min-w-[20rem]' }, [
      h('p', { class: 'w-full' }, `Uploading ${filename}...`),
      h(markRaw(ToastProgress), {
        progress: fileUploadProgress,
        class: 'mt-2 h-[10px]'
      })
    ]),
    duration: Infinity
  })
}
