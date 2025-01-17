const SHA256 = require('crypto-js/sha256');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blockSchema = new Schema({
  blockNumber: {
    type: Number,
    required: true
  },
  timestamp: {
    type: String,
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
  previousHash: {
    type: String,
    required: true
  },
  hash: {
    type: String,
    required: true
  }
});

blockSchema.methods.calculateHash = () => {
  this.hash = SHA256(
    this.blockNumber +
      this.timestamp +
      this.candidateId.toString() +
      this.voterId.toString() +
      this.previousHash
  ).toString();
};

module.exports = mongoose.model('Block', blockSchema);
