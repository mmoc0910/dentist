const express = require('express');
const router = express.Router();
const billController = require('../controllers/bill.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/bills/get_list_bills
router.get('/get_list_bills', billController.getListBills);

// @route   GET /api/bills/:id
router.get('/:id', billController.getBillById);

module.exports = router;
