const { validationResult } = require('express-validator/check');
const io = require('socket.io');
const moment = require('moment');

const Election = require('../models/election');
const User = require('../models/user');
const Block = require('../models/block');

exports.getElections = async (req, res, next) => {
  try {
    const elections = await Election.find();
    res.status(200).json(elections);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getElection = async (req, res, next) => {
  const electionId = req.body.electionId;
  try {
    const election = await Election.findById(electionId);
    if (!election) {
      const error = new Error('Could not find election.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(election);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createElection = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const expireDate = req.body.expireDate;
  const electionName = req.body.electionName;
  const candidates = req.body.candidates.map(candidate => {
    candidate.candidateId = candidate.candidateId.toString();
  });

  const election = new Election({
    expireDate: expireDate,
    electionName: electionName,
    candidates: candidates,
    blockchain: []
  });
  try {
    const newElection = await election.createGenesis();
    io.getIO().emit('elections', {
      action: 'create',
      election: { ...election._doc }
    });
    res.status(201).end('Election created successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteElection = async (req, res, next) => {
  const electionId = req.body.electionId;
  try {
    const election = await Election.findById(election);
    if (!election) {
      const error = new Error('Could not find election.');
      error.statusCode = 404;
      throw error;
    }
    await Election.findByIdAndDelete(electionId);
    io.getIO().emit('elections', { action: 'delete', election: electionId });
    res.status(200).end('Election deleted successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createUserVote = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }
  const voterId = req.userId;
  const electionId = req.body.electionId;
  const candidateId = req.body.candidateId;
  try {
    const voter = await User.findById(voterId);
    if (!voter) {
      const error = new Error('No registered voter.');
      error.statusCode = 404;
      throw error;
    }
    if (voter.checkIfAlreadyVoted()) {
      const error = new Error('You already participated in this vote!');
      error.statusCode = 401;
      throw error;
    } else {
      const election = await Election.findById(electionId).populate(
        'blockchain'
      );
      if (!election) {
        const error = new Error('No election found!');
        error.statusCode = 404;
        throw error;
      }
      if (!candidateId) {
        const error = new Error('No candidate found!');
        error.statusCode = 404;
        throw error;
      }
      const oldBlockNumber = election.latestBlock().blockNumber;
      const vote = new Block({
        blockNumber: oldBlockNumber + 1,
        timestamp: moment(),
        candidateId: candidateId,
        voterId: voterId,
        previousHash: '0',
        hash: '0'
      });
      election.addBlock(vote);
      voter.vote();
      res.statusCode(201).end('Voted successfully!');
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
