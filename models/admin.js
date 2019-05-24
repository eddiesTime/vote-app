const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const adminSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  districtId: {
    type: Schema.Types.ObjectId,
    ref: 'Districts',
    required: true
  }
});

module.exports = mongoose.model('Admin', adminSchema);
