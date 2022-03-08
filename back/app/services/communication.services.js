const dotenv = require('dotenv');
dotenv.config();

// regExp used for checking inputs
const emailRegExp =
  /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()\.,;\s@\"]+\.{0,1})+([^<>()\.,;:\s@\"]{2,}|[\d\.]+))$/;

const AWS = require('aws-sdk');
const db = require("../models");
const defaultRegion = 'us-west-2';

const defaultEmailSource = 'StrongNode Notifications <no-reply@strongnode.io>';
const defaultSmsOrigin = '+18555460621';
const defaultSmsSenderId = 'MySenderID';
const defaultSmsRegisteredKeyword = 'strongnode';

const defaultSupportEmail = 'support@strongnode.io';

/**
 * Object that holds template names from jsons/email-template.json.
 * Just to makes things easier. todo think about getting values directly from json above
 * @type {{resetPassword: string, confirmEmail: string}}
 */
exports.emailTemplatesNames = {
  confirmEmail: 'EmailTemplate',
  resetPassword: 'ResetPasswordTemplate',
  supportRequest: 'SupportRequestTemplate'
};

/**
 * Method that is used for sending !ONE! templated email.
 * By default, this method uses emailTemplate used for email verification.
 * @param options
 * @returns {Promise<boolean>}
 */
const sendTemplatedEmail = async (
    to,
    templateData = '{ "link":"unknown"}',
    templateName = 'EmailTemplate',
    source = defaultEmailSource
) => {
  let sesOptions = {
    region: defaultRegion
  };

  // check if parameter is email
  if (!emailRegExp.test(to)) return false;

  // default AWS SES email options
  let defaultEmailOptions = {
    Destination: {
      ToAddresses: [to]
    },
    TemplateData: templateData,
    Source: defaultEmailSource,
    Template: templateName
  };

  // if being called from localhost, change the endpoint to localstack, also show template data since the localstack
  // does not send emails
  if (process.env.AWS_LOCALSTACK_URL != '') {
    sesOptions.endpoint = process.env.AWS_LOCALSTACK_URL;
    console.log(templateData);
  }

  const ses = new AWS.SES(sesOptions);
  return await ses.sendTemplatedEmail(defaultEmailOptions).promise();
}

/**
 * Method that takes care of sending SMS to a phone number.
 * @returns {Request<Pinpoint.SendMessagesResponse, AWSError>}
 */
exports.sendSms = (destinationNumber, message, messageType = 'TRANSACTIONAL') => {
  let pinpointOptions = {
    region: defaultRegion
  };

  if (process.env.AWS_LOCALSTACK_URL != '') {
    pinpointOptions.endpoint = process.env.AWS_LOCALSTACK_URL;
  }

  var pinpoint = new AWS.Pinpoint(pinpointOptions);

  // default pinpoint options
  var params = {
    ApplicationId: process.env.ApplicationId ? process.env.ApplicationId : 'fakeAppIDLocalstack',
    MessageRequest: {
      Addresses: {
        [destinationNumber]: {
          ChannelType: 'SMS'
        }
      },
      MessageConfiguration: {
        SMSMessage: {
          Body: message,
          Keyword: defaultSmsRegisteredKeyword,
          MessageType: messageType,
          OriginationNumber: defaultSmsOrigin,
          SenderId: defaultSmsSenderId
        }
      }
    }
  };

  // returns sent for localhost purposes
  if (process.env.AWS_LOCALSTACK_URL != '') return { status: true, data: 'sample data' };

  return pinpoint.sendMessages(params, function (err, data) {
    return data ? { status: true, data: data } : { status: false, err: err };
  });
};

/**
 * Method that sends email to a support team of SNE.
 * Also, it creates a record in database, so it can be shown in the admin dashboard in the future.
 */
exports.sendSupportRequest = async (user, message) => {
  const templateData = {
    user_email: user.email,
    user_message: message,
    user_username: user.username
  };

  if (process.env.AWS_LOCALSTACK_URL != '') {
    console.log('[LOCALSTACK] Support requested email sent! See following data below')
    console.log(templateData)
    return true
  } else {
    return await sendTemplatedEmail(defaultSupportEmail, templateData, exports.emailTemplatesNames.supportRequest)
  }
}

exports.sendTemplatedEmail = sendTemplatedEmail

// todo add the send bulk emails - not sure if we would need this?
