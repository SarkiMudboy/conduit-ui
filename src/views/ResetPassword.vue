<script setup lang="ts">
import RequestPasswordReset from '@/components/password/RequestPasswordReset.vue'
import OTPView from '@/components/password/OTPView.vue'
import ChangePassword from '@/components/password/ChangePassword.vue'
import CustomHeader from '@/components/CustomHeader.vue'
import { computed, ref } from 'vue'

const pages: any = {
  RequestPasswordReset: RequestPasswordReset,
  OTPView: OTPView,
  ChangePassword: ChangePassword
}
const currentPage = ref('RequestPasswordReset')
const emailToken = ref('')

function renderOTPView(token: string) {
  emailToken.value = token
  currentPage.value = 'OTPView'
}

function renderChangePasswordView(token: string) {
  emailToken.value = token
  currentPage.value = 'ChangePassword'
}

const renderPage = computed(() => {
  return pages[currentPage.value]
})

const token = computed(() => {
  return emailToken.value
})
</script>

<template>
  <CustomHeader>
    <RouterLink to="/"> Home </RouterLink>
  </CustomHeader>
  <Suspense>
    <component
      :is="renderPage"
      :email_token="token"
      @reset-email-token-recieved="renderOTPView"
      @otp-confirmed="renderChangePasswordView"
    />
    <template v-slot:fallback> Data is loading... </template>
  </Suspense>
</template>
