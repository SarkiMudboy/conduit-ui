<script setup lang="ts">
import { protectedReq, type reqOptions } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { computed, ref, type Ref } from 'vue';
import { type Drive, type DriveDetail } from "./types"
import DriveCard from './DriveCard.vue';
import AddDrive from './AddDrive.vue';
import { useToast } from '@/components/ui/toast';
import Toaster from '@/components/ui/toast/Toaster.vue';
import FileObjects from '@/components/FileObjects.vue';
import DriveActions from './DriveActions.vue';

const { toast } = useToast()
const drives: Ref<Drive[]> = ref([])

const selectedDrive: Ref<DriveDetail | null> = ref(null)

const setDriveFileObjects = computed(() => {
  const objects = selectedDrive.value ? selectedDrive.value.storage_objects : []
  return objects
})


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
    <div :class="cn('w-full overflow-x-auto scrollbar-none')">
      <div v-if="selectedDrive">
        <FileObjects :assets="setDriveFileObjects" :driveUid="selectedDrive.uid" />
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
