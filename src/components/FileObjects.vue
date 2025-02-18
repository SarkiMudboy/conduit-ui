<script setup lang="ts">
import Folder from './icons/Folder.vue'
import File from './icons/File.vue'
import { type FileObject } from './Drives/types'
import NoData from './illustrations/NoData.vue';
import { calculateFileSize } from '@/lib/utils';

const props = defineProps<{ assets: FileObject[] }>()

const objType = (fileObject: FileObject) => {
  if (!fileObject.is_directory) return File
  else return Folder
}


</script>

<template>
  <div v-if="props.assets.length > 0" class="flex gap-3 min-w-full p-1">
    <div v-for="obj in props.assets" :key="obj.uid">
      <div class="flex flex-col items-center cursor-pointer">
        <component :is="objType(obj)" @click="$emit('selectedObject', obj.uid, 'object')" />
        <p class="text-lg font-mono font-light">{{ obj.name }}</p>
        <p class="font-light font-mono text-gray-300">{{ calculateFileSize(obj.size) }}</p>
      </div>
    </div>
  </div>
  <NoData v-else />
</template>
