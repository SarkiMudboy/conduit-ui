import { ref } from 'vue'
import { protectedReq, type reqOptions } from '../utils'
import { type FileData } from '@/stores/uploadFileStore'
import { useToast } from '@/components/ui/toast/use-toast'

type FileResourceData = {
  resource_uid?: string
  files: FileData[]
  bulk: boolean
}

export type FileUploadPresignedURL = {
  id: string
  url: string
}

export const getAWSUploadPresignedURL = async (
  files: FileData[],
  bulk: boolean,
  driveUid: string,
  resourceUid: string | null
): Promise<FileUploadPresignedURL[]> => {
  const reqHeaders = new Headers()
  reqHeaders.append('Content-Type', 'application/json')

  let presignedURLs: FileUploadPresignedURL[] = []

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

  await protectedReq(params).then((r) => {
    if (r.status == 200) {
      presignedURLs = r.response
      console.log(presignedURLs)
    } // else error toast
  })

  return presignedURLs
}
// may need to move this to workers...
export const uploadFileToS3 = async (presignedURL: string, file: File) => {
  const { toast } = useToast()
  const headers = { 'Content-Type': '*' }
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
