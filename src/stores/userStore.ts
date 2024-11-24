import { ref, computed, reactive, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { req, type reqOptions } from '@/lib/utils'

type User =
  | {
      uid: string
      email?: string
      tag: string
      avatar: string | null
      drive?: {
        uid: string
        name: string
        size: string
      }
    }
  | {}

export const useCurrentUserStore = defineStore('useCurrentUserStore', () => {
  const currentUser: User = reactive({})
  return {
    currentUser
  }
})
