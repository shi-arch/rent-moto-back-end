const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const invoiceSchema = new Schema({
    invoiceNumber: {
      type: String,
      required: true,
      unique: true
    },
    orderId: {
      type: String,
      required: true,
      unique: true      
    },
    pdfDoc: {
      type: String,
      required: true      
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const invoiceTbl = mongoose.model('invoiceTbl', invoiceSchema);
  
  module.exports = invoiceTbl;
  

  