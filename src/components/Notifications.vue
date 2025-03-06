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

const userStore = useCurrentUserStore()
const currentUser = userStore.getUser()
const notifications: Ref<DriveNotification[]> = ref([])

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
      <div v-for="notif in notifications" class="" :key=notif.uid>
        <p>
          {{ notif.author }} added some files to {{ notif.drive }} <span v-if="notif.note">saying <span
              class="text-sm truncate">{{
                notif.note }}</span></span>
        </p>
      </div>
    </PopoverContent>
  </Popover>
</template>
