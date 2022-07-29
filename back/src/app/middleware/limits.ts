import {
  createLimit,
  identifyByAuth,
  identifyByEmailAndIP
} from './utils/createLimit'

/**
 * Limit to prevent SMS flood attack.
 * Characteristics (T= trial): T T 5 T 5 T 5 T 5 ...
 */
export const sendSMSLimit = createLimit('smsSend', identifyByAuth, {
  maxFreeTrials: 2, // After 2 trials and every consecutive trials
  banMinutesBase: 5, // 5 min ban
  multiplier: 1, // Do not increase the time
  resetCountAfterBanExpires: false // false = allow only 1 trial after ban expires
})

/**
 * Limit to prevent brute force OTP attack.
 * Characteristics (T= trial): T T T 5 T 50 T 500 T 5000 ...
 */
export const authOTPLimit = createLimit('authenticatorAuth', identifyByAuth, {
  maxFreeTrials: 3, // After 3 trials and on every consecutive trials
  banMinutesBase: 5, // 5 min ban
  multiplier: 10,
  resetCountAfterBanExpires: false // false = allow only 1 trial after ban expires
})

/**
 * Limit to prevent brute force Password attack.
 * Characteristics (T= trial): T T T T T 5 T 15 T 45 T 135 ...
 */
export const authPasswordLimit = createLimit(
  'passwordAuth',
  identifyByEmailAndIP,
  {
    maxFreeTrials: 5, // After 5 trials and on every consecutive trials
    banMinutesBase: 5, // 5 min ban
    multiplier: 3,
    resetCountAfterBanExpires: false // false = allow only 1 trial after ban expires
  }
)

/**
 * Limit to prevent high AWS costs for identity verification
 * This limit is calculated together with 2 uploads + 1 submit
 *
 * Characteristics (T^N= N trials): T^60 5hour T^60 25hour T^60 ...
 */
export const identityVerificationLimit = createLimit(
  'identityVerificationLimit',
  identifyByAuth,
  {
    // for letting users correct their picture issues like "head is not straight enough"
    // I estimate the maximum trials for one photo is about 20
    // identity verification has two photos, so its 40
    // and with each trial the user can submit the form which is another 20 so 60
    maxFreeTrials: 60,
    banMinutesBase: 5 * 60, // 5 hour cool down
    multiplier: 5, // after 5 hour ban and another 60 trials the user will be banned from the feature for a whole day
    resetCountAfterBanExpires: true // after the ban expires the user can send another 60 requests
  }
)
