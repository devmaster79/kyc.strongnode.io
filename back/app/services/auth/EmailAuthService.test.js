const { describe } = require('mocha');
const assert = require('assert');
const { EmailAuthService } = require('./EmailAuthService');
const { TokenService, MODE_FULL, MODE_REGISTRATION } = require('./TokenService');


describe('Email Authentication', () => {
    const tokenService = new TokenService();
    it('should work for registered users', async () => {
        let userRecord = {
            user_name: "test",
            email: "test@test.com",
            password: "",
            enable_password: false,
            enable_qr: false,
            enable_sms: false,
        };
        const fakeUserRepository = {
            findOne() {
                return userRecord;
            },
            update(data, query) {
                assert.equal(userRecord.email, query.where.email);
                userRecord = { ...userRecord, ...data };
                return [1];
            }
        };
        const fakeCommunicationService = {
            sendTemplatedEmail(to, templateData, _templateName) {
                assert.equal(to, userRecord.email);
                let token = templateData.link.split('token=')[1];
                assert.ok(token.length)
                let decoded = tokenService.decode(token, [MODE_FULL]);
                assert.notEqual(decoded, null);
                assert.equal(decoded.email, userRecord.email);
                assert.equal(decoded.user_name, userRecord.user_name);
            }
        };
        const emailAuthService = new EmailAuthService(
            fakeUserRepository,
            fakeCommunicationService,
            tokenService
        );

        await emailAuthService.sendVerificationEmail(userRecord.email);
    });

    it('should work for non-registered users', async () => {
        const userRecord = {};
        const email = "test@test.com";
        const fakeUserRepository = {
            findOne() {
                throw new Error("could not found user")
            },
            update(_data, _query) {
                return [0];
            }
        };
        const fakeCommunicationService = {
            sendTemplatedEmail(to, templateData, _templateName) {
                assert.equal(to, email);
                let token = templateData.link.split('token=')[1];
                assert.ok(token.length)
                let decoded = tokenService.decode(token, [MODE_REGISTRATION]);
                assert.notEqual(decoded, null);
                assert.equal(decoded.email, email);
                assert.equal(decoded.user_name, null);
            }
        };
        const emailAuthService = new EmailAuthService(
            fakeUserRepository,
            fakeCommunicationService,
            tokenService
        );

        await emailAuthService.sendVerificationEmail(email);
    });
});