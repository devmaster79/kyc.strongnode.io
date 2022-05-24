const { bannedError } = require('shared/endpoints/responses')

/**
 * @type {Object.<string, { nextFreeTime: number, count: number }>}
 */
let trials = {}

/**
 * method that resets the trials database
 */
exports.resetTrials = () => {
  trials = {}
}

/**
 * method that cleans up old entries
 */
exports.cleanUp = () => {
  const now = Date.now()
  Object.keys(trials)
    .filter((key) => trials[key].nextFreeTime < now)
    .forEach((key) => {
      delete trials[key]
    })
}

setInterval(exports.cleanUp, 60 * 60 * 1000)

/**
 * @typedef {Object} Limit
 * @property {(req: Object, res: Object, next: () => any) => any} limiter
 * a middleware that sends error on too many trials
 * @property {(req: Object, res: Object, next: () => any) => any} resolver
 * a middleware that makes the controller able to remove the limit on success
 * @property {(req: Object) => void} resolve
 * a static method that calls the resolver provided in the request
 */

/**
 * Limit the maximal trials.
 * The strategy allows multiple trials without limit for example:
 * F = number of free trials
 * B = base minutes of ban
 * M = multiplier
 *
 * after F trials -> B*M^0 min ban ->
 * after 1 trials -> B*M^1 min ban ->
 * after 1 trials -> B*M^2 min ban
 *
 * @param {string} name the limitation's name, used for separation
 * @param {(req: Object) => string} getIdentifier a function that returns
 * the identifier of a user
 * It is useful to prefix the identifier with the route name,
 * because login trials are not the same as sms trials
 * @param {Object} config
 * @param {number} config.maxFreeTrials
 * @param {number} config.banMinutesBase
 * @param {number} config.multiplier
 * @returns {Limit} see the Limit typedef
 */
exports.createLimit = (
  name,
  getIdentifier,
  config = { maxFreeTrials: 5, banMinutesBase: 5, multiplier: 3 }
) => {
  return {
    limiter: createLimiter(getIdentifier, name, config),
    resolver: createResolver(getIdentifier, name),
    resolve(req) {
      req.limits[name].registerSuccess()
    }
  }
}

/**
 * Create a limiter middleware
 * @param {(req: Object) => string} getIdentifier a function that returns
 * the identifier of a user
 * @param {string} name
 * @param {Object} config
 * @param {number} config.maxFreeTrials
 * @param {number} config.banMinutesBase
 * @param {number} config.multiplier
 * @returns {(req: Object, res: Object, next: () => any) => any}
 */
const createLimiter = (getIdentifier, name, config) => (req, res, next) => {
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
      // user should be banned
      lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count)
    } else if (lastTrial.nextFreeTime <= now) {
      // ban expired so we allow one free trial and renew the ban
      lastTrial.count += 1
      lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count)
      return next()
    } else {
      // already banned and not expired
    }
  }

  // STEP 2: check next free time
  if (lastTrial.nextFreeTime && lastTrial.nextFreeTime > now) {
    return res.status(401).send(bannedError(lastTrial.nextFreeTime - now))
  }

  lastTrial.count += 1
  return next()
}

/**
 * Creates a middleware that extends request with a resolver function
 * that controllers could call in case of a successful login
 * @param {(req: Object) => string} getIdentifier a function that returns
 * the identifier of a user
 * @param {string} name
 * @returns {(req: Object, res: Object, next: () => any) => any}
 */
const createResolver = (getIdentifier, name) => (req, res, next) => {
  const identifier = calculateUID(name, getIdentifier(req))
  req.limits = {
    [name]: {
      registerSuccess() {
        delete trials[identifier]
      }
    },
    ...req.limits
  }
  return next()
}

/**
 * Get a unique identifier of the authorized user.
 * @param {Object} req
 * @param {Object} req.user
 * @param {string} req.user.email
 * @returns {string}
 */
exports.identifyByAuth = (req) => {
  return req.user.email
}

/**
 * Get a unique identifier of the user based on the email and ip.
 * @param {Object} req
 * @param {string} req.ip
 * @param {Object} req.body
 * @param {string} req.body.email
 * @returns {string}
 */
exports.identifyByEmailAndIP = (req) => {
  return `${req.body.email}__${req.ip}`
}

/**
 * Calculate the next timestamp for ban
 * @param {Object} config
 * @param {number} config.maxFreeTrials
 * @param {number} config.banMinutesBase
 * @param {number} config.multiplier
 * @param {number} trials
 * @returns {number} timestamp
 */
function calculateNextFreeTime(config, trials) {
  const excess_trials = trials - config.maxFreeTrials
  const base = config.banMinutesBase
  const m = config.multiplier
  const e = excess_trials - 1
  const banMs = base * Math.pow(m, e) * 60 * 1000
  return Date.now() + banMs
}

/**
 *
 * @param {string} name
 * @param {string} identifier
 * @returns {string}
 */
const calculateUID = (name, identifier) => name + '__' + identifier
