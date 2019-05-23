const path = require('path');
const express = require('express');

const candidateController = require('../controllers/candidate');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/candidates', isAuth, candidateController.getCandidates);
router.get(
  '/candidates/:candidateId',
  isAuth,
  candidateController.getCandidate
);
router.post('/candidate', isAuth, isAdmin, candidateController.createCandidate);
router.delete(
  '/candidates/:candidateId',
  isAuth,
  isAdmin,
  candidateController.deleteCandidate
);
router.put(
  '/candidate/:candidateId',
  isAuth,
  isAdmin,
  candidateController.updateCandidate
);

module.exports = router;
