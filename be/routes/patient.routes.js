const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patient.controller');
const { authMiddleware } = require('../middleware/auth.middleware');

// All routes require authentication
router.use(authMiddleware);

// @route   GET /api/patients/get_list_patients
router.get('/get_list_patients', patientController.getListPatients);

// @route   GET /api/patients/get_all_patients
router.get('/get_all_patients', patientController.getAllPatients);

// @route   GET /api/patients/:id
router.get('/:id', patientController.getPatientById);

// @route   POST /api/patients/
router.post('/', patientController.addPatient);

// @route   PUT /api/patients/:id
router.put('/:id', patientController.updatePatient);

// @route   DELETE /api/patients/:id
router.delete('/:id', patientController.deletePatient);

module.exports = router;
