const express=require('express');
const bodyparser=require('body-parser');
const sequelize=require('./util/database');

const app=express();
const cors=require('cors');

app.use(cors());
app.use(bodyparser.json());

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);

const User=require('./Models/User');
const Expense=require('./Models/Expense');

Expense.belongsTo(User);
User.hasMany(Expense);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    }
    catch (e) {
        console.log(e);
    }
})();