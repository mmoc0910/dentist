const express = require('express');
const router = express.Router();
const roleController = require('../controllers/role.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/roles/get_list_roles
router.get('/get_list_roles', roleController.getListRoles);

// @route   POST /api/roles/create_defaults
router.post('/create_defaults', roleController.createDefaultRoles);

module.exports = router;
