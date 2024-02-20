const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const Order=sequelize.define('order',{
    id:{
        type:Sequelize.INTEGER,
        primaryKey:true,
        autoIncrement:true
    },
    
    orderId:{
        type:Sequelize.STRING,
        allowNull:false
    },
    paymentId:{
        type:Sequelize.STRING,
    },
    Status:{
        type:Sequelize.STRING,
    }
})

module.exports=Order;