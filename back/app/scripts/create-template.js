const AWS = require("aws-sdk");
const ses = new AWS.SES({
   region: 'us-west-2'
});
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