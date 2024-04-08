const express=require('express');
const bodyparser=require('body-parser');

require('dotenv').config();

const sequelize=require('./util/database');

const fs = require('fs');
const path = require('path')

const app=express();
const cors=require('cors');

const helmet=require('helmet');
const morgan=require('morgan');

const accessLogStream=fs.createWriteStream(
    path.join(__dirname,'access.log'),
    {flags:'a'}
)
app.use(cors());
app.use(helmet());
app.use(morgan('combined',{stream:accessLogStream}));
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
app.use('/premium',premiumRoutes);

app.use( (req, res) => {
    res.sendFile(req.url,{root:'public'});
})

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