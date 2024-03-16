const express=require('express');
const bodyparser=require('body-parser');
const sequelize=require('./util/database');

const app=express();
const cors=require('cors');

app.use(cors());
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

const userRoutes=require('./routes/user');
const expenseRoutes=require('./routes/expense');
const incomeRoutes=require('./routes/incomes');
const premiumRoutes=require('./routes/premium');
const reportsRoutes=require('./routes/reports');
const forgotRoute=require('./routes/forgot');

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/incomes',incomeRoutes);
app.use('/password',forgotRoute);
app.use('/reports',reportsRoutes)
app.use(premiumRoutes);

const User=require('./Models/User');
const Expense=require('./Models/Expense');
const Income=require('./Models/Income');
const Order=require('./Models/Order');

const ForgotRequest=require('./Models/ForgotRequests');

Expense.belongsTo(User);
User.hasMany(Expense);

Income.belongsTo(User);
User.hasMany(Income);

Order.belongsTo(User);
User.hasMany(Order);

ForgotRequest.belongsTo(User);
User.hasMany(ForgotRequest);

(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    }
    catch (e) {
        console.log(e);
    }
})();