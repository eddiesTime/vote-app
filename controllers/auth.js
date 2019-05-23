const User = require('../models/user');
const Admin = require('../models/admin');

const { validationResult } = require('express-validator/check');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

postLogin();
postNewPassword();
postLogout();
