import getClient from '@/services/api'
import type { FileObject } from './types'
import { must } from '../utils'

async function getObjects(object_uid: string, drive_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<FileObject>, [`drives/${drive_uid}/objects/${object_uid}`])
}

export default {
  getObjects
}
