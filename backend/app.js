const express=require('express');
const bodyparser=require('body-parser');
const sequelize=require('./util/database');

const app=express();
const cors=require('cors');

app.use(cors());
app.use(bodyparser.json());

const userRoutes=require('./routes/user');

app.use('/user',userRoutes);

const User=require('./Models/User');

(async () => {
    try {
        await sequelize.sync();
        app.listen(3000);
    }
    catch (e) {
        console.log(e);
    }
})();