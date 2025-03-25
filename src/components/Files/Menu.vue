<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut
} from '@/components/ui/context-menu';
import { Download } from 'lucide-vue-next';

const props = defineProps<{ assetId: string }>();
// add a store for dowloads? 

async function downloadAsset() {

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
          <Download class="h-4 w-4" />
        </ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem inset disabled>
        Details
      </ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
