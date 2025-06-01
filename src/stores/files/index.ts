import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import type { FileObject } from '@/services/files/types'
import type { APIResponse } from '@/services/types'
import { API } from '@/services'
import { AxiosError } from 'axios'

export const useFileObjectStore = defineStore('useFileObjectStore', () => {
  const files: Ref<FileObject[]> = ref([])
  const preloadedDirectories: Ref<FileObject[]> = ref([])

  function initObjects(objects: FileObject) {
    files.value = objects.content ? objects.content : files.value
    initDirectories(objects.directories)
  }

  function initDirectories(dirs?: FileObject[]) {
    preloadedDirectories.value = dirs ? dirs : preloadedDirectories.value
  }

  function checkLoadedDirectories(uid: string) {
    const found = preloadedDirectories.value.find((file) => file.uid == uid)
    return found
  }

  const removeFileObject = (uid: string) => {
    const idx = files.value.findIndex((file) => file.uid == uid)

    if (idx == -1) return
    files.value.splice(idx, 1)
  }

  const loadFolderAssets = async (
    folder: string,
    drive: string
  ): Promise<APIResponse<FileObject | null>> => {
    try {
      const { status, data } = await API.files.getObjects(folder, drive)
      if (status === 200 && data.content) {
        initObjects(data)
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
      status: 400,
      body: null
    }
  }

  return {
    files,
    initObjects,
    initDirectories,
    removeFileObject,
    loadFolderAssets,
    checkLoadedDirectories
  }
})
