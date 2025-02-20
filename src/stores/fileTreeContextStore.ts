import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'

export type ObjectNode = {
  uid: string
  name: string
}

export const useFileTreeContextStore = defineStore('useFileTreeContextStore', () => {
  const filePath: Ref<ObjectNode[]> = ref([])

  function setNode(node: ObjectNode) {
    const pos = filePath.value.findIndex((file) => file.uid == node.uid)

    if (pos !== -1) filePath.value = filePath.value.slice(0, pos + 1)
    else filePath.value.push(node)
  }

  return { filePath, setNode }
})
