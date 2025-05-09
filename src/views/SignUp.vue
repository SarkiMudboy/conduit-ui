<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header.vue'
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/userStore'
import { authGitHub } from '@/lib/utils'
import { type RegisterData } from '@/services/auth/types'
import { useToast, Toaster } from '@/components/ui/toast'

import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'



const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

function checkEmail(email: string) {
  return emailRegex.test(email)
}

const userData = reactive({
  email: '',
  password: '',
  tag: ''
})

const userStore = useCurrentUserStore()
const router = useRouter()
const { toast } = useToast()

// find out how to validate the email 
const formSchema = toTypedSchema(
  z.object({
    email: z.coerce.string().refine((emailAddr) => checkEmail(emailAddr), {
      message: "Invalid email"
    }),
    tag: z.coerce.string(),
    password: z.coerce.string().min(5, { message: "Password must be at least 5 characters long" }),
  })
)


const { handleSubmit, setValues } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit(async (userData) => {
  await register(userData)
})


async function register(data: RegisterData) {

  const response = await userStore.dispatchRegister(data)
  if (response.body) {
    const currentUser = response.body
    userStore.setUser(currentUser)
    router.push('/files')
  } else {
    toast({
      title: 'Sign Up Failed',
      description: `Something went wrong`,
      variant: 'destructive'
    })

  }
}
</script>

<template>
  <Header>
    <!--   <RouterLink to="/"> Home </RouterLink> -->
  </Header>
  <Card class="mx-auto max-w-sm mt-12">
    <CardHeader>
      <CardTitle class="text-xl"> Sign Up </CardTitle>
      <CardDescription> Enter your information to create an account </CardDescription>
    </CardHeader>
    <form @submit="onSubmit">
      <CardContent>
        <div class="grid gap-4">
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="email">
              <FormLabel for="email">Email</FormLabel>
              <Input id="email" type="email" placeholder="m@example.com" v-bind="componentField"
                v-model="userData.email" required />
              <FormMessage />
            </FormField>
          </div>
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="tag">
              <FormLabel for="tag">Tag (Username)</FormLabel>
              <Input id="tag" type="text" placeholder="tedx56" v-bind="componentField" v-model="userData.tag" />
              <FormMessage />
            </FormField>
          </div>
          <div class="grid gap-2">
            <FormField v-slot="{ componentField }" name="password">
              <FormLabel for="password">Password</FormLabel>
              <Input id="password" type="password" v-bind="componentField" v-model="userData.password" />
            </FormField>
          </div>
          <Button type="submit" class="w-full"> Create an account </Button>
          <Button variant="outline" class="w-full" @click="authGitHub"> Sign up with GitHub </Button>
        </div>
        <div class="mt-4 text-center text-sm">
          Already have an account?
          <RouterLink to="/login" class="underline">Sign in</RouterLink>
        </div>
        <div class="pt-5">
          <p class="text-xs text-foreground-lighter sm:mx-auto sm:max-w-sm">
            By continuing, you agree to Conduit's
            <a class="underline hover:text-foreground-light" href="https://supabase.com/terms">Terms of Service</a>
            and
            <a class="underline hover:text-foreground-light" href="https://supabase.com/privacy">Privacy Policy</a>, and
            to receive periodic emails with updates.
          </p>
        </div>
      </CardContent>
    </form>
  </Card>
  <Toaster />
</template>
