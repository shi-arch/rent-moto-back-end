const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  userType: {
    type: String,
    enum: ["GUEST", "USER", "ADMIN"],
    required: true
  },
  name: {
    type: String,
    required: false,
    trim: true
  },
  contact: {
    type: String,
    required: false,
    trim: true,
    // unique: true
  },
  ip: {
    type: String,
    required: false
  },  
  countryCode: {
    type: String,
    required: true,
    trim: true
  },
  profileImage: {
    type: String,
    required: false,
  },
  userName: {
    type: String,
    required: false,
    trim: true,
    //unique: true
  },
  email: {
    type: String,
    required: false,
    trim: true,
    //unique: true
  },
  gender: {
    type: String,
    required: false,
    enum: ['Male', 'Female', 'Other'],
  },
  status: {
    type: String,
    required: false,
  },
  alterNateContact: {
    type: String,
    required: false,
  },
  dob: {
    type: Date,
    required: false
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  isBlockedBy: {
    type: Array,
    default: []
  },
  password: {
    type: String,
    required: false
  },
  otp: {
    type: String,
    required: false
  },
  otpExpire: {
    type: Date,
    required: false
  }
}, { timestamps: true });

const User = mongoose.model('User', userSchema);

module.exports = User;
