const path = require('path');
const express = require('express');

const registrationController = require('../controllers/registration');

const router = express.Router();

router.post('/', registrationController.generateVoterLogin);

module.exports = router;
