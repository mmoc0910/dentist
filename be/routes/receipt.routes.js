const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receipt.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/receipts/get_list_receipts_by_treatment/:id
router.get('/get_list_receipts_by_treatment/:id', receiptController.getReceiptsByTreatmentId);

// @route   GET /api/receipts/new_receipts/:id
router.get('/new_receipts/:id', receiptController.getNewReceiptByTreatmentId);

// @route   POST /api/receipts/
router.post('/', receiptController.addReceipt);

module.exports = router;
