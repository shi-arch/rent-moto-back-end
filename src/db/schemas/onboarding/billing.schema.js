const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const billingHistorySchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planType: {
    type: String,
    required: true
  },
  planName: {
    type: String,
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
  isActive: {
    type: Boolean,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: Schema.Types.ObjectId,
    ref: 'Transaction'
  }
}, { timestamps: true });

const BillingHistory = mongoose.model('BillingHistory', billingHistorySchema);

module.exports = BillingHistory;
