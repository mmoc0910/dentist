const express = require('express');
const router = express.Router();
const notifyController = require('../controllers/notify.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/notifies/get_list_notify
router.get('/get_list_notify', notifyController.getListNotify);

// @route   PUT /api/notifies/read_notify/:id
router.put('/read_notify/:id', notifyController.readNotify);

module.exports = router;
