const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blockSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  candidateId: {
    type: Schema.Types.ObjectId,
    ref: 'Candidate',
    required: true
  },
  voterId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  timestamp: {
    type: String,
    required: true
  },
  previousHash: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Blockchain', blockSchema);
