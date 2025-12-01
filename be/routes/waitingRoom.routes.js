const express = require('express');
const router = express.Router();
const waitingRoomController = require('../controllers/waitingRoom.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/waiting_room/get-list-waiting
router.get('/get-list-waiting', waitingRoomController.getListWaiting);

// @route   GET /api/waiting_room/get_list_confirm
router.get('/get_list_confirm', waitingRoomController.getListConfirm);

// @route   PUT /api/waiting_room/call-patient/:id
router.put('/call-patient/:id', waitingRoomController.callPatient);

// @route   PUT /api/waiting_room/confirm-customer/:id
router.put('/confirm-customer/:id', waitingRoomController.confirmCustomer);

// @route   DELETE /api/waiting_room/:id
router.delete('/:id', waitingRoomController.deleteWaiting);

module.exports = router;
