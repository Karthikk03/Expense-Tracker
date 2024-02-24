const razorpay = require('razorpay');
const dotenv = require('dotenv');

const User = require('../Models/User');
const Order = require('../Models/Order');

const generateToken=require('../util/functions');
const Expense = require('../Models/Expense');
const { Sequelize } = require('sequelize');

dotenv.config();

exports.checkPremium=async(req,res,next)=>{
    try{

        const user = await User.findByPk(req.userId);
        if(user.isPremium)return res.json(true);

        res.json(false);
    }
    catch(e){
        return res.status(500).json({message:'Some internal issue'})
    }
}

exports.purchase = async (req, res, next) => {
    try {
        const instance = new razorpay({
            key_id: process.env.razorPayKey_id,
            key_secret: process.env.razorPayKey_secret
        })
        const user = await User.findByPk(req.userId);
        const amount = 2500;

        instance.orders.create({ amount, currency: "INR" }, (err, order) => {
            if (err) {
                console.error(err);
                return res.status(400).json({ message: 'Failed to create order', error: err.message });
            }

            user.createOrder({ orderId: order.id, status: 'PENDING' })
                .then(() => {
                    return res.status(201).json({ order, key_id: instance.key_id })
                })
                .catch(err => { throw new Error(err) })
        })
    }
    catch (e) {
        console.log(e);
        res.status(400).json({ message: 'Something went wrong', error: e });
    }
}

exports.updatePayment = async (req, res, next) => {
    try {

        const { orderId, paymentId, status } = req.body;
        const order = await Order.findOne({
            where: {
                orderId
            }
        })


        if (status === 'Successful') {
            const user = await User.findByPk(req.userId)

            await Promise.all([
                order.update({ paymentId, status }),
                user.update({ isPremium: true })
            ])
            const token=await generateToken(user.id,user.name,true);
            return res.json({
                message: 'You are a premium member now',
                token
            });
        }
        else {
            await order.update({paymentId,status});
            res.json({ message: 'Try again,Your payment failed' })
        }


    }

    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getLeaderboard=async(req,res,next)=>{
    const leaderboard=await User.findAll({
        include:[{
            model:Expense,
            attributes:[]
        }],
        attributes:[
            'name',
            [Sequelize.fn('SUM',Sequelize.col('expenses.amount')),'totalExpense']
        ],
        group:['User.id']
    });

    res.status(200).json(leaderboard);
}