import { MODE_GUEST, MODE_REGISTRATION, MODE_2FA, MODE_FULL, AuthMode } from './TokenService';
import * as routes from "shared/routes";
import { emailTemplatesNames } from '../communication.services';
import path from 'path';
import { Model } from 'sequelize/types';

class EmailAuthService {
    /**
     * dbiro: these will be migrated correctly to typescript later
     * @param {typeof import('sequelize').Model} userRepository
     * @param {import('../communication.services')} communicationService
     * @param {import('./TokenService').TokenService} tokenService
     */
    constructor(
        private __userRepository: any,
        private __communicationService: any,
        private __tokenService: any
    ) {}

    /**
     * send email with link for the next step
     * if not registered -> signin link
     * if registered -> signup link
     */
    async sendVerificationEmail(email: string) {
        email = email.toLowerCase();
        let link;
        const user = await this.__userRepository.findOne({ where: { email } });
        if(user) {
            const mode = this.__tokenService.determineNextMode(user, MODE_GUEST);
            const token = this.__tokenService.generateToken(email, user.user_name, mode);
            link = this.__getURL(mode, token, user);
        } else {
            const mode = MODE_REGISTRATION;
            const token = this.__tokenService.generateToken(email, null, mode);
            link = this.__getURL(mode, token, undefined);
        }
        await this.__communicationService.sendTemplatedEmail(
            email,
            { link },
            emailTemplatesNames.confirmEmail
        );
    }

    /**
     * TODO: type user
     * @param {Object|undefined} user
     * @param {boolean} user.enable_qr,
     * @param {boolean} user.enable_sms,
     * @param {boolean} user.enable_password,
     */
    __getURL(mode: AuthMode, token: string, user: any) {
        return (new URL(this.__getRoute(mode, token, user), process.env.FRONTEND_URL)).href;
    }

    /**
     * TODO: type user
     * @param {Object|undefined} user
     * @param {boolean} user.enable_qr,
     * @param {boolean} user.enable_sms,
     * @param {boolean} user.enable_password,
     */
    __getRoute(mode: AuthMode, token: string, user: any) {
        switch (mode.id) {
            case MODE_GUEST.id:
                return ''
            case MODE_REGISTRATION.id:
                return `${routes.REGISTER}?token=${token}`
            case MODE_2FA.id:
                if (user.enable_qr)
                    return `${routes.SIGN_IN_WITH_AUTHENTICATOR}?token=${token}`
                if (user.enable_sms)
                    return `${routes.SIGN_IN_WITH_SMS}?token=${token}`
                if (user.enable_password)
                    return `${routes.SIGN_IN_WITH_PASSWORD}?token=${token}`
            case MODE_FULL.id:
                return `${routes.SIGN_IN_WITH_TOKEN}?token=${token}`
            default:
                throw "Unexpected mode.id: " + mode.id
        }
    }
}

module.exports = {
    EmailAuthService
};