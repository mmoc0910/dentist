const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/category.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// Category routes
// @route   GET /api/categories/get_list_service
router.get('/get_list_service', categoryController.getListService);

// @route   GET /api/categories/get_all_category_service
router.get('/get_all_category_service', categoryController.getAllCategoryService);

// @route   GET /api/categories/get_all_service
router.get('/get_all_service', categoryController.getAllService);

// @route   GET /api/categories/get_treating_service/:id
router.get('/get_treating_service/:id', categoryController.getTreatingService);

// @route   GET /api/categories/get_all_service_by_category_id/:id
router.get('/get_all_service_by_category_id/:id', categoryController.getServiceByCategoryId);

// @route   GET /api/categories/get_detail_service/:id
router.get('/get_detail_service/:id', categoryController.getServiceById);

// @route   POST /api/categories/
router.post('/', categoryController.addCategory);

// @route   GET /api/categories/:id
router.get('/:id', categoryController.getCategoryById);

// @route   PUT /api/categories/:id
router.put('/:id', categoryController.updateCategory);

// @route   DELETE /api/categories/:id
router.delete('/:id', categoryController.deleteCategory);

// Service routes
// @route   POST /api/categories/add_service
router.post('/add_service', categoryController.addService);

// @route   PUT /api/categories/update_service/:id
router.put('/update_service/:id', categoryController.updateService);

// @route   DELETE /api/categories/delete_service/:id
router.delete('/delete_service/:id', categoryController.deleteService);

module.exports = router;
