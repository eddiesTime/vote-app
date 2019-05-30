const { validationResult } = require('express-validator/check');
const io = require('socket.io');

const Election = require('../models/election');
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

exports.createUserVote = async (req, res, next) => {};
