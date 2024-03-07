const SibApiV3Sdk = require('@getbrevo/brevo');
const { v4: uuidv4 } = require('uuid');
const User = require('../Models/User');
const forgotRequest = require('../Models/ForgotRequests');
const bcrypt = require('bcrypt');
const sequelize = require('../util/database');

require('dotenv').config();

exports.forgot = async (req, res, next) => {
    try {
        const { mail } = req.body;
        const user = await User.findOne({
            where: {
                email: mail
            }
        })

        if (!user) return res.status(400).json('User not found');

        const newUid = uuidv4();


        const forgotRequest = await user.createForgotRequest({
            id: newUid,
            isActive: true
        })


        let apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

        let apiKey = apiInstance.authentications['apiKey'];
        apiKey.apiKey = process.env.API_KEY;

        let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();


        sendSmtpEmail.subject = 'Here is your reset link';
        sendSmtpEmail.htmlContent = `<html>
        <body>
            <h1>Here is your Password reset link</h1>
            <p>please follow the below link <p>
            <a href="http://localhost:3000/password/resetpassword/{{params.uuid}}">Click here</a;

            </body>
            </html>`;
        sendSmtpEmail.sender = { 'name': 'Karthik K', "email": "karthikkonamgeri1@gmail.com" };
        sendSmtpEmail.to = [{ "email": mail, "name": "Jane Doe" }];
        sendSmtpEmail.params = { 'uuid': newUid };

        const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('API called successfully. Returned data: ' + JSON.stringify(response));

        res.status(200).json('Mail sent successfully')
    }
    catch (e) {
        console.log(e)
        res.status(500).json('Internal Server Issue')
    }


}

exports.reset = async (req, res, next) => {
    const uuid = req.params.uuid;

    try {

        const request = await forgotRequest.findByPk(uuid);

        if (!request) return res.status(404).json('Link Invalid');

        if (request.isActive === false) return res.status(401).json('link expired');

        res.status(200).send(`<html>
            <form action="/password/update/${uuid}" method="POST">
                <label for="pass">Enter Password:</label>
                <input type="password" id="pass" name="pass" required>
                <input type="submit" value="Reset">
            </form>

        </html>`)
    }
    catch (e) {
        console.log(e);
    }
}


exports.update = async (req, res, next) => {
    const uuid = req.params.uuid;
    console.log(req.body);
    const trans=await sequelize.transaction();
    try {
        const request = await forgotRequest.findByPk(uuid, {
            include: [{
                model: User
            }]
        });

        console.log(request)
        if(request.isActive===false)throw new Error('Link Expired') 

        const user = request.user;

        const password=await bcrypt.hash(req.body.pass,10);
        console.log(password);

        await user.update({password},{transaction:trans});
        await request.update({isActive:false},{transaction:trans})

        await trans.commit();

        return res.status(200).json('Password Changed Successfully');
    }

    catch(e){
        await trans.rollback();
        console.log(e);
        return res.status(403).json({e:e.message,success:false})
    }

}