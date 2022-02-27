/** Route to store the token and redirect user to the dashboard  */
exports.SIGNIN = (token) => `/signin?token=${token}`;
/** Registration */
exports.SIGNUP = (token) => `/signup?token=${token}`;
/** Optional password authentication */
exports.SIGNINPASS = (token) => `/signinpass?token=${token}`;
/** Optional QR authentication */
exports.SIGNINQR = (token) => `/signintwostep?token=${token}`;
/** Optional SMS authentication */
exports.SIGNINSMS = (token) => `/signinsms?token=${token}`;