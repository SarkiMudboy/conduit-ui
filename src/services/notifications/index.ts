import getClient from '@/services/api'
import { type DriveNotification } from './types'
import { must } from '../utils'

async function getNotifications() {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<DriveNotification[]>, ['notifications/'])
}

async function markRead(notif_uid: string) {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.post<boolean>, [`notifications/${notif_uid}/mark-read/`])
}

export default { getNotifications, markRead }
