<script setup lang="ts">
import { ref, shallowRef, type Ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'
import DriveCard from './DriveCard.vue'
import Objects from './Objects.vue'
import Button from '@/components/ui/button/Button.vue'

type base = {
  name: string
  size: number
  uid: string
  used: number
}

type Drive = base & {
  type: 'shared' | 'personal'
}

type StorageObjects = base & {
  metadata: object
  path: string | null
}

type Object = base & {
  members: string[]
  // storage_objects: StorageObjects[]
}

interface Resource {
  title: string
  component: object | string
  objects: Drive[] | StorageObjects[] // change this to
  grid: string
}

const currentResource: Ref<Resource> = shallowRef({
  title: 'Your Drives',
  component: DriveCard,
  objects: [],
  grid: 'grid grid-cols-3 gap-4'
})

const selectedDrive = ref('')

const getObject = async (uid: string, objtype: 'drive' | 'object') => {
  let path = 'http://localhost:8000/api/v1/drives/'

  if (objtype === 'drive') {
    selectedDrive.value = uid
    path += uid
  } else path += `${selectedDrive.value}/objects/${uid}`

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: path,
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    let resource = {
      title: r.response.name,
      component: Objects,
      objects: [],
      grid: 'grid grid-cols-7 gap-4'
    }
    objtype === 'drive'
      ? (resource.objects = r.response.storage_objects)
      : (resource.objects = r.response.content)
    currentResource.value = resource
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
  <ul v-if="currentResource.objects.length > 0" :class="currentResource.grid">
    <component
      :is="currentResource.component"
      v-for="obj in currentResource.objects"
      :resource="obj"
      @selected-object="getObject"
    />
  </ul>
  <div v-else class="flex flex-col items-center gap-1 text-center mt-9">
    <h3 class="text-2xl font-bold tracking-tight">You have no files</h3>
    <p class="text-sm text-muted-foreground">Share files with members by uploading a new file</p>
    <Button class="mt-4">Add a file</Button>
  </div>
</template>
