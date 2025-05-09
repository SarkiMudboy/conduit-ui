<script setup lang="ts">
import Button from '../ui/button/Button.vue'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { req, type reqOptions } from '@/lib/utils'
import { PinInput, PinInputGroup, PinInputInput } from '@/components/ui/pin-input'
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

const emailToken = defineProps({
  email_token: {
    type: String,
    required: true
  }
})

const { toast } = useToast()

const emit = defineEmits<{
  (e: 'otp-confirmed', token: string): void
}>()

const formSchema = toTypedSchema(
  z.object({
    password: z.array(z.coerce.string()).length(6, { message: 'Invalid Input' })
  })
)

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema
})

const onPasswordSubmit = handleSubmit(({ password }) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const requestParams: reqOptions = {
    data: {
      otp: password.join(''),
      token: emailToken.email_token
    },
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/users/confirm-reset-password/',
    method: 'POST'
  }

  req(requestParams).then((r) => {
    if (r.status == 200) {
      emit('otp-confirmed', r.response.token)
    } else {
      toast({
        title: 'Uh Oh',
        description: 'Something went wrong, Please try again',
        variant: 'destructive'
      })
    }
  })
})
</script>

<template>
  <form class="w-2/3 space-y-6 mx-auto max-w-sm mt-14" @submit="onPasswordSubmit">
    <FormField v-slot="{ componentField, value }" name="password">
      <FormItem>
        <FormLabel>OTP</FormLabel>
        <FormControl>
          <PinInput id="pin-input" :model-value="value" placeholder="○" class="flex gap-2 items-center mt-1" otp
            type="number" :name="componentField.name" @update:model-value="(arrStr) => {
                setFieldValue('password', arrStr.filter(Boolean))
              }
              ">
            <PinInputGroup>
              <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
            </PinInputGroup>
          </PinInput>
        </FormControl>
        <FormDescription> Enter OTP recieved in your mail here. </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button>Submit</Button>
  </form>
  <Toaster />
</template>
