export type DriveNotification = {
  uid: string
  author: { uid: string; tag: string }
  drive: { uid: string; name: string }
  note: string
  created_at: string
}
