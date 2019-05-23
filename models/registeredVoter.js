const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const rVoterSchema = new Schema({
  userId: {},
  districtId: {},
  hasVoted: {}
});

module.exports = mongoose.model('Registered Voter', rVoterSchema);
