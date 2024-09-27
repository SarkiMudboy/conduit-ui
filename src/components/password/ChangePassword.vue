<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'
import { Input } from '@/components/ui/input'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { req, type reqOptions } from '@/lib/utils'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'

const emailToken = defineProps({
  email_token: {
    type: String,
    required: true
  }
})
const router = useRouter()
const { toast } = useToast()
const newPassword = ref('')

const formSchema = toTypedSchema(
  z.object({
    password: z.coerce.string().min(5, { message: 'Password must be at least 5 characters long' }),
    confirmPassword: z.coerce.string().refine((p) => p === newPassword.value, {
      message: 'Passwords must match'
    })
  })
)

const form = useForm({
  validationSchema: formSchema
})

const onSubmit = form.handleSubmit((passwords) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestParams: reqOptions = {
    data: {
      password: passwords.password,
      token: emailToken.email_token
    },
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/users/reset-password/',
    method: 'PUT'
  }
  req(requestParams).then((r) => {
    console.log(r)
    switch (r.status) {
      case 200:
        toast({
          title: 'Success',
          description: 'Your Password has been successfully reset.'
        })
        setTimeout(() => {
          // console.log('Executed after 2 seconds')
          router.push('/login')
        }, 3000)
        break
      case 400:
      case 500:
        toast({
          title: 'Uh Oh',
          description: 'Something went wrong, Please try again',
          variant: 'destructive'
        })
        break
      default:
        console.log('Nope')
    }
  })
})
</script>

<template>
  <Card class="w-[550px] mx-auto mt-14">
    <CardHeader>
      <CardTitle>Reset Your Password</CardTitle>
      <CardDescription>Please enter your new password</CardDescription>
    </CardHeader>
    <form @submit="onSubmit">
      <CardContent>
        <div class="grid items-center w-full gap-4">
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <div class="flex flex-col space-y-1.5">
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    id="name"
                    type="password"
                    placeholder="New password"
                    v-model="newPassword"
                    v-bind="componentField"
                  />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="confirmPassword">
            <FormItem>
              <div class="flex flex-col space-y-1.5">
                <FormLabel>Confirm Password</FormLabel>
                <FormControl
                  ><Input
                    id="name"
                    type="password"
                    placeholder="Enter again..."
                    v-bind="componentField"
                /></FormControl>
              </div>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <Button>Submit</Button>
      </CardFooter>
    </form>
  </Card>
  <Toaster />
</template>
