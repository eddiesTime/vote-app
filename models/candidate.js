const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  firstname: {},
  lastname: {},
  faction: {},
  image: {}
});

module.exports = mongoose.model('Candidate', candidateSchema);
