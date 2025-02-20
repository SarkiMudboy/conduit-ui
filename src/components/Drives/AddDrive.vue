<script setup lang="ts">
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import DialogClose from '@/components/ui/dialog/DialogClose.vue'
import { X, Plus } from 'lucide-vue-next'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SearchMembers from '@/components/SearchMembers.vue'
import { ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'
import { type Drive } from './types'
import Button from '@/components/ui/button/Button.vue'

const emit = defineEmits<{
  (e: 'drive-created', drive: Drive): void
}>()

const props = defineProps<{ userDrives: string[] }>()

const isOpen = ref(false)
const hasError = ref(false)
const errorMessage = ref('')

const setIsOpen = (value: boolean) => {
  isOpen.value = value
}

const openDialog = () => {
  isOpen.value = true
}

const closeDialog = () => {
  isOpen.value = false
}

const validateInput = () => {
  if (props.userDrives.includes(newDrive.value.name)) {
    hasError.value = true
    errorMessage.value = 'Drive with that name already exists!'
  } else {
    hasError.value = false
    errorMessage.value = ''
  }
}

const newDrive = ref<{ name: string; members: string[] }>({ name: '', members: [] })
const AddMember = (member: string) => {
  newDrive.value.members.push(member)
}

const addDrive = async () => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: { name: newDrive.value.name, members: newDrive.value.members },
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/drives/',
    method: 'POST'
  }
  await protectedReq(params).then((r) => {
    if (r.status == 201) {
      emit('drive-created', r.response)
      closeDialog()
    }
  })
}
</script>

<template>
  <Dialog :open="isOpen" @update:open="setIsOpen">
    <DialogTrigger as-child>
      <Button class="gap-2" @click="openDialog">
        <Plus class="h-4 w-4" />
        New Drive
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogClose
        class="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none hover:ring-2 hover:ring-ring hover:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
        @click="closeDialog">
        <X class="w-4 h-4" />
        <span class="sr-only">Close</span>
      </DialogClose>
      <DialogHeader>
        <DialogTitle class="font-semibold text-lg md:text-2xl">Create a New Drive</DialogTitle>
        <DialogDescription> Set a name and add a friend </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div>
          <div class="flex flex-row items-center gap-4">
            <Label for="name" class="text-right font-bold text-nowrap"> Drive Name </Label>
            <Input id="name" placeholder="Ex: My Images" :class="[
              'col-span-3',
              {
                'border-red-500 ring-2 ring-red-500 focus:border-red-500 focus:ring-red-500':
                  hasError
              }
            ]" required v-model="newDrive.name" @input="validateInput" />
          </div>
          <p v-if="hasError" class="ml-[100px] mt-2 w-1/2 text-sm text-red-500">
            {{ errorMessage }}
          </p>
        </div>

        <div class="grid grid-cols-6 items-center gap-4">
          <Label for="username" class="text-right font-bold"> Members </Label>
          <SearchMembers @member-selected="AddMember" />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" @click="addDrive"> Add </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
