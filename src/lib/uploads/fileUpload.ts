import { ref } from 'vue'
import { protectedReq, type reqOptions } from '../utils'
import { type FileData } from '@/stores/uploadFileStore'

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

  let path = `http://localhost:8000/api/v1/drives/${driveUid}/share/get-upload-url/`
  let uploadData: FileResourceData = {
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

export const uploadFileToS3 = async (presignedURL: string, file: Blob) => {
  const headers = { 'Content-Type': '*' }
  const params = {
    method: 'PUT',
    headers: headers,
    body: file
  }
  await fetch(presignedURL, params).then((r) => {
    // show toast with upload success or failed.
  })
}
