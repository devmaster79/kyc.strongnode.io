import axios from 'axios';
import * as urls from 'utils/config';

/**
 * @typedef Success
 * @property {'success'} result
 */

/**
 * @typedef UnexpectedError
 * @property {'unexpected-error'} result
 */

/**
 * @typedef UnauthorizedError
 * @property {'unauthorized-error'} result
 */

/**
 * @template F,R
 * @typedef ValidationError
 * @property {'validation-error'} result
 * @property {F} field
 * @property {R} reason
 */

/**
 * @typedef {Success|UnexpectedError|UnauthorizedError} GenericResponse
 */

/**
 * Get the response data even if the response status is not 2xx
 * @param {string} route
 * @param {any} data
 * @returns {Promise<any>}
 */
 async function getResponse(route, data) {
    try {
        const response = await axios.post(route, data);
        return response.data;
    } catch(e) {
        return e.response.data;
    }
}

/**
 * @param {string} token
 */
function setToken(token) {
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
};

/**
 * Set token when possible
 * @param {string} route
 * @param {Promise<any>}  receivingData
 * @returns {Promise<any>}
 */
async function withSettingToken(receivingData) {
    const data = await receivingData;
    if(data.token) setToken(data.token);
    return data;
}

export default {
    /**
     * @param {string} email
     * @returns {Promise<Success|UnexpectedError|ValidationError.<'email',undefined>>}
     */
    sendVerificationEmail(email) {
        return getResponse(urls.sendVerificationEmail, { email })
    },
    /**
     * @param {Object} params
     * @param {string} params.user_name
     * @param {string} params.first_name
     * @param {string} params.last_name
     * @returns {Promise<
            GenericResponse|
            ValidationError.<'user_name', undefined>|
            ValidationError.<'user_name', 'already-taken'>|
            ValidationError.<'first_name', undefined>|
            ValidationError.<'last_name', undefined>
        >}
     */
    register(params) {
        return getResponse("/register", {
            user_name: params.user_name,
            first_name: params.first_name,
            last_name: params.last_name,
        });
    },
    /**
     * @param {string} password
     * @returns {Promise<GenericResponse,ValidationError.<'password'>>}
     */
    enablePasswordAuth(password) {
        return getResponse(urls.enablePasswordAuth, { password });
    },
    /**
     * @returns {Promise<GenericResponse>}
     */
    disablePasswordAuth() {
        return getResponse(urls.disablePasswordAuth);
    },
    /**
     * @param {string} password
     * @returns {Promise<GenericResponse,ValidationError.<'password'>>}
     */
    authByPassword(password) {
        return withSettingToken(getResponse(urls.authByPassword, { password }));
    },
    /**
     * @returns {Promise<GenericResponse>}
     */
    sendSMSToUser() {
        return getResponse(urls.sendSMSToUser);
    },
    /**
     * @param {string} smscode
     * @returns {Promise<GenericResponse,ValidationError.<'smscode'>>}
     */
    authBySMSCode(smscode) {
        return withSettingToken(getResponse(urls.authBySMSCode, { smscode }));
    },
    /**
     * @param {string} phoneNumber
     * @returns {Promise<GenericResponse,ValidationError.<'number'>>}
     */
    sendSMSAndSaveNumber(phoneNumber) {
        return getResponse(urls.sendSMSAndSaveNumber, { number: phoneNumber });
    },
    /**
     * @param {string} smscode
     * @returns {Promise<GenericResponse,ValidationError.<'smscode'>>}
     */
    enableSMSAuth(smscode) {
        return getResponse(urls.enableSMSAuth, { smscode });
    },
    /**
     * @returns {Promise<GenericResponse>}
     */
    disableSMSAuth() {
        return getResponse(urls.disableSMSAuth);
    },
    /**
     * @param {string} token
     * @returns {Promise<GenericResponse,ValidationError.<'token'>>}
     */
    authByQRCode(token) {
        return withSettingToken(getResponse(urls.authByQRCode, { token }));
    },
    /**
     * @returns {Promise<GenericResponse>}
     */
    generateQRCode() {
        return getResponse(urls.generateQRCode);
    },
    /**
     * @param {string} token
     * @returns {Promise<GenericResponse,ValidationError.<'token'>>}
     */
    enableQRAuth(token) {
        return getResponse(urls.enableQRAuth, { token });
    },
    /**
     * @returns {Promise<GenericResponse>}
     */
    disableQRAuth() {
        return getResponse(urls.disableQRAuth);
    },
}