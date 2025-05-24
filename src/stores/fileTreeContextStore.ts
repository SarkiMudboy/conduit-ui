import { defineStore } from 'pinia'
import { ref, type Ref } from 'vue'
import getHTTPClient from '@/services/api'

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

  async function addNodes(drive: string, pathSource: string) {
    const objectNodes = await dispatchGetNodes(drive, pathSource)
    filePath.value.push(...objectNodes)
  }

  async function dispatchGetNodes(drive: string, leaf: string) {
    const client = getHTTPClient({ withAuth: true })
    const response = await client.get<ObjectNode[]>(
      `drives/${drive}/objects/${leaf}/get_path_detail`
    )
    return response.data
  }

  return { filePath, setNode, addNodes }
})
