const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  password: {},
  identNumber: {}
});

module.exports = mongoose.model('User', userSchema);
