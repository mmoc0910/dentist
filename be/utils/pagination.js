/**
 * Parse and validate pagination parameters
 * @param {Object} query - Request query object
 * @returns {Object} - Parsed pagination parameters
 */
exports.parsePagination = (query) => {
  const { page = 1, size = 10 } = query;
  
  // Parse to integer and ensure positive values
  const pageNum = Math.max(1, parseInt(page) || 1);
  const sizeNum = Math.max(1, Math.min(100, parseInt(size) || 10)); // Max 100 per page
  
  return {
    page: pageNum,
    size: sizeNum,
    skip: (pageNum - 1) * sizeNum
  };
};

/**
 * Create pagination response
 * @param {Array} data - Data array
 * @param {Number} total - Total count
 * @param {Number} page - Current page
 * @param {Number} size - Page size
 * @returns {Object} - Pagination response
 */
exports.createPaginationResponse = (data, total, page, size) => {
  return {
    data,
    totalPages: Math.ceil(total / size),
    currentPage: page,
    pageSize: size,
    total
  };
};
