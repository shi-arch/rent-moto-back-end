const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const requestSchema = new Schema({
    receiverId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    senderId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    isAccepted: {
      type: Boolean,
      default: false
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const Request = mongoose.model('Request', requestSchema);
  
  module.exports = Request;
  