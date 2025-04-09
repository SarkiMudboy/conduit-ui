<script setup lang="ts">
import { Check, Copy, Download } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { computed, ref, watch } from 'vue';
import axios from 'axios';
import type { DownloadAssetProp } from './types';

const props = defineProps<{
  downloadAsset: () => Promise<string>,
  objectData: DownloadAssetProp,
  open: boolean,
  setOpen: (open: boolean) => void
}>()

const copied = ref(false)
const loading = ref(false)
const { toast } = useToast()

//const assetLink = computed(() => link.value)

const link = ref("")

watch(() => props.open, async (value) => {
  if (value) {
    if (props.objectData.isDir) loading.value = true
    try {
      link.value = await props.downloadAsset()
    } finally {
      loading.value = false
    }

  }
})

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(link.value)
    copied.value = true
    toast({
      title: "Link Copied",
      description: "The link has been copied to your clipboard."
    })

    setTimeout(() => copied.value = false, 2000)
  } catch (err) {
    toast({
      title: "Failed to copy",
      description: "Could not copy the link to your clipboard.",
      variant: "destructive",
    })
  }
}

const downloadLink = async () => {
  try {

    const response = await axios.get(link.value, { responseType: "blob" })

    if (response.status == 200) {

      const link = URL.createObjectURL(response.data)

      const linkAnchor = document.createElement('a')
      linkAnchor.href = link
      linkAnchor.download = props.objectData.assetName
      document.body.appendChild(linkAnchor)
      linkAnchor.click()

      // Clean up
      document.body.removeChild(linkAnchor)
      URL.revokeObjectURL(link)
    }

    toast({
      title: "Downloading File...",
      description: "Your file is being downloaded",
    })
  } catch (err) {
    toast({
      title: "Download Failed",
      description: "Your file failed to download",
      variant: "destructive"
    })

  }
}

</script>

<template>
  <Dialog :open="props.open" @update:open="props.setOpen">
    <DialogContent class="sm:max-w-md">
      <div v-if="loading" class="flex flex-col justify-center items-center">
        <p class="font-bold">
          Getting asset link...
        </p>
        <i class="animate-pulse w-10 h-10 mt-2">
          🚀
        </i>
      </div>
      <div v-else>
        <DialogHeader>
          <DialogTitle>Share Link/Download</DialogTitle>
          <DialogDescription>Copy this link to share it with others.</DialogDescription>
        </DialogHeader>
        <div class="flex items-center space-x-2">
          <div class="grid flex-1 gap-2">
            <Input id="link" class="w-full mt-2" v-model="link" readonly @click="(e: Event) => {
              const inputElem = e.currentTarget as HTMLInputElement
              inputElem.select()
            }" />
          </div>
          <Button size="sm" class="px-3" @click="copyToClipboard" :variant='copied ? "link" : "default"'
            title="Copy to clipboard">
            <Check v-if="copied" class="h-4 w-4" />
            <Copy v-else class="h-4 w-4" />
            <span class="sr-only">Copy</span>
          </Button>
          <Button class="px-3" size="sm" @click="downloadLink" variant="outline" title="Download File locally">
            <Download class="h-4 w-4" />
            <span class="sr-only">Download</span>
          </Button>
        </div>
      </div>
    </DialogContent>
  </Dialog>
</template>
