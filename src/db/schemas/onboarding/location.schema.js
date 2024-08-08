const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const locationSchema = new Schema({
    myLocation: {
      type: String,
      required: true
    },
    subLocation: {
      type: Array,
      required: true
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const location = mongoose.model('location', locationSchema);
  
  module.exports = location;
  

  