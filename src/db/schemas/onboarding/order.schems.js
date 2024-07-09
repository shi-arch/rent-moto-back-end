const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming there's a User model already defined
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
    ref: 'Transaction', // Assuming there's a Transaction model defined
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

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
