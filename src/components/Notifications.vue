<script setup lang="ts">
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { computed } from 'vue';
import { useCurrentUserStore } from '@/stores/userStore';
import Button from '@/components/ui/button/Button.vue';
import { Bell } from 'lucide-vue-next';
import { cn } from '@/lib/utils';
import { useNotificationStore } from '@/stores/notificationStore';
import { useFileObjectStore } from '@/stores/files';
import { useDriveStore } from '@/stores/drives';
import type { DriveNotification } from '@/services/notifications/types';
import type { FileObjectView } from '@/services/files/types';
import { useGlobalAssetStore } from '@/stores/globalAssetStore';


const userStore = useCurrentUserStore()
const notifStore = useNotificationStore()
//const fileObjectStore = useFileObjectStore()
//const driveStore = useDriveStore()
const currentUser = userStore.getUser()
const globalAssetStore = useGlobalAssetStore()

const notifications = computed(() => {
  //return notifStore.notifications

  return [
    {
      uid: "83838383838",
      author: {
        uid: "gdgdgdgdg",
        tag: "hdhdhdh",
      },
      drive: {
        uid: "wewewew",
        name: 'kddkkdk',
      },
      note: "eeeee",
      source: "",
      read: false,
      created_at: "lololo",
    }
  ]
})

function getNoun(author: { uid: string, tag: string }) {
  return currentUser && (author.uid === currentUser.uid) ? "You" : author.tag
}

async function handleNotificationClick(notification_uid: string) {

  const n = notifStore.getNotification(notification_uid) as DriveNotification
  if (!n) {
    //globalAssetStore.setAsset({ source: n.source, drive: n.drive.uid })

    globalAssetStore.setAsset({ source: "f9650604-536a-4f4f-bd4f-e7b87470467d", drive: "07d2335e-cd0f-4a54-be36-14bea7ae2aeb" })
  } else {
    //globalAssetStore.setAsset({ drive: n.drive.uid })
    globalAssetStore.setAsset({ source: "f9650604-536a-4f4f-bd4f-e7b87470467d", drive: "07d2335e-cd0f-4a54-be36-14bea7ae2aeb" })
  }
  await notifStore.dispatchMarkAsRead(notification_uid)
}

await notifStore.dispatchGetNotifications()
</script>

<template>
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" size="icon" class="relative">
        <Bell class="h-5 w-5" />
        <span v-if="notifications.length > 0"
          class="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-primary-foreground dark:text-white">
          {{ notifications.length }}
        </span>
      </Button>
    </PopoverTrigger>
    <PopoverContent class="w-80 p-0" align="end">
      <Card class="border-0">
        <CardHeader class="pb-3">
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent class="max-h-[300px] overflow-auto p-0">
          <div v-if="notifications.length > 0" class="divide-y">
            <div v-for="notif in notifications" :key="notif.uid"
              :class="cn('cursor-pointer p-4 transition-colors hover:bg-muted', !notif.read && 'bg-muted/50')"
              @click="handleNotificationClick(notif.uid)">
              <div class="flex items-start gap-2">
                <div class="flex-1 space-y-1">
                  <p class="text-sm text-muted-foreground">
                    <span class="font-bold">{{ getNoun({ uid: notif.author.uid, tag: notif.author.tag }) }}</span> added
                    some files to {{ notif.drive.name }}
                    <span v-if="notif.note">saying <span class="w-2 font-bold text-wrap">{{ notif.note }}</span></span>
                  </p>
                </div>
                <span v-if="!notif.read" class="mt-1 h-2 w-2 rounded-full bg-red-500" />
              </div>
            </div>
          </div>
          <p v-else class="py-6 text-center text-muted-foreground">No notifications</p>
        </CardContent>
      </Card>
    </PopoverContent>
  </Popover>
</template>
