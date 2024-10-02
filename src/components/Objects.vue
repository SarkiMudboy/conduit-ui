<script setup lang="ts">
import Folder from './icons/Folder.vue'

const object = defineProps({
  resource: {
    type: Object,
    required: true
  }
})
</script>

<template>
  <div class="flex flex-col">
    <Folder
      class="h-32 w-32 cursor-pointer"
      @click="$emit('selectedObject', object.resource.uid, 'object')"
    />
    <p class="text-lg font-semibold">{{ object.resource.name }}</p>
  </div>
</template>
