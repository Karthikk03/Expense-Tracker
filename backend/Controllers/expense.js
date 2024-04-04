const User = require('../Models/User');
const Expense = require('../Models/Expense');
const Sequelize = require('../util/database');

exports.addExpense = async (req, res, next) => {
    const trans = await Sequelize.transaction();
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        const { category, amount, date, description } = req.body;

        const currentExpesne = user.totalExpense + amount;

        const newOne = await user.createExpense({
            category,
            amount,
            description,
            date
        }, { transaction: trans });

        await user.update({ totalExpense: currentExpesne, expenseCount: user.expenseCount + 1 }, { transaction: trans });


        const lastPage = Math.ceil(user.expenseCount / 6);

        console.log(user.expenseCount);

        await trans.commit();

        return res.status(201).json({ newOne, lastPage });

    }
    catch (e) {
        console.log(e)
        await trans.rollback();
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.getExpenses = async (req, res, next) => {
    try {
        const page_no = req.query.page_no;
        const start = (page_no - 1) * 6;
        const user = await User.findByPk(req.userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const whereClause = {
            userId: req.userId
        }

        const expenses = await Expense.findAll({
            where: whereClause,
            limit: 6,
            offset: start,
        })

        const lastPage = Math.max(Math.ceil(user.expenseCount / 6),1);
        const current = parseInt(page_no);
        const totalExpense = user.totalExpense;

        console.log(await user.countExpenses(), user.expenseCount);
        return res.json({ expenses, totalExpense, current, lastPage });

    }
    catch (e) {
        console.log(e);
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.delete = async (req, res, next) => {
    const trans = await Sequelize.transaction();
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

        const newExpense = user.totalExpense - expense.amount;

        await expense.destroy({ transaction: trans });
        await user.update({ totalExpense: newExpense, expenseCount: user.expenseCount - 1 }, { transaction: trans });
        console.log(user.expenseCount);
        await trans.commit();
        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        console.log(error)
        await trans.rollback();
        res.status(500).json({ message: error.message });
    }
}

exports.update = async (req, res, next) => {
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

        const expenseData = req.body;

        await expense.update(expenseData);

        res.status(200).json(expense);
    }
    catch (error) {
        console.log(error)
        res.status(500).json({ message: error.message });
    }
}