import DriveController from './drives'
import FileController from './files'
import NotificationController from './notifications'
import AuthController from './auth'

export const API = {
  auth: AuthController,
  drives: DriveController,
  files: FileController,
  notifications: NotificationController
}
