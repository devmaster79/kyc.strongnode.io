const { describe, it } = require('mocha');
const assert = require('assert');
const { TokenService } = require('./TokenService');
const {
    RegistrationService,
    EmailIsAlreadyRegisteredError,
    UserNameIsAlreadyTakenError
} = require('./RegistrationService');

describe("Registration service", () => {
    const tokenService = new TokenService();
    const fakeGravatarService = (withResponse) => ({
        async getProfileImageURL(_email) {
            return withResponse;
        }
    });

    it("should throw error when email is registered", async () => {
        let userRecord = {
            email: "test@test.com",
            user_name: "test",
        }

        const fakeUserRepository = {
            findOne(query) {
                if (query.where.email == userRecord.email) {
                    return userRecord;
                } else {
                    return null
                }
            },
            create(_data) {
                assert.ok(false, "User is created but it should not be created");
            }
        };
        const registrationService = new RegistrationService(
            fakeUserRepository,
            tokenService,
            fakeGravatarService(null)
        );
        try {
            await registrationService.createUser({
                email: userRecord.email, // same email
                user_name: "test2",
                first_name: "Test",
                last_name: "Test"
            });
            assert.ok(false, "There were no errors but there should be.");
        } catch (e) {
            assert.ok(e instanceof EmailIsAlreadyRegisteredError, e)
        }
    });

    // NOTE: The current auth flow does not tell us that the email is registered or not.
    // Unfortunately we cannot provide this for the username.
    // Afaik username is part of the requirements, therefore this test case:
    it("should throw error when user_name is registered", async () => {
        let userRecord = {
            email: "test@test.com",
            user_name: "test",
        }

        const fakeUserRepository = {
            findOne(query) {
                if (query.where.user_name == userRecord.user_name) {
                    return userRecord;
                } else {
                    return null
                }
            },
            create(_data) {
                assert.ok(false, "User is created but it should not be created");
            }
        };
        const registrationService = new RegistrationService(
            fakeUserRepository,
            tokenService,
            fakeGravatarService(null)
        );
        try {
            await registrationService.createUser({
                email: "test2@test2.com", // different email
                user_name: userRecord.user_name, // same user_name
                first_name: "Test",
                last_name: "Test"
            });
            assert.ok(false, "There were no errors but there should be.");
        } catch (e) {
            assert.ok(e instanceof UserNameIsAlreadyTakenError, e)
        }
    });

    it("should create user with gravatar if available and auth user", async () => {
        const profileURL = "http.//something.com/me.jpg";
        const fakeUserRepository = {
            findOne(_query) {
                return null;
            },
            create(data) {
                assert.equal(data.profile_img_url, profileURL);
                return data;
            }
        };
        const registrationService = new RegistrationService(
            fakeUserRepository,
            tokenService,
            fakeGravatarService(profileURL)
        );
        const token = await registrationService.createUser({
            email: "test2@test2.com",
            user_name: "test",
            first_name: "Test",
            last_name: "Test",
        });
        assert.equal(typeof token, 'string');
    });

    it("should create user without gravatar and auth user", async () => {
        const fakeUserRepository = {
            findOne(_query) {
                return null;
            },
            create(data) {
                return data;
            }
        };
        const registrationService = new RegistrationService(
            fakeUserRepository,
            tokenService,
            fakeGravatarService(null)
        );
        const token = await registrationService.createUser({
            email: "test2@test2.com",
            user_name: "test",
            first_name: "Test",
            last_name: "Test",
        });
        assert.equal(typeof token, 'string');
    });
});