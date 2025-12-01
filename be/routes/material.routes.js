const express = require('express');
const router = express.Router();
const materialController = require('../controllers/material.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/materials/get_list_materials
router.get('/get_list_materials', materialController.getListMaterials);

// @route   GET /api/materials/get_all_material
router.get('/get_all_material', materialController.getAllMaterials);

// @route   GET /api/materials/:id
router.get('/:id', materialController.getMaterialById);

// @route   POST /api/materials/
router.post('/', materialController.addMaterial);

// @route   PUT /api/materials/:id
router.put('/:id', materialController.updateMaterial);

// @route   DELETE /api/materials/:id
router.delete('/:id', materialController.deleteMaterial);

module.exports = router;
