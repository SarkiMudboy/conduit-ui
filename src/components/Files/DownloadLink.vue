<script setup lang="ts">
import { Check, Copy, Download } from 'lucide-vue-next';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/toast';
import { computed, ref } from 'vue';

const props = defineProps<{ link: string, open: boolean, setOpen: (open: boolean) => void }>()
const copied = ref(false)
const { toast } = useToast()

const assetLink = computed(() => props.link)

const copyToClipboard = async () => {
  try {
    await navigator.clipboard.writeText(props.link)
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

const downloadLink = () => {
  try {
    const linkAnchor = document.createElement('a')
    linkAnchor.href = props.link
    linkAnchor.download = "filename.zip"
    document.body.appendChild(linkAnchor)
    linkAnchor.click()

    // Clean up
    document.body.removeChild(linkAnchor)

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
      <DialogHeader>
        <DialogTitle>Share Link/Download</DialogTitle>
        <DialogDescription>Copy this link to share it with others.</DialogDescription>
      </DialogHeader>
      <div class="flex items-center space-x-2">
        <div class="grid flex-1 gap-2">
          <Input id="link" class="w-full" v-model="assetLink" readonly @click="(e: Event) => {
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
    </DialogContent>
  </Dialog>
</template>
