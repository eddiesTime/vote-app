const crypto = require('crypto');
const io = require('socket.io');

const Admin = require('../models/admin');
const User = require('../models/user');

const GENESIS_VOTER = 'Genesis Block';

exports.generateVoterLogin = async (req, res, next) => {
  const generatedUsername = crypto.randomBytes(11).toString('hex');
  const generatedPassword = crypto.randomBytes(6).toString('hex');
  const changedPw = false;
  const hasVoted = false;
  try {
    // const loadedAdmin = await Admin.findById(req.userId);
    // if (!loadedAdmin) {
    //   const error = new Error('Not authorized to create new login');
    //   error.statusCode = 401;
    //   throw error;
    // }
    // const districtId = loadedAdmin.districtId.toString();
    const districtId = '5d4ed544ca16fae655114b47';
    const user = await createUser(
      generatedUsername,
      generatedPassword,
      changedPw,
      districtId,
      hasVoted
    );
    const newUser = await user.save();
    res
      .status(201)
      .json({ username: newUser.username, password: newUser.password });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

async function createUser(name, password, changedPw, districtId, hasVoted) {
  return new Promise(resolve => {
    const user = new User({
      username: name,
      password: password,
      changedPw: changedPw,
      districtId: districtId,
      hasVoted: hasVoted
    });
    resolve(user);
  });
}

exports.getAllVoter = async (req, res, next) => {
  try {
    const voter = await User.find().select(['-password']);
    const noGenVoter = voter.filter(voter => {
      return voter.username !== GENESIS_VOTER;
    });
    res.status(200).json(noGenVoter);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteVoter = async (req, res, next) => {
  const voterId = req.params.voterId;
  try {
    const voter = await User.findById(voterId);
    if (!voter) {
      const error = new Error('Could not find voter.');
      error.statusCode = 404;
      throw error;
    }
    await User.findByIdAndDelete(voterId);
    res.status(200).end('Voter deleted successfully');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
