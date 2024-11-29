<script setup lang="ts">
import { computed, reactive, ref, shallowRef, type Ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'
import DriveCard from './DriveCard.vue'
import Objects from './Objects.vue'
import Button from '@/components/ui/button/Button.vue'
import AddDrive from './AddDrive.vue'

import { useToast } from '@/components/ui/toast/use-toast'
import { Toaster } from '@/components/ui/toast'

import { Input } from '@/components/ui/input'
import { getAWSUploadPresignedURL, uploadFileToS3 } from '@/lib/uploads/fileUpload'

type base = {
  name: string
  size: number
  uid: string
  used: number
}

export type Drive = base & {
  type: 'shared' | 'personal'
}

type StorageObjects = base & {
  metadata: object
  path: string | null
}

type FileData = {
  filename: string
  filesize: number
  metadata: object
}

type FileResourceData = {
  resource_uid?: string
  file: FileData
}

// type Object = base & {
//   members: string[]
// }

const objects: Ref<Drive[] | StorageObjects[]> = ref([])

const configForComponents: {
  [key: string]: {
    component: object
    grid: string
  }
} = {
  drive: {
    component: DriveCard,
    grid: 'grid grid-cols-3 gap-4'
  },
  storageObject: {
    component: Objects,
    grid: 'grid grid-cols-7 gap-4'
  }
}

interface Resource {
  uid:
    | string
    | null /* if the resource is a storage object i.e folder , the uid of the object is attached else its set to null. 
  This helps us to diff between when we are in a folder and drive root */
  name: string
  title: string
}

const { toast } = useToast()

const currentResource: Ref<Resource> = ref({
  uid: null,
  name: 'drive',
  title: 'Your Drives'
})
const selectedDrive = ref('')

const fileUploadData: {
  file: File
  fileURL: string
  uploadPresignedURL: string
  eagerLoadUrlPromise: Promise<String> | null
} = reactive({
  file: new File(['content'], 'example.txt', { type: 'text/plain' }),
  fileURL: '',
  uploadPresignedURL: '',
  eagerLoadUrlPromise: null
})

const getObject = async (uid: string, objtype: 'drive' | 'object') => {
  let path = 'http://localhost:8000/api/v1/drives/'

  if (objtype === 'drive') {
    selectedDrive.value = uid
    path += uid
  } else path += `${selectedDrive.value}/objects/${uid}`

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: path,
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    if (r.status == 200) {
      currentResource.value = {
        uid: uid,
        name: 'storageObject',
        title: r.response.name
      }

      objtype === 'drive'
        ? (objects.value = r.response.storage_objects)
        : (objects.value = r.response.content)
    }
  })
}

const appendNewDrive = (drive: Drive) => {
  if (currentResource.value.name == 'drive') {
    ;(objects.value as Drive[]).push(drive)
    toast({
      title: 'Drive created',
      description: `${drive.name} added!`
    })
  }
}

const renderGrid = computed(() => {
  return configForComponents[currentResource.value.name].grid
})

const renderComponent = computed(() => {
  return configForComponents[currentResource.value.name].component
})

const handleFileChange = async (e: any /* change to HTML Event */) => {
  if (e.target.files) {
    fileUploadData.file = e.target.files[0]
    fileUploadData.fileURL = URL.createObjectURL(fileUploadData.file as File)
    console.log(fileUploadData.fileURL)

    if (fileUploadData.file) {
      fileUploadData.eagerLoadUrlPromise = getAWSUploadPresignedURL(
        fileUploadData.file,
        selectedDrive.value,
        currentResource.value.uid
      )
    }
  }
}

export const initiateUpload = async () => {
  if (fileUploadData.eagerLoadUrlPromise) {
    const url = await fileUploadData.eagerLoadUrlPromise.then((url) => String(url))
    await uploadFileToS3(url, fileUploadData.file)
  } else {
    // toast error here
    console.log('Error getting URL')
  }
}

async function listDrives() {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/drives/',
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    objects.value = r.response
  })
}
await listDrives()
</script>
<template>
  <div class="flex items-center justify-between">
    <h1 class="text-lg font-semibold md:text-2xl">{{ currentResource.title }}</h1>
    <AddDrive
      v-if="currentResource.name == 'drive'"
      @drive-created="appendNewDrive"
      :userDrives="objects.map((drive) => drive.name)"
    />
  </div>
  <div>
    <ul v-if="objects.length > 0" :class="renderGrid">
      <component
        :is="renderComponent"
        v-for="obj in objects"
        :key="obj.uid"
        :resource="obj"
        @selected-object="getObject"
      />
    </ul>
    <div v-else class="flex flex-col items-center gap-1 text-center mt-9">
      <h3 class="text-2xl font-bold tracking-tight">You have no files</h3>
      <div class="grid w-full max-w-sm items-center gap-1.5">
        <p class="text-sm text-muted-foreground">
          Share files with members by uploading a new file
        </p>
      </div>
      <form class="mt-5">
        <Input id="file-upload" type="file" @change="handleFileChange" />
        <Button class="mt-4" @click="initiateUpload">Add file</Button>
      </form>
    </div>
  </div>
  <Toaster />
</template>
