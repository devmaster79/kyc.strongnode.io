# modular_codebase
1. Keep related things close to each other.
e.g: UserController and PostController are not, but UserController and UserModel are close to each other.

# fakeable_dependencies
1. Constructor parameters should include all required dependencies for the class, and the class should only use them.
2. Export the class, not the instance.
3. Write tests

e.g.:
Good:
```ts
export class SMSAuthService {

    constructor(
        private __userRepository: Model,
        private __communicationService: CommunicationService,
        private __tokenService: TokenService
     ) {}

    async sendSMS(email: string): Promise<void> {
        const user = await this.__userRepository.findOne({ where: { email } });
        await this.__sendOneTimePasswordSMS(user.phoneNumber, email)
    }
    // ...
}
```
Wrong:
```ts
export async function sendSMS(email: string): Promise<void> {
    const user = await users.findOne({ where: { email } });
    await sendOneTimePasswordSMS(user.phoneNumber, email)
}
```

EDIT:
There are some exceptions though. There are some cases where it would not help at all, for example, on frontend where we talk about single methods that just give name to axios calls. Faking axios would give false positive tests all the time. Not faking it would be an API integration test, that would be better done on the backend. **So follow the above convention when it has use.** If it does not have and someone still uses it, it's not a problem, but I would not enforce it for those cases.

GUI programming is different unfortunately, we cannot apply strong conventions there, it has its own problems, that these rules cannot solve.

# filenames
1. UpperCamelCase means types or classes or components are exported
    For e.g.: App.tsx, SMSAuthService.ts, UserController.ts
3. lowerCamelCase means an instance or a function is exported
    For e.g.: useAuth.tsx, useLocalStorage.tsx, routes.ts
5. do not use kebab-case
6. do not mark files by .controller.js or .services.js etc.

# react_component_order
The main component is always the first. Styled and other child components are defined after.

It helps the reader, because they start from the top of the file

# react_component_type
When developing a new React component we should use the functional-style way. We agreed on #dev channel at Slack.
