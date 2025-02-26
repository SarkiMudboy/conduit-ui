<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, ref, type Ref } from 'vue';
import { type Drive, type DriveDetail } from "./types"
import DriveCard from './DriveCard.vue';
import AddDrive from './AddDrive.vue';
import { useToast } from '@/components/ui/toast';
import Toaster from '@/components/ui/toast/Toaster.vue';
import FileObjects from '@/components/FileObjects.vue';
import DriveActions from './DriveActions.vue';
import { useFileTreeContextStore } from '@/stores/fileTreeContextStore';
import { driveAssetsQuery } from './utils';
import { useDriveStore } from '@/stores/drives';

const { toast } = useToast()
const filePathNavStore = useFileTreeContextStore()
const driveStore = useDriveStore()

await driveStore.dispatchGetDrives()
const drives: Ref<Drive[]> = ref(driveStore.drives)
const selectedDrive: Ref<DriveDetail | null> = ref(null)

const setDriveFileObjects = computed(() => {
  const objects = selectedDrive.value ? selectedDrive.value.storage_objects : []
  return objects
})


const getDriveAssets = async (uid: string) => {

  await driveAssetsQuery(uid).then((response) => {
    if (response.status == 200) {
      selectedDrive.value = response.response
      // for the path up top
      if (selectedDrive.value) {
        filePathNavStore.setNode({ uid: selectedDrive.value.uid, name: selectedDrive.value.name })
      }
    }
  })
}


//async function listDrives() {
//
//  const myHeaders = new Headers()
//  myHeaders.append('Content-Type', 'application/json')
//
//  const params: reqOptions = {
//    data: null,
//    headers: myHeaders,
//    url: 'http://localhost:8000/api/v1/drives/',
//    method: 'GET'
//  }
//
//  await protectedReq(params).then((r) => {
//    drives.value = r.response
//  })
//
//}

const addNewDrive = (drive: Drive) => {
  drives.value.push(drive);
  toast({
    title: 'Drive created',
    description: `${drive.name} added!`
  })
}

//await listDrives()

</script>

<template>
  <div class="p-6">
    <div :class="cn('w-full overflow-x-auto scrollbar-none')">
      <div v-if="selectedDrive">
        <FileObjects :assets="setDriveFileObjects" />
      </div>
      <div v-else>
        <DriveActions>
          <AddDrive :userDrives="drives.map((drive) => drive.name)" @drive-created="addNewDrive" />
        </DriveActions>
        <div class=" flex gap-3 min-w-full p-1">
          <DriveCard v-for="drive in drives" :key="drive.uid" v-bind="drive" @drive-selected="getDriveAssets" />
        </div>
      </div>
    </div>
  </div>
  <Toaster />
</template>
