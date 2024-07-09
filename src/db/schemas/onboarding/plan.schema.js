const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  plan: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction', // Assuming you have a Transaction model
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

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
