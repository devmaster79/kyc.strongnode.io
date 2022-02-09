const AWS = require("aws-sdk");

let sesOptions = {
   region: 'us-west-2'
}

if (process.env.AWS_LOCALSTACK_URL !== '')
   sesOptions.endpoint = process.env.AWS_LOCALSTACK_URL

const ses = new AWS.SES(sesOptions);
/**
 * @fileOverview update-template.js Update existing email templates
 * */
const mainFunction =  async () => {
  const templates = require("../jsons/email-template.json").templates;
  return await Promise.all(templates.map(template => ses.updateTemplate({
    Template: template
  }).promise()))
}
mainFunction().then(() => {
   console.log('Templates are updated successfully.');
}, (ex) => {
   console.log('Error in updating templates.');
   console.dir(ex.message);
});
