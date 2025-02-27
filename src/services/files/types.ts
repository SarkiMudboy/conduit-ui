import type { Asset } from '../types'

export type FileObject = Asset & {
  path: string
  content?: FileObject[]
  metadata: object
  is_directory: boolean
}
