const nodemailer = require('nodemailer');

// Create email transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send email
const sendEmail = async (to, subject, html) => {
  try {
    const transporter = createTransporter();
    
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send password reset email
const sendPasswordResetEmail = async (to, fullname, tempPassword) => {
  const subject = 'Khôi phục mật khẩu - Phòng khám nha khoa';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">Khôi phục mật khẩu</h2>
      <p>Xin chào <strong>${fullname}</strong>,</p>
      <p>Mật khẩu mới của bạn là:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin: 0; color: #1976d2;">${tempPassword}</h3>
      </div>
      <p style="color: #d32f2f;">
        <strong>Lưu ý:</strong> Vui lòng đăng nhập và đổi mật khẩu ngay sau khi nhận được email này.
      </p>
      <p>Trân trọng,</p>
      <p><strong>Phòng khám nha khoa</strong></p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
      <p style="font-size: 12px; color: #666;">
        Đây là email tự động, vui lòng không trả lời email này.
      </p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

// Send appointment reminder email
const sendAppointmentReminderEmail = async (to, fullname, appointmentDate, doctorName) => {
  const subject = 'Nhắc nhở lịch hẹn - Phòng khám nha khoa';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #1976d2;">Nhắc nhở lịch hẹn</h2>
      <p>Xin chào <strong>${fullname}</strong>,</p>
      <p>Đây là email nhắc nhở về lịch hẹn khám của bạn:</p>
      <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
        <p style="margin: 5px 0;"><strong>Thời gian:</strong> ${appointmentDate}</p>
        <p style="margin: 5px 0;"><strong>Bác sĩ:</strong> ${doctorName}</p>
      </div>
      <p>Vui lòng đến đúng giờ hoặc liên hệ với chúng tôi nếu cần thay đổi lịch hẹn.</p>
      <p>Trân trọng,</p>
      <p><strong>Phòng khám nha khoa</strong></p>
    </div>
  `;

  return await sendEmail(to, subject, html);
};

module.exports = {
  sendEmail,
  sendPasswordResetEmail,
  sendAppointmentReminderEmail
};
