const express=require('express');
const bodyparser=require('body-parser');
const sequelize=require('./util/database');

const app=express();
const cors=require('cors');

app.use(cors());
app.use(bodyparser.json());

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const premiumRoutes=require('./routes/premium');

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);
app.use(premiumRoutes);

const User=require('./Models/User');
const Expense=require('./Models/Expense');
const Order=require('./Models/Order');

Expense.belongsTo(User);
User.hasMany(Expense);

Order.belongsTo(User);
User.hasMany(Order);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    }
    catch (e) {
        console.log(e);
    }
})();