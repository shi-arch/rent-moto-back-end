const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const planSchema = new Schema({
    planName: {
      type: String,
      required: true,
      unique: true
    },
    planPrice: {
      type: String,
      required: true      
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'location',
      required: true      
    },
    stationId: {
      type: String,
      ref: 'station',
      required: true      
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const plan = mongoose.model('plan', planSchema);
  
  module.exports = plan;
  

  