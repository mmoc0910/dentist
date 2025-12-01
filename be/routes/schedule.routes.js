const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/schedule.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/schedule/get_list_schedule
router.get('/get_list_schedule', scheduleController.getListSchedule);

// @route   GET /api/schedule/:id
router.get('/:id', scheduleController.getScheduleById);

// @route   POST /api/schedule
router.post('/', scheduleController.addSchedule);

// @route   PUT /api/schedule/:id
router.put('/:id', scheduleController.updateSchedule);

// @route   DELETE /api/schedule/:id
router.delete('/:id', scheduleController.deleteSchedule);

module.exports = router;
