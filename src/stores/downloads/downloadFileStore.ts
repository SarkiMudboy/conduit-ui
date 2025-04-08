import { defineStore } from 'pinia'
import type { APIResponse } from '@/services/types'
import type { AxiosError } from 'axios'
import { API } from '@/services'
import type { DownloadPresignedURL } from '@/services/files/types'
import { ref, type Ref } from 'vue'
import { generateZipAssetForFolders } from './utils'

export const useDownloadFileStore = defineStore('useDownloadFileStore', () => {
  const assetDownloadURLs: Ref<DownloadPresignedURL[] | null> = ref(null)

  const processURLs = async (): Promise<string> => {
    // check the length of assetDownloadURLs... if its eq = 1 leave as is
    // else call the func to download and zip up the asset. This should be in utils...
    if (assetDownloadURLs.value) {
      if (assetDownloadURLs.value.length > 1) {
        // await call func
        return await generateZipAssetForFolders(assetDownloadURLs.value)
      } else return assetDownloadURLs.value[0].url
    }
    return ''
  }

  async function dispatchGetDownloadPresignedURL(
    drive: string,
    asset: string
  ): Promise<APIResponse<DownloadPresignedURL[] | null>> {
    try {
      const { status, data } = await API.files.getDownloadPresignedURL(drive, asset)
      if (status === 200) {
        assetDownloadURLs.value = data
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
    processURLs,
    dispatchGetDownloadPresignedURL
  }
})
