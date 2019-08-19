const path = require('path');
const express = require('express');

const registrationController = require('../controllers/registration');

const router = express.Router();

router.post('/', registrationController.generateVoterLogin);
router.delete('/:voterId', registrationController.deleteVoter);
router.get('/', registrationController.getAllVoter);

module.exports = router;
