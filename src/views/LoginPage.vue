<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import Header from '@/components/Header.vue'
import { authGitHub } from '@/lib/utils'
import { useCurrentUserStore } from '@/stores/userStore'
import type { LoginCredentials } from '@/services/auth/types'
import { useToast } from '@/components/ui/toast'
import { FormField, FormLabel } from '@/components/ui/form/FormLabel.vue'

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
    email: z.coerce.string(),
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

async function signInUser() {
  const isEmail = emailRegex.test(identifier.value)
  isEmail ? (credentials.email = identifier.value) : (credentials.tag = identifier.value)
  isEmail ? delete credentials.tag : delete credentials.email
  await logIn(credentials)
}
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
    <form @submit="onsubmit">${0}</form>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email/Tag</Label>
          <Input id="email" type="text" placeholder="m@example.com or @ted5x4" v-model="identifier" required />
        </div>
        <div class="grid gap-2">
          <div class="flex items-center">
            <Label for="password">Password</Label>
            <RouterLink to="/reset-password" class="ml-auto inline-block text-sm underline">Forgot Password?
            </RouterLink>
          </div>
          <Input id="password" type="password" v-model="credentials.password" required />
        </div>
        <Button type="submit" class="w-full" @click="signInUser"> Login </Button>
        <Button variant="outline" class="w-full" @click="authGitHub"> Login with GitHub </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Don't have an account?
        <RouterLink to="/sign-up" class="underline">Sign Up</RouterLink>
      </div>
    </CardContent>
  </Card>
  <Toaster />
</template>
