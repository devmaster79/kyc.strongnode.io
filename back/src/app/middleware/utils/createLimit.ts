import { UserRequest } from 'app/controllers/utils'
import { NextFunction, Request, Response } from 'express'
import { bannedError } from 'shared/endpoints/responses'

let trials: { [key: string]: { nextFreeTime: number | null; count: number } } =
  {}

/**
 * method that resets the trials database
 */
export const resetTrials = () => {
  trials = {}
}

/**
 * method that cleans up old entries
 */
export const cleanUp = () => {
  const now = Date.now()
  Object.keys(trials)
    .filter((key) => {
      const nextFreeTime = trials[key].nextFreeTime
      return nextFreeTime && nextFreeTime < now
    })
    .forEach((key) => {
      delete trials[key]
    })
}

setInterval(cleanUp, 60 * 60 * 1000)

export interface Limit<TRequest> {
  /** a middleware that sends error on too many trials */
  limiter: (req: TRequest, res: Response, next: NextFunction) => unknown
  /** a middleware that makes the controller able to remove the limit on success */
  resolver: (req: TRequest, res: Response, next: NextFunction) => unknown
  /** a static method that calls the resolver provided in the request */
  resolve: (req: RequestWithLimit<TRequest>) => void
}

export interface LimitConfig {
  maxFreeTrials: number
  banMinutesBase: number
  multiplier: number
  resetCountAfterBanExpires: boolean
}

export type Resolver = {
  registerSuccess: () => void
}

export type RequestWithLimit<TRequest> = TRequest & {
  limits: { [name: string]: Resolver }
}

export const createLimit = <TRequest>(
  name: string,
  getIdentifier: (req: TRequest) => string,
  config: LimitConfig = {
    maxFreeTrials: 5,
    banMinutesBase: 5,
    multiplier: 3,
    resetCountAfterBanExpires: false
  }
): Limit<TRequest> => {
  return {
    limiter: createLimiter(getIdentifier, name, config),
    resolver: createResolver(getIdentifier, name),
    resolve(req: RequestWithLimit<TRequest>) {
      req.limits[name].registerSuccess()
    }
  }
}

/**
 * Create a limiter middleware
 * @param getIdentifier a function that returns the identifier of a user
 */
const createLimiter =
  <TRequest>(
    getIdentifier: (req: TRequest) => string,
    name: string,
    config: LimitConfig
  ) =>
  (req: TRequest, res: Response, next: NextFunction) => {
    const identifier = calculateUID(name, getIdentifier(req))
    const now = Date.now()
    let lastTrial = trials[identifier]
    if (!lastTrial) {
      trials[identifier] = {
        count: 1,
        nextFreeTime: null
      }
      lastTrial = trials[identifier]
    }

    // STEP 1: set the next free-to-try time
    if (lastTrial.count > config.maxFreeTrials) {
      if (!lastTrial.nextFreeTime) {
        // CASE: user should be banned
        lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count)
      } else if (
        lastTrial.nextFreeTime <= now &&
        config.resetCountAfterBanExpires
      ) {
        // CASE: ban expired so the user get another [maxFreeTrials] free trials starting with this one
        lastTrial.count = 1
        lastTrial.nextFreeTime = null
      } else if (
        lastTrial.nextFreeTime <= now &&
        !config.resetCountAfterBanExpires
      ) {
        // CASE: ban expired so we allow one free trial and renew the ban
        lastTrial.count += 1
        lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count)
        return next()
      } else {
        // CASE: already banned and not expired
      }
    }

    // STEP 2: check next free time
    if (lastTrial.nextFreeTime && lastTrial.nextFreeTime > now) {
      const response = bannedError(lastTrial.nextFreeTime - now)
      if (res.headersSent) {
        return res.end(`${JSON.stringify(response)}\n\n`)
      } else {
        return res.status(401).send(response)
      }
    }

    lastTrial.count += 1
    return next()
  }

/**
 * Creates a middleware that extends request with a resolver function
 * that controllers could call in case of a successful login
 */
const createResolver =
  <TRequest>(getIdentifier: (req: TRequest) => string, name: string) =>
  (req: TRequest, res: Response, next: NextFunction) => {
    const identifier = calculateUID(name, getIdentifier(req))
    const reqWithLimit = req as RequestWithLimit<TRequest>
    reqWithLimit.limits = {
      [name]: {
        registerSuccess() {
          delete trials[identifier]
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

/**
 * Calculate the next timestamp for ban
 * @returns timestamp
 */
function calculateNextFreeTime(config: LimitConfig, trials: number) {
  const excess_trials = trials - config.maxFreeTrials
  const base = config.banMinutesBase
  const m = config.multiplier
  const e = excess_trials - 1
  const banMs = base * Math.pow(m, e) * 60 * 1000
  return Date.now() + banMs
}

const calculateUID = (name: string, identifier: string) =>
  name + '__' + identifier
