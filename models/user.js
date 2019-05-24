const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  genUserLogin: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  changedPw: {
    type: Boolean,
    required: true
  },
  districtId: {
    type: Schema.Types.ObjectId,
    ref: 'District',
    required: true
  },
  hasVoted: {
    type: Boolean,
    required: true
  }
});

module.exports = mongoose.model('User', userSchema);
