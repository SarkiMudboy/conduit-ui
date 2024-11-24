<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import CustomHeader from '@/components/CustomHeader.vue'
import { reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/userStore'
import { authGitHub, parseGithubAuthURL, req, type reqOptions } from '@/lib/utils'

type registerData = {
  email: string
  password: string
  tag: string
}

const userData = reactive({
  email: '',
  password: '',
  tag: ''
})

const userStore = useCurrentUserStore()
const router = useRouter()

async function register(data: registerData) {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify(data)

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  }

  let { ...currentUser } = await fetch(
    'http://localhost:8000/api/v1/users/sign-up/',
    requestOptions
  )
    .then((response) => response.json())
    .catch((error) => console.error(error))

  userStore.currentUser = currentUser
  router.push('/files')
}

async function signUp() {
  await register(userData)
}
</script>

<template>
  <CustomHeader>
    <RouterLink to="/"> Home </RouterLink>
  </CustomHeader>
  <Card class="mx-auto max-w-sm mt-12">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription> Enter your information to create an account </CardDescription>
    </CardHeader>
    <CardContent>
      <div class="grid gap-4">
        <div class="grid gap-2">
          <Label for="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            v-model="userData.email"
            required
          />
        </div>
        <div class="grid gap-2">
          <Label for="tag">Tag (Username)</Label>
          <Input id="tag" type="text" placeholder="tedx56" v-model="userData.tag" />
        </div>
        <div class="grid gap-2">
          <Label for="password">Password</Label>
          <Input id="password" type="password" v-model="userData.password" />
        </div>
        <Button type="submit" class="w-full" @click="signUp"> Create an account </Button>
        <Button variant="outline" class="w-full" @click="authGitHub"> Sign up with GitHub </Button>
      </div>
      <div class="mt-4 text-center text-sm">
        Already have an account?
        <RouterLink to="/login" class="underline">Sign in</RouterLink>
      </div>
      <div class="pt-5">
        <p class="text-xs text-foreground-lighter sm:mx-auto sm:max-w-sm">
          By continuing, you agree to Conduit's
          <a class="underline hover:text-foreground-light" href="https://supabase.com/terms"
            >Terms of Service</a
          >
          and
          <a class="underline hover:text-foreground-light" href="https://supabase.com/privacy"
            >Privacy Policy</a
          >, and to receive periodic emails with updates.
        </p>
      </div>
    </CardContent>
  </Card>
</template>
