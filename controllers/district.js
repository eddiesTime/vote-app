const { validationResult } = require('express-validator/check');

const District = require('../models/district');

const GENESIS_DISTRICT = 'Genesis Block District Name';

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await District.find();
    const noGenDistricts = districts.filter(district => {
      return district.districtName !== GENESIS_DISTRICT;
    });
    res.status(200).json(noGenDistricts);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getDistrict = async (req, res, next) => {
  const districtId = req.params.districtId;
  try {
    const district = await District.findById(districtId);
    if (!district) {
      const error = new Error('Could not find district.');
      error.statusCode = 404;
      throw error;
    }
    if (district.districtName === GENESIS_DISTRICT) {
      const error = new Error('Forbidden request, access denied');
      error.statusCode = 404;
      throw error;
    }
    res.status(200).json(district);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createDistrict = async (req, res, next) => {
  // if (req.isAdmin) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const country = req.body.country;

  const city = req.body.city;
  const districtName = req.body.districtName;

  const district = new District({
    country: country,
    city: city,
    districtName: districtName
  });

  try {
    const oldDistrict = await District.findOne({
      districtName: districtName
    });
    if (oldDistrict) {
      const error = new Error('District has already been created!');
      error.statusCode = 400;
      throw error;
    }
    const newDistrict = await district.save();
    res.status(201).json(newDistrict);
  } catch (err) {
    console.log('catch');
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
  // } else {
  //   const error = new Error('Not authorized!');
  //   error.statusCode = 401;
  //   next(error);
  // }
};

exports.updateDistrict = async (req, res, next) => {
  const districtId = req.params.districtId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed, entered data is incorrect.');
    error.statusCode = 422;
    throw error;
  }

  const country = req.body.country;
  const city = req.body.city;
  const districtName = req.body.districtName;

  try {
    const oldDistrict = await District.findOne({
      districtName: districtName
    });
    if (oldDistrict) {
      const error = new Error(
        'District cannot be updated! A District with this name already exists'
      );
      error.statusCode = 400;
      throw error;
    }

    const district = await District.findById(districtId);
    if (!district) {
      const error = new Error('Could not find district.');
      error.statusCode = 404;
      throw error;
    }
    district.country = country;
    district.city = city;
    district.districtName = districtName;

    const updatedDistrict = await district.save();
    res.status(200).json(updatedDistrict);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteDistrict = async (req, res, next) => {
  const districtId = req.params.districtId;
  console.log(req.params);
  console.log(districtId);
  try {
    const district = await District.findById(districtId);
    if (!district) {
      const error = new Error('Could not find district.');
      error.statusCode = 404;
      throw error;
    }
    await District.findByIdAndDelete(districtId);
    res.status(200).end('District deleted successfully!');
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
