const { validationResult } = require('express-validator/check');
const io = require('socket.io');

const Vote = require('../models/vote');
const Block = require('../models/block');

exports.getVotes = async (req, res, next) => {
  try {
    const votes = await Vote.find();
    res.status(200).json(votes);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getVote = async (req, res, next) => {
  const voteId = req.body.voteId;
  try {
    const vote = await Vote.findById(voteId);
    if (!vote) {
      const error = new Error('Could not find vote.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(vote);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createVote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const expireDate = req.body.expireDate;
  const voteName = req.body.voteName;
  const candidates = req.body.candidates.map(candidate => {
    candidate.candidateId = candidate.candidateId.toString();
  });

  const vote = new Vote({
    expireDate: expireDate,
    voteName: voteName,
    candidates: candidates,
    blockchain: []
  });
  try {
    const newVote = await vote.createGenesis();
    io.getIO().emit('votes', { action: 'create', vote: { ...vote._doc } });
    res.status(201).end('Vote created successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteVote = async (req, res, next) => {
  const voteId = req.body.voteId;
  try {
    const vote = await Vote.findById(vote);
    if (!vote) {
      const error = new Error('Could not find vote.');
      error.statusCode = 404;
      throw error;
    }
    await Vote.findByIdAndDelete(voteId);
    io.getIO().emit('votes', { action: 'delete', vote: voteId });
    res.status(200).end('Vote deleted successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
