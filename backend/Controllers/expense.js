const User = require('../Models/User');
const Expense = require('../Models/Expense');
const Sequelize=require('../util/database');

exports.addExpense = async (req, res, next) => {
    const trans=await Sequelize.transaction();
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        const { category, amount, date, description } = req.body;

        const currentExpesne= user.totalExpense+amount;

        const newOne = await user.createExpense({
            category,
            amount,
            description,
            date
        },{transaction:trans});

        await user.update({ totalExpense: currentExpesne },{transaction:trans});

        await trans.commit();
        return res.status(201).json(newOne);

    }
    catch (e) {
        await trans.rollback();
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });
        const expenses = await Expense.findAll({
            where: {
                userId: user.id
            }
        })

        const totalExpense=user.totalExpense;
        return res.json({expenses,totalExpense});

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

        const expenseId = req.params.id;

        const expense = await Expense.findOne({
            where: {
                id: expenseId,
                userId: req.userId
            }
        });

        if (!expense) {
            return res.status(404).json({ error: "Expense not found or does not belong to the user" });
        }

        const newExpense=user.totalExpense-expense.amount;
        await expense.destoy({transaction:trans});
        await user.update({totalExpense:newExpense},{transaction:trans});
        await trans.commit();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        await trans.rollback();
        res.status(500).json({ message: error.message });
    }
}