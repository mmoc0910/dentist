const express = require('express');
const router = express.Router();
const materialExportController = require('../controllers/materialExport.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/material_export/get_list_export
router.get('/get_list_export', materialExportController.getListExport);

// @route   GET /api/material_export/get_list_material_export_of_patient/:id
router.get('/get_list_material_export_of_patient/:id', materialExportController.getExportsByPatientId);

// @route   GET /api/material_export/:id
router.get('/:id', materialExportController.getExportById);

// @route   POST /api/material_export/
router.post('/', materialExportController.addExport);

// @route   PUT /api/material_export/:id
router.put('/:id', materialExportController.updateExport);

// @route   DELETE /api/material_export/:id
router.delete('/:id', materialExportController.deleteExport);

module.exports = router;
