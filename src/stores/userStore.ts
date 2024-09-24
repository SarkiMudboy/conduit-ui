import { ref, computed, reactive, type Ref } from 'vue'
import { defineStore } from 'pinia'

type User =
  | {}
  | {
      uid: string
      email: string
      tag: string
      avatar: string | null
      drive: {
        uid: string
        name: string
        size: string
      }
      token: Token
    }

type Token =
  | {}
  | {
      refresh: string
      access: string
    }

export const useCurrentUserStore = defineStore('useCurrentUserStore', () => {
  const currentUser: User = reactive({})
  return {
    currentUser
  }
})

export const useTokenStore = defineStore('tokens', () => {
  const tokens: Token = reactive({
    access: '',
    refresh: ''
  })
  return {
    tokens
  }
})
