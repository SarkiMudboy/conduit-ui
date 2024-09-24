import { ref, computed, reactive } from 'vue'
import { defineStore } from 'pinia'

export const useCurrentUserStore = defineStore('useCurrentUserStore', () => {
  const currentUser = ref({})
  return {
    currentUser
  }
})

export const useTokenStore = defineStore('tokens', () => {
  const tokens = ref({
    access: '',
    refresh: ''
  })
  return {
    tokens
  }
})
