export type Asset = {
  uid: string
  name: string
  size: number
  created_at: string
}

export type Drive = Asset & {
  used: number
  type: 'personal' | 'shared'
}

export type FileObject = Asset & {
  path: string
  metadata: object
  is_directory: boolean
}

export type DriveDetail = Asset & {
  used: number
  members: string[]
  storage_objects: FileObject[]
}
