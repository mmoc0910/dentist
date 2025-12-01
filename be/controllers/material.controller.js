const { parsePagination } = require('../utils/pagination');
const Material = require('../models/material.model');

// @desc    Get list of materials with pagination
// @route   GET /api/materials/get_list_materials
// @access  Private
exports.getListMaterials = async (req, res) => {
  try {
    const pagination = parsePagination(req.query);
    
    const query = search ? {
      $or: [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const materials = await Material.find(query)
      .limit(pagination.size)
      .skip(pagination.skip)
      .sort({ createdAt: -1 });

    const count = await Material.countDocuments(query);

    res.status(200).json({
      materials,
      totalPages: Math.ceil(count / pagination.size),
      currentPage: pagination.page,
      total: count
    });
  } catch (error) {
    console.error('Get materials error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all materials
// @route   GET /api/materials/get_all_material
// @access  Private
exports.getAllMaterials = async (req, res) => {
  try {
    const materials = await Material.find({ isActive: true })
      .sort({ name: 1 });

    res.status(200).json(materials);
  } catch (error) {
    console.error('Get all materials error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get material by ID
// @route   GET /api/materials/:id
// @access  Private
exports.getMaterialById = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy vật liệu' });
    }

    res.status(200).json(material);
  } catch (error) {
    console.error('Get material error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add new material
// @route   POST /api/materials/
// @access  Private
exports.addMaterial = async (req, res) => {
  try {
    const { name, description, unit, quantity, min_quantity, price, supplier } = req.body;

    // Check if material exists
    const existingMaterial = await Material.findOne({ name });

    if (existingMaterial) {
      return res.status(400).json({ message: 'Vật liệu đã tồn tại' });
    }

    const material = await Material.create({
      name,
      description,
      unit,
      quantity,
      min_quantity,
      price,
      supplier
    });

    res.status(201).json({
      message: 'Thêm vật liệu thành công',
      material
    });
  } catch (error) {
    console.error('Add material error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update material
// @route   PUT /api/materials/:id
// @access  Private
exports.updateMaterial = async (req, res) => {
  try {
    const { name, description, unit, quantity, min_quantity, price, supplier, isActive } = req.body;

    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy vật liệu' });
    }

    if (name) material.name = name;
    if (description !== undefined) material.description = description;
    if (unit) material.unit = unit;
    if (quantity !== undefined) material.quantity = quantity;
    if (min_quantity !== undefined) material.min_quantity = min_quantity;
    if (price !== undefined) material.price = price;
    if (supplier !== undefined) material.supplier = supplier;
    if (isActive !== undefined) material.isActive = isActive;

    await material.save();

    res.status(200).json({
      message: 'Cập nhật vật liệu thành công',
      material
    });
  } catch (error) {
    console.error('Update material error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete material
// @route   DELETE /api/materials/:id
// @access  Private
exports.deleteMaterial = async (req, res) => {
  try {
    const material = await Material.findById(req.params.id);

    if (!material) {
      return res.status(404).json({ message: 'Không tìm thấy vật liệu' });
    }

    await Material.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa vật liệu thành công' });
  } catch (error) {
    console.error('Delete material error:', error);
    res.status(500).json({ message: 'Không thể xóa vật liệu', error: error.message });
  }
};
