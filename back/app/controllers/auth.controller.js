const { TokenService } = require('../services/auth/TokenService');
const { EmailAuthService } = require('../services/auth/EmailAuthService');
const { PasswordAuthService } = require('../services/auth/PasswordAuthService');
const { SMSAuthService } = require('../services/auth/SMSAuthService');
const { QRAuthService } = require('../services/auth/QRAuthService');
const { RegistrationService, UserNameIsAlreadyTakenError, EmailIsAlreadyRegisteredError } = require('../services/auth/RegistrationService');
const { GravatarService } = require('../services/GravatarService');

const { default: validator } = require('validator');
const { sendSMSLimit, authOTPLimit, authPasswordLimit } = require('../middleware/limits');
const communicationService = require('../services/communication.services');
const userRepository = require('../models').users;
const tokenService = new TokenService();
const emailAuthService = new EmailAuthService(userRepository, communicationService, tokenService);
const passwordAuthService = new PasswordAuthService(userRepository, tokenService);
const smsAuthService = new SMSAuthService(userRepository, communicationService, tokenService);
const qrAuthService = new QRAuthService(userRepository, tokenService);
const gravatarService = new GravatarService();
const registrationService = new RegistrationService(userRepository, tokenService, gravatarService);

class ValidationError extends Error {
    constructor(problematic_field_name, reason) {
        super(`Wrong field value: ${problematic_field_name}`);
        this.field_name = problematic_field_name;
        this.reason = reason;
    }
}
class GenericClientError extends Error {
    constructor(id) {
        super(`${id}`);
        this.id = id;
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
        } else if(e instanceof GenericClientError) {
            res.status(400).send({ result: e.id });
        } else if(e instanceof UnauthorizedError) {
            res.status(401).send({ result: 'unauthorized-error' });
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
        return { token };
    } catch(e) {
        if(e instanceof UserNameIsAlreadyTakenError) {
            throw new ValidationError('user_name', 'already-taken')
        }
    }
})

exports.enablePasswordAuth = withResponse(async req => {
    if (req.body.password.length >= 6) throw new ValidationError('password');
    const result = await passwordAuthService.setPassword(req.user.email, req.body.password);
    if (!result) throw new GenericClientError("unable-to-set-password-error");
});

exports.disablePasswordAuth = withResponse(async req => {
    const result = await passwordAuthService.disablePasswordAuth(req.user.email);
    if (!result) throw new GenericClientError("unable-to-remove-password-error");
});

exports.authByPassword = withResponse(async req => {
    if (!req.body.password) throw new ValidationError('password');
    const token = await passwordAuthService.authByPassword(req.user.email, passwrod);
    if (!token) throw new UnauthorizedError();
    authPasswordLimit.resolve(req);
    return { token };
});

exports.sendSMSToUser = withResponse(async req => {
    await smsAuthService.sendSMS(req.user.email);
});

exports.authBySMSCode = withResponse(async req => {
    if (!req.body.smscode) throw new ValidationError('smscode');
    const token = await smsAuthService.authBySMS(req.user.email, req.body.smscode);
    if (!token) throw new UnauthorizedError();
    sendSMSLimit.resolve(req);
    authOTPLimit.resolve(req);
    return { token };
});

exports.sendSMSAndSaveNumber = withResponse(async req => {
    if (!req.body.number) throw new ValidationError('smscode');
});

exports.enableSMSAuth = withResponse(async req => {
    if (!req.body.smscode) throw new ValidationError('smscode');
    const result = await smsAuthService.activateSMSAuth(req.user.email, req.body.smscode);
    if (!result) throw new GenericClientError('unable-to-activate-sms-auth-error');
    sendSMSLimit.resolve(req);
});

exports.disableSMSAuth = withResponse(async req => {
    const result = await smsAuthService.deactivate(req.user.email);
    if (!result) throw new GenericClientError('unable-to-deactivate-sms-auth-error');
});

exports.authByQRCode = withResponse(async req => {
    if (!req.body.token) throw new ValidationError('token');
    const token = await qrAuthService.authByQR(req.user.email, req.body.token);
    if (!token) throw new UnauthorizedError();
    authOTPLimit.resolve(req);
    return { token };
});

exports.generateQRCode = withResponse(async req => {
    const qrcode = await qrAuthService.generateQRCode(req.user.email);
    if (!qrcode) throw new GenericClientError('unable-to-generate-qr-code-error');
    return { qrcode };
});

exports.enableQRAuth = withResponse(async req => {
    if (!req.body.token) throw new ValidationError('token');
    const result = await qrAuthService.activateQrAuth(req.user.email, req.body.token);
    if (!result) throw new GenericClientError('unable-to-activate-qr-auth-error');
});

exports.disableQRAuth = withResponse(async req => {
    const result = await qrAuthService.deactivateQrAuth(req.user.email);
    if (!result) throw new GenericClientError('unable-to-deactivate-qr-auth-error');
});