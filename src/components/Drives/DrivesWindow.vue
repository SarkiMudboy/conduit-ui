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
import { useGlobalAssetStore } from '@/stores/globalAssetStore';
import { storeToRefs } from 'pinia';
import { useFileObjectStore } from '@/stores/files';
import type { FileObject } from '@/services/files/types';


const { toast } = useToast()
const filePathNavStore = useFileTreeContextStore()
const driveStore = useDriveStore()
const globalStore = useGlobalAssetStore()
const fileObjectStore = useFileObjectStore()
const { asset } = storeToRefs(globalStore)

var isMounted = ref(false)

await driveStore.dispatchGetDrives()
const drives = computed<Drive[]>(() => {
  return driveStore.drives
})

const selectedDrive: Ref<DriveDetail | null> = ref(null)
const selectedAssets: Ref<FileObject[]> = ref([])


const setDriveFileObjects = computed(() => {
  if (isMounted.value) {
    return selectedAssets.value
  }
  return []
})


watch(asset, async () => {
  // watch the global store for selected uploads and render the folder/drive containing the new assets
  if (!selectedDrive.value) {
    const obj = asset?.value

    if (!obj?.source && obj?.drive) {
      await getDriveAssets(obj.drive)
    } else if (obj?.source) {
      await getDriveAssets(obj.drive, obj.source)
    }
  }
})

const getDriveAssets = async (uid: string, fromSource?: string) => {

  const response = await driveStore.dispatchGetDriveAssets(uid)
  if (response.body) {
    selectedDrive.value = response.body
    selectedDrive.value && filePathNavStore.setNode({ uid: selectedDrive.value.uid, name: selectedDrive.value.name })
    fileObjectStore.initDirectories(selectedDrive.value.directories)
  } else {
    toast({
      title: "Get Drive Failed",
      description: "Couldn't fetch that drive",
      variant: "destructive"
    })
    return
  }

  if (fromSource) {
    const response = await fileObjectStore.loadFolderAssets(fromSource, uid)
    if (response.body) {
      selectedAssets.value = response.body.content ? response.body.content : selectedAssets.value
      await filePathNavStore.addNodes(selectedDrive.value.uid, fromSource)
    }
  } else {
    selectedAssets.value = selectedDrive.value && "storage_objects" in selectedDrive.value ? selectedDrive.value.storage_objects : []
  }
  isMounted.value = true
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
      <div v-if="selectedDrive && isMounted">
        <FileObjects :assets="setDriveFileObjects" />
      </div>
      <div v-else>
        <DriveActions>
          <AddDrive :userDrives="drives.map((drive) => drive.name)" @drive-created="addNewDrive" />
        </DriveActions>
        <div class=" flex flex-row flex-wrap gap-3 min-w-full p-1">
          <DriveCard v-for="drive in drives" :key="drive.uid" v-bind="drive" @drive-selected="getDriveAssets" />
        </div>
      </div>
    </div>
  </div>
  <Toaster />
</template>
