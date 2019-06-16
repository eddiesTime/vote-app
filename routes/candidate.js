const path = require('path');
const express = require('express');

const candidateController = require('../controllers/candidate');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, candidateController.getCandidates);
router.get('/:candidateId', isAuth, candidateController.getCandidate);
router.post('/', isAuth, isAdmin, candidateController.createCandidate);
router.delete(
  '/:candidateId',
  isAuth,
  isAdmin,
  candidateController.deleteCandidate
);
router.put(
  '/:candidateId',
  isAuth,
  isAdmin,
  candidateController.updateCandidate
);

module.exports = router;
