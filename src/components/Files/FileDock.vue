<script setup lang="ts">
import Button from '@/components/ui/button/Button.vue';
import FileIcon from '@/components/icons/FileIcon.vue';
import { X } from 'lucide-vue-next';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useUploadFileStore } from '@/stores/uploadFileStore'
import { computed, ref } from 'vue';
import { calculateFileSize } from '@/lib/utils';


const fileStore = useUploadFileStore();
const f = fileStore.files
const selectedFiles = ref(f)
const isFolderUpload = fileStore.isFolderUpload()
const emit = defineEmits<{ (e: 'clear-files'): void }>();

const openfileList = ref(false)

const setOpenFileList = () => {
  if (!isFolderUpload) {
    openfileList.value = true
  }
}

const selectedFileNames = computed(() => {
  return selectedFiles.value.map(file => file.file.name).join(", ")
})

const ClearFile = (id?: string) => {
  if (id) {
    fileStore.clearFiles(id)
  } else {
    selectedFiles.value = []
    fileStore.clearFiles()
    emit('clear-files')
  }
}

</script>

<template>
  <X class="absolute right-11 top-2/4 w-4 h-4" @click="ClearFile()" />
  <Popover v-model:open="openfileList">
    <PopoverTrigger as-child>
      <Button
        class="flex flex-col items-center justify-items-center h-36 w-full max-w-md text-black dark:text-white bg-transparent border border-gray-400 border-solid hover:bg-transparent"
        @mouseenter="setOpenFileList">
        <span>
          <FileIcon class=" fill-black dark:fill-white" />
        </span>
        <p class="w-1/2 truncate">{{ selectedFileNames }}</p>
      </Button>
    </PopoverTrigger>
    <PopoverContent side="right" align="start">
      <ScrollArea :class="['max-h-72', { 'h-72': selectedFiles.length > 7 }]">
        <div v-for="file in selectedFiles" :key="file.data.id">
          <div class="grid grid-cols-5">
            <div class="text-sm font-bold truncate col-span-3">
              {{ file.file.name }}
            </div>
            <span class="text-sm">{{ calculateFileSize(file.file.size) }}</span>
            <X class="w-4 h-4 justify-self-end" @click="ClearFile(file.data.id)" />
          </div>
          <hr v-if="selectedFiles.indexOf(file) != selectedFiles.length - 1"
            style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
        </div>
      </ScrollArea>
    </PopoverContent>
  </Popover>
</template>
