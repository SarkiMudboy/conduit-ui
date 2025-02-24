import { protectedReq, type reqOptions } from '../utils'
import { type FileData } from '@/stores/uploadFileStore'
import { useToast } from '@/components/ui/toast/use-toast'
import axios from 'axios'
import { h } from 'vue'
import Progress from '@/components/ui/progress/Progress.vue'

const { toast } = useToast()

type FileResourceData = {
  resource?: string
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
    uploadData.resource = resourceUid
  }

  const params: reqOptions = {
    data: uploadData,
    headers: reqHeaders,
    url: path,
    method: 'POST'
  }

  const presignedURLData = await protectedReq(params).then((r) => {
    if (r.status == 200) {
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

export const uploadFileToS3 = async (presignedURL: string, file: File, metadata: object) => {
  try {
    const response = await axios.put(presignedURL, file, {
      headers: { ...metadata, 'Content-Type': '*' },
      onUploadProgress: (event) => {
        if (event.lengthComputable && event.total) {
          toast({
            title: 'File Upload',
            description: h('div', {}, [
              h('p', {}, `Uploading ${file.name}`),
              h(Progress, {
                progress: Math.floor((event.loaded / event.total) * 100),
                class: 'mt-2'
              })
            ])
          })
        }
      }
    })

    if (response.status != 200) throw new Error('Failed')
    else
      toast({ title: 'File uploaded', description: `${file.name} has been uploaded sucessfully` })
  } catch (error) {
    toast({
      title: 'Failed upload',
      description: `Failed to upload ${file.name}`,
      variant: 'destructive'
    })
  }
}
