const moment = require('moment-timezone');

// Format date to Vietnamese timezone
const formatDate = (date, format = 'DD/MM/YYYY HH:mm') => {
  return moment(date).tz('Asia/Ho_Chi_Minh').format(format);
};

// Generate random string
const generateRandomString = (length = 8) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Generate treatment ID
const generateTreatmentId = () => {
  const date = moment().format('YYYYMMDD');
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `TRT${date}${random}`;
};

// Calculate age from birthday
const calculateAge = (birthday) => {
  if (!birthday) return null;
  return moment().diff(moment(birthday), 'years');
};

// Format currency (VND)
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(amount);
};

// Check if date is today
const isToday = (date) => {
  return moment(date).isSame(moment(), 'day');
};

// Get date range for period
const getDateRange = (period = 'month') => {
  let start, end;
  
  switch (period) {
    case 'today':
      start = moment().startOf('day').toDate();
      end = moment().endOf('day').toDate();
      break;
    case 'week':
      start = moment().startOf('week').toDate();
      end = moment().endOf('week').toDate();
      break;
    case 'month':
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
      break;
    case 'year':
      start = moment().startOf('year').toDate();
      end = moment().endOf('year').toDate();
      break;
    default:
      start = moment().startOf('month').toDate();
      end = moment().endOf('month').toDate();
  }
  
  return { start, end };
};

module.exports = {
  formatDate,
  generateRandomString,
  generateTreatmentId,
  calculateAge,
  formatCurrency,
  isToday,
  getDateRange
};
