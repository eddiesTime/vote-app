const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const districtSchema = new Schema({
  country: {},
  city: {},
  districtName: {}
});

module.exports = mongoose.model('District', districtSchema);
