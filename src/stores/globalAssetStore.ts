import { defineStore } from 'pinia'
import { reactive, ref, type Ref } from 'vue'

export interface GlobalAsset {
  source?: string
  drive: string
}

export const useGlobalAssetStore = defineStore('useGlobalAssetStore', () => {
  const asset: Ref<GlobalAsset | null> = ref(null)

  function setAsset(obj: GlobalAsset) {
    //asset.drive = obj.drive
    //asset.source = obj.source ? obj.source : undefined
    asset.value = obj
    console.log(asset.value)
  }

  return { asset, setAsset }
})
