const PatientRecord = require('../models/patientRecord.model');
const Bill = require('../models/bill.model');
const moment = require('moment');

// @desc    Get patient records by patient ID
// @route   GET /api/patient_record/get_list_record/:id
// @access  Private
exports.getRecordsByPatientId = async (req, res) => {
  try {
    const records = await PatientRecord.find({ patient_id: req.params.id })
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('services.service_id')
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error('Get records error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all records by treatment ID
// @route   GET /api/patient_record/get_all_record/:id
// @access  Private
exports.getRecordsByTreatmentId = async (req, res) => {
  try {
    const records = await PatientRecord.find({ treatment_id: req.params.id })
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('services.service_id')
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    console.error('Get records by treatment error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get record by ID
// @route   GET /api/patient_record/:id
// @access  Private
exports.getRecordById = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.id)
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('services.service_id');

    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Get record error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add patient record
// @route   POST /api/patient_record/
// @access  Private
exports.addRecord = async (req, res) => {
  try {
    const { patient_id, treatment_id, doctor_id, services, diagnosis, treatment_plan, note, images, visit_date, next_visit } = req.body;

    const record = new PatientRecord({
      patient_id,
      treatment_id,
      doctor_id,
      services,
      diagnosis,
      treatment_plan,
      note,
      images,
      visit_date,
      next_visit
    });

    // Calculate total price
    record.calculateTotalPrice();
    await record.save();

    // Create or update bill
    let bill = await Bill.findOne({ treatment_id });
    
    if (bill) {
      bill.total_amount += record.total_price;
      bill.remaining_amount = bill.total_amount - bill.paid_amount;
      await bill.save();
    } else {
      bill = await Bill.create({
        patient_id,
        treatment_id,
        record_id: record._id,
        total_amount: record.total_price,
        remaining_amount: record.total_price,
        created_by: req.user._id
      });
    }

    const populatedRecord = await PatientRecord.findById(record._id)
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('services.service_id');

    res.status(201).json({
      message: 'Thêm hồ sơ thành công',
      record: populatedRecord
    });
  } catch (error) {
    console.error('Add record error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update patient record
// @route   PUT /api/patient_record/:id
// @access  Private
exports.updateRecord = async (req, res) => {
  try {
    const { services, diagnosis, treatment_plan, note, images, status, visit_date, next_visit, paid_amount } = req.body;

    const record = await PatientRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
    }

    const oldTotalPrice = record.total_price;

    if (services) record.services = services;
    if (diagnosis !== undefined) record.diagnosis = diagnosis;
    if (treatment_plan !== undefined) record.treatment_plan = treatment_plan;
    if (note !== undefined) record.note = note;
    if (images) record.images = images;
    if (status) record.status = status;
    if (visit_date) record.visit_date = visit_date;
    if (next_visit !== undefined) record.next_visit = next_visit;
    if (paid_amount !== undefined) record.paid_amount = paid_amount;

    // Recalculate total price
    record.calculateTotalPrice();
    await record.save();

    // Update bill
    const bill = await Bill.findOne({ treatment_id: record.treatment_id });
    if (bill) {
      const priceDifference = record.total_price - oldTotalPrice;
      bill.total_amount += priceDifference;
      bill.remaining_amount = bill.total_amount - bill.paid_amount;
      await bill.save();
    }

    const updatedRecord = await PatientRecord.findById(record._id)
      .populate('patient_id')
      .populate('doctor_id', 'fullname email')
      .populate('services.service_id');

    res.status(200).json({
      message: 'Cập nhật hồ sơ thành công',
      record: updatedRecord
    });
  } catch (error) {
    console.error('Update record error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete patient record
// @route   DELETE /api/patient_record/:id
// @access  Private
exports.deleteRecord = async (req, res) => {
  try {
    const record = await PatientRecord.findById(req.params.id);

    if (!record) {
      return res.status(404).json({ message: 'Không tìm thấy hồ sơ' });
    }

    // Check if same day as creation date
    const recordDate = moment(record.createdAt).startOf('day');
    const currentDate = moment().startOf('day');

    if (!recordDate.isSame(currentDate)) {
      return res.status(400).json({ message: 'Không được xóa sau ngày khởi tạo.' });
    }

    // Update bill
    const bill = await Bill.findOne({ treatment_id: record.treatment_id });
    if (bill) {
      bill.total_amount -= record.total_price;
      bill.remaining_amount = bill.total_amount - bill.paid_amount;
      await bill.save();
    }

    await PatientRecord.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa hồ sơ thành công' });
  } catch (error) {
    console.error('Delete record error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
