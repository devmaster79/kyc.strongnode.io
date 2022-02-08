dotenv.config()

// regExp used for checking inputs
const emailRegExp = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/

const AWS = require('aws-sdk');

const defaultEmailSource = "Notifications <no-reply@strongnode.io>"

/**
 * Method that is used for sending !ONE! templated email.
 * @param options
 * @returns {Promise<boolean>}
 */
exports.sendTemplatedEmail = async (to, templateData = '{ "link":"unknown"}', templateName = 'EmailTemplate', source = defaultEmailSource) => {
    let sesOptions = {
        region: "us-west-2",
    }

    // check if parameter is email
    if (!emailRegExp.test(to))
        return false

    // default AWS SES email options
    let defaultEmailOptions = {
        Destination: {
            ToAddresses: to
        },
        TemplateData: templateData,
        Source: defaultEmailSource,
        Template: templateName
    }

    // if being called from localhost, change the endpoint to localstack
    if (process.env.AWS_LOCALSTACK_URL != '')
        sesOptions.endpoint = process.env.AWS_LOCALSTACK_URL

    const ses = new AWS.SES(sesOptions)
    return await ses.sendTemplatedEmail(defaultEmailOptions).promise()
}

// todo add the send bulk emails
// todo add the pinpoint AWS stuff here
