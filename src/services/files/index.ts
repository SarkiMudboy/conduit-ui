import http from '../api'
import { type APIResponse } from '../types'
import { FileResourceData, FileUploadPresignedURL, FileUploadPresignedURLData } from './types'

async function getFilesPresignedURLS(driveUID: string, fileData: FileResourceData) {
  return await http.post<APIResponse<FileUploadPresignedURLData>>(
    `drives/${driveUID}/share/get-upload-url/`,
    fileData
  )
}

async function uploadFilesTos3Bucket(metadata: object, file: File) {
  http.defaults.headers.common = { ...metadata, 'Content-Type': '*' }
  return await http.post()
}

export default {
  getFilesPresignedURLS
}
