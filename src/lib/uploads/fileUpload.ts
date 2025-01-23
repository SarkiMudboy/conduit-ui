import { ref } from 'vue'
import { protectedReq, type reqOptions } from '../utils'
import { type FileData } from '@/stores/uploadFileStore'
import { useToast } from '@/components/ui/toast/use-toast'
import { useCurrentUserStore } from '@/stores/userStore'
import { metadata } from '@vueuse/core/metadata.cjs'

type FileResourceData = {
  resource_uid?: string
  files: FileData[]
  bulk: boolean
}

type FileUploadPresignedURL = {
  id: string
  url: string
}

export type FileUploadPresignedURLData = {
  presigned_urls: FileUploadPresignedURL[]
  metadata: { [key: string]: string }
}

export const getAWSUploadPresignedURL = async (
  files: FileData[],
  bulk: boolean,
  driveUid: string,
  resourceUid: string | null
) /* Promise<FileUploadPresignedURL[]>*/ => {
  const { toast } = useToast()
  const reqHeaders = new Headers()
  reqHeaders.append('Content-Type', 'application/json')

  const path = `http://localhost:8000/api/v1/drives/${driveUid}/share/get-upload-url/`
  const uploadData: FileResourceData = {
    files: files,
    bulk: bulk /* true: its bulk file upload, for directory uploads the flag is set to false,
    false: single file or directory
    */
  }

  if (resourceUid) {
    uploadData.resource_uid = resourceUid
  }

  const params: reqOptions = {
    data: uploadData,
    headers: reqHeaders,
    url: path,
    method: 'POST'
  }

  const presignedURLData = await protectedReq(params).then((r) => {
    if (r.status == 200) {
      //console.log(presignedURLs)
      return r.response
    } else {
      toast({
        title: 'Failed to upload',
        description: `Something went wrong`,
        variant: 'destructive'
      })
      return []
    }
  })

  return presignedURLData
}

// may need to move this to workers...
export const uploadFileToS3 = async (presignedURL: string, file: File, metadata: object) => {
  const { toast } = useToast()
  const headers = { ...metadata, 'Content-Type': '*' }
  const params = {
    method: 'PUT',
    headers: headers,
    body: file
  }
  await fetch(presignedURL, params).then((r) => {
    if (r.status == 200) {
      toast({ title: 'File uploaded', description: `${file.name} has been uploaded sucessfully` })
    } else
      toast({
        title: 'Failed upload',
        description: `Failed to upload ${file.name}`,
        variant: 'destructive'
      })
  })
}
