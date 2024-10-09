<script setup lang="ts">
import { computed, ref } from 'vue'
import {
  ComboboxAnchor,
  ComboboxContent,
  ComboboxInput,
  ComboboxPortal,
  ComboboxRoot
} from 'radix-vue'
import { CommandEmpty, CommandGroup, CommandItem, CommandList } from '@/components/ui/command'
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText
} from '@/components/ui/tags-input'
import Button from './ui/button/Button.vue'
import { protectedReq, type reqOptions } from '@/lib/utils'

type User = {
  uid: string
  tag: string
  avatar: string
}

const foundUsers = ref<User[]>([])
const notFound = ref(false)
const selectedUsers = ref<string[]>([])
const open = ref(false)
const searchTerm = ref('')

const errorMessage = ref('')

const emit = defineEmits<{
  (e: 'member-selected', uid: string): void
}>()

const handleSearchTerm = (e: Event) => {
  const target = e.target as HTMLInputElement
  searchTerm.value = target.value
  errorMessage.value = errorMessage.value != '' ? '' : errorMessage.value
}

const searchUser = async () => {
  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')
  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: `http://localhost:8000/api/v1/users/search/?key=${searchTerm.value}`,
    method: 'GET'
  }
  await protectedReq(params).then((r) => {
    foundUsers.value = r.response
    if (r.response.length == 0) notFound.value = true
    open.value = true
  })
}

const filteredUsers = computed(() =>
  foundUsers.value.filter((i) => !selectedUsers.value.includes(i.uid))
)
</script>

<template>
  <div class="col-start-2 col-span-4">
    <TagsInput class="px-0 gap-0" :model-value="selectedUsers">
      <div class="flex gap-2 flex-wrap items-center">
        <TagsInputItem v-for="item in selectedUsers" :key="item" :value="item" class="mx-0.5">
          <TagsInputItemText />
          <TagsInputItemDelete />
        </TagsInputItem>
      </div>

      <ComboboxRoot
        v-model="selectedUsers"
        v-model:open="open"
        :searchTerm="searchTerm"
        class="w-full"
      >
        <ComboboxAnchor as-child>
          <ComboboxInput placeholder="Search email or tag" as-child>
            <TagsInputInput
              class="w-full px-3"
              :class="selectedUsers.length > 0 ? 'mt-2' : ''"
              @keydown.enter.prevent
              @input="handleSearchTerm"
            />
          </ComboboxInput>
        </ComboboxAnchor>

        <ComboboxContent>
          <CommandList
            position="popper"
            class="w-[--radix-popper-anchor-width] rounded-md mt-2 border bg-popover text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2"
          >
            <CommandEmpty v-if="notFound"> User not found </CommandEmpty>
            <CommandGroup>
              <CommandItem
                v-for="user in filteredUsers"
                :key="user.uid"
                :value="user.tag"
                @select.prevent="
                  (ev) => {
                    if (typeof ev.detail.value === 'string') {
                      searchTerm = ''
                      notFound = false
                      open = false
                      if (!selectedUsers.includes(user.tag)) selectedUsers.push(user.tag)
                      else {
                        errorMessage = 'User has already been selected'
                      }
                      emit('member-selected', user.uid)
                    }
                    if (filteredUsers.length === 0) {
                      open = false
                    }
                  }
                "
              >
                {{ user.tag }}
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </ComboboxContent>
      </ComboboxRoot>
    </TagsInput>
  </div>
  <Button variant="outline" @click="searchUser">Search</Button>
  <p v-if="errorMessage != ''" class="col-span-4 ml-[90px] text-sm text-red-500">
    {{ errorMessage }}
  </p>
</template>
