const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  token: {
    type: String,
    required: true,
    trim: true
  },
  ipAddress: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
