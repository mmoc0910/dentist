const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/income.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/income
router.get('/', incomeController.getIncome);

// @route   GET /api/income/net_income
router.get('/net_income', incomeController.getNetIncome);

// @route   GET /api/income/total_spend
router.get('/total_spend', incomeController.getTotalSpend);

module.exports = router;
