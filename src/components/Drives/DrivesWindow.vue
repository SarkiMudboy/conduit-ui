<script setup lang="ts">
import { cn } from '@/lib/utils';
import { computed, ref, watch, type Ref } from 'vue';
import type { Drive, DriveDetail } from '@/services/drives/types';
import DriveCard from './DriveCard.vue';
import AddDrive from './AddDrive.vue';
import { useToast } from '@/components/ui/toast';
import Toaster from '@/components/ui/toast/Toaster.vue';
import FileObjects from '@/components//Files/FileObjects.vue';
import DriveActions from './DriveActions.vue';
import { useFileTreeContextStore } from '@/stores/fileTreeContextStore';
import { useDriveStore } from '@/stores/drives';
import { useGlobalAssetStore, type GlobalAsset } from '@/stores/globalAssetStore';
import { storeToRefs } from 'pinia';
import { useFileObjectStore } from '@/stores/files';


const { toast } = useToast()
const filePathNavStore = useFileTreeContextStore()
const driveStore = useDriveStore()
const globalStore = useGlobalAssetStore()
const fileObjectStore = useFileObjectStore()
const { asset } = storeToRefs(globalStore)


await driveStore.dispatchGetDrives()
const drives = computed<Drive[]>(() => {
  return driveStore.drives
})

const selectedDrive: Ref<DriveDetail | null> = ref(null)

const setDriveFileObjects = computed(() => {
  return selectedDrive.value && "storage_objects" in selectedDrive.value ? selectedDrive.value.storage_objects : []
})


watch(asset, async () => {
  const obj = asset?.value
  if (!obj?.source && obj?.drive) {
    console.log(asset.value)
    await getDriveAssets(obj.drive)
  } else if (obj?.source) {

    const response = await fileStore.loadFolderAssets(folder.uid, drive.uid)
    if (response.body) {
      selectedDrive.value = {}
    }
  }
  //}
})

//watch(() => globalStore.asset, () => {
//console.log("HELLOOOO")
//if (!newFileObject.source && newFileObject.drive) {
//  await getDriveAssets(newFileObject.drive)
//}
//})

const getDriveAssets = async (uid: string) => {

  const response = await driveStore.dispatchGetDriveAssets(uid)
  if (response.body) {
    selectedDrive.value = response.body
    // for the path up top
    if (selectedDrive.value) {
      filePathNavStore.setNode({ uid: selectedDrive.value.uid, name: selectedDrive.value.name })
    }
  } else {
    toast({
      title: "Get Drive Failed",
      description: "Couldn't fetch that drive",
      variant: "destructive"
    })
  }
}

const addNewDrive = (drive: Drive) => {
  toast({
    title: 'Drive created',
    description: `${drive.name} added!`
  })
}

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
