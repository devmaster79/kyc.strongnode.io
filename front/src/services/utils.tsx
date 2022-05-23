import axios from 'axios'

type HTTPVerb = 'get' | 'post' | 'put' | 'delete' | 'patch'

/** Get the response data even if the response status is not 2xx */
export async function fetchAPI<RequestData, ResponseData>(
  verb: HTTPVerb,
  path: string,
  data: RequestData | Record<never, never> = {}
): Promise<ResponseData> {
  try {
    const response = await axios[verb](path, data)
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    } else {
      throw new Error('Something went wrong, there is no data: ' + error)
    }
  }
}
