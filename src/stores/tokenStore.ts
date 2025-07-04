import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useCSRFTokenStore = defineStore('useCSRFTokenStore', () => {
  const csrfToken = ref('')

  const getCSRFToken = async () => {
    const baseURL = import.meta.env.VITE_CONDUIT_BASE_URL
    await fetch(`${baseURL}set-csrf-token/`, {
      method: 'GET',
      credentials: 'include'
    })
      .then((response) => response.json())
      .then((data) => {
        csrfToken.value = data.csrfToken
      })
    console.log(csrfToken)
    //console.info(document.cookie)
    //csrfToken.value = document.cookie
    //  .split(';')
    //  .find((row) => row.startsWith('csrftoken='))
    //  ?.split('=')[1] as string
  }
  getCSRFToken()

  return {
    csrfToken
  }
})
