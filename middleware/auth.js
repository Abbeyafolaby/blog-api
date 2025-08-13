/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';

/**
 * Middleware to authenticate requests using JWT tokens
 * Extracts token from Authorization header and verifies it
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object} 401 error if authentication fails
 */
function authenticate(req, res, next) {
  try {
    // Extract Authorization header and split into scheme and token
    const authHeader = req.headers.authorization || '';
    const [scheme, token] = authHeader.split(' ');

    // Validate Authorization header format (Bearer token)
    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ 
        message: 'Unauthorized: Missing or invalid token' 
      });
    }

    // Verify JWT token and extract user payload
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user information to request object for use in protected routes
    req.user = payload;
    
    // Continue to next middleware/route handler
    next();
  } catch (error) {
    // Return 401 if token verification fails
    return res.status(401).json({ 
      message: 'Unauthorized', 
      error: error.message 
    });
  }
}

// Export the authentication middleware
export { authenticate };


