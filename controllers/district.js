const fs = require('fs');
const path = require('path');
const { validationResult } = require('express-validator/check');

const District = require('../models/district');

exports.getDistricts = async (req, res, next) => {
  try {
    const districts = await District.find();
    res.status(200).json(districts);
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
    res.status(200).json(district);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.createDistrict = async (req, res, next) => {
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
    await district.save();
    res.status(201);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
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
    res.status(200).json(updatedCandidate);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.deleteDistrict = async (req, res, next) => {
  const districtId = req.params.districtId;
  try {
    const district = await District.findById(districtId);
    if (!district) {
      const error = new Error('Could not find district.');
      error.statusCode = 404;
      throw error;
    }
    await District.findByIdAndDelete(districtId);
    res.status(200);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

postDistrict();
getDistrict();
deleteDistrict();
putDistrict();