/**
 * Middleware to check if user has admin role
 * Must be used after authenticate middleware
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} 403 error if user is not admin
 */
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      message: 'Access denied: Admin role required'
    });
  }
  next();
}

export { requireAdmin };
