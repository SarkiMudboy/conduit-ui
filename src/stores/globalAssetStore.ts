import { defineStore } from 'pinia'
import type { FileObjectView } from '@/services/files/types'
import { ref, type Ref } from 'vue'

export const useGlobalAssetStore = defineStore('useGlobalAssetStore', () => {
  const asset: Ref<FileObjectView | null> = ref(null)

  function setAsset(obj: FileObjectView) {
    asset.value = obj
  }

  return { asset, setAsset }
})
