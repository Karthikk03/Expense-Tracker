const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const User=sequelize.define('user',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    email:{
        type:Sequelize.STRING,
        allowNull:false,
        unique:true
    },
    name:{
        type:Sequelize.STRING,
        allowNull:false
    },
    password:{
        type:Sequelize.STRING,
        allowNull:false
    },
    totalExpense:{
        type:Sequelize.INTEGER,
        allowNull:false
    },
    isPremium:{type:Sequelize.BOOLEAN}
})

module.exports=User;