const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// @desc    Login user
// @route   POST /api/login
// @access  Public
exports.login = async (req, res) => {
  try {
    // Frontend gửi userName, phải map sang username
    const { userName, username, password } = req.body;
    const loginUsername = userName || username;

    // Validate input
    if (!loginUsername || !password) {
      return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin' });
    }

    // Check if user exists
    const user = await User.findOne({ 
      $or: [{ username: loginUsername }, { email: loginUsername }] 
    }).populate('role_id');

    if (!user) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Tài khoản đã bị khóa' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: 'Tên đăng nhập hoặc mật khẩu không đúng' });
    }

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    // Map role name to match frontend expectations
    let roleName = 'Admin'; // default
    if (user.role_id && user.role_id.name) {
      const roleMapping = {
        'Admin': 'Admin',
        'Bác sĩ': 'Doctor',
        'Điều dưỡng trưởng': 'LeaderNurse',
        'Y tá': 'Nurse',
        'Lễ tân': 'Receptionist'
      };
      roleName = roleMapping[user.role_id.name] || user.role_id.name;
    }

    res.status(200).json({
      message: 'Đăng nhập thành công',
      jwt: token, // Frontend expect 'jwt' not 'token'
      role: roleName, // Frontend expect 'role'
      user: userResponse
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

// @desc    Forgot password
// @route   POST /api/forgot_password
// @access  Public
exports.forgotPassword = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ message: 'Vui lòng nhập tên đăng nhập hoặc email' });
    }

    // Find user by username or email
    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy tài khoản' });
    }

    // Generate temporary password
    const tempPassword = Math.random().toString(36).slice(-8);
    
    // Update user password
    user.password = tempPassword;
    await user.save();

    // Send email with new password
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: process.env.EMAIL_FROM,
        to: user.email,
        subject: 'Khôi phục mật khẩu - Phòng khám nha khoa',
        html: `
          <h2>Khôi phục mật khẩu</h2>
          <p>Xin chào ${user.fullname},</p>
          <p>Mật khẩu mới của bạn là: <strong>${tempPassword}</strong></p>
          <p>Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.</p>
          <p>Trân trọng,</p>
          <p>Phòng khám nha khoa</p>
        `
      };

      await transporter.sendMail(mailOptions);

      res.status(200).json({ 
        message: 'Mật khẩu mới đã được gửi đến email của bạn',
        email: user.email
      });
    } catch (emailError) {
      console.error('Email error:', emailError);
      // If email fails, still return the temp password in response (for development)
      res.status(200).json({ 
        message: 'Không thể gửi email. Mật khẩu tạm thời của bạn là: ' + tempPassword,
        tempPassword // Remove this in production
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};
