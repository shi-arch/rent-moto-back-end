const mongoose = require('mongoose');

const configSchema = new mongoose.Schema({
    type: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  }, { timestamps: true });
  
  const Config = mongoose.model('Config', configSchema);
  
  module.exports = Config;
  