<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import { req, type reqOptions } from '@/lib/utils'
import { useTokenStore } from '@/stores/userStore'

const route = useRoute()
const router = useRouter()
const tokenStore = useTokenStore()
const callbackData: {
  state: string
  code: string
} = {
  state: route.query.state as string,
  code: route.query.code as string
}

const myHeaders = new Headers()
myHeaders.append('Content-Type', 'application/json')
console.log(callbackData)
const options: reqOptions = {
  data: callbackData,
  headers: myHeaders,
  url: 'http://localhost:8000/api/v1/users/oauth/github/callback/',
  method: 'POST'
}
const response = await req(options)
if (response.status == 200) {
  tokenStore.setTokens({
    access: response.response.access,
    refresh: response.response.refresh
  })
  router.push('/files')
}
</script>
