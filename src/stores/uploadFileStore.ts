import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type FileData = {
  filename: string
  path: string | null
  filesize: number
  id: string
  metadata?: object
  uploaded: boolean
}

export type FileObject = {
  file: File
  fileURL: string
  id: string
  uploadPresignedURL: string
}

export const useUploadFileStore = defineStore('useUploadFileStore', () => {
  const fileUploadData: Ref<{ [key: string]: FileObject }> = ref({})
  const fileData: Ref<FileData[]> = ref([])
  const selectedFiles: Ref<{ id: string; file: File }[]> = ref([])

  const addFiles = (files: File[]) => {
    files.forEach((file) => {
      const id = crypto.randomUUID() as string

      fileUploadData.value[id] = {
        file: file,
        fileURL: URL.createObjectURL(file),
        id: id, // id to identify each file through out the process **required by the API**
        uploadPresignedURL: ''
      }

      fileData.value.push({
        filename: file.name,
        path: file.webkitRelativePath,
        filesize: file.size,
        id: id,
        uploaded: false
      })

      selectedFiles.value.push({ id: id, file: file })
    })
  }

  const setUploadURL = (id: string, url: string) => {
    fileUploadData.value[id].uploadPresignedURL = url
  }

  const getFile = (id: string) => {
    return fileUploadData.value[id].file
  }

  const clearFiles = (id?: string) => {
    if (id) {
      delete fileUploadData.value[id]
      fileData.value.splice(fileData.value.findIndex((file) => file.id === id))
      selectedFiles.value.splice(selectedFiles.value.findIndex((file) => file.id === id))
    } else {
      selectedFiles.value = []
      fileUploadData.value = {}
      fileData.value = []
    }
  }

  return {
    fileUploadData,
    fileData,
    addFiles,
    getFile,
    setUploadURL,
    selectedFiles,
    clearFiles
  }
})
