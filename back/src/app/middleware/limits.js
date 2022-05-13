const {
  createLimit,
  identifyByAuth,
  identifyByEmailAndIP
} = require('./utils/createLimit')

/**
 * Limit to prevent SMS flood attack.
 * Characteristics (T= trial): T T 5 T 5 T 5 T 5 ...
 */
exports.sendSMSLimit = createLimit('smsSend', identifyByAuth, {
  maxFreeTrials: 2, // After 2 trials and every consecutive trials
  banMinutesBase: 5, // 5 min ban
  multiplier: 1 // Do not increase the time
})

/**
 * Limit to prevent brute force OTP attack.
 * Characteristics (T= trial): T T T 5 T 50 T 500 T 5000 ...
 */
exports.authOTPLimit = createLimit('authenticatorAuth', identifyByAuth, {
  maxFreeTrials: 3, // After 3 trials and on every consecutive trials
  banMinutesBase: 5, // 5 min ban
  multiplier: 10
})

/**
 * Limit to prevent brute force Password attack.
 * Characteristics (T= trial): T T T T T 5 T 15 T 45 T 135 ...
 */
exports.authPasswordLimit = createLimit('passwordAuth', identifyByEmailAndIP, {
  maxFreeTrials: 5, // After 5 trials and on every consecutive trials
  banMinutesBase: 5, // 5 min ban
  multiplier: 3
})
