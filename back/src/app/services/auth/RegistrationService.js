const { REGISTRATION_LIMIT } = require('app/config/config');
const { MODE_REGISTRATION } = require('./TokenService');

class RegistrationService {
    /**
     * @param {typeof import('sequelize').Model} userRepository
     * @param {import('./TokenService').TokenService} tokenService
     * @param {import('../GravatarService').GravatarService} gravatarService
     */
    constructor(userRepository, tokenService, gravatarService) {
        this.__userRepository = userRepository;
        this.__tokenService = tokenService;
        this.__gravatarService = gravatarService;
    }

    /**
     * Create a new user
     * @param {Object} props
     * @param {string} props.email
     * @param {string} props.user_name
     * @param {string} props.first_name
     * @param {string} props.last_name
     *
     * @throws {EmailIsAlreadyRegisteredError}
     * @throws {UserNameIsAlreadyTakenError}
     *
     * @returns {Promise<string>} access token to the dashboard
     */
    async createUser(props) {
        if(await this.__isEmailRegistered(props.email)) {
            // NOTE: this case couldn't happen,
            // because if email is registered user will only see the login screen or dashboard.
            throw new EmailIsAlreadyRegisteredError();
        }
        if(await this.__isUserNameRegistered(props.user_name)) {
            throw new UserNameIsAlreadyTakenError();
        }
        if(await this.__isLimitReached()) {
            throw new LimitReachedError();
        }
        const profile_img_url = await this.__gravatarService.getProfileImageURL(props.email);
        const user = await this.__userRepository.create({
            email: props.email,
            user_name: props.user_name,
            first_name: props.first_name,
            last_name: props.last_name,
            ...(profile_img_url ? { profile_img_url } : {})
        });
        if(!user) throw new new UnableToCreateUserError();
        const nextMode = this.__tokenService.determineNextMode(user, MODE_REGISTRATION);
        const token = this.__tokenService.generateToken(user.email, user.user_name, nextMode);
        return token;
    }

    /**
     * Check whether the email exists or not
     * @param {string} email
     * @returns {Promise<boolean>}
     */
     async __isEmailRegistered(email) {
        const user = await this.__userRepository.findOne({ where: { email } });
        return !!user;
    }

    /**
     * Check whether the user_name exists or not
     * @param {string} user_name
     * @returns {Promise<boolean>}
     */
    async __isUserNameRegistered(user_name) {
        const user = await this.__userRepository.findOne({ where: { user_name } });
        return !!user;
    }

    /**
     * Check whether the registration limit is reached or not
     * @returns {Promise<boolean>}
     */
    async __isLimitReached() {
        const number_of_users = await this.__userRepository.count();
        return number_of_users >= REGISTRATION_LIMIT;
    }
}

/**
 * Please do not share this error with users
 */
 class EmailIsAlreadyRegisteredError extends Error {
    constructor() {
        super("Email is already registered.")
    }
}

class UserNameIsAlreadyTakenError extends Error {
    constructor() {
        super("Email is already registered.")
    }
}

class UnableToCreateUserError extends Error {
    constructor() {
        super("Unable to create user.")
    }
}

class LimitReachedError extends Error {
    constructor() {
        super("Maximum number of users reached")
    }
}

module.exports = {
    RegistrationService,
    EmailIsAlreadyRegisteredError,
    UserNameIsAlreadyTakenError,
    UnableToCreateUserError,
    LimitReachedError
};