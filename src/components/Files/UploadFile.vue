<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { X } from 'lucide-vue-next';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Switch } from '@/components/ui/switch';
import { useUploadFileStore } from '@/stores/uploadFileStore'
import { useFileTreeContextStore } from '@/stores/fileTreeContextStore';

import { ref, type Ref } from 'vue';
import Button from '@/components/ui/button/Button.vue';
import UploadIcon from '@/components/icons/UploadIcon.vue';
import FileDock from './FileDock.vue';
import { useToast } from '@/components/ui/toast';

const fileDropActive = ref(false)
const filePathNav = useFileTreeContextStore()

const { toast } = useToast()
const fileUploadStore = useUploadFileStore()

const note = ref('') // bind to note elem and in preloadFilesPresignedURLs add the note to store, add to payload
const fileSelected: Ref<boolean> = ref(false)
const inputRef: Ref<HTMLInputElement | null> = ref(null);

const isFolderUpload = ref(false);
const isOpen = ref(false)

const setIsOpen = (value: boolean) => {
  isOpen.value = value
}

const openFileUploadDialog = () => {
  setIsOpen(true);
}

const closeFileUploadDialog = () => {
  setIsOpen(false);
}
const setFileSelected = (selected: boolean) => {
  fileSelected.value = selected;
}
const toggleUploadType = () => {
  isFolderUpload.value = isFolderUpload.value ? false : true;
}

const handleUploadInputClick = (e: MouseEvent | KeyboardEvent) => {
  e.preventDefault()
  inputRef.value ? inputRef.value.click() : null;
}

const formSchema = toTypedSchema(z.object({
  note: z.string().min(0).max(2500),
  files: z.array(z.instanceof(File)).min(1, 'Select a file').max(40, 'Max files exeeded'),
}))

const { isFieldDirty, handleSubmit } = useForm({
  validationSchema: formSchema,
})

const onSubmit = handleSubmit((values) => {
  initiateUpload()
})


const clearFiles = () => {
  setFileSelected(false);
}

const preloadFilesPresignedURLs = async (fileList: File[]) => {

  const selectedDrive = filePathNav.filePath[0]
  const currentResource = filePathNav.filePath.length > 1 ? filePathNav.filePath[filePathNav.filePath.length - 1] : { uid: null }

  fileUploadStore.clearFiles()
  const isBulk = !fileList.every((f) => f.webkitRelativePath.includes('/'))

  fileUploadStore.addFiles(fileList, (currentResource.uid == selectedDrive.uid))
  setFileSelected(true)

  if (fileUploadStore.files) {
    const response = await fileUploadStore.dispatchGetPresignedURLS(
      selectedDrive.uid,
      isBulk,
      currentResource.uid
    )

    if (!response.body)
      toast({
        title: 'Failed to upload',
        description: `Something went wrong`,
        variant: 'destructive'
      })

  }
}

const handleFileChange = async (e: any /* change to HTML Event */) => {

  (note.value && fileUploadStore.setUploadData("note", note.value))

  if (e.target.files) {

    const files: File[] = Array.from(e.target.files)
    await preloadFilesPresignedURLs(files)

  } else setFileSelected(false);
}

const initiateUpload = async () => {

  closeFileUploadDialog()

  fileUploadStore.files.forEach(async (file) => {

    if (file.data.metadata) {
      file.data.metadata['x-amz-meta-file_path'] = file.data.path as string
      file.data.metadata['x-amz-meta-filesize'] = file.file.size.toString()
    }

    const response = await fileUploadStore.dispatchUploadFiles(file)
    if (response.body) {
      toast(
        {
          title: 'File uploaded',
          description: `${file.file.name} has been uploaded sucessfully`
        })
    } else {
      toast({
        title: 'Failed upload',
        description: `Failed to upload ${file.file.name}`,
        variant: 'destructive'
      })
    }
  })

  fileUploadStore.clearFiles()

}

// drag files event handlers 

const handleFileDrop = (event: DragEvent) => {

  event.preventDefault()
  fileDropActive.value = false

  let files: File[] = []

  if (event.dataTransfer?.files) {
    files = [...event.dataTransfer.files]

  } else if (event.dataTransfer?.items) {

    [...event.dataTransfer.items].forEach((item) => {

      if (item.kind === "file") {
        const file = item.getAsFile() as File;
        files.push(file)
      }
    })
  }
  preloadFilesPresignedURLs(files)
}

const toggleFileDropActive = () => fileDropActive.value = !fileDropActive.value

</script>
<template>
  <Dialog :open="isOpen" @update:open="setIsOpen">
    <DialogTrigger as-child>
      <Button variant="outline" class="gap-2 bg-gray-800 hover:bg-gray-500 text-white hover:text-white"
        @click="openFileUploadDialog">
        <svg class="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <path d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Add File
      </Button>
    </DialogTrigger>
    <DialogContent class="px-8">
      <DialogClose @click="closeFileUploadDialog"
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
        <X class="w-4 h-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
      <DialogHeader>
        <DialogTitle class="font-semibold text-lg md:text-2xl">Upload Files</DialogTitle>
      </DialogHeader>
      <form @submit="onSubmit">
        <FormField name="note" v-slot="{ componentField }" :validate-on-blur="!isFieldDirty">
          <FormItem>
            <FormLabel class="font-bold mt-5">Note
            </FormLabel>
            <FormControl>
              <textarea
                class='flex h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
                v-bind="componentField" v-model="note"></textarea>
            </FormControl>
            <FormDescription>
              Add a message for recipients
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <FormField name="files" v-slot="{ componentField }" :validate-on-blur="!isFieldDirty">
          <FormItem class="mt-10">
            <FormLabel class="font-bold">Upload File
            </FormLabel>
            <FormControl>
              <input v-if="isFolderUpload" style="display: none;" id="file-upload" type="file" ref="inputRef" multiple
                webkitdirectory @change="handleFileChange" v-bind="componentField" />
              <input v-else style="display: none;" id="file-upload" type="file" ref="inputRef" multiple
                @change="handleFileChange" v-bind="componentField" />
              <Button v-if="!fileSelected"
                :class="['flex', 'flex-col', 'items-center', 'justify-items-center', 'w-full', 'max-w-md', 'h-36', 'text-black', 'dark:text-white', 'bg-transparent', 'border', 'border-gray-400', 'border-dashed', 'hover:bg-transparent]', { 'border-solid border-green-400 border-4': fileDropActive }]"
                @click="handleUploadInputClick" @drop="handleFileDrop" @dragover.prevent
                @dragenter="toggleFileDropActive" @dragleave="toggleFileDropActive">
                <span class="dark:text-white">
                  <UploadIcon />
                </span>Upload</Button>
              <FileDock v-else @clear-files="clearFiles" />
            </FormControl>
            <FormDescription>
              Add files or folder
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
        <div class="flex flex-row mt-5 space-x-4">
          <p class="font-medium">Folder upload</p>
          <Switch :checked="isFolderUpload" @update:checked="toggleUploadType" />
        </div>
        <DialogFooter>
          <Button class="mt-5" type="submit">
            Send
          </Button>
        </DialogFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
