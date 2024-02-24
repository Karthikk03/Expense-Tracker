const jwt=require('jsonwebtoken');

module.exports = async function generateToken(id, name,isPremium) {

    return jwt.sign({ id, name,isPremium}, process.env.secretKey);
}