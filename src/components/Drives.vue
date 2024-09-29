<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'
import DriveCard from './DriveCard.vue'

type Drive = {
  name: string
  size: number
  type: 'shared' | 'personal'
  uid: string
  used: number
}

const drives: Ref<Drive[] | []> = ref([])

async function getDrives() {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/drives/',
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    drives.value = r.response
  })
}
await getDrives()
</script>
<template>
  <ul class="flex flex-col space-y-2">
    <DriveCard v-for="drive in drives" :drive="drive" />
  </ul>
</template>
