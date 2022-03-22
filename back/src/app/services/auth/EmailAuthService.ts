import { MODE_GUEST, MODE_REGISTRATION, MODE_2FA, MODE_FULL, AuthMode } from './TokenService';
import * as routes from "shared/routes";
import { RegistrationTemplate } from '../communication/templates/RegistrationTemplate';
import { SignInTemplate } from '../communication/templates/SignInTemplate';
import type { EmailService } from '../communication/EmailService';
import type { TokenService } from './TokenService';
class EmailAuthService {
    /**
     * dbiro: this will be migrated correctly to typescript later
     * @param {typeof import('sequelize').Model} userRepository
     */
    constructor(
        private __userRepository: any,
        private __emailService: EmailService,
        private __tokenService: TokenService
    ) { }

    /**
     * send email with link for the next step
     * if not registered -> signin link
     * if registered -> signup link
     */
    async sendVerificationEmail(email: string) {
        email = email.toLowerCase();
        let link;
        const user = await this.__userRepository.findOne({ where: { email } });
        if (user) {
            const mode = this.__tokenService.determineNextMode(user, MODE_GUEST);
            const token = this.__tokenService.generateToken(email, user.user_name, mode);
            link = this.__getURL(mode, token, user);
            await this.__emailService.sendTemplate(
                email,
                new SignInTemplate(),
                { link, userName: user.user_name }
            );
        } else {
            const mode = MODE_REGISTRATION;
            const token = this.__tokenService.generateToken(email, null, mode);
            link = this.__getURL(mode, token, undefined);
            await this.__emailService.sendTemplate(
                email,
                new RegistrationTemplate(),
                { link }
            );
        }
    }

    /**
     * TODO: type user
     * @param {Object|undefined} user
     * @param {boolean} user.enable_authenticator,
     * @param {boolean} user.enable_sms,
     * @param {boolean} user.enable_password,
     */
    __getURL(mode: AuthMode, token: string, user: any) {
        return (new URL(this.__getRoute(mode, token, user), process.env.FRONTEND_URL)).href;
    }

    /**
     * TODO: type user
     * @param {Object|undefined} user
     * @param {boolean} user.enable_authenticator,
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
                if (user.enable_authenticator)
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