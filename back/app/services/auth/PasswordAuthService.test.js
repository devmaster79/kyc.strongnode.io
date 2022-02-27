const { describe } = require('mocha');
const assert = require('assert');
const { PasswordAuthService } = require('./PasswordAuthService');
const { TokenService } = require('./TokenService');


describe('Password authentication', () => {
    const tokenService = new TokenService();
    it('should work', async () => {
        let userRecord = {
            email: "test@test.com",
            password: "",
            enable_password: false,
            enable_qr: false,
            enable_sms: false,
        }

        const fakeUserRepository = {
            findOne() {
                return userRecord;
            },
            update(data, query) {
                assert.equal(userRecord.email, query.where.email)
                userRecord = { ...userRecord, ...data };
                return [1];
            }
        };
        const passwordAuthService = new PasswordAuthService(fakeUserRepository, tokenService);

        const setResult = await passwordAuthService.setPassword(
            userRecord.email,
            "something"
        )
        assert.equal(userRecord.enable_password, true);
        assert.equal(setResult, true);
        const authResult = await passwordAuthService.authByPassword(
            userRecord.email,
            "something"
        )
        assert.equal(typeof authResult, 'string');
        const removeResult = await passwordAuthService.removePassword(
            userRecord.email,
        )
        assert.equal(removeResult, true);
        assert.equal(userRecord.enable_password, false);
    })
});