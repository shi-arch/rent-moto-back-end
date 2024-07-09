const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
  isGroupChat: {
    type: Boolean,
    required: true
  },
  users: [{
    type: Schema.Types.ObjectId,
    ref: 'User' // Reference to the User model
  }],
  chatName: {
    type: String,
    required: function() { return this.isGroupChat; } // Required only if it's a group chat
  },
  lastMsgId: {
    type: Schema.Types.ObjectId,
    ref: 'Message' // Reference to the Message model
  },
  lastMessage: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;
