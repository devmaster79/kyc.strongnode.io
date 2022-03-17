const { createLimit } = require('./createLimit');
const { describe, it } = require('mocha');
const assert = require('assert');

describe("limit of maximal trials", () => {
    const snooze = ms => new Promise(resolve => setTimeout(resolve, ms));
    const resWhileFree = ({
        status(code) {
            assert.ok(false, "status sent while it should allow users");
        }
    });

    it("should allow 5 free trials by default", (done) => {
        const req = {};
        const getIdentifier = (req) => "testuser1";
        const limit = createLimit("testLimit", getIdentifier);

        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => {
            done()
        });
    });

    it("should allow 5 and ban after the 6th trial by default", (done) => {
        const req = {};
        const getIdentifier = (req) => "testuser2";
        const resWhileBanned = {
            status(code) {
                assert.ok(true);
                done();
            }
        };
        const limit = createLimit("testLimit", getIdentifier);

        // allow 5 trials:
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        // 6th should be banned:
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        });
    });


    it("should allow additional 5 free trial after 1 success", (done) => {
        const req = {};
        const getIdentifier = (req) => "testuser3";
        const resWhileBanned = {
            status(code) {
                assert.ok(true);
                done();
            }
        };
        const limit = createLimit("testLimit", getIdentifier);

        // allow 5 trials:
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.resolver(req, resWhileFree, () => {
            req.limits.testLimit.registerSuccess()
        })
        // allow 5 additional trials:
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        // 6th should be banned:
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        });
    });


    it("should ban after max trials for the configured time", async () => {
        const req = {};
        const getIdentifier = (req) => "testuser4";
        const config = {
            maxFreeTrials: 3,
            banMinutesBase: 0.1 / 60, // 100ms ban
            multiplier: 2,
        }
        const resWhileBanned = {
            status(code) {
                return {
                    send(data) {
                        assert.ok(true);
                    }
                }
            }
        };
        const limit = createLimit("testLimit", getIdentifier, config);

        // allow 3 trials:
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });
        limit.limiter(req, resWhileFree, () => { });

        // trials for 90ms + wait until 110ms
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(90)
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(20)

        // allow 1 additional trials:
        limit.limiter(req, resWhileFree, () => { });

        // trials for 190ms + wait for 210ms
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(190)
        limit.limiter(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(210)

        // allow 1 additional trials:
        limit.limiter(req, resWhileFree, () => { });

    });
});