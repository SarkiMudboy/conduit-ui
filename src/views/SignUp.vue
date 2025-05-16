<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FormField, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Header from '@/components/Header.vue'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useCurrentUserStore } from '@/stores/userStore'
import { authGitHub } from '@/lib/utils'
import { type RegisterData } from '@/services/auth/types'
import { useToast, Toaster } from '@/components/ui/toast'

import * as z from 'zod'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import ShowTag from '@/components/ShowTag.vue'



const userData = reactive({
  email: '',
  password: '',
  tag: ''
})

const userStore = useCurrentUserStore()
const router = useRouter()
const { toast } = useToast()

const savedTag = ref('')

// find out how to validate the email 
const formSchema = toTypedSchema(
  z.object({
    email: z.coerce.string().email({ message: "Invalid email" }),
    tag: z.union([z.string(), z.literal('')]).optional().default(''),
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
    savedTag.value = currentUser.tag
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
  <div v-if="savedTag">
    <ShowTag :userTag="savedTag" />
  </div>
  <div v-else class="flex flex-col gap-0 bg-gradient-to-br from-blue-100 via-white to-purple-100">
    <Header />
    <div class="min-h-screen">
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
                <a class="underline hover:text-foreground-light" href="https://supabase.com/privacy">Privacy Policy</a>,
                and
                to receive periodic emails with updates.
              </p>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  </div>
  <Toaster />
</template>
