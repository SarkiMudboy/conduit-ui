import getClient from '@/services/api'
import { type DriveNotification } from './types'
import { must } from '../utils'

async function getNotifications() {
  const config = { withAuth: true }
  const client = getClient(config)
  return must(client.get<DriveNotification[]>, ['notifications/'])
}

export default { getNotifications }
