import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import {
  type FileData,
  type FileMetaData,
  type GetPresignedURLData,
  type PresignedURLS,
  type UploadFile
} from '@/services/files/types'
import type { APIResponse } from '@/services/types'
import type { AxiosError } from 'axios'
import { API } from '@/services'

export const useUploadFileStore = defineStore('useUploadFileStore', () => {
  const files: Ref<UploadFile[]> = ref([])
  const presignedFiles: Ref<GetPresignedURLData> = ref({
    files: [] as FileData[],
    bulk: false
  })

  const addFiles = (fileObjects: File[], isDriveRoot: boolean) => {
    fileObjects.forEach((file) => {
      const id = crypto.randomUUID() as string

      let filepath = file.webkitRelativePath
      if (isDriveRoot || !filepath) filepath = file.name

      const f = {
        id: id,
        filename: file.name,
        path: filepath,
        filesize: file.size
      }
      files.value.push({
        data: f,
        file: file,
        fileURL: '',
        uploadPresignedURL: '',
        uploaded: false
      })

      presignedFiles.value.files.push(f)
    })
  }

  const setUploadData = <T extends keyof GetPresignedURLData>(
    field: T,
    value: GetPresignedURLData[T]
  ) => {
    presignedFiles.value[field] = value
  }

  const setUploadMeta = (id: string, url: string, metadata: FileMetaData) => {
    const file = files.value.find((file) => file.data.id == id)
    if (file) {
      file.uploadPresignedURL = url
      file.data.metadata = metadata
    }
  }

  const getFile = (id: string) => {
    const file = files.value.find((file) => file.data.id == id)
    return file ? file.file : null
  }

  const getFilePath = (id: string) => {
    const file = files.value.find((file) => file.data.id == id)
    return file ? file.data.path : ''
  }

  const clearFiles = (id?: string) => {
    if (id) {
      files.value.splice(
        files.value.findIndex((file) => file.data.id === id),
        1
      )
      presignedFiles.value.files.splice(
        presignedFiles.value.files.findIndex((file) => file.id === id),
        1
      )
    } else {
      files.value = []
    }
  }

  const dispatchGetPresignedURLS = async (
    drive: string,
    isBulk: boolean,
    resource: string | null
  ): Promise<APIResponse<PresignedURLS | null>> => {
    // set presignedURL data here first
    if (resource) presignedFiles.value.resource = resource
    presignedFiles.value.bulk = isBulk

    try {
      const { status, data } = await API.files.getObjectPresignedURL(presignedFiles.value, drive)
      if (status === 200) {
        data.presigned_urls.forEach((url) => setUploadMeta(url.id, url.url, data.metadata))
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

  const dispatchUploadFiles = async (file: UploadFile): Promise<APIResponse<boolean>> => {
    try {
      const uploaded = await API.files.uploadFile(
        file.uploadPresignedURL,
        file.file,
        file.data.metadata as FileMetaData
      )
      return { body: uploaded }
    } catch (error) {
      return { body: false }
    }
  }

  return {
    files,
    addFiles,
    getFile,
    clearFiles,
    getFilePath,
    dispatchGetPresignedURLS,
    dispatchUploadFiles,
    setUploadData
  }
})
