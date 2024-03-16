const User = require('../Models/User');
const Income = require('../Models/Income');
const Sequelize=require('../util/database');

exports.addIncome = async (req, res, next) => {
    const trans=await Sequelize.transaction();
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        const { category, amount, date, description } = req.body;

        const currentIncome= user.totalIncome+amount;

        const newOne = await user.createIncome({
            category,
            amount,
            description,
            date
        },{transaction:trans});

        await user.update({ totalIncome: currentIncome },{transaction:trans});

        await trans.commit();
        return res.status(201).json(newOne);

    }
    catch (e) {
        await trans.rollback();
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.getIncomes = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });
        const incomes = await Income.findAll({
            where: {
                userId: user.id
            }
        })

        const totalIncome=user.Income;
        return res.json({incomes,totalIncome});

    }
    catch (e) {
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.delete = async (req, res, next) => {
    const trans=await Sequelize.transaction();
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        const incomeId = req.params.id;

        const income = await Income.findOne({
            where: {
                id: incomeId,
                userId: req.userId
            }
        });

        if (!income) {
            return res.status(404).json({ error: "Expense not found or does not belong to the user" });
        }

        const newIncome=user.totalIncome-income.amount;
        await income.destoy({transaction:trans});
        await user.update({totalIncome:newIncome},{transaction:trans});
        await trans.commit();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        await trans.rollback();
        res.status(500).json({ message: error.message });
    }
}