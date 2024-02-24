const jwt = require('jsonwebtoken');
const dotenv=require('dotenv');

dotenv.config();

module.exports = async (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const secretKey =process.env.secretKey;
        const user = jwt.verify(token, secretKey);
        req.userId = user.id;
        next();
    }
    catch (e) {
        console.log(e);
    }
}
