<script setup lang="ts">
import { useNotificationStore } from '@/stores/notificationStore';

const props = defineProps<{ assetId: string, isNew: boolean, isFolder: boolean }>();
const notifStore = useNotificationStore()

const tempIsNew = props.isNew

if (props.isNew) {
  await notifStore.viewAssetHandler(props.assetId)
}

</script>
<template>
  <div class="relative inline-block">
    <slot />
    <div v-if="tempIsNew"
      :class="['absolute', 'h-5', 'w-5', 'rounded-full', 'z-10', 'bg-red-500', 'flex', 'justify-center items-center px-1.5 font-medium', 'text-xs', 'text-white', isFolder ? 'top-3 right-5' : 'top-3 right-10']">
      N
    </div>
  </div>
</template>
