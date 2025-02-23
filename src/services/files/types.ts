import { type FileData } from '@/stores/uploadFileStore'

export type FileResourceData = {
  resource?: string
  files: FileData[]
  bulk: boolean
}

export type FileUploadPresignedURL = {
  id: string
  url: string
}

export type FileUploadPresignedURLData = {
  presigned_urls: FileUploadPresignedURL[]
  metadata: { [key: string]: string }
}
