export const base_url = process.env.REACT_APP_BASE_URL + '/api';

// USER
export const investor_url = `${base_url}/users/createInvestor`;
export const get_investor_details = `${base_url}/users/profile/getInvestorProfile`;
export const upload_profile_img = `${base_url}/users/profile/image`;
export const profile_url = `${base_url}/users/profile`;
export const create_support_request = `${base_url}/users/support/create-request`;

// AUTH
export const sendVerificationEmail = `${base_url}/auth/sendVerificationEmail`;
export const register = `${base_url}/auth/register`;
export const enablePasswordAuth = `${base_url}/auth/enablePasswordAuth`;
export const disablePasswordAuth = `${base_url}/auth/disablePasswordAuth`;
export const authByPassword = `${base_url}/auth/authByPassword`;
export const sendSMSToUser = `${base_url}/auth/sendSMSToUser`;
export const authBySMSCode = `${base_url}/auth/authBySMSCode`;
export const sendSMSAndSaveNumber = `${base_url}/auth/sendSMSAndSaveNumber`;
export const enableSMSAuth = `${base_url}/auth/enableSMSAuth`;
export const disableSMSAuth = `${base_url}/auth/disableSMSAuth`;
export const authByAuthenticator = `${base_url}/auth/authByAuthenticator`;
export const generateAuthenticatorQRCode = `${base_url}/auth/generateAuthenticatorQRCode`;
export const enableAuthenticatorAuth = `${base_url}/auth/enableAuthenticatorAuth`;
export const disableAuthenticatorAuth = `${base_url}/auth/disableAuthenticatorAuth`;

// HISTORY
export const findAllVested = `${base_url}/history/findAllVested`;
export const findAllWithdrawn = `${base_url}/history/findAllWithdrawn`;
export const findWithdrawnDetails = `${base_url}/history/findWithdrawnDetails`;
export const findVestedDetails = `${base_url}/history/findVestedDetails`;
export const history_url = `${base_url}/history`;

// NEWS
export const get_news = `${base_url}/news`;
