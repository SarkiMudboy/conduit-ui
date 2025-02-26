import getClient from '@/services/api'
import { type Drive, type DriveDetail, type InputCreateDrive } from './types'
import { must } from '../utils'

async function getDrives() {
  const withAuth = true
  const client = getClient(withAuth)
  return must(client.get<Drive[]>, ['drives/'])
}

async function createDrive(data: InputCreateDrive) {
  const withAuth = true
  const client = getClient(withAuth)
  return await client.post<Drive>('drives/', data)
}

async function getDriveAssets(uid: string) {
  const withAuth = true
  const client = getClient(withAuth)
  return await client.get<DriveDetail>('drives/' + uid)
}

async function deleteDrive(uid: string) {
  const client = getClient(true)
  return await client.delete<boolean>('drives/' + uid)
}

export default {
  getDrives,
  createDrive,
  getDriveAssets,
  deleteDrive
}
