const express=require('express');
const router=express.Router();

const userController=require('../Controllers/user');

router.post('/create-user',userController.postAdd);

router.post('/login',userController.login);

module.exports=router;
