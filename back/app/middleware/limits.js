const { createLimit, identifyByAuth } = require("./utils/createLimit");

/**
 * Limit to prevent SMS flood attack.
 * Characteristics (T= trial): T T 5 T 5 T 5 T 5 ...
 * This shouldn't be resolved, that's why it does not expose the resolver.
 */
exports.sendSMSLimit = {
    limiter: createLimit("smsSend", identifyByAuth, {
        maxFreeTrials: 2, // After 2 trials and every consecutive trials
        banMinutesBase: 5, // 5 min ban
        multiplier: 1, // Do not increase the time
    }).limiter
}

/**
 * Limit to prevent brute force OTP attack.
 * Characteristics (T= trial): T T T 5 T 50 T 500 T 5000 ...
 */
exports.authSMSLimit = createLimit("smsAuth", identifyByAuth, {
    maxFreeTrials: 3, // After 3 trials and on every consecutive trials
    banMinutesBase: 5, // 5 min ban
    multiplier: 10,
});