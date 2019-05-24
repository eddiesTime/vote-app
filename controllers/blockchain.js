const Block = require('../models/block');
const SHA256 = require('crypto-js/sha256');
async function Blockchain() {
  try {
      const genBlock = await createGenesis()
      this.chain = [genBlock]
  } catch (err) {}
}

async function createGenesis() {
    return new Promise(resolve => {
        const genesisBlock = new Block({
          blockNumber: 0,
          candidateId: 'Genesis Block',
          voterId: 'Genesis Block',
          previousHash: '0',
          hash: ""
        });
        const newBlock = await genesisBlock.save()
        resolve(newBlock)
    })
}

function latestBlock() {
    return this.chain[this.chain.length - 1];
}

function addBlock(newBlock){
    newBlock.previousHash = this.latestBlock().hash;

}