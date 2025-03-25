<script setup lang="ts">
import Folder from '@/components/icons/Folder.vue'
import File from '@/components/icons/File.vue'
import { type FileObject } from '@/services/files/types';
import { calculateFileSize } from '@/lib/utils';
import { ref, type Ref } from 'vue';
import UploadFile from './UploadFile.vue';
import FolderNav from '@/components/FolderNav.vue';
import { useFileTreeContextStore, type ObjectNode } from '@/stores/fileTreeContextStore';
import { useDriveStore } from '@/stores/drives';
import { useFileObjectStore } from '@/stores/files';
import { toast } from '@/components/ui/toast';
import Menu from './Menu.vue';


const props = defineProps<{ assets: FileObject[] }>()
const filePathNavStore = useFileTreeContextStore()
const drive = filePathNavStore.filePath[0]

const { dispatchGetDriveAssets } = useDriveStore()
const fileStore = useFileObjectStore()

const objType = (fileObject: FileObject) => {
  if (!fileObject.is_directory) return File
  else return Folder
}

const assets: Ref<FileObject[]> = ref(props.assets)
const parent = ref(drive.uid)

const selectObject = (obj: FileObject) => {
  if (obj.is_directory) loadFolderAssets({ uid: obj.uid, name: obj.name })
}

async function checkAsset(source: string | ObjectNode) {

  if (typeof source == "string") {
    const response = await dispatchGetDriveAssets(source)
    if (response.body) {
      assets.value = response.body.storage_objects
      parent.value = source
      filePathNavStore.setNode({ uid: source, name: response.body.name })
    }
  } else loadFolderAssets(source)

}

const loadFolderAssets = async (folder: ObjectNode) => {

  const response = await fileStore.loadFolderAssets(folder.uid, drive.uid)
  if (response.body) {
    assets.value = response.body.content ? response.body.content : assets.value
    parent.value = folder.uid
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
  <div v-if="assets.length > 0" class="flex flex-wrap mt-5 gap-3 min-w-full p-1">
    <div v-for="obj in assets" :key="obj.uid">
      <Menu>
        <div :class="['flex flex-col', 'items-center', { 'cursor-pointer': (objType(obj) == Folder) }]">
          <component :is="objType(obj)" @click="selectObject(obj)" />
          <p class="text-lg font-mono font-light w-40 text-center truncate">{{ obj.name }}</p>
          <p class="font-light font-mono text-gray-300">{{ calculateFileSize(obj.size) }}</p>
        </div>
      </Menu>
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
