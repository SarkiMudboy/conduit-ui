<script setup lang="ts">
import Folder from './icons/Folder.vue'
import File from './icons/File.vue'
import { type FileObject } from './Drives/types'
import { calculateFileSize, protectedReq, type reqOptions } from '@/lib/utils';
import { ref, type Ref } from 'vue';
import UploadFile from '@/components/file_upload/UploadFile.vue';
import FolderNav from '@/components/FolderNav.vue';
import { useFileTreeContextStore, type ObjectNode } from '@/stores/fileTreeContextStore';
import { driveAssetsQuery } from '@/components/Drives/utils';

const props = defineProps<{ assets: FileObject[] }>()

const filePathNavStore = useFileTreeContextStore()
const drive = filePathNavStore.filePath[0]

const objType = (fileObject: FileObject) => {
  if (!fileObject.is_directory) return File
  else return Folder
}

const assets: Ref<FileObject[]> = ref(props.assets)
const parent = ref(drive.uid)

const selectObject = (obj: FileObject) => {
  if (obj.is_directory) loadFolderAssets({ uid: obj.uid, name: obj.name })
}

function checkAsset(source: string | ObjectNode) {

  if (typeof source == "string") {
    driveAssetsQuery(source).then((response) => {
      assets.value = response.response.storage_objects
      parent.value = source
      filePathNavStore.setNode({ uid: source, name: response.response.name })
    })
  } else loadFolderAssets(source)

}

const loadFolderAssets = async (folder: ObjectNode) => {

  const url = 'http://localhost:8000/api/v1/drives/' + `${drive.uid}/objects/${folder.uid}`

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
      parent.value = folder.uid
      filePathNavStore.setNode(folder)
    }
  })
}

</script>

<template>
  <FolderNav @node-selected="checkAsset">
    <UploadFile />
  </FolderNav>
  <div v-if="assets.length > 0" class="flex flex-wrap mt-5 gap-3 min-w-full p-1">
    <div v-for="obj in assets" :key="obj.uid">
      <div :class="['flex flex-col', 'items-center', { 'cursor-pointer': (objType(obj) == Folder) }]">
        <component :is="objType(obj)" @click="selectObject(obj)" />
        <p class="text-lg font-mono font-light w-40 text-center truncate">{{ obj.name }}</p>
        <p class="font-light font-mono text-gray-300">{{ calculateFileSize(obj.size) }}</p>
      </div>
    </div>
  </div>
  <div v-else class="flex flex-col items-center justify-center h-[30rem] gap-3 text-center mt-9">
    <h3 class="text-2xl font-bold tracking-tight">You have no files</h3>
    <div class="items-center gap-1.5">
      <p class="text-sm text-muted-foreground">
        Share files with members by uploading a new file
      </p>
    </div>
    <UploadFile class="mt-5" />
  </div>

</template>
