const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stationSchema = new Schema({
    stationName: {
      type: String,
      required: true
    },
    stationId: {
      type: String,
      required: true,
      unique: true
    },
    locationId: {
      type: Schema.Types.ObjectId,
      ref: 'location',
      required: true      
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const station = mongoose.model('station', stationSchema);
  
  module.exports = station;
  

  