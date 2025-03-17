import { ref, computed, reactive, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { req, type reqOptions } from '@/lib/utils'

type User = {
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

export const useCurrentUserStore = defineStore('useCurrentUserStore', () => {
  const currentUser: Ref<User | {}> = ref({})

  const setUser = (user: User) => {
    console.log(user)
    currentUser.value = user
  }

  const getUser = (): User => {
    return currentUser.value as User
  }

  return {
    getUser,
    setUser
  }
})
