const express=require('express');
const router=express.Router();

const authorize=require('../Controllers/authorize');
const expenseController=require('../Controllers/expense');

router.post('/add-expense',authorize,expenseController.addExpense);

router.get('/',authorize,expenseController.getExpenses);

router.delete('/:id',authorize,expenseController.delete);

router.patch('/edit-expense/:id',authorize,expenseController.update);
module.exports=router;