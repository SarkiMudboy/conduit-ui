import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCSRFTokenStore = defineStore('useCSRFTokenStore', () => {
  const csrfToken = ref('')
  const getCSRFToken = () => {
    console.info(document.cookie)
    csrfToken.value = document.cookie
      .split(';')
      .find((row) => row.startsWith('csrftoken='))
      ?.split('=')[1] as string
  }
  getCSRFToken()
  return {
    csrfToken
  }
})
