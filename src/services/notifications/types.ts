import type { BasicDriveView } from '../drives/types'

export type DriveNotification = {
  uid: string
  author: { uid: string; tag: string }
  drive: BasicDriveView
  note: string
  source: string
  read: boolean
  created_at: string
}
