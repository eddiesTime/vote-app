const SHA256 = require('crypto-js/sha256');

class Block {
  constructor(blockNumber, timestamp, candidateId, voterId) {
    this.blockNumber = blockNumber;
    this.timestamp = timestamp;
    this.candidateId = candidateId;
    this.voterId = voterId;
    this.previousHash = '0';
    this.hash = this.calculateHash();
  }

  calculateHash() {
    return SHA256(
      this.blockNumber +
        this.timestamp +
        this.candidateId.toString() +
        this.voterId.toString() +
        this.previousHash
    ).toString();
  }
}

module.exports = Block;
