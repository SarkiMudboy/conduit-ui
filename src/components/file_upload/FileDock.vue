<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import FileIcon from '@/components/icons/FileIcon.vue';
import { X } from 'lucide-vue-next';
import { useUploadFileStore } from '@/stores/uploadFileStore'
import { computed, ref } from 'vue';


const fileStore = useUploadFileStore();
const selectedFiles = ref(fileStore.selectedFiles)
const emit = defineEmits<{ (e: 'clear-files'): void }>();

const selectedFileNames = computed(() => {
  return selectedFiles.value.map(file => file.file.name).join(", ")
})

const ClearFile = (id?: string) => {
  if (id) {
    selectedFiles.value.splice(selectedFiles.value.findIndex((file) => file.id === id), 1)
    fileStore.clearFiles(id)
  } else {
    selectedFiles.value = []
    fileStore.clearFiles()
  }
  emit('clear-files')
}

</script>

<template>
  <X class="absolute right-11 top-2/4 w-4 h-4" @click="ClearFile()" />
  <Button
    class="flex flex-col items-center justify-items-center h-36 w-full max-w-md text-black dark:text-white bg-transparent border border-gray-400 border-solid hover:bg-transparent">
    <span>
      <FileIcon class=" fill-black dark:fill-white" />
    </span>
    <p class="w-1/2 truncate">{{ selectedFileNames }}</p>
  </Button>
</template>
