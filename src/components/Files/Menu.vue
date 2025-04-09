<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut
} from '@/components/ui/context-menu';
import { Link2 } from 'lucide-vue-next';
import { useDownloadFileStore } from '@/stores/downloads/downloadFileStore';
import DownloadLink from './DownloadLink.vue';
import { ref } from 'vue';
import type { DownloadAssetProp } from './types';

const openDownloadDialog = ref(false)
const setDownloadDialogOpen = (open: boolean) => {
  openDownloadDialog.value = open
}

const downloadFileStore = useDownloadFileStore()
const props = defineProps<{ driveId: string, assetData: DownloadAssetProp }>();

const downloadAsset = async () => {
  const response = await downloadFileStore.dispatchGetDownloadPresignedURL(props.driveId, props.assetData.assetId)
  if (response.body) {
    return await downloadFileStore.processURLs()
  }

  return ""
}

</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-40">
      <ContextMenuItem inset @click="setDownloadDialogOpen(true)">
        Download
        <ContextMenuShortcut>
          <Link2 class="h-4 w-4" />
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Details
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
  <DownloadLink :open="openDownloadDialog" :setOpen="setDownloadDialogOpen" :objectData="props.assetData"
    :downloadAsset="downloadAsset" />
</template>
