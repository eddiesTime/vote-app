const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.postLogin('/login', authController.createCandidate);
router.postNewPassword('/new-password', authController.createCandidate);
router.logout('/logout', authController.logout);

module.exports = router;
