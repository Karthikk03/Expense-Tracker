const razorpay = require('razorpay');
const dotenv = require('dotenv');

const User = require('../Models/User');
const Order = require('../Models/Order');

const generateToken = require('../util/functions');
const Expense = require('../Models/Expense');
const { Sequelize } = require('sequelize');

dotenv.config();

exports.checkPremium = async (req, res, next) => {
    try {

        const user = await User.findByPk(req.userId);
        if (user.isPremium) return res.json(true);

        res.json(false);
    }
    catch (e) {
        return res.status(500).json({ message: 'Some internal issue' })
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
            const token = await generateToken(user.id, user.name, true);
            return res.json({
                message: 'You are a premium member now',
                token
            });
        }
        else {
            await order.update({ paymentId, status });
            res.json({ message: 'Try again,Your payment failed' })
        }


    }

    catch (e) {
        console.log(e);
        return res.status(500).json({ message: 'Internal server error' });
    }

}

exports.getLeaderboard = async (req, res, next) => {
    try {

        console.log(1)
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json('User not found');

        const pageSize = 14;
        const page_no = parseInt(req.query.page_no) || 1;
        const offset = (page_no - 1) * pageSize;

        const [leaderboard, total] = await Promise.all([
            User.findAll({
                order: [['totalExpense', 'DESC']],
                offset,
                limit: pageSize
            }),
            User.count()
        ]);

        let userRank = leaderboard.findIndex(item => item.id === user.id) + 1 + offset;

        if (userRank == offset) {
            const usersAhead = await User.count({
                where: {
                    totalExpense: {
                        [Sequelize.Op.gt]: user.totalExpense
                    }
                }
            });
            userRank = usersAhead + 1;
        }

        leaderboard.forEach((current,index) => {
            current.dataValues.rank=index+1+offset
        });

        if (userRank > pageSize + offset) {
            const length = leaderboard.length;

            user.dataValues.rank=userRank;

            if (length == pageSize) leaderboard[length - 1] = user;

            else leaderboard.push(user);
        }

        const lastPage = Math.ceil(total / 14);

        const response = {
            leaderboard,
            userRank,
            current:page_no,
            lastPage
        }
        return res.status(200).json(response);
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}