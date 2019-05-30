const Block = require('../models/block');
const moment = require('moment');

const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;

const voteSchema = new Schema({
  expireDate: {
    type: String,
    required: true
  },
  voteName: {
    type: String,
    required: true
  },
  candidates: [
    {
      candidateId: {
        type: Schema.Types.ObjectId,
        ref: 'Candidate',
        required: true
      }
    }
  ],
  blockchain: [
    {
      blockId: {
        type: Schema.Types.ObjectId,
        ref: 'Block',
        required: true
      }
    }
  ]
});

voteSchema.methods.createGenesis = () => {
  const genesis = new Block({
    blockNumber: 0,
    timestamp: moment(),
    candidateId: ObjectId('5cef9dea531481cacae068d0'),
    voterId: ObjectId('5cef9ede531481cacae068d1'),
    previousHash: '0',
    hash: '0'
  });
  genesis
    .save()
    .then(result => {
      this.blockchain.push(result._id.toString());
      return this.save();
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
    });
};

voteSchema.methods.latestBlock = () => {
  return this.blockchain[this.blockchain.length - 1];
};

voteSchema.methods.addBlock = newBlock => {
  newBlock.previousHash = this.latestBlock().hash;
  newBlock.hash = newBlock.calculateHash();
  this.blockchain.push(newBlock);
  return this.save();
};

voteSchema.methods.checkValid = () => {
  for (let i = 1; i < this.blockchain.length; i++) {
    const currentBlock = this.blockchain[i];
    const previousBlock = this.blockchain[i - 1];

    if (
      currentBlock.hash !== currentBlock.calculateHash() ||
      currentBlock.previousHash !== previousBlock.hash
    ) {
      return false;
    }
  }
  return true;
};

voteSchema.methods.getVoteResults = () => {
  let result = [];
  this.candidates.forEach(candidate => {
    result.push({ candidateId: candidate.candidateId, vote_count: 0 });
  });
  for (let i = 1; i < this.blockchain.length; i++) {
    const index = result.findIndex(id => {
      return id === this.blockchain[i].candidateId;
    });
    result[index].vote_count = result[index].vote_count + 1;
  }
  return result;
};

module.exports = mongoose.model('Vote', voteSchema);
