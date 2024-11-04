const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["manager", "customer", "admin"],
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  isContactVerified: {
    type: Boolean,
    default: false
  },
  kycApproved: {
    type: Boolean,
    default: false
  },
  userDocuments: {
    type: Array,
    default: []
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    required: true
  },
  altContact: {
    type: String,
    trim: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  contact: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    trim: true
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
