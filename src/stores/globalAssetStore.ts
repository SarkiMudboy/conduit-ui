import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export interface GlobalAsset {
  source?: string
  drive: string
}

export const useGlobalAssetStore = defineStore('useGlobalAssetStore', () => {
  const asset: Ref<GlobalAsset | null> = ref(null)

  function setAsset(obj: GlobalAsset) {
    asset.value = obj
  }
  return { asset, setAsset }
})
