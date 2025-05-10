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
import getHTTPClient from '@/services/api'

const emit = defineEmits<{
  (e: 'reset-email-token-recieved', token: string): void
}>()

const email = ref('')
const emailToken = ref('')

async function sendEmail() {

  const request = { email: email.value }
  const config = { withAuth: false }
  const http = getHTTPClient(config)
  try {
    const { status, data } = await http.post(
      '/users/request-reset-password/', request
    )
    if (status == 200) {
      emailToken.value = data.token
      emit('reset-email-token-recieved', emailToken.value)
    }
    else throw new Error('An error occured')
  } catch (error) {
    console.error(error)
  }

}
</script>

<template>
  <div class="container">
    <Card class="mx-auto max-w-sm mt-12">
      <CardHeader>
        <CardTitle>Reset Password</CardTitle>
        <CardDescription>If an account with the email exist, an email with an OTP will be sent</CardDescription>
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
