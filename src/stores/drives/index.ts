import { defineStore } from 'pinia'
import { ref } from 'vue'
import { type Drive, type InputCreateDrive } from '@/services/drives/types'

import { API } from '@/services'
import { AxiosError } from 'axios'
import { type APIResponse } from '@/services/types'

export const useDriveStore = defineStore('useDriveStore', () => {
  const drives = ref<Drive[]>([])

  const initDrives = (data: Drive[]) => {
    drives.value = data
  }

  const removeDrive = (uid: string) => {
    const idx = drives.value.findIndex((drive) => drive.uid == uid)

    if (idx == -1) return
    drives.value.splice(idx, 1)
  }

  // dispatchers

  const dispatchGetDrives = async (): Promise<APIResponse<null>> => {
    try {
      const { status, data } = await API.drives.getDrives()
      if (status === 200) {
        initDrives(data)
        return {
          body: null
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

  const dispatchCreateDrive = async (
    drive: InputCreateDrive
  ): Promise<APIResponse<Drive | null>> => {
    try {
      const { status, data } = await API.drives.createDrive(drive)
      if (status === 200) {
        drives.value.push(data)
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
    drives,
    initDrives,
    removeDrive,
    dispatchGetDrives,
    dispatchCreateDrive
  }
})
