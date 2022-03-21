const { describe, it } = require('mocha');
const assert = require('assert');
const { SmsService } = require('./SmsService');

describe('SmsService', () => {
    const PHONE_NUMBER = '+999999';
    const MESSAGE = 'Something';

    it('should be able to call aws right', async () => {
        let called = false;
        const fakePinpoint = {
            /**
             * @param {import('aws-sdk/clients/pinpoint').SendMessagesRequest} params
             */
            sendMessages(params) {
                assert.equal(params.MessageRequest.Addresses[PHONE_NUMBER].ChannelType, 'SMS');
                assert.equal(params.MessageRequest.MessageConfiguration.SMSMessage.Body, MESSAGE);
                called = true;
                return {
                    promise() {
                        return Promise.resolve()
                    }
                }
            }
        };
        const smsService = new SmsService(fakePinpoint);
        await smsService.send(PHONE_NUMBER, MESSAGE)
        assert.ok(called);
    })
});