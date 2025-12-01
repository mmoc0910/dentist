const Category = require('../models/category.model');
const Service = require('../models/service.model');

// @desc    Get list of services grouped by category
// @route   GET /api/categories/get_list_service
// @access  Private
exports.getListService = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true });
    const result = [];

    for (const category of categories) {
      const services = await Service.find({ 
        category_id: category._id, 
        isActive: true 
      });
      
      result.push({
        ...category.toObject(),
        services
      });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error('Get list service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all categories with services
// @route   GET /api/categories/get_all_category_service
// @access  Private
exports.getAllCategoryService = async (req, res) => {
  try {
    const categories = await Category.find();
    
    res.status(200).json(categories);
  } catch (error) {
    console.error('Get all category service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get all services
// @route   GET /api/categories/get_all_service
// @access  Private
exports.getAllService = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('category_id')
      .sort({ name: 1 });

    res.status(200).json(services);
  } catch (error) {
    console.error('Get all service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get treating services
// @route   GET /api/categories/get_treating_service/:id
// @access  Private
exports.getTreatingService = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate('category_id');

    res.status(200).json(services);
  } catch (error) {
    console.error('Get treating service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get services by category ID
// @route   GET /api/categories/get_all_service_by_category_id/:id
// @access  Private
exports.getServiceByCategoryId = async (req, res) => {
  try {
    const services = await Service.find({ 
      category_id: req.params.id,
      isActive: true 
    }).populate('category_id');

    res.status(200).json(services);
  } catch (error) {
    console.error('Get service by category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get service detail
// @route   GET /api/categories/get_detail_service/:id
// @access  Private
exports.getServiceById = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('category_id');

    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }

    res.status(200).json(service);
  } catch (error) {
    console.error('Get service detail error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add category
// @route   POST /api/categories/
// @access  Private
exports.addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;

    const category = await Category.create({
      name,
      description
    });

    res.status(201).json({
      message: 'Thêm danh mục thành công',
      category
    });
  } catch (error) {
    console.error('Add category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get category by ID
// @route   GET /api/categories/:id
// @access  Private
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    res.status(200).json(category);
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
exports.updateCategory = async (req, res) => {
  try {
    const { name, description, isActive } = req.body;

    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    if (name) category.name = name;
    if (description !== undefined) category.description = description;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();

    res.status(200).json({
      message: 'Cập nhật danh mục thành công',
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
exports.deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Không tìm thấy danh mục' });
    }

    // Check if category has services
    const hasServices = await Service.findOne({ category_id: req.params.id });

    if (hasServices) {
      return res.status(400).json({ message: 'Không thể xóa danh mục có dịch vụ' });
    }

    await Category.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa danh mục thành công' });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Add service
// @route   POST /api/categories/add_service
// @access  Private
exports.addService = async (req, res) => {
  try {
    const { name, description, price, category_id, duration } = req.body;

    const service = await Service.create({
      name,
      description,
      price,
      category_id,
      duration
    });

    const populatedService = await Service.findById(service._id)
      .populate('category_id');

    res.status(201).json({
      message: 'Thêm dịch vụ thành công',
      service: populatedService
    });
  } catch (error) {
    console.error('Add service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update service
// @route   PUT /api/categories/update_service/:id
// @access  Private
exports.updateService = async (req, res) => {
  try {
    const { name, description, price, category_id, duration, isActive } = req.body;

    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }

    if (name) service.name = name;
    if (description !== undefined) service.description = description;
    if (price) service.price = price;
    if (category_id) service.category_id = category_id;
    if (duration) service.duration = duration;
    if (isActive !== undefined) service.isActive = isActive;

    await service.save();

    const updatedService = await Service.findById(service._id)
      .populate('category_id');

    res.status(200).json({
      message: 'Cập nhật dịch vụ thành công',
      service: updatedService
    });
  } catch (error) {
    console.error('Update service error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete service
// @route   DELETE /api/categories/delete_service/:id
// @access  Private
exports.deleteService = async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({ message: 'Không tìm thấy dịch vụ' });
    }

    await Service.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa dịch vụ thành công' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
