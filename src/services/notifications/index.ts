import getClient from '@/services/api'
import { type DriveNotification } from './types'
import { must } from '../utils'
import { type PaginatedAPIResponse } from '../types'

async function getNotifications() {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<PaginatedAPIResponse<DriveNotification>>, ['notifications/'])
}

async function markRead(notif_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.post<boolean>, [`notifications/${notif_uid}/mark-read/`])
}

export default { getNotifications, markRead }
