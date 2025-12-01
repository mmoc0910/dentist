const express = require('express');
const router = express.Router();
const timekeepingController = require('../controllers/timekeeping.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/timekeeping/get_list_timekeeping
router.get('/get_list_timekeeping', timekeepingController.getListTimekeeping);

// @route   POST /api/timekeeping/checkin
router.post('/checkin', timekeepingController.checkIn);

// @route   POST /api/timekeeping/checkout
router.post('/checkout', timekeepingController.checkOut);

module.exports = router;
