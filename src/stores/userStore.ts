import { ref, computed, reactive, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { req, type reqOptions } from '@/lib/utils'

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

type Token = {
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

  function setTokens(t: Token) {
    tokens.access = t.access
    tokens.refresh = t.refresh
  }

  // function that verifies tokens and
  async function verify(): Promise<Boolean> {
    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')

    const raw = JSON.stringify({
      token: tokens.access
    })

    const params: reqOptions = {
      data: raw,
      headers: myHeaders,
      url: 'http://localhost:8000/api/token/verify/',
      method: 'POST'
    }

    await req(params).then((r) => {
      if (r.status == 200) return true
    })
    return false
  }

  // refresh tokens
  async function refreshToken() {
    if (tokens.refresh == '') return false

    const myHeaders = new Headers()
    myHeaders.append('Content-Type', 'application/json')
    myHeaders.append('Authorization', `Bearer: ${tokens.access}`)

    const raw = JSON.stringify({
      refresh: tokens.refresh
    })
    const params: reqOptions = {
      data: raw,
      headers: myHeaders,
      url: 'http://localhost:8000/api/token/refresh/',
      method: 'POST'
    }
    await req(params).then((r) => {
      if (r.status == 200) tokens.access = r.response.access
      else return false
    })

    return true
  }

  return {
    tokens,
    setTokens,
    refreshToken
  }
})
