const User = require('../Models/User');
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const dotenv=require('dotenv');

const generateToken=require('../util/functions');

dotenv.config();

exports.postAdd = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    let password = req.body.password;
    try {
         password=await bcrypt.hash(password,10);
         console.log(password);
        await User.create({ name, email, password,totalExpense:0 });
        return res.json({ message: 'User created' });

    }
    catch (e) {
        if (e.original.errno === 1062) return res.status(500).json({ error: 'User already exists', code: 1 });
        else return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.login = async (req, res, next) => {
    
    const{email,password}=req.body;

    try {
        const user = await User.findOne({
            where: {
                email: email
            }
        });

        if(!user){
            return res.status(404).json({message:'User not found'});
        }

        const match=await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(401).json({message:`User not authorized`})
        }

        const token=await generateToken(user.id,user.name,null);

        return res.status(200).json({message:'USer logined Successfully',token});
    }
    catch (e) {
        console.log(e);
    }
}

