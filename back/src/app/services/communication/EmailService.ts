import { SES } from "aws-sdk";
import { SendEmailRequest } from "aws-sdk/clients/ses";
import { EMAIL_CONFIG } from "../../config/config";
import { Sendable } from "./templates/BaseTemplate";

// regExp used for checking inputs
const emailRegExp =
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

export class EmailService {
    constructor(
        private __awsSes: SES
    ) { }

    async sendTemplate<P, T extends Sendable<P>>(to: string, template: T, templateData: Parameters<T['renderBody']>[0]): Promise<any> {
        if (process.env.NODE_ENV == 'development') {
            console.log("[LocalStack] Email sent: ", templateData);
            return;
        }
        return await this.__send(
            to,
            template.renderSubject(templateData),
            template.renderBody(templateData)
        )
    }

    async __send(
        to: string,
        subject: string,
        message: string,
    ): Promise<any> {
        // check if parameter is email
        if (!emailRegExp.test(to)) throw Error('Wrong email address');

        // default AWS SES email options
        let defaultEmailOptions: SendEmailRequest = {
            Destination: {
                ToAddresses: [to]
            },
            Source: EMAIL_CONFIG.source,
            Message: {
                Subject: {
                    Data: subject
                },
                Body: {
                    Html: {
                        Data: message
                    }
                }
            }
        };

        return await this.__awsSes.sendEmail(defaultEmailOptions).promise();
    }
}