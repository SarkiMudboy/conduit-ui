<script setup lang="ts">
import Folder from '@/components/icons/Folder.vue'
import File from '@/components/icons/File.vue'
import { type FileObject } from '@/services/files/types';
import { calculateFileSize } from '@/lib/utils';
import { ref, computed, type Ref, watch } from 'vue';
import UploadFile from './UploadFile.vue';
import FolderNav from '@/components/FolderNav.vue';
import { useFileTreeContextStore, type ObjectNode } from '@/stores/fileTreeContextStore';
import { useDriveStore } from '@/stores/drives';
import { useFileObjectStore } from '@/stores/files';
import { toast } from '@/components/ui/toast';
import Menu from './Menu.vue';
import NewAssetBadge from './NewAssetBadge.vue';
import { useGlobalAssetStore } from '@/stores/globalAssetStore';
import { useNotificationStore } from '@/stores/notificationStore';
import { storeToRefs } from 'pinia';


const props = defineProps<{ assets: FileObject[] }>()
const filePathNavStore = useFileTreeContextStore()
const driveStore = useDriveStore()
const drive = filePathNavStore.filePath[0]
const notificationStore = useNotificationStore()


const { dispatchGetDriveAssets } = useDriveStore()
const fileStore = useFileObjectStore()
const globalStore = useGlobalAssetStore()

const { asset } = storeToRefs(globalStore)


watch(asset, async () => {
  // watch the global store for selected uploads and render the folder/drive containing the new assets
  const obj = asset.value
  if (!obj?.source && obj?.drive) {
    const response = await driveStore.dispatchGetDriveAssets(obj.drive)
    if (response.body) {
      assets.value = response.body.storage_objects
      filePathNavStore.setNode({ uid: obj.drive, name: response.body.name })
    }
  } else if (obj?.source) {
    const response = await fileStore.loadFolderAssets(obj.source, obj.drive)
    if (response.body) {
      assets.value = response.body.content ? response.body.content : assets.value
      filePathNavStore.addNodes(obj.drive, obj.source)
    }
  }

})


const objType = (fileObject: FileObject) => {
  if (!fileObject.is_directory) return File
  else return Folder
}

const assets: Ref<FileObject[]> = ref(props.assets)
const setAssets = computed(() => {
  return assets.value
})

const selectObject = (obj: FileObject) => {
  if (obj.is_directory) loadFolderAssets({ uid: obj.uid, name: obj.name })
}

async function checkAsset(source: string | ObjectNode) {

  if (typeof source == "string") {
    const response = await dispatchGetDriveAssets(source)
    if (response.body) {
      assets.value = response.body.storage_objects
      filePathNavStore.setNode({ uid: source, name: response.body.name })
    }
  } else loadFolderAssets(source)

}

const loadFolderAssets = async (folder: ObjectNode) => {

  const response = await fileStore.loadFolderAssets(folder.uid, drive.uid)
  if (response.body) {
    assets.value = response.body.content ? response.body.content : assets.value
    filePathNavStore.setNode(folder)
  } else {
    toast({
      title: "Get Files Failed",
      description: "Couldn't fetch files",
      variant: "destructive"
    })
  }
}

</script>

<template>
  <FolderNav @node-selected="checkAsset">
    <UploadFile />
  </FolderNav>
  <div v-if="setAssets.length > 0" class="flex flex-wrap mt-5 gap-3 min-w-full p-1">
    <div v-for="obj in setAssets" :key="obj.uid">
      <NewAssetBadge :assetId="obj.uid" :isNew="notificationStore.isNewAsset(obj.uid)" :isFolder="obj.is_directory">
        <Menu :driveId="drive.uid" :assetData="{ assetId: obj.uid, assetName: obj.name, isDir: obj.is_directory }">
          <div :class="['flex flex-col', 'items-center', { 'cursor-pointer': (objType(obj) == Folder) }]">
            <component :is="objType(obj)" @click="selectObject(obj)" />
            <p class="text-lg font-mono font-light w-40 text-center truncate">{{ obj.name }}</p>
            <p class="font-light font-mono text-gray-300">{{ calculateFileSize(obj.size) }}</p>
          </div>
        </Menu>
      </NewAssetBadge>
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
