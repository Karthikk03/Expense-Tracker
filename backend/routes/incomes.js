const express=require('express');
const router=express.Router();

const authorize=require('../Controllers/authorize');
const incomeController=require('../Controllers/incomes');

router.post('/add-income',authorize,incomeController.addIncome);

router.get('/',authorize,incomeController.getIncomes);

router.delete('/:id',authorize,incomeController.delete);

module.exports=router;