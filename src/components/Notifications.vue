<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { API } from '@/services'
import { ref, type Ref } from 'vue';
import { type DriveNotification } from '@/services/notifications/types';
import { useCurrentUserStore } from '@/stores/userStore';
import Button from '@/components/ui/button/Button.vue';
import { Bell } from 'lucide-vue-next';


const userStore = useCurrentUserStore()
const currentUser = userStore.getUser()
const notifications: Ref<DriveNotification[]> = ref([])

function getNoun(author: { uid: string, tag: string }) {
  if (currentUser && author.uid === currentUser.uid) return "You"
  else return author.tag
}

async function fetchDriveNotifications() {
  const { status, data } = await API.notifications.getNotifications()
  if (status === 200) notifications.value = data
}
await fetchDriveNotifications()
</script>

<template>
  <Popover>
    <PopoverTrigger>
      <Button variant="ghost" size="icon">
        <Bell class="h-4 w-4" />
      </Button>
    </PopoverTrigger>
    <PopoverContent>
      <div v-for="notif in notifications" class="hover:bg-gray-200" :key=notif.uid>
        <p>
          <span class="font-bold">{{ notif.author.tag }}</span> added some files to {{ notif.drive.name }} <span
            v-if="notif.note">saying <span class="w-2 font-bold text-wrap">{{
              notif.note }}</span></span>
        </p>
        <hr v-if="notifications.indexOf(notif) != notifications.length - 1"
          style="border: none; border-top: 1px solid #ccc; margin: 10px 0;">
      </div>
    </PopoverContent>
  </Popover>
</template>
