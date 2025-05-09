<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { authGitHub } from '@/lib/utils'
import { useCurrentUserStore } from '@/stores/userStore'
import type { LoginCredentials } from '@/services/auth/types'
import { useToast, Toaster } from '@/components/ui/toast'
import { FormField, FormMessage, FormLabel } from '@/components/ui/form'

import * as z from 'zod'
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'

const credentials: LoginCredentials =
  reactive({
    email: '',
    tag: '',
    password: ''
  })

const router = useRouter()
const { toast } = useToast()
const userStore = useCurrentUserStore()

let identifier = ref('')
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const formSchema = toTypedSchema(
  z.object({
    email: z.coerce.string().refine((emailAddr) => checkEmail(emailAddr), {
      message: "Invalid Email"
    }),
    tag: z.coerce.string(),
    password: z.coerce.string()
  })
)

const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema
})

async function logIn(creds: LoginCredentials) {
  const response = await userStore.dispatchLogin(creds)
  if (response.body) {
    userStore.setUser(response.body)
    router.push('/files')
  } else {
    toast({
      title: 'Sign Up Failed',
      description: `Something went wrong`,
      variant: 'destructive'
    })

  }
}

function checkEmail(email: string) {
  return emailRegex.test(email)
}

const onSubmit = handleSubmit(async (userData) => {
  const isEmail = checkEmail(userData.email)
  isEmail ? (credentials.email = identifier.value) : (credentials.tag = identifier.value)
  isEmail ? delete credentials.tag : delete credentials.email
  await logIn(credentials)
})
</script>

<template>
  <Header>
    <!-- <RouterLink to="/"> Home </RouterLink> -->
  </Header>
  <Card class="mx-auto max-w-sm mt-12">
    <CardHeader>
      <CardTitle class="text-2xl"> Login </CardTitle>
      <CardDescription> Enter your email or tag below to login to your account </CardDescription>
    </CardHeader>
    <form @submit="onSubmit">
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="email">
              <FormLabel for="email">Email/Tag</FormLabel>
              <Input id="email" type="text" placeholder="m@example.com or @ted5x4" v-bind="componentField"
                v-model="identifier" required />
            </FormField>
          </div>
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="password">
              <div class="flex items-center">
                <FormLabel for="password">Password</FormLabel>
                <RouterLink to="/reset-password" class="ml-auto inline-block text-sm underline">Forgot Password?
                </RouterLink>
              </div>
              <Input id="password" type="password" v-bind="componentField" v-model="credentials.password" required />
              <FormMessage />
            </FormField>
          </div>
          <Button type="submit" class="w-full"> Login </Button>
          <Button variant="outline" class="w-full" @click="authGitHub"> Login with GitHub </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Don't have an account?
          <RouterLink to="/sign-up" class="underline">Sign Up</RouterLink>
        </div>
      </CardContent>
    </form>
  </Card>
  <Toaster />
</template>
