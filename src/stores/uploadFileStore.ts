import { defineStore } from 'pinia'
import { reactive } from 'vue'

export type FileData = {
  filename: string
  path: string | null
  filesize: number
  id: string
  metadata?: object
}

export type FileObject = {
  file: File
  fileURL: string
  id: string
  uploadPresignedURL: string
}

export const useUploadFileStore = defineStore('useUploadFileStore', () => {
  const fileUploadData: Record<string, FileObject> = reactive({})
  const fileData: FileData[] = reactive([])

  const addFiles = (files: File[]) => {
    files.forEach((file) => {
      const id = crypto.randomUUID() as string

      fileUploadData[id] = {
        file: file,
        fileURL: URL.createObjectURL(file),
        id: id, // id to identify each file through out the process **required by the API**
        uploadPresignedURL: ''
      }

      fileData.push({
        filename: file.name,
        path: file.webkitRelativePath,
        filesize: file.size,
        id: id
      })
    })
  }

  const setUploadURL = (id: string, url: string) => {
    fileUploadData[id].uploadPresignedURL = url
  }

  const getFile = (id: string) => {
    return fileUploadData[id].file
  }

  return {
    fileUploadData,
    fileData,
    addFiles,
    getFile,
    setUploadURL
  }
})
