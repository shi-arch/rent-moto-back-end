const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userKpiSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  totalMinutes: {
    type: Number,
    default: 0
  },
  totalCalls: {
    type: Number,
    default: 0
  },
  rating: {
    type: Number,
    default: 0
  },
  totalReports: {
    type: Number,
    default: 0
  },
  totalFriends: {
    type: Number,
    default: 0
  },
  streak: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

const UserKpi = mongoose.model('UserKpi', userKpiSchema);

module.exports = UserKpi;
