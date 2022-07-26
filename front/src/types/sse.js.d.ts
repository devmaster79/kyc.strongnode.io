export {}

declare global {
  export type Method = 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  export type Options<TPayload> = {
    headers?: Record<string, string>
    payload?: TPayload
    method: Method
    withCredentials?: boolean
  }
  export class SSE<TPayload> {
    constructor(url: string, options?: Options<TPayload>)
  }
  interface Window {
    SSE: typeof SSE
  }
}
