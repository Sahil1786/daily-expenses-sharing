const express = require('express');
const { addExpense, getUserExpenses, getOverallExpenses, downloadBalanceSheet } = require('../controllers/expenseController');
const { validateExpense } = require('../utils/validation');
const router = express.Router();

router.post('/', validateExpense, addExpense);
router.get('/user/:userId', getUserExpenses);
router.get('/overall', getOverallExpenses);
router.get('/download', downloadBalanceSheet);

module.exports = router;
