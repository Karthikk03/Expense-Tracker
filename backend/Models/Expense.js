const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Expense=sequelize.define('expense',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    category:{
        type:Sequelize.STRING,
        allowNull:false,
    },
    description:{
        type:Sequelize.STRING,
        allowNull:false
    },
    amount:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    date:{
        type:Sequelize.DATEONLY,
        allowNull:false
    }
})

module.exports=Expense;