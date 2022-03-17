const { describe, teardown } = require('mocha');
const assert = require('assert');
const { QRAuthService } = require('./QRAuthService');
const { TokenService } = require('./TokenService');

const OriginalDate = Date;
const setTime = (t) => {Date = { now() { return t } }};
const resetTime = () => {Date = OriginalDate};

describe('QR Authentication', () => {
    const tokenService = new TokenService();
    it('should work', async () => {
        let actualToken;
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
                if(data.qr_secret && data.qr_secret.length) {
                    setTime(1000)
                    data.qr_secret = 'GEZDGNBVGY3TQOJQGEZDGNBVGY3TQOJQ';
                    // with this date and secret the token will be this:
                    actualToken = '755224';
                }

                userRecord = { ...userRecord, ...data };
                return [1];
            }
        };

        const qrAuthService = new QRAuthService(fakeUserRepository, tokenService);

        const preAuthResult = await qrAuthService.authByQR(userRecord.email, "123");
        assert.equal(preAuthResult, null);

        const generateResult = await qrAuthService.generateQRCode(userRecord.email);
        assert.equal(typeof generateResult, 'string');

        const activateResult = await qrAuthService.activateQrAuth(
            userRecord.email,
            actualToken
        );
        assert.equal(activateResult, true);

        const authResult = await qrAuthService.authByQR(
            userRecord.email,
            actualToken
        );
        assert.equal(typeof authResult, 'string');
    })

    teardown(() => {
        resetTime()
    })
});