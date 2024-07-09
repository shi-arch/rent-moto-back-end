const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const activeUserSchema = new Schema({
  userSocketId: {
    type: String,
    required: true
  },
  isActive: {
    type: Boolean,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const ActiveUser = mongoose.model('activeUser', activeUserSchema);

module.exports = ActiveUser;
