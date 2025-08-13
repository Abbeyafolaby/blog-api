/* eslint-disable no-undef */
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * Creates a JWT token for authenticated users
 * @param {Object} user - User object with id, email, role, and name
 * @returns {string} JWT token with 7-day expiration
 */
function createToken(user) {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email, 
      role: user.role, 
      name: user.name 
    },
    process.env.JWT_SECRET,
    { expiresIn: '7d' } // Token expires in 7 days
  );
}

/**
 * User registration endpoint
 * Creates a new user account with hashed password
 * 
 * @param {Object} req - Express request object with name, email, password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and JWT token
 */
async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({ 
        message: 'Name, email and password are required' 
      });
    }

    // Check if user already exists with this email
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ 
        message: 'Email already in use' 
      });
    }

    // Create new user (password will be hashed by pre-save middleware)
    const user = await User.create({ name, email, password });
    
    // Generate JWT token for the new user
    const token = createToken(user);
    
    // Return success response with user data and token
    return res.status(201).json({
      message: 'User registered successfully',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token,
    });
  } catch (error) {
    // Handle any errors during registration
    return res.status(500).json({ 
      message: 'Registration failed', 
      error: error.message 
    });
  }
}

/**
 * User login endpoint
 * Authenticates user credentials and issues JWT token
 * 
 * @param {Object} req - Express request object with email and password
 * @param {Object} res - Express response object
 * @returns {Object} JSON response with user data and JWT token
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ 
        message: 'Email and password are required' 
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Verify password using bcrypt comparison
    const valid = await user.comparePassword(password);
    if (!valid) {
      return res.status(401).json({ 
        message: 'Invalid credentials' 
      });
    }

    // Generate JWT token for authenticated user
    const token = createToken(user);
    
    // Return success response with user data and token
    return res.status(200).json({
      message: 'Login successful',
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email, 
        role: user.role 
      },
      token,
    });
  } catch (error) {
    // Handle any errors during login
    return res.status(500).json({ 
      message: 'Login failed', 
      error: error.message 
    });
  }
}

// Export authentication controller functions
export { register, login };


