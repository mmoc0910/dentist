const Role = require('../models/role.model');

// @desc    Get list of roles
// @route   GET /api/roles/get_list_roles
// @access  Private
exports.getListRoles = async (req, res) => {
  try {
    const roles = await Role.find().sort({ name: 1 });

    res.status(200).json(roles);
  } catch (error) {
    console.error('Get roles error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Create default roles (for initial setup)
// @route   POST /api/roles/create_defaults
// @access  Private (Admin only)
exports.createDefaultRoles = async (req, res) => {
  try {
    const defaultRoles = [
      { name: 'Admin', description: 'Quản trị viên hệ thống' },
      { name: 'Bác sĩ', description: 'Bác sĩ nha khoa' },
      { name: 'Điều dưỡng trưởng', description: 'Điều dưỡng trưởng' },
      { name: 'Y tá', description: 'Y tá' },
      { name: 'Lễ tân', description: 'Nhân viên lễ tân' }
    ];

    for (const role of defaultRoles) {
      const existingRole = await Role.findOne({ name: role.name });
      if (!existingRole) {
        await Role.create(role);
      }
    }

    const roles = await Role.find();
    res.status(200).json({
      message: 'Tạo roles mặc định thành công',
      roles
    });
  } catch (error) {
    console.error('Create default roles error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
