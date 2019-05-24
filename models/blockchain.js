const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const blockchainSchema = new Schema({
  blocks: [
    {
      blockId: {
        type: Schema.Types.ObjectId,
        ref: 'Block',
        required: true
      }
    }
  ],
  voteId: {
    type: Schema.Types.ObjectId,
    ref: 'Vote',
    required: true
  }
});

module.exports = mongoose.model('Blockchain', blockchainSchema);
