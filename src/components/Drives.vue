<script setup lang="ts">
import { ref, type Ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'
import DriveCard from './DriveCard.vue'
import Objects from './Objects.vue'

type Drive = {
  name: string
  size: number
  type: 'shared' | 'personal'
  uid: string
  used: number
}

interface Resource {
  title: string
  component: object | string
  objects: Drive[] | Object[] // change this
  grid: string
}

const currentResource: Ref<Resource> = ref({
  title: 'Your Drives',
  component: DriveCard,
  objects: [],
  grid: 'grid grid-cols-3 gap-4'
})

const getDrive = async (uid: string) => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: `http://localhost:8000/api/v1/drives/${uid}`,
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    console.log(r.response)
    currentResource.value = {
      title: 'Object name',
      component: Objects,
      objects: r.response.storage_objects,
      grid: 'grid grid-cols-5 gap-4'
    }
  })
}

async function listDrives() {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/drives/',
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    currentResource.value.objects = r.response
  })
}
await listDrives()
</script>
<template>
  <div class="flex items-center">
    <h1 class="text-lg font-semibold md:text-2xl">{{ currentResource.title }}</h1>
  </div>
  <ul :class="currentResource.grid">
    <component
      :is="currentResource.component"
      v-for="obj in currentResource.objects"
      :resource="obj"
      @selected-drive="getDrive"
    />
  </ul>
</template>
