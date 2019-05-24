const crypto = require('crypto');

const bcrypt = require('bcryptjs');

const Admin = require('../models/admin');
const User = require('../models/user');

exports.generateVoterLogin = async (req, res, next) => {
  const generatedUsername = crypto.randomBytes(11).toString('hex');
  const generatedPassword = crypto.randomBytes(6).toString('hex');
  const changedPw = false;
  const hasVoted = false;
  try {
    const loadedAdmin = await Admin.findById(req.userId);
    if (!loadedAdmin) {
      const error = new Error('Not authorized to create new login');
      error.statusCode = 401;
      throw error;
    }
    const districtId = loadedAdmin.districtId.toString();
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
