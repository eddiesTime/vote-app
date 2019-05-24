const Block = require('./block')
const BlockModel = require('../models/block')
const moment = require('moment')

class Blockchain {

    constructor() {
        this.chain = [ await this.createGenesis()];
    }

    async function createGenesis(){
        return new Promise(resolve => {
            const genesisBlock = new Block(0, moment(), "Genesis Block", "Genesis Block");
            const block = new BlockModel({
                blockNumber: genesisBlock.blockNumber,
                timestamp: genesisBlock.timestamp,
                candidateId: genesisBlock.timestamp,
                voterId: genesisBlock.voterId,
                previousHash: genesisBlock.previousHash,
                hash: genesisBlock.hash
            })
            const newBlock = await block.save();
            resolve(newBlock)
        })

    }

function latestBlock(){
    return this.chain[this.chain.length - 1];
 }

function addBlock(){ }

function checkIfAlreadyVoted(){ }

function checkValid(){ }

function getVoteResults(){ }

};

module.exports = Blockchain