const path = require('path');
const express = require('express');

const districtController = require('../controllers/district');

const router = express.Router();

router.get('/', districtController.getDistricts);
router.get('/:districtId', districtController.getDistrict);
router.post('/', districtController.createDistrict);
router.delete('/:districtId', districtController.deleteDistrict);
router.put('/:districtId', districtController.updateDistrict);

module.exports = router;
