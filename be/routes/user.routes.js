const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/users/get_list_users
router.get('/get_list_users', userController.getListUsers);

// @route   GET /api/users/get_profile
router.get('/get_profile', userController.getProfile);

// @route   GET /api/users/:id
router.get('/:id', userController.getUserById);

// @route   POST /api/users/register
router.post('/register', userController.registerUser);

// @route   PUT /api/users/:id
router.put('/:id', userController.updateUser);

// @route   PUT /api/users/change_password/:id
router.put('/change_password/:id', userController.changePassword);

// @route   DELETE /api/users/:id
router.delete('/:id', userController.deleteUser);

module.exports = router;
