const express = require('express');
const router = express.Router();
const materialImportController = require('../controllers/materialImport.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/material_imports/get_list_import
router.get('/get_list_import', materialImportController.getListImport);

// @route   GET /api/material_imports/:id
router.get('/:id', materialImportController.getImportById);

// @route   POST /api/material_imports/
router.post('/', materialImportController.addImport);

// @route   POST /api/material_imports/add_list_import/:id
router.post('/add_list_import/:id', materialImportController.addListImport);

// @route   PUT /api/material_imports/:id
router.put('/:id', materialImportController.updateImport);

// @route   DELETE /api/material_imports/:id
router.delete('/:id', materialImportController.deleteImport);

module.exports = router;
