const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const preferencesSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Assuming you have a User model
    required: true
  },
  gender: {
    type: String,
    required: true
  },
  ageRange: {
    start: {
      type: Number,
      required: true
    },
    end: {
      type: Number,
      required: true
    }
  },
  topics: { type : Array , "default" : [] },
  otherQuestions: {
    type: String
  }
}, { timestamps: true });

const Preferences = mongoose.model('Preferences', preferencesSchema);

module.exports = Preferences;
