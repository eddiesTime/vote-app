const mongoose = require('mongoose');

const Schema = mongoose.Schema;

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

module.exports = mongoose.model('Vote', voteSchema);
