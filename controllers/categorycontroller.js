const category = require('../models/category');
const apperror = require('../utils/apperror');
const asynchandler = require('../utils/asynchandler');

const getcategories = asynchandler(async (req, res, next) => {
  const categories = await category.find();
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: categories,
  });
});

const createcategory = asynchandler(async (req, res, next) => {
  const newcategory = await category.create(req.body);
  res.status(201).json({
    status: 'success',
    data: newcategory,
  });
});

const updatecategory = asynchandler(async (req, res, next) => {
  const updatedcategory = await category.findbyidandupdate(
    req.params.id,
    req.body,
    { new: true, runvalidators: true }
  );

  if (!updatedcategory) {
    return next(new apperror('category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    data: updatedcategory,
  });
});

const deletecategory = asynchandler(async (req, res, next) => {
  const deletedcategory = await category.findbyidanddelete(req.params.id);
  if (!deletedcategory) {
    return next(new apperror('category not found', 404));
  }

  res.status(200).json({
    status: 'success',
    message: 'category deleted successfully',
  });
});

module.exports = {
  getcategories,
  createcategory,
  updatecategory,
  deletecategory,
};