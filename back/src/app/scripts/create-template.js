const AWS = require("aws-sdk");

let sesOptions = {
    region: 'us-west-2'
}

if (process.env.AWS_LOCALSTACK_URL !== '')
    sesOptions.endpoint = process.env.AWS_LOCALSTACK_URL

const ses = new AWS.SES(sesOptions);
/**
 * @fileOverview create-template.js Create email templates
 * */
const mainFunction =  async () => {
  const templates = require("../jsons/email-template.json").templates;
  return await Promise.all(templates.map(template => ses.createTemplate({
    Template: template
  }).promise()))
}
mainFunction().then(() => {
   console.log('template created successfully.');
}, (ex) => {
  console.log('Error in template creation.');
  console.dir(ex.message);
});

exports.createTemplate = mainFunction
