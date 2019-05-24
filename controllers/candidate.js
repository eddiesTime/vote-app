const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');

const io = require('socket.io');
const Candidate = require('../models/candidate');

exports.getCandidates = async (req, res, next) => {
  try {
    const candidates = await Candidate.find();
    res.status(200).json(candidates);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getCandidate = async (req, res, next) => {
  const candidateId = req.params.candidateId;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error = new Error('Could not find candidate.');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(candidate);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createCandidate = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.body.imageUrl;

  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const faction = req.body.faction;

  const candidate = new Candidate({
    firstname: firstname,
    lastname: lastname,
    faction: faction,
    imageUrl: imageUrl
  });

  try {
    await candidate.save();
    io.getIO().emit('candidate', {
      action: 'create',
      candidate: { ...candidate._doc }
    });
    res.status(201).end('Candidate created successfully');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.updateCandidate = async (req, res, next) => {
  const candidateId = req.params.candidateId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const imageUrl = req.body.imageUrl;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const faction = req.body.faction;

  if (!imageUrl) {
    const error = new Error('No file picked.');
    error.statusCode = 422;
    throw error;
  }

  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error = new Error('Could not find candidate.');
      error.statusCode = 404;
      throw error;
    }
    candidate.firstname = firstname;
    candidate.imageUrl = imageUrl;
    candidate.lastname = lastname;
    candidate.faction = faction;
    const updatedCandidate = await candidate.save();
    io.getIO().emit('candidate', {
      action: 'update',
      candidate: updatedCandidate
    });
    res.status(200).json(updatedCandidate);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteCandidate = async (req, res, next) => {
  const candidateId = req.params.candidateId;
  try {
    const candidate = await Candidate.findById(candidateId);
    if (!candidate) {
      const error = new Error('Could not find candidate.');
      error.statusCode = 404;
      throw error;
    }
    await Candidate.findByIdAndDelete(candidateId);
    io.getIO().emit('candidate', { action: 'delete', candidate: candidateId });
    res.status(200).end('Candidate deleted successfully');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
