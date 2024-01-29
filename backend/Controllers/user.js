const User = require('../Models/User');

exports.postAdd = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        await User.create({ name, email, password });
        return res.json({ message: 'User created' });

    }
    catch (e) {
        if(e.original.errno===1062)return res.status(500).json({error:'User already exists',code:1});
        else return res.status(500).json({error:'Some internal issue'});
    }
}