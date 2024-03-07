const Sequelize=require('sequelize');
const sequelize=require('../util/database');

const ForgotRequest=sequelize.define('ForgotRequest',{
    id:{
        type:Sequelize.STRING,
        primaryKey:true,
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false,
    },
    
    isActive:{
        type:Sequelize.BOOLEAN,
        allowNull:false
    }
})

module.exports=ForgotRequest;