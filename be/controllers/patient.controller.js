const Patient = require('../models/patient.model');
const PatientRecord = require('../models/patientRecord.model');

// @desc    Get list of patients with pagination
// @route   GET /api/patients/get_list_patients
// @access  Private
exports.getListPatients = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    
    // Parse to integer and ensure positive values
    const pageNum = Math.max(1, parseInt(page) || 1);
    const sizeNum = Math.max(1, parseInt(size) || 10);
    
    const query = search ? {
      $or: [
        { fullname: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const patients = await Patient.find(query)
      .limit(sizeNum)
      .skip((pageNum - 1) * sizeNum)
      .sort({ createdAt: -1 });

    const count = await Patient.countDocuments(query);

    res.status(200).json({
      patients,
      totalPages: Math.ceil(count / sizeNum),
      currentPage: pageNum,
      total: count
    });
  } catch (error) {
    console.error('Get patients error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients/get_all_patients
// @access  Private
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find({ isActive: true })
      .sort({ fullname: 1 });

    res.status(200).json(patients);
  } catch (error) {
    console.error('Get all patients error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
exports.getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error('Get patient error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add new patient
// @route   POST /api/patients/
// @access  Private
exports.addPatient = async (req, res) => {
  try {
    const { fullname, phone, email, address, birthday, gender, identity_card, medical_history, allergies, note } = req.body;

    // Check if patient with same phone exists
    const existingPatient = await Patient.findOne({ phone });
    
    if (existingPatient) {
      return res.status(400).json({ message: 'Số điện thoại đã tồn tại' });
    }

    const patient = await Patient.create({
      fullname,
      phone,
      email,
      address,
      birthday,
      gender,
      identity_card,
      medical_history,
      allergies,
      note
    });

    res.status(201).json({
      message: 'Thêm bệnh nhân thành công',
      patient
    });
  } catch (error) {
    console.error('Add patient error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update patient
// @route   PUT /api/patients/:id
// @access  Private
exports.updatePatient = async (req, res) => {
  try {
    const { fullname, phone, email, address, birthday, gender, identity_card, medical_history, allergies, note, avatar, isActive } = req.body;

    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    // Update fields
    if (fullname) patient.fullname = fullname;
    if (phone) patient.phone = phone;
    if (email !== undefined) patient.email = email;
    if (address !== undefined) patient.address = address;
    if (birthday) patient.birthday = birthday;
    if (gender) patient.gender = gender;
    if (identity_card !== undefined) patient.identity_card = identity_card;
    if (medical_history !== undefined) patient.medical_history = medical_history;
    if (allergies !== undefined) patient.allergies = allergies;
    if (note !== undefined) patient.note = note;
    if (avatar !== undefined) patient.avatar = avatar;
    if (isActive !== undefined) patient.isActive = isActive;

    await patient.save();

    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      patient
    });
  } catch (error) {
    console.error('Update patient error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete patient
// @route   DELETE /api/patients/:id
// @access  Private
exports.deletePatient = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id);

    if (!patient) {
      return res.status(404).json({ message: 'Không tìm thấy bệnh nhân' });
    }

    // Check if patient has records
    const hasRecords = await PatientRecord.findOne({ patient_id: req.params.id });

    if (hasRecords) {
      return res.status(400).json({ message: 'Không được xóa bệnh nhân khi đã có lịch sử thăm khám.' });
    }

    await Patient.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa thành công.' });
  } catch (error) {
    console.error('Delete patient error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
