import axios from 'axios'
import { SnackbarKey, useSnackbar } from 'notistack'
import asyncify from 'callback-to-async-iterator'

type HTTPVerb = 'get' | 'post' | 'put' | 'delete' | 'patch'

type IRequestData<Body, Params> = {
  body?: Body
  params?: Params
} | void

type IMessageWithResult = {
  message: string
  result: string
}

/** A custom promise type */
export class ApiResponse<TResponse> {
  constructor(private promise: Promise<TResponse>) {}

  /**
   * The mandatory catch is useful but fetchAPI will allways resolve the request.
   * So the rest of the errors are language errors that we can write to the console.
   * So the catch would be the same everywhere. That's why this "done".
   */
  done() {
    this.promise.catch(console.error)
  }

  then<TReturnType>(
    callback: (response: TResponse) => TReturnType
  ): ApiResponse<TReturnType> {
    return new ApiResponse(
      new Promise((resolve) => {
        this.promise
          .then((response) => {
            // eslint-disable-next-line promise/no-callback-in-promise
            resolve(callback(response))
          })
          .catch(console.error)
      })
    )
  }

  /**
   * If the response has message and result, then we know everything for enquing a snackbar.
   */
  thenEnqueueSnackbar(
    enqueueSnackbar: ReturnType<typeof useSnackbar>['enqueueSnackbar']
  ): ApiResponse<SnackbarKey> {
    return this.then((response) => {
      // This method is hidden when the response don't have this type.
      // So we can assume it has it:
      const responseWithMessageAndResult = response as unknown as {
        message: string
        result: string
      }
      return enqueueSnackbar(responseWithMessageAndResult.message, {
        variant:
          responseWithMessageAndResult.result === 'success'
            ? 'success'
            : 'error'
      })
    })
  }
}

/**
 * A generic Response.
 * You should use this for types instead of ApiResponse!
 *
 * It has an additional feature: If the response type does not have result and message,
 * the thenEnqueueSnackbar should be hidden.
 */
export type Response<T> = T extends IMessageWithResult
  ? ApiResponse<T>
  : Omit<ApiResponse<T>, 'thenEnqueueSnackbar'>

/** Get the response data even if the response status is not 2xx */
export function fetchAPI<
  Body,
  Params,
  RequestData extends IRequestData<Body, Params>,
  ResponseData
>(verb: HTTPVerb, path: string, data: RequestData): ApiResponse<ResponseData> {
  const promise = axios({
    method: verb,
    url: path,
    params: data?.params,
    data: data?.body
  })
  return new ApiResponse(
    new Promise<ResponseData>((resolve) => {
      promise
        .then((response) => {
          resolve(response.data)
        })
        .catch((error) => {
          if (axios.isAxiosError(error) && error.response) {
            resolve(error.response.data)
          } else {
            console.error('Something went wrong, there is no data: ' + error)
          }
        })
    })
  )
}

/** Get the response data even if the response status is not 2xx */
export function fetchSseAPI<
  Body,
  Params,
  RequestData extends IRequestData<Body, Params>,
  ResponseData
>(verb: HTTPVerb, path: string, data: RequestData) {
  let last_response_len = 0
  const xhttp = new XMLHttpRequest()
  const params = new URLSearchParams(data?.params || {}).toString()
  const uri = `${path}?${params}`
  xhttp.open(verb.toUpperCase(), uri, true)

  // set headers
  xhttp.setRequestHeader('Content-Type', 'application/json;charset=UTF-8')
  for (const headerName in axios.defaults.headers.common || []) {
    xhttp.setRequestHeader(
      headerName,
      axios.defaults.headers.common[headerName] as string
    )
  }

  // send data
  if (typeof data?.body !== undefined) xhttp.send(JSON.stringify(data?.body))

  // handle response
  return asyncify<ResponseData>(
    async (callback) => {
      xhttp.onprogress = () => {
        xhttp.response
          .substr(last_response_len)
          .split('\n\n')
          .filter((data: string) => data.length > 0)
          .forEach((data: string) => {
            callback(JSON.parse(data))
          })
        last_response_len = xhttp.response.length
      }
    },
    {
      onClose: () => {
        xhttp.onprogress = () => {
          // DO NOTHING
        }
      }
    }
  )
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
    ) => Response<Exclude<T[Key]['response'], null>>
  } = {}

  for (const endpointName in endpoints) {
    const endpoint = endpoints[endpointName]
    const lowerEndpointName = uncapitalize(endpointName)
    // ApiResponse always have the thenEnqueueSnackbar, even if it should not be visible.
    // Of course this will never be compatible with the "Response" type but that's a helper type that hides the thenEnqueueSnackbar when it is not usable.
    // so we can safely erase the current type
    output[lowerEndpointName] = ((data: never) => {
      return fetchAPI(endpoints[endpointName].METHOD, endpoint.PATH, data)
    }) as never
  }

  return output as unknown as Required<typeof output>
}
