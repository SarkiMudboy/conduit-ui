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
  <div>
    <Folder class="h-64 w-64" />
    <p class="mx-7 text-lg font-semibold">{{ object.resource.name }}</p>
  </div>
</template>
