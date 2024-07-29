const Expense = require('../models/Expense');
const User = require('../models/User');
const { Parser } = require('json2csv');
const fs = require('fs');
const path = require('path');

exports.addExpense = async (req, res) => {
  try {
    const { amount, description, participants } = req.body;
    const newExpense = new Expense({ amount, description, participants });
    await newExpense.save();
    res.status(201).json(newExpense);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getUserExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ 'participants.user': req.params.userId });
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getOverallExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.downloadBalanceSheet = async (req, res) => {
  try {
    // Fetch all expenses and populate participant user details
    const expenses = await Expense.find().populate('participants.user');
    const users = await User.find();

    const balanceSheet = users.map(user => {
      const individualExpenses = expenses.filter(expense => 
        expense.participants.some(participant => participant.user.id === user.id)
      );

      const totalExpense = individualExpenses.reduce((total, expense) => {
        const userShare = expense.participants.find(participant => participant.user.id === user.id).share;
        return total + userShare;
      }, 0);

      return {
        name: user.name,
        email: user.email,
        mobile: user.mobile,
        totalExpense,
      };
    });

    const fields = ['name', 'email', 'mobile', 'totalExpense'];
    const opts = { fields };
    const parser = new Parser(opts);
    const csv = parser.parse(balanceSheet);

    // Create a file path for the CSV
    const filePath = path.join(__dirname, '..', 'downloads', 'balanceSheet.csv');

    // Write the CSV file
    fs.writeFileSync(filePath, csv);

    // Set headers and send the file
    res.setHeader('Content-Disposition', 'attachment; filename=balanceSheet.csv');
    res.setHeader('Content-Type', 'text/csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
