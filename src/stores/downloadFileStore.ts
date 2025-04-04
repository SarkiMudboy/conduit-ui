import { defineStore } from 'pinia'
import type { APIResponse } from '@/services/types'
import type { AxiosError } from 'axios'
import { API } from '@/services'

export const useDownloadFileStore = defineStore('useDownloadFileStore', () => {
  async function dispatchGetDownloadPresignedURL(
    drive: string,
    asset: string
  ): Promise<APIResponse<{ uid: string; url: string } | null>> {
    try {
      const { status, data } = await API.files.getDownloadPresignedURL(drive, asset)
      if (status === 200) {
        return {
          body: data
        }
      }
    } catch (error) {
      const _error = error as AxiosError<string>
      return {
        status: _error.response ? _error.response.status : 400,
        body: null
      }
    }
    return {
      body: null,
      status: 400
    }
  }

  return {
    dispatchGetDownloadPresignedURL
  }
})
