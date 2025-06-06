import { type Asset } from '../types'
import type { FileObject } from '../files/types'

export type Drive = Asset & {
  used: number
  type: 'personal' | 'shared'
}

export type DriveDetail = Asset & {
  used: number
  members: string[]
  storage_objects: FileObject[]
  directories?: FileObject[]
}

export type BasicDriveView = {
  uid: string
  name: string
}

export type InputCreateDrive = {
  name: string
  members: string[]
}
