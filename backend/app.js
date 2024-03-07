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
const premiumRoutes=require('./routes/premium');
const forgotRoute=require('./routes/forgot');

app.use('/user',userRoutes);
app.use('/expenses',expenseRoutes);
app.use('/password',forgotRoute);
app.use(premiumRoutes);

const User=require('./Models/User');
const Expense=require('./Models/Expense');
const Order=require('./Models/Order');

const ForgotRequest=require('./Models/ForgotRequests');

Expense.belongsTo(User);
User.hasMany(Expense);

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