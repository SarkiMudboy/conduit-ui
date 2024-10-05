<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-vue-next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import SearchMembers from './SearchMembers.vue'
import { ref } from 'vue'
import { protectedReq, type reqOptions } from '@/lib/utils'

const emit = defineEmits<{
  (e: 'drive-created', drive: object): void
}>()

const newDrive = ref<{ name: string; members: string[] }>({ name: '', members: [] })
const AddMember = (member: string) => {
  newDrive.value.members.push(member)
}

const addDrive = async () => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: 'http://localhost:8000/api/v1/drives/',
    method: 'POST'
  }
  await protectedReq(params).then((r) => {
    if (r.status == 200) {
      emit('drive-created', r.response)
    }
  })
}
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button class="mr-7"> New Drive </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle class="font-semibold text-lg md:text-2xl">Create a New Drive</DialogTitle>
        <DialogDescription> Set a name and add a friend </DialogDescription>
      </DialogHeader>
      <div class="grid gap-4 py-4">
        <div class="flex flex-row items-center gap-4">
          <Label for="name" class="text-right font-bold text-nowrap"> Drive Name </Label>
          <Input
            id="name"
            placeholder="Ex: My Images"
            class="col-span-3 w"
            v-model="newDrive.name"
          />
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
