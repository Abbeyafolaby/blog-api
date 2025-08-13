import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// User schema definition with validation rules
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true, // Remove whitespace from beginning and end
    },
    email: {
      type: String,
      required: true,
      unique: true, // Ensure email uniqueness across users
      lowercase: true, // Store email in lowercase
      trim: true, // Remove whitespace
    },
    password: {
      type: String,
      required: true,
      minlength: 6, // Minimum password length requirement
    },
    role: {
      type: String,
      enum: ['admin', 'author', 'reader'], // Restrict to valid roles
      default: 'reader', // Default role for new users
    },
  },
  { timestamps: true } // Automatically add createdAt and updatedAt fields
);

/**
 * Pre-save middleware to hash password before saving
 * Only hashes password if it has been modified
 */
userSchema.pre('save', async function preSave(next) {
  // Skip hashing if password hasn't changed
  if (!this.isModified('password')) return next();
  
  // Hash password with salt rounds for security
  const saltRounds = 10;
  this.password = await bcrypt.hash(this.password, saltRounds);
  next();
});

/**
 * Instance method to compare password with stored hash
 * @param {string} plain - Plain text password to compare
 * @returns {Promise<boolean>} True if password matches, false otherwise
 */
userSchema.methods.comparePassword = function comparePassword(plain) {
  return bcrypt.compare(plain, this.password);
};

// Create and export the User model
const User = mongoose.model('User', userSchema);
export default User;


