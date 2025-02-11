<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import FileIcon from '@/components/icons/FileIcon.vue';
import { useUploadFileStore, type FileObject } from '@/stores/uploadFileStore'

const fileStore = useUploadFileStore();
const fileNames = fileStore.selectedFiles.map(file => file.file.name).join(", ")
console.log(fileNames);

//const emit = defineEmits<{ (e: 'remove-file', name: string): void }>();
</script>

<template>
  <Button
    class="flex flex-col items-center justify-items-center w-full h-36 text-black bg-white border border-gray-400 border-solid hover:bg-white">
    <FileIcon />
    <p class="w-1/2 truncate">{{ fileNames }}</p>
  </Button>
</template>
