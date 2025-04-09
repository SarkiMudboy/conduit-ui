import JSZip from 'jszip'
import type { DownloadPresignedURL } from '@/services/files/types'
import axios from 'axios'

export const generateZipAssetForFolders = async (
  files: DownloadPresignedURL[]
): Promise<string> => {
  const zip = new JSZip()
  let url = ''

  await Promise.all(
    files.map(async (file) => {
      // download it here
      try {
        const response = await axios.get(file.url, { responseType: 'blob' })
        if (response.status == 200) {
          zip.file(file.path, response.data)
        }
      } catch (error) {
        console.log('Error downloading files')
        return ''
      }
    })
  )

  // save it
  await zip.generateAsync({ type: 'blob' }).then((content) => {
    url = URL.createObjectURL(content)
  })

  return url
}
