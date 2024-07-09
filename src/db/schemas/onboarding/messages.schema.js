const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
  senderId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: false
  },
  chatId: {
    type: Schema.Types.ObjectId,
    ref: 'Chat',
    required: true
  },
  image: {
    type: String, // URL or path to the image file
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;
