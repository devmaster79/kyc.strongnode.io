const { describe, teardown } = require('mocha');
const assert = require('assert');
const { AuthenticatorAuthService } = require('./AuthenticatorAuthService');
const { TokenService } = require('./TokenService');

const OriginalDate = Date;
const setTime = (t) => {Date = { now() { return t } }};
const resetTime = () => {Date = OriginalDate};

describe('Authenticator Authentication', () => {
    const tokenService = new TokenService();
    it('should work', async () => {
        let actualToken;
        let userRecord = {
            email: "test@test.com",
            password: "",
            enable_password: false,
            enable_authenticator: false,
            enable_sms: false,
        }

        const fakeUserRepository = {
            findOne() {
                return userRecord;
            },
            update(data, query) {
                assert.equal(userRecord.email, query.where.email)
                if(data.authenticator_qr_secret && data.authenticator_qr_secret.length) {
                    setTime(1000)
                    data.authenticator_qr_secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
                    // with this date and secret the token will be this:
                    actualToken = '755224';
                }

                userRecord = { ...userRecord, ...data };
                return [1];
            }
        };

        const authenticatorAuthService = new AuthenticatorAuthService(fakeUserRepository, tokenService);

        const preAuthResult = await authenticatorAuthService.authByAuthenticator(userRecord.email, "123");
        assert.equal(preAuthResult, null);

        const generateResult = await authenticatorAuthService.generateQRCode(userRecord.email);
        assert.equal(typeof generateResult, 'string');

        const activateResult = await authenticatorAuthService.activateAuthenticatorAuth(
            userRecord.email,
            actualToken
        );
        assert.equal(activateResult, true);

        const authResult = await authenticatorAuthService.authByAuthenticator(
            userRecord.email,
            actualToken
        );
        assert.equal(typeof authResult, 'string');
    })

    teardown(() => {
        resetTime()
    })
});