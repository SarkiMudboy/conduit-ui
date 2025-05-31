import { ref, type Ref } from 'vue'
import { defineStore } from 'pinia'
import { type LoginCredentials, type RegisterData, type User } from '@/services/auth/types'
import type { APIResponse } from '@/services/types'
import { API } from '@/services'
import type { AxiosError } from 'axios'

export const useCurrentUserStore = defineStore('useCurrentUserStore', () => {
  const currentUser: Ref<User | {}> = ref({})

  const setUser = (user: User) => {
    currentUser.value = user
  }

  const getUser = (): User => {
    console.log(currentUser.value)
    return currentUser.value as User
  }

  const dispatchRegister = async (payload: RegisterData): Promise<APIResponse<User | null>> => {
    try {
      const { status, data } = await API.auth.register(payload)
      if (status == 201) {
        setUser(data)
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

  const dispatchLogin = async (payload: LoginCredentials): Promise<APIResponse<User | null>> => {
    try {
      const { status, data } = await API.auth.login(payload)
      if (status == 200) {
        setUser(data)
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

  const dispatchLogout = async (): Promise<APIResponse<null>> => {
    try {
      const { status, data } = await API.auth.logout()
      if (status == 204) {
        return {
          body: null,
          status: 204
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
    getUser,
    setUser,
    dispatchRegister,
    dispatchLogin,
    dispatchLogout
  }
})
