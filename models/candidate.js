const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const candidateSchema = new Schema({
  firstname: {
    type: String,
    required: true
  },
  lastname: {
    type: String,
    required: true
  },
  faction: {
    type: String,
    required: true,
    default: 'Jerry',
    enum: ['Rick', 'Morty', 'Jerry']
  },
  imageUrl: {
    type: String
  }
});

module.exports = mongoose.model('Candidate', candidateSchema);
