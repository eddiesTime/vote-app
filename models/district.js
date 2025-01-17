const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const districtSchema = new Schema({
  country: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  districtName: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('District', districtSchema);
