import axios from 'axios'
type HTTPVerb = 'get' | 'post' | 'put' | 'delete' | 'patch'

type IRequestData<Body, Params> = {
  body?: Body
  params?: Params
} | void

/** Get the response data even if the response status is not 2xx */
export async function fetchAPI<
  Body,
  Params,
  RequestData extends IRequestData<Body, Params>,
  ResponseData
>(verb: HTTPVerb, path: string, data: RequestData): Promise<ResponseData> {
  try {
    const response = await axios({
      method: verb,
      url: path,
      params: data?.params,
      data: data?.body
    })
    return response.data
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data
    } else {
      throw new Error('Something went wrong, there is no data: ' + error)
    }
  }
}

/** The structure of the endpoint definition namespaces */
interface IEndpoint<
  Body,
  Params,
  Request extends IRequestData<Body, Params>,
  Response
> {
  PATH: string
  METHOD: HTTPVerb
  request: Request | null
  response: Response | null
}

/** It does this: SomeThing -> someThing */
function uncapitalize<T extends string>(val: T): Uncapitalize<typeof val> {
  return (val.charAt(0).toLowerCase() + val.slice(1)) as Uncapitalize<
    typeof val
  >
}

/** Reads the endpoint definitions and generates an object of API calling methods */
export function generateApiCalls<
  Body,
  Params,
  Request extends IRequestData<Body, Params>,
  T extends Record<string, IEndpoint<unknown, unknown, Request, unknown>>
>(endpoints: T) {
  // object of API calls
  const output: {
    [Key in keyof T as Uncapitalize<string & Key>]?: (
      data: Exclude<T[Key]['request'], null>
    ) => Promise<Exclude<T[Key]['response'], null>>
  } = {}

  for (const endpointName in endpoints) {
    const endpoint = endpoints[endpointName]
    const lowerEndpointName = uncapitalize(endpointName)
    output[lowerEndpointName] = async (data) => {
      return await fetchAPI(endpoints[endpointName].METHOD, endpoint.PATH, data)
    }
  }

  return output as unknown as Required<typeof output>
}
