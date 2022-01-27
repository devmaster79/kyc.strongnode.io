const AWS = require("aws-sdk");

let sesOptions = {
  region: "us-west-2",
}

if (process.env.AWS_LOCALSTACK_URL != '')
  sesOptions.endpoint = process.env.AWS_LOCALSTACK_URL

const ses = new AWS.SES(sesOptions);
/**
 * @fileOverview create-template.js Create an email template
 * */
const mainFunction =  async () => {
  const params =  require("../jsons/email-template.json");
  return await ses.createTemplate(params).promise();
}
mainFunction().then(() => {
   console.log('template created successfully.');
}, (ex) => {
  console.log('Error in template creation.');
  console.dir(ex.message);
});