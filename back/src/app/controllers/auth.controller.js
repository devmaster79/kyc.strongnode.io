const { TokenService } = require('../services/auth/TokenService');
const { EmailAuthService } = require('../services/auth/EmailAuthService');
const { PasswordAuthService } = require('../services/auth/PasswordAuthService');
const { SMSAuthService } = require('../services/auth/SMSAuthService');
const { AuthenticatorAuthService } = require('../services/auth/AuthenticatorAuthService');
const { RegistrationService, UserNameIsAlreadyTakenError, LimitReachedError } = require('../services/auth/RegistrationService');
const { GravatarService } = require('../services/GravatarService');
const { EmailService } = require('../services/communication/EmailService');
const { SmsService } = require('../services/communication/SmsService');
const { default: validator } = require('validator');
const { AWS_CONFIG } = require('app/config/config');
const { sendSMSLimit, authOTPLimit, authPasswordLimit } = require('../middleware/limits');
const AWS = require('aws-sdk');

const smsService = new SmsService(new AWS.Pinpoint(AWS_CONFIG()));
const emailService = new EmailService(new AWS.SES(AWS_CONFIG()));
const userRepository = require('../models').users;
const tokenService = new TokenService();
const emailAuthService = new EmailAuthService(userRepository, emailService, tokenService);
const passwordAuthService = new PasswordAuthService(userRepository, tokenService);
const smsAuthService = new SMSAuthService(userRepository, smsService, tokenService);
const authenticatorAuthService = new AuthenticatorAuthService(userRepository, tokenService);
const gravatarService = new GravatarService();
const registrationService = new RegistrationService(userRepository, tokenService, gravatarService);

class ValidationError extends Error {
    constructor(problematic_field_name, reason) {
        super(`Wrong field value: ${problematic_field_name}`);
        this.field_name = problematic_field_name;
        this.reason = reason;
    }
}

class UnauthorizedError extends Error {
    constructor() {
        super(`Unauthorized`);
    }
}

const withResponse = (controller) => async (req, res) => {
    try {
        const response = await controller(req, res);
        if(typeof response == 'object') {
            res.send({ result: 'success', ...response });
        } else {
            res.send({ result: 'success' });
        }
    } catch (e) {
        // TODO: unifiy errors
        if(e instanceof ValidationError) {
            res.status(400).send({
                result: "validation-error",
                field: e.field_name,
                reason: e.reason,
            });
        } else if(e instanceof UnauthorizedError) {
            res.status(401).send({ result: 'unauthorized-error' });
        } else if(e instanceof LimitReachedError) {
            res.status(400).send({ result: 'limit-reached-error' });
        } else {
            res.status(500).send({ result: "unexpected-error" });
            console.error(e);
        }
    }
}

exports.sendVerificationEmail = withResponse(async req => {
    if (!validator.isEmail(req.body.email)) throw new ValidationError('email');
    await emailAuthService.sendVerificationEmail(req.body.email);
});

exports.register = withResponse(async req => {
    if (!req.body.first_name) throw new ValidationError('first_name');
    if (!req.body.last_name) throw new ValidationError('last_name');
    if (!req.body.user_name) throw new ValidationError('user_name');
    try {
        const token = await registrationService.createUser({
            email: req.user.email,
            user_name: req.body.user_name,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
        })
        console.log(token);
        return { token };
    } catch(e) {
        if(e instanceof UserNameIsAlreadyTakenError) {
            throw new ValidationError('user_name', 'already-taken')
        } else {
            throw e;
        }
    }
})

exports.enablePasswordAuth = withResponse(async req => {
    if (req.body.password.length <= 6) throw new ValidationError('password', "too-short");
    await passwordAuthService.setPassword(req.user.email, req.body.password);
});

exports.disablePasswordAuth = withResponse(async req => {
    await passwordAuthService.disablePasswordAuth(req.user.email);
});

exports.authByPassword = withResponse(async req => {
    if (!req.body.password) throw new ValidationError('password');
    const token = await passwordAuthService.authByPassword(req.user.email, req.body.password);
    if (!token) throw new ValidationError('password', 'wrong');
    authPasswordLimit.resolve(req);
    return { token };
});

exports.sendSMSToUser = withResponse(async req => {
    await smsAuthService.sendSMS(req.user.email);
});

exports.authBySMSCode = withResponse(async req => {
    if (!req.body.smscode) throw new ValidationError('smscode');
    const token = await smsAuthService.authBySMS(req.user.email, req.body.smscode);
    if (!token) throw new ValidationError('smscode','wrong');
    sendSMSLimit.resolve(req);
    authOTPLimit.resolve(req);
    return { token };
});

exports.sendSMSAndSaveNumber = withResponse(async req => {
    if (!req.body.number) throw new ValidationError('number');
    await smsAuthService.sendSMSAndStoreNumber(req.user.email, req.body.number);
});

exports.enableSMSAuth = withResponse(async req => {
    if (!req.body.smscode) throw new ValidationError('smscode');
    const result = await smsAuthService.activateSMSAuth(req.user.email, req.body.smscode);
    if (!result) throw new ValidationError('smscode', 'wrong');
    sendSMSLimit.resolve(req);
});

exports.disableSMSAuth = withResponse(async req => {
    await smsAuthService.deactivate(req.user.email);
});

exports.authByAuthenticator = withResponse(async req => {
    if (!req.body.token) throw new ValidationError('token');
    const token = await authenticatorAuthService.authByAuthenticator(req.user.email, req.body.token);
    if (!token) throw new ValidationError('token','wrong');
    authOTPLimit.resolve(req);
    return { token };
});

exports.generateAuthenticatorQRCode = withResponse(async req => {
    const qrcode = await authenticatorAuthService.generateQRCode(req.user.email);
    return { qrcode };
});

exports.enableAuthenticatorAuth = withResponse(async req => {
    if (!req.body.token) throw new ValidationError('token');
    const result = await authenticatorAuthService.activateAuthenticatorAuth(req.user.email, req.body.token);
    if (!result) throw new ValidationError('token', 'wrong');
});

exports.disableAuthenticatorAuth = withResponse(async req => {
    await authenticatorAuthService.deactivateAuthenticatorAuth(req.user.email);
});