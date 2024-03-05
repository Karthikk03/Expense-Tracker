const SibApiV3Sdk = require('@getbrevo/brevo');
require('dotenv').config();

module.exports = async(req, res, next) => {
    console.log(req.body);
    let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    let apiKey = apiInstance.authentications['apiKey'];
    apiKey.apiKey = process.env.API_KEY;

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = 'Here is your reset link';
    sendSmtpEmail.textContent = 'Here is your otp 123897';
    sendSmtpEmail.sender = { 'name':'Karthik K', "email": "karthikkonamgeri1@gmail.com" };
    sendSmtpEmail.to = [{ "email": "karthikkonamgeri1@gmail.com", "name": "Jane Doe" }];

    const response=await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('API called successfully. Returned data: ' + JSON.stringify(response));

    res.status(200).json('Mail sent successfully')

}
