const path = require('path');
const express = require('express');

const electionController = require('../controllers/election');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAuth, electionController.getElections);
router.get('/:electionId', isAuth, electionController.getElection);
router.post('/:electionId/vote', isAuth, electionController.createUserVote);
router.post('', isAuth, isAdmin, electionController.createElection);
router.delete(
  '/:electionId',
  isAuth,
  isAdmin,
  electionController.deleteElection
);

module.exports = router;
