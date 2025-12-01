const express = require('express');
const router = express.Router();
const laboController = require('../controllers/labo.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/labos/get_list_labos
router.get('/get_list_labos', laboController.getListLabos);

// @route   GET /api/labos/get_all_labo
router.get('/get_all_labo', laboController.getAllLabos);

// @route   GET /api/labos/get_list_prepare/:id
router.get('/get_list_prepare/:id', laboController.getListPrepare);

// @route   GET /api/labos/get_list_receive/:id
router.get('/get_list_receive/:id', laboController.getListReceive);

// @route   GET /api/labos/:id
router.get('/:id', laboController.getLaboById);

// @route   POST /api/labos/
router.post('/', laboController.addLabo);

// @route   PUT /api/labos/:id
router.put('/:id', laboController.updateLabo);

// @route   DELETE /api/labos/:id
router.delete('/:id', laboController.deleteLabo);

module.exports = router;
