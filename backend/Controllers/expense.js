const User = require('../Models/User');
const Expense = require('../Models/Expense');

exports.addExpense = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        if (!user) res.status(404).json({ error: "User not found" });

        const { category, amount, date, description } = req.body;

        const newOne = await user.createExpense({
            category,
            amount,
            description,
            date
        });

        return res.status(201).json(newOne);

    }
    catch (e) {
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
        console.log(expenses)
        return res.json(expenses);

    }
    catch (e) {
        return res.status(500).json({ error: 'Some internal issue' });
    }
}

exports.delete = async (req, res, next) => {
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

        await expense.destroy();

        res.json({ message: "Expense deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}