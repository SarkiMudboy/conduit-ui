import type { BasicDriveView } from '../drives/types'
import type { Asset } from '../types'

export type FileObject = Asset & {
  path: string
  content?: FileObject[]
  metadata: object
  is_directory: boolean
  directories?: FileObject[]
}

export type FileMetaData = { [key: string]: string }

export type FileData = {
  id: string
  filename: string
  path: string | null
  filesize: number
  metadata?: FileMetaData
}

export type UploadFile = {
  data: FileData
  file: File
  fileURL: string
  uploadPresignedURL: string
  uploaded: boolean
}

// presigned urls
export type GetPresignedURLData = {
  files: FileData[]
  resource?: string
  bulk: boolean
  note?: string
  mentioned_members?: string[]
}

export type PresignedURLS = {
  presigned_urls: { id: string; url: string }[]
  metadata: FileMetaData
}

export type FileObjectView = {
  drive: BasicDriveView
  file_objects: FileObject[]
}

export type DownloadPresignedURL = {
  uid: string
  path: string
  url: string
}
