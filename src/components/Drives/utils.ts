import { protectedReq, type reqOptions } from '@/lib/utils'

export const driveAssetsQuery = async (uid: string) => {
  const url = 'http://localhost:8000/api/v1/drives/' + uid

  const myHeaders = new Headers()
  myHeaders.append('Content-Type', 'application/json')

  const params: reqOptions = {
    data: null,
    headers: myHeaders,
    url: url,
    method: 'GET'
  }

  const response = await protectedReq(params)

  return response
}
