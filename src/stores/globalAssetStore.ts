import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface GlobalAsset {
  source?: string
  drive: string
}

// this store is used to store file/folder information that concerns multiple components
// This contains assets the other components need to react to...
// use a watcher to watch the 'asset' ref and react appropriately
export const useGlobalAssetStore = defineStore('useGlobalAssetStore', () => {
  const asset: Ref<GlobalAsset | null> = ref(null)

  function setAsset(obj: GlobalAsset) {
    asset.value = obj
  }

  return { asset, setAsset }
})
