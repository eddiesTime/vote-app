const User = require('../models/user');
const Admin = require('../models/admin');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.login = async (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    const loadedAdmin = await Admin.findOne({ email: username });
    if (!loadedAdmin) {
      const loadedUser = await User.findOne({ username: username });
      if (!loadedUser) {
        const error = new Error(
          'A user with this username could not be found.'
        );
        error.statusCode = 404;
        throw error;
      }
      const isEqual = await bcrypt.compare(password, loadedUser.password);
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 404;
        throw error;
      }
      const token = jwt.sign(
        { username: loadedUser.username, userId: loadedUser._id.toString() },
        'secretvotingappappsecret',
        { expiresIn: '1h' }
      );
      res.status(200).json({ token: token, userId: loadedUser._id.toString() });
    } else {
      // isAdmin
      const isEqual = loadedAdmin.password === password;
      if (!isEqual) {
        const error = new Error('Wrong password');
        error.statusCode = 404;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedAdmin.email,
          userId: loadedAdmin._id.toString(),
          isAdmin: true
        },
        'secretvotingappappsecret',
        { expiresIn: '1h' }
      );
      res
        .status(200)
        .json({ token: token, userId: loadedAdmin._id.toString() });
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.newPassword = async (req, res, next) => {
  const username = req.body.username;
  const newPassword = req.body.password;
  try {
    const loadedUser = await User.findOne({ username: username });
    if (!loadedUser) {
      const error = new Error('A user with this username could not be found.');
      error.statusCode = 404;
      throw error;
    }
    const isEqual = await bcrypt.compare(newPassword, loadedUser.password);
    if (isEqual) {
      const error = new Error(
        'New and old password are not allowed to be equal!'
      );
      error.statusCode = 400;
      throw error;
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    loadedUser.password = hashedNewPassword;
    loadedUser.changedPw = true;
    await loadedUser.save();
    res.status(200).end('Password has been changed successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.logout = (req, res) => {
  req.isAuth = false;
  req.isAdmin = false;
  req.userId.destroy(err => {
    console.log(err);
    res.redirect('/');
  });
};
