export const base_url = process.env.REACT_APP_BASE_URL + '/api';

// USER
export const investor_url = `${base_url}/users/createInvestor`;
export const upload_profile_img = `${base_url}/users/profile/image`;
export const profile_url = `${base_url}/users/profile`;

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
export const authByQRCode = `${base_url}/auth/authByQRCode`;
export const generateQRCode = `${base_url}/auth/generateQRCode`;
export const enableQRAuth = `${base_url}/auth/enableQRAuth`;
export const disableQRAuth = `${base_url}/auth/disableQRAuth`;

// HISTORY
export const findAllVested = `${base_url}/history/findAllVested`;
export const findAllWithdrawn = `${base_url}/history/findAllWithdrawn`;
export const history_url = `${base_url}/history`;

// NEWS
export const get_news = `${base_url}/news`;
