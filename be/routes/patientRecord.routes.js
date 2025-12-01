const express = require('express');
const router = express.Router();
const patientRecordController = require('../controllers/patientRecord.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/patient_record/get_list_record/:id
router.get('/get_list_record/:id', patientRecordController.getRecordsByPatientId);

// @route   GET /api/patient_record/get_all_record/:id
router.get('/get_all_record/:id', patientRecordController.getRecordsByTreatmentId);

// @route   GET /api/patient_record/:id
router.get('/:id', patientRecordController.getRecordById);

// @route   POST /api/patient_record/
router.post('/', patientRecordController.addRecord);

// @route   PUT /api/patient_record/:id
router.put('/:id', patientRecordController.updateRecord);

// @route   DELETE /api/patient_record/:id
router.delete('/:id', patientRecordController.deleteRecord);

module.exports = router;
