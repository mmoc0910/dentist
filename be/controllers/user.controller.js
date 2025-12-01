const User = require('../models/user.model');
const bcrypt = require('bcryptjs');

// @desc    Get list of users
// @route   GET /api/users/get_list_users
// @access  Private
exports.getListUsers = async (req, res) => {
  try {
    const { page = 1, size = 10, search = '' } = req.query;
    
    const query = search ? {
      $or: [
        { fullname: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ]
    } : {};

    const users = await User.find(query)
      .populate('role_id')
      .select('-password')
      .limit(size * 1)
      .skip((page - 1) * size)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      users,
      totalPages: Math.ceil(count / size),
      currentPage: page,
      total: count
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('role_id')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Private (Admin only)
exports.registerUser = async (req, res) => {
  try {
    const { email, username, password, fullname, phone, address, birthday, gender, role_id } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ 
      $or: [{ email }, { username }] 
    });

    if (userExists) {
      return res.status(400).json({ message: 'Email này đã được sử dụng.' });
    }

    // Create user
    const user = await User.create({
      email,
      username,
      password,
      fullname,
      phone,
      address,
      birthday,
      gender,
      role_id
    });

    const userResponse = await User.findById(user._id)
      .populate('role_id')
      .select('-password');

    res.status(201).json({
      message: 'Tạo tài khoản thành công',
      user: userResponse
    });
  } catch (error) {
    console.error('Register user error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Update user
// @route   PUT /api/users/:id
// @access  Private
exports.updateUser = async (req, res) => {
  try {
    const { fullname, phone, address, birthday, gender, role_id, isActive, avatar } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Update fields
    if (fullname) user.fullname = fullname;
    if (phone) user.phone = phone;
    if (address !== undefined) user.address = address;
    if (birthday) user.birthday = birthday;
    if (gender) user.gender = gender;
    if (role_id) user.role_id = role_id;
    if (isActive !== undefined) user.isActive = isActive;
    if (avatar !== undefined) user.avatar = avatar;

    await user.save();

    const updatedUser = await User.findById(user._id)
      .populate('role_id')
      .select('-password');

    res.status(200).json({
      message: 'Cập nhật thông tin thành công',
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Cập nhật thất bại', error: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Xóa người dùng thành công' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Get current user profile
// @route   GET /api/users/get_profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('role_id')
      .select('-password');

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Change password
// @route   PUT /api/users/change_password/:id
// @access  Private
exports.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }

    // Check old password
    const isMatch = await user.comparePassword(oldPassword);

    if (!isMatch) {
      return res.status(401).json({ message: 'Mật khẩu cũ không đúng' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Đổi mật khẩu thành công' });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
