<script setup lang="ts">
import { protectedReq, type reqOptions } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { Button } from "@/components/ui/button"
import { computed, ref, type Ref } from 'vue';
import { type Drive, type DriveDetail, type FileObject } from "./types"
import DriveCard from './DriveCard.vue';
import AddDrive from './AddDrive.vue';
import { useToast } from '@/components/ui/toast';
import Toaster from '@/components/ui/toast/Toaster.vue';
import FileObjects from '@/components/FileObjects.vue';

const { toast } = useToast()
const drives: Ref<Drive[]> = ref([])

const selectedDrive: Ref<DriveDetail | null> = ref(null)

const setDriveFileObjects = computed(() => {
  const objects = selectedDrive.value ? selectedDrive.value.storage_objects : []
  return objects
})


//const getObject = async (uid: string, objtype: 'drive' | 'object') => {
//  let path = 'http://localhost:8000/api/v1/drives/'
//
//  if (objtype === 'drive') {
//    selectedDrive.value = uid
//    path += uid
//  } else path += `${selectedDrive.value}/objects/${uid}`
//
//  const myHeaders = new Headers()
//  myHeaders.append('Content-Type', 'application/json')
//  const params: reqOptions = {
//    data: null,
//    headers: myHeaders,
//    url: path,
//    method: 'GET'
//  }
//  await protectedReq(params).then((r) => {
//    if (r.status == 200) {
//      currentResource.value = {
//        uid: uid,
//        name: 'storageObject',
//        title: r.response.name
//      }
//
//      objtype === 'drive'
//        ? (objects.value = r.response.storage_objects)
//        : (objects.value = r.response.content)
//    }
//  })
//}

const getDriveAssets = async (uid: string) => {

  const url = 'http://localhost:8000/api/v1/drives/' + uid

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
      selectedDrive.value = r.response
      console.log(r.response)
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
    drives.value = r.response
  })

}

const addNewDrive = (drive: Drive) => {
  drives.value.push(drive);
  toast({
    title: 'Drive created',
    description: `${drive.name} added!`
  })
}

await listDrives()

</script>

<template>
  <div class="p-6">
    <div class="mb-6 flex items-center gap-4">
      <AddDrive :userDrives="drives.map((drive) => drive.name)" @drive-created="addNewDrive" />
      <Button variant="outline" class="gap-2">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" />
        </svg>
        Upload
      </Button>
      <Button variant="outline" class="gap-2">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Create folder
      </Button>
      <Button variant="outline" class="gap-2">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M12 18.5a6.5 6.5 0 100-13 6.5 6.5 0 000 13zM12 14a2 2 0 100-4 2 2 0 000 4z" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Record
      </Button>
    </div>
    <div :class="cn('w-full overflow-x-auto scrollbar-none')">
      <div v-if="selectedDrive">
        <FileObjects :assets="setDriveFileObjects" />
      </div>
      <div v-else class=" flex gap-3 min-w-full p-1">
        <DriveCard v-for="drive in drives" :key="drive.uid" v-bind="drive" @drive-selected="getDriveAssets" />
      </div>
    </div>
  </div>
  <Toaster />
</template>
