const MaterialImport = require('../models/materialImport.model');
const Material = require('../models/material.model');
const moment = require('moment');

// @desc    Get list of material imports
// @route   GET /api/material_imports/get_list_import
// @access  Private
exports.getListImport = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;

    const imports = await MaterialImport.find()
      .populate('material_id')
      .populate('created_by', 'fullname email')
      .limit(size * 1)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 });

    const count = await MaterialImport.countDocuments();

    res.status(200).json({
      imports,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get import list error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get material import by ID
// @route   GET /api/material_imports/:id
// @access  Private
exports.getImportById = async (req, res) => {
  try {
    const materialImport = await MaterialImport.findById(req.params.id)
      .populate('material_id')
      .populate('created_by', 'fullname email');

    if (!materialImport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
    }

    res.status(200).json(materialImport);
  } catch (error) {
    console.error('Get import error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add material import
// @route   POST /api/material_imports/
// @access  Private
exports.addImport = async (req, res) => {
  try {
    const { material_id, quantity, price, supplier, note, import_date } = req.body;

    const materialImport = await MaterialImport.create({
      material_id,
      quantity,
      price,
      supplier,
      note,
      import_date,
      created_by: req.user._id
    });

    // Update material quantity
    const material = await Material.findById(material_id);
    if (material) {
      material.quantity += quantity;
      await material.save();
    }

    const populatedImport = await MaterialImport.findById(materialImport._id)
      .populate('material_id')
      .populate('created_by', 'fullname email');

    res.status(201).json({
      message: 'Thêm phiếu nhập thành công',
      import: populatedImport
    });
  } catch (error) {
    console.error('Add import error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add list of material imports
// @route   POST /api/material_imports/add_list_import/:id
// @access  Private
exports.addListImport = async (req, res) => {
  try {
    const { imports } = req.body;

    const createdImports = [];

    for (const item of imports) {
      const materialImport = await MaterialImport.create({
        ...item,
        created_by: req.user._id
      });

      // Update material quantity
      const material = await Material.findById(item.material_id);
      if (material) {
        material.quantity += item.quantity;
        await material.save();
      }

      const populatedImport = await MaterialImport.findById(materialImport._id)
        .populate('material_id')
        .populate('created_by', 'fullname email');

      createdImports.push(populatedImport);
    }

    res.status(201).json({
      message: 'Thêm danh sách phiếu nhập thành công',
      imports: createdImports
    });
  } catch (error) {
    console.error('Add list import error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update material import
// @route   PUT /api/material_imports/:id
// @access  Private
exports.updateImport = async (req, res) => {
  try {
    const { quantity, price, supplier, note, import_date } = req.body;

    const materialImport = await MaterialImport.findById(req.params.id);

    if (!materialImport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
    }

    // Check if same day as creation date
    const importDate = moment(materialImport.createdAt).startOf('day');
    const currentDate = moment().startOf('day');

    if (!importDate.isSame(currentDate)) {
      return res.status(400).json({ message: 'Vật liệu nhập chỉ được cập nhật cùng với ngày khởi tạo.' });
    }

    // Update material quantity
    const material = await Material.findById(materialImport.material_id);
    if (material && quantity !== undefined) {
      material.quantity = material.quantity - materialImport.quantity + quantity;
      await material.save();
    }

    if (quantity !== undefined) materialImport.quantity = quantity;
    if (price !== undefined) materialImport.price = price;
    if (supplier !== undefined) materialImport.supplier = supplier;
    if (note !== undefined) materialImport.note = note;
    if (import_date) materialImport.import_date = import_date;

    await materialImport.save();

    const updatedImport = await MaterialImport.findById(materialImport._id)
      .populate('material_id')
      .populate('created_by', 'fullname email');

    res.status(200).json({
      message: 'Cập nhật phiếu nhập thành công',
      import: updatedImport
    });
  } catch (error) {
    console.error('Update import error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete material import
// @route   DELETE /api/material_imports/:id
// @access  Private
exports.deleteImport = async (req, res) => {
  try {
    const materialImport = await MaterialImport.findById(req.params.id);

    if (!materialImport) {
      return res.status(404).json({ message: 'Không tìm thấy phiếu nhập' });
    }

    // Check if same day as creation date
    const importDate = moment(materialImport.createdAt).startOf('day');
    const currentDate = moment().startOf('day');

    if (!importDate.isSame(currentDate)) {
      return res.status(400).json({ message: 'Vật liệu nhập chỉ được xóa cùng với ngày khởi tạo.' });
    }

    // Update material quantity
    const material = await Material.findById(materialImport.material_id);
    if (material) {
      material.quantity -= materialImport.quantity;
      await material.save();
    }

    await MaterialImport.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa phiếu nhập thành công' });
  } catch (error) {
    console.error('Delete import error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
