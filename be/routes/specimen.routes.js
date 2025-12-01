const express = require('express');
const router = express.Router();
const specimenController = require('../controllers/specimen.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/specimens/get_list_speciemns
router.get('/get_list_speciemns', specimenController.getListSpecimens);

// @route   GET /api/specimens/get_list_specimens_of_patient/:id
router.get('/get_list_specimens_of_patient/:id', specimenController.getSpecimensByPatientId);

// @route   PUT /api/specimens/labo_receive
router.put('/labo_receive', specimenController.laboReceive);

// @route   PUT /api/specimens/labo_delivery
router.put('/labo_delivery', specimenController.laboDelivery);

// @route   PUT /api/specimens/report_specimen/:id
router.put('/report_specimen/:id', specimenController.reportSpecimen);

// @route   PUT /api/specimens/use_specimen/:id
router.put('/use_specimen/:id', specimenController.useSpecimen);

// @route   GET /api/specimens/:id
router.get('/:id', specimenController.getSpecimenById);

// @route   POST /api/specimens/
router.post('/', specimenController.addSpecimen);

// @route   PUT /api/specimens/:id
router.put('/:id', specimenController.updateSpecimen);

// @route   DELETE /api/specimens/:id
router.delete('/:id', specimenController.deleteSpecimen);

module.exports = router;
