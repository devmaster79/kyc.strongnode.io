let trials = {};

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
 * @param {(req: Object) => string} getIdentifier a function that returns the unique identifier of a user
 * It is useful to prefix the identifier with the route name,
 * because login trials are not the same as sms trials
 * @param {Object} config
 * @param {number} config.maxFreeTrials
 * @param {number} config.banMinutesBase
 * @param {number} config.multiplier
 * @returns {(req: Object, res: Object, next: () => any) => any}
 */
exports.limitTrials = (
    getIdentifier,
    config = { maxFreeTrials: 5, banMinutesBase: 5, multiplier: 3 }
) => (req, res, next) => {
    const now = Date.now();
    const identifier = getIdentifier(req);
    let lastTrial = trials[identifier];
    if (!lastTrial) {
        trials[identifier] = {
            count: 1,
            nextFreeTime: null,
        };
        lastTrial = trials[identifier];
    }
    // STEP 1: set the next free-to-try time
    if (lastTrial.count > config.maxFreeTrials) {
        if (!lastTrial.nextFreeTime) {
            // user should be banned
            lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count);
        } else if (lastTrial.nextFreeTime <= now) {
            // ban expired so we allow one free trial and renew the ban
            lastTrial.count+=1;
            lastTrial.nextFreeTime = calculateNextFreeTime(config, lastTrial.count);
            return next();
        } else {
            // already banned and not expired
        }
    }

    // STEP 2: check next free time
    if (lastTrial.nextFreeTime && lastTrial.nextFreeTime > now) {
        return res.status(401).send({
            banned: true,
            millis: lastTrial.nextFreeTime - now
        });
    }

    // STEP 3: extend request for controllers
    req.limitTrials = {
        registerSuccess() {
            delete trials[identifier];
        }
    }

    lastTrial.count += 1;
    return next();
};

/**
 * Get a unique identifier of the authorized user.
 * @param {Object} req
 * @param {Object} req.user
 * @param {string} req.user.email
 * @returns {string}
 */
exports.identifyByAuth = (req) => {
    return req.user.email;
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
    const excess_trials = trials - config.maxFreeTrials;
    const base = config.banMinutesBase;
    const m = config.multiplier;
    const e = excess_trials - 1;
    const banMs = base * Math.pow(m, e) * 60 * 1000;
    const newNextFreeTime = Date.now() + banMs;
    return newNextFreeTime;
}
