const mongoose = require('mongoose');

const peersSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    trim: true
  },
  ipAddress: {
    type: String,
    required: true
  },
  peerId: {
    type: String
  },
  socketId: {
    type: String
  },
  enableCam: {
    type: Boolean
  },
  isActive: {
    type: Boolean,
    required: false
  },
  keyWords: {
    type: String,
    required: false
  },
}, { timestamps: true });

const Peers = mongoose.model('Peers', peersSchema);

module.exports = Peers;
