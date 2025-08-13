import DOMPurify from 'isomorphic-dompurify';

/**
 * Sanitize request body to prevent XSS attacks
 * Removes any potentially malicious HTML/JavaScript
 */
export const sanitizeInput = (req, res, next) => {
  // Sanitize body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = DOMPurify.sanitize(req.body[key]);
      }
    });
  }
  
  // Sanitize query parameters
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = DOMPurify.sanitize(req.query[key]);
      }
    });
  }
  
  next();
};

/**
 * Validate post data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validatePost = (req, res, next) => {
  const { title, content, tags } = req.body;
  const errors = [];

  // Validate title
  if (!title || title.trim().length < 3) {
    errors.push('Title must be at least 3 characters long');
  }
  if (title && title.length > 200) {
    errors.push('Title cannot exceed 200 characters');
  }

  // Validate content
  if (!content || content.trim().length < 10) {
    errors.push('Content must be at least 10 characters long');
  }

  // Validate tags (optional)
  if (tags && !Array.isArray(tags)) {
    errors.push('Tags must be an array');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};

/**
 * Validate comment data
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
export const validateComment = (req, res, next) => {
  const { content } = req.body;
  const errors = [];

  // Validate content
  if (!content || content.trim().length < 1) {
    errors.push('Comment content cannot be empty');
  }
  if (content && content.length > 1000) {
    errors.push('Comment cannot exceed 1000 characters');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }

  next();
};
