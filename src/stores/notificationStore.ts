import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import { type DriveNotification } from '@/services/notifications/types'

import { API } from '@/services'
import { AxiosError } from 'axios'
import type { APIResponse } from '@/services/types'

export const useNotificationStore = defineStore('useNotificationStore', () => {
  const notifications: Ref<DriveNotification[]> = ref([])
  const newAssets: Ref<string[][]> = ref([])

  function getNotification(uid: string) {
    return notifications.value.find((notif) => notif.uid === uid)
  }

  function isNewAsset(uid: string) {
    for (let i = 0; i < newAssets.value.length - 1; i++) {
      for (let j = 0; j < newAssets.value[i].length - 1; j++) {
        if (newAssets.value[i][j] == uid) return true
      }
    }
    return false
  }

  async function viewAssetHandler(uid: string) {
    let notificationUid

    for (let i = 0; i < newAssets.value.length - 1; i++) {
      for (let j = 0; j < newAssets.value[i].length - 1; j++) {
        if (newAssets.value[i][j] == uid) {
          notificationUid = <string>newAssets.value[i].pop()
          await dispatchMarkAsRead(notificationUid)
          //newAssets.value.splice(i, 1)
        }
      }
    }
  }

  const dispatchGetNotifications = async (): Promise<APIResponse<DriveNotification[] | null>> => {
    try {
      const { status, data } = await API.notifications.getNotifications()
      if (status === 200) {
        notifications.value = data
        // set as unread and add to the generic array of new objects
        notifications.value.forEach((notif) => {
          notif.read = false
          const assetArray = [...notif.assets, notif.uid]
          newAssets.value.push(assetArray)
        })

        return {
          body: data,
          status: 200
        }
      } else throw new Error('Something went wrong')
    } catch (error) {
      const _error = error as AxiosError<string>
      return {
        status: _error.response ? _error.response.status : 400,
        body: null
      }
    }
  }

  const dispatchMarkAsRead = async (notification_uid: string): Promise<APIResponse<boolean>> => {
    try {
      const { status, data } = await API.notifications.markRead(notification_uid)
      if (status === 200 && data) {
        notifications.value = notifications.value.map((notification) =>
          notification.uid == notification_uid ? { ...notification, read: true } : notification
        )
        return {
          body: true,
          status: 200
        }
      } else throw new Error('Something went wrong')
    } catch (error) {
      const _error = error as AxiosError<string>
      return {
        status: _error.response ? _error.response.status : 400,
        body: false
      }
    }
  }

  return {
    notifications,
    getNotification,
    dispatchGetNotifications,
    dispatchMarkAsRead,
    newAssets,
    isNewAsset,
    viewAssetHandler
  }
})
