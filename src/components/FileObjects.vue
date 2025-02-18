<script setup lang="ts">
import Folder from './icons/Folder.vue'
import File from './icons/File.vue'
import { type FileObject } from './Drives/types'
import { calculateFileSize, protectedReq, type reqOptions } from '@/lib/utils';
import { computed, ref, type Ref } from 'vue';
import UploadFile from '@/components/file_upload/UploadFile.vue';

const props = defineProps<{ assets: FileObject[], driveUid: string }>()

const objType = (fileObject: FileObject) => {
  if (!fileObject.is_directory) return File
  else return Folder
}

const assets: Ref<FileObject[]> = ref(props.assets)
const parent = ref(props.driveUid)

//const readObjectAssets = computed(() => {
//  return assets
//})

const selectObject = (obj: FileObject) => {
  if (obj.is_directory) loadFolderAssets(obj.uid)
}

const loadFolderAssets = async (uid: string) => {

  const url = 'http://localhost:8000/api/v1/drives/' + `${props.driveUid}/objects/${uid}`

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: url,
    method: 'GET'
  }

  await protectedReq(params).then((r) => {

    if (r.status == 200) {

      assets.value = r.response.content
      parent.value = uid
      console.log(r.response)

    }

  })
}

</script>

<template>
  <div v-if="assets.length > 0" class="flex gap-3 min-w-full p-1">
    <div v-for="obj in assets" :key="obj.uid">
      <div :class="['flex flex-col', 'items-center', { 'cursor-pointer': (objType(obj) == Folder) }]">
        <component :is="objType(obj)" @click="selectObject(obj)" />
        <p class="text-lg font-mono font-light">{{ obj.name }}</p>
        <p class="font-light font-mono text-gray-300">{{ calculateFileSize(obj.size) }}</p>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center h-[30rem] gap-1 text-center mt-9">
    <h3 class="text-2xl font-bold tracking-tight">You have no files</h3>
    <div class="items-center gap-1.5">
      <p class="text-sm text-muted-foreground">
        Share files with members by uploading a new file
      </p>
    </div>
    <UploadFile class="mt-5" :selectedDrive="driveUid" :currentResource="parent" />
  </div>

</template>
