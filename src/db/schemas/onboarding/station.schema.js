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
    stationManagerFirstName: {
      type: String,
      required: true
    },
    stationManagerLastName: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    city: {
      type: String,
      required: true
    },
    language: {
      type: String,
      required: true
    },
    pinCode: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
      unique: true
    },
    latitude: {
      type: String,
      required: true
    },
    longitude: {
      type: String,
      required: true
    }
  }, { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } });
  
  const station = mongoose.model('station', stationSchema);
  
  module.exports = station;
  

  