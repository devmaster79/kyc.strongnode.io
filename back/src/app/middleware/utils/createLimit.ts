import { UserRequest } from 'app/controllers/utils'
import { AppLogger, Logger } from 'app/services/Logger'
import { NextFunction, Request, Response } from 'express'
import { bannedError } from 'shared/endpoints/responses'
import { WebSocket } from 'ws'
import process from 'node:process'
import { LIMITER_SERVICE_URL } from 'app/config/config'

class LimiterService {
  storedConnection: WebSocket | null = null
  reconnectTimout: NodeJS.Timeout | undefined = undefined
  closing = false

  constructor(private __logger: Logger = new Logger('LimiterService')) {}

  connect(): Promise<WebSocket> {
    // if the connection is alive
    if (this.storedConnection)
      return new Promise((resolve) => {
        if (this.storedConnection) {
          resolve(this.storedConnection)
        }
      })

    // if the connection is NOT alive
    const ws = new WebSocket(LIMITER_SERVICE_URL)
    ws.on('error', (e) => {
      this.__logger.error(e)
      this.reconnect()
    })
    ws.on('close', (e, reason) => {
      if (this.closing) return
      this.__logger.error('Closed', e, reason.toString('ascii'))
      this.reconnect()
    })

    return new Promise((resolve) => {
      ws.on('open', () => {
        this.storedConnection = ws
        resolve(ws)
        this.__logger.log('Connected')
      })
    })
  }

  async disconnect() {
    this.__logger.log('Server is shutting down')
    this.closing = true
    if (this.storedConnection) this.storedConnection.terminate()
  }

  reconnect = () => {
    this.storedConnection = null
    if (this.reconnectTimout) {
      clearTimeout(this.reconnectTimout)
    }
    this.reconnectTimout = setTimeout(() => {
      this.__logger.log('Reconnecting')
      this.connect()
    }, 1000)
  }

  private async __send_command(command: string): Promise<[string, string]> {
    const ws = await this.connect()
    ws.send(command)
    return new Promise((resolve, reject) => {
      ws.on('message', function message(data) {
        try {
          const msg = data.toString('ascii')
          const result = msg.split(' ')[0]
          const rest = msg.replace(result, '').trim()
          resolve([result, rest])
        } catch (e) {
          reject(new Error('Malformed response'))
        }
      })
    })
  }

  async send_access(
    limit_id: string,
    user_id: string
  ): Promise<AccessResponse> {
    const [result, rest] = await this.__send_command(
      `ACCESS ${limit_id} ${this.__encode(user_id)}`
    )
    if (result === 'ERROR') throw new Error(rest)
    if (result === 'ALLOWED') return { result }
    if (result === 'DENIED') return { result, nextFreeTimeMs: parseInt(rest) }
    throw new Error('Malformed response')
  }

  async send_resolve(
    limit_id: string,
    user_id: string
  ): Promise<ResolveResponse> {
    const [result, rest] = await this.__send_command(
      `RESOLVE ${limit_id} ${this.__encode(user_id)}`
    )
    if (result === 'ERROR') throw new Error(rest)
    if (result === 'DONE') return { result }
    throw new Error('Malformed response')
  }

  __encode(val: string) {
    return Buffer.from(val).toString('hex')
  }
}

const limiterService = new LimiterService()
limiterService.connect().catch(AppLogger.error)

function quit() {
  limiterService
    .disconnect()
    .then(() => {
      process.exit(0)
    })
    .catch(() => {
      process.exit(1)
    })
}

process.on('SIGINT', quit)
process.on('SIGTERM', quit)

type AccessResponse =
  | { result: 'ALLOWED' }
  | { result: 'DENIED'; nextFreeTimeMs: number }
type ResolveResponse = { result: 'DONE' }

export type Resolver = {
  registerSuccess: () => Promise<void>
}
export type RequestWithLimit<TRequest> = TRequest & {
  limits: { [name: string]: Resolver }
}
export type Limit<TRequest> = {
  /** a middleware that sends error on too many trials */
  limiter: (req: TRequest, res: Response, next: NextFunction) => unknown
  /** a middleware that makes the controller able to remove the limit on success */
  resolver: (req: TRequest, res: Response, next: NextFunction) => unknown
  /** a static method that calls the resolver provided in the request */
  resolve: (req: RequestWithLimit<TRequest>) => void
}

/** Creates multiple middlewares for limiting */
export const createLimit = <TRequest>(
  name: string,
  getIdentifier: (req: TRequest) => string
): Limit<TRequest> => {
  return {
    limiter: createLimiter(getIdentifier, name),
    resolver: createResolver(getIdentifier, name),
    async resolve(req: RequestWithLimit<TRequest>) {
      await req.limits[name].registerSuccess()
    }
  }
}

/**
 * Creates a middleware that will limit the access based on the limit-service
 */
const createLimiter =
  <TRequest>(getIdentifier: (req: TRequest) => string, name: string) =>
  async (req: TRequest, res: Response, next: NextFunction) => {
    try {
      const response = await limiterService.send_access(
        name,
        getIdentifier(req)
      )
      if (response.result === 'ALLOWED') {
        return next()
      } else if (response.result === 'DENIED') {
        const bannedResponse = bannedError(response.nextFreeTimeMs - Date.now())
        if (res.headersSent) {
          return res.end(`${JSON.stringify(bannedResponse)}\n\n`)
        } else {
          return res.status(401).send(bannedResponse)
        }
      } else {
        new Error('Malformed response')
      }
    } catch (e) {
      AppLogger.error('limiter got an error: ', e)
    }
  }

/**
 * Creates a middleware that extends request with a resolver function
 * that controllers could call in case of a successful login
 */
const createResolver =
  <TRequest>(getIdentifier: (req: TRequest) => string, name: string) =>
  async (req: TRequest, _res: Response, next: NextFunction) => {
    const reqWithLimit = req as RequestWithLimit<TRequest>
    reqWithLimit.limits = {
      [name]: {
        async registerSuccess() {
          await limiterService.send_resolve(name, getIdentifier(req))
        }
      },
      ...reqWithLimit.limits
    }
    return next()
  }

/** Get a unique identifier of the authorized user. */
export const identifyByAuth = (req: UserRequest) => {
  return req.user.email
}

/** Get a unique identifier of the user based on the email and ip. */
export const identifyByEmailAndIP = (req: Request) => {
  return `${req.body.email}__${req.ip}`
}
