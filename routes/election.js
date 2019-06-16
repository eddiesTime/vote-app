const path = require('path');
const express = require('express');

const electionController = require('../controllers/election');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, electionController.getCandidates);
router.get('/:electionId', isAuth, electionController.getCandidate);
router.post('/:electionId/vote', isAuth, electionController.createUserVote);
router.post('', isAuth, isAdmin, electionController.createCandidate);
router.delete(
  '/:electionId',
  isAuth,
  isAdmin,
  electionController.deleteCandidate
);
router.put('/:electionId', isAuth, isAdmin, electionController.updateCandidate);

module.exports = router;
