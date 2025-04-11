import getClient from '@/services/api'
import type {
  DownloadPresignedURL,
  FileMetaData,
  FileObject,
  GetPresignedURLData,
  PresignedURLS
} from './types'
import { must, getUploadToast } from '../utils'
import { ref, type Ref } from 'vue'
import axios from 'axios'

async function getObjects(object_uid: string, drive_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<FileObject>, [`drives/${drive_uid}/objects/${object_uid}`])
}

export function getObjectPresignedURL(data: GetPresignedURLData, drive_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.post<PresignedURLS>, [`drives/${drive_uid}/share/get-upload-url/`, data])
}

export function getDownloadPresignedURL(drive_uid: string, object_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<DownloadPresignedURL[]>, [
    `drives/${drive_uid}/share/${object_uid}/get-download-url/`
  ])
}

export const uploadFile = async (
  presignedURL: string,
  file: File,
  metadata: FileMetaData,
  fileUploadCompleted: Ref<number>,
  fileUploadTotal?: number
): Promise<boolean> => {
  //const fileUploadCompleted = ref(0)
  //const uploadToast = getUploadToast(file.name, fileUploadCompleted)

  try {
    const response = await axios.put(presignedURL, file, {
      headers: { ...metadata, 'Content-Type': '*' },
      onUploadProgress: (event) => {
        const total = fileUploadTotal || event.total
        if (event.lengthComputable && total) {
          fileUploadCompleted.value = Math.floor((event.loaded / total) * 100)
        }
      }
    })

    if (response.status != 200) throw new Error('Failed')
    else {
      //uploadToast.dismiss()
      return true
    }
  } catch (error) {
    return false
  }
}

export default {
  getObjects,
  getObjectPresignedURL,
  getDownloadPresignedURL,
  uploadFile
}
