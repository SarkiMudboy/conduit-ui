import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCSRFTokenStore = defineStore('useCSRFTokenStore', () => {
  const csrfToken = ref('')
  console.log(document.cookie)
  const getCSRFToken = () => {
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
