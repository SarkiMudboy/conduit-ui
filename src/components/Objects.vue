<script setup lang="ts">
import Folder from './icons/Folder.vue'
import File from './icons/File.vue'
import { computed } from 'vue'

const object = defineProps({
  resource: {
    type: Object,
    required: true
  }
})
const objType = computed(() => {
  if (!object.resource.is_directory) return File
  else return Folder
})
</script>

<template>
  <div class="flex flex-col items-center">
    <component :is="objType" class="w-full h-auto cursor-pointer"
      @click="$emit('selectedObject', object.resource.uid, 'object')" />
    <p class="text-lg font-semibold">{{ object.resource.name }}</p>
  </div>
</template>
