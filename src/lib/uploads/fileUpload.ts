import { ref } from 'vue'
import { protectedReq, type reqOptions } from '../utils'

type FileData = {
  filename: string
  filesize: number
  metadata: object
}

type FileResourceData = {
  resource_uid?: string
  file: FileData
}

export const getAWSUploadPresignedURL = async (
  file: File,
  driveUid: string,
  resourceUid: string | null
) => {
  const reqHeaders = new Headers()
  reqHeaders.append('Content-Type', 'appllication/json')
  let presignedURL = new String()

  let path = `http://localhost:8000/api/v1/drives/${driveUid}/share/get-upload-url/`
  let uploadData: FileResourceData = {
    file: {
      filename: file.name,
      filesize: file.size,
      metadata: {}
    }
  }

  if (resourceUid) {
    uploadData.resource_uid = resourceUid
  }

  const params: reqOptions = {
    data: uploadData,
    headers: reqHeaders,
    url: path,
    method: 'GET'
  }

  await protectedReq(params).then((r) => {
    if (r.status == 200) {
      presignedURL = r.response.url
    } // else error toast
  })
  /*
    /drives/drive_uid/share/get_upload_url/
    /share/get_upload_url/
  
    {
      'uid': 'xxxxx' // if a uid is provided then its an object?
      'file' {
        'filename': 'bla bla',
        'filesize': 23KB
        ... 
        }
  }
    */
  return presignedURL
}

export const initiateUpload = async (url: string, file: Blob) => {}
