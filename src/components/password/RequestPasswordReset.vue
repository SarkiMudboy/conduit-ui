<script setup lang="ts">
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { ref } from 'vue'

const emit = defineEmits<{
  (e: 'reset-email-token-recieved', token: string): void
}>()

const email = ref('')
const emailToken = ref('')

async function sendEmail() {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const raw = JSON.stringify({ email: email.value })

  const requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw
  }

  let responseData = await fetch(
    'http://localhost:8000/api/v1/users/request-reset-password/',
    requestOptions
  )
    .then((response) => {
      if (response.ok) return response.json()
      else throw new Error('An error occured')
    })
    .catch((error) => console.error(error))

  emailToken.value = responseData.token
  emit('reset-email-token-recieved', emailToken.value)
}
</script>

<template>
  <div class="container">
    <Card class="mx-auto max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription
          >If an account with the email exist, an email with an OTP will be sent</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid items-center w-full gap-4">
            <div class="flex flex-col space-y-1.5">
              <Label for="email">Email</Label>
              <Input id="email" placeholder="example@email.com" v-model="email" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex justify-between px-6 pb-6">
        <!-- <Button variant="outline"> Cancel </Button> -->
        <Button variant="outline" @click="sendEmail">Send Email</Button>
      </CardFooter>
    </Card>
  </div>
</template>
