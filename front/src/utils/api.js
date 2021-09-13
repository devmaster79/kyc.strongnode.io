import axios from 'axios';
import { signup_url, password_url, sms_url, check_sms_url, qr_url, verify_qr_url } from './config';

const signup = async (data) => {
    const config = {
        url: signup_url,
        method: "POST",
        data: data
    };
    axios(config)
        .then(res => console.log(res));
}

const createPassword = async (data) => {
    const config = {
        url: password_url,
        method: "PUT",
        data: data
    }
    return axios(config);
}

const sendSMS = async (number, email) => {
    const config = {
        url: sms_url,
        method: "POST",
        data: {
            number: number,
            email: email
        }
    };
    return axios(config);
}

const checkSMS = async (email) => {
    const config = {
        url: check_sms_url,
        method: "GET",
        params: {
            email: email
        }
    };
    return axios(config);
}

const createQR = async (email) => {
    const config = {
        url: qr_url,
        method: "PUT",
        data: {
            email: email
        }
    };
    return axios(config);
}

const verifyTOTP = async (email, token) => {
    const config = {
        url: verify_qr_url,
        method: "POST",
        data: {
            email: email,
            token: token
        }
    };
    return axios(config);
}

export default signup;
export { createPassword, sendSMS, checkSMS, createQR, verifyTOTP };