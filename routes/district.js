const path = require('path');
const express = require('express');

const districtController = require('../controllers/district');
const isAuth = require('../middleware/is-auth');
const isAdmin = require('../middleware/is-admin');

const router = express.Router();

router.get('/', isAdmin, districtController.getCandidates);
router.get('/:districtId', isAdmin, districtController.getCandidate);
router.post('/', isAdmin, districtController.createCandidate);
router.delete('/:districtId', isAdmin, districtController.deleteCandidate);
router.put('/:districtId', isAdmin, districtController.updateCandidate);

module.exports = router;
