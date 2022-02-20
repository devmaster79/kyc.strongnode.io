const { limitTrials } = require('./limit-trials');
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
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => {
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

        // allow 5 trials:
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        // 6th should be banned:
        limitTrials(getIdentifier)(req, resWhileBanned, () => {
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

        // allow 5 trials:
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => {
            req.limitTrials.registerSuccess()
        });
        // allow 5 additional trials:
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        limitTrials(getIdentifier)(req, resWhileFree, () => { });
        // 6th should be banned:
        limitTrials(getIdentifier)(req, resWhileBanned, () => {
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

        // allow 3 trials:
        limitTrials(getIdentifier, config)(req, resWhileFree, () => { });
        limitTrials(getIdentifier, config)(req, resWhileFree, () => { });
        limitTrials(getIdentifier, config)(req, resWhileFree, () => { });

        // trials for 90ms + wait until 110ms
        limitTrials(getIdentifier, config)(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(90)
        limitTrials(getIdentifier, config)(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(20)

        // allow 1 additional trials:
        limitTrials(getIdentifier, config)(req, resWhileFree, () => { });

        // trials for 190ms + wait for 210ms
        limitTrials(getIdentifier, config)(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(190)
        limitTrials(getIdentifier, config)(req, resWhileBanned, () => {
            assert.ok(false, "next called while it should ban");
        })
        await snooze(210)

        // allow 1 additional trials:
        limitTrials(getIdentifier, config)(req, resWhileFree, () => { });

    });
});