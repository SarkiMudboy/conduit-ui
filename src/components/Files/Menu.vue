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
import { ref, type Ref } from 'vue';
//import type { DownloadPresignedURL } from '@/services/files/types';

const openDownloadDialog = ref(false)
const setDownloadDialogOpen = (open: boolean) => {
  openDownloadDialog.value = open
}

const downloadLink = ref("")
const downloadFileStore = useDownloadFileStore()
const props = defineProps<{ driveId: string, assetId: string, assetName: string }>();

const downloadAsset = async () => {
  const response = await downloadFileStore.dispatchGetDownloadPresignedURL(props.driveId, props.assetId)
  if (response.body) {
    downloadLink.value = await downloadFileStore.processURLs()
    setDownloadDialogOpen(true)
  }
}

</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger>
      <slot />
    </ContextMenuTrigger>
    <ContextMenuContent class="w-40">
      <ContextMenuItem inset @click="downloadAsset">
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
  <DownloadLink :open="openDownloadDialog" :setOpen="setDownloadDialogOpen" :link="downloadLink"
    :filename="props.assetName" />
</template>
