const AppError = require('../utils/apperror');
const Category = require('../models/categoryschema');
const asyncHandler = require('../utils/asyncHandler');

exports.getAllCategories = async (req, res, next) => {

    const categories = await Category.find();
    res.json({ status: 'success', message: 'Categories fetched', data: categories });

};

exports.getCategoryById = async (req, res, next) => {

    const category = await Category.findById(req.params.id);
    // central error handling
    if (!category) return next(new AppError('Category not found', 404));
    res.json({ status: 'success', message: 'Category fetched', data: category });


};

exports.createCategory = async (req, res, next) => {

    const { categoryname, description } = req.body;
    // central error handling
    if (!categoryname) return next(new AppError('Please provide categoryname', 400));
    // prevent .toLowerCase() crash if Postman body is empty
    const slug = categoryname.toLowerCase().replace(/\s+/g, '-');
    const newCategory = await Category.create({ categoryname, description, slug });
    
    res.status(201).json({ status: 'success', message: 'Category created', data: newCategory });


};

exports.updateCategory = async (req, res, next) => {

    // central error handling
    if (!req.body) return next(new AppError('Request body is required', 400));

    const { categoryname, description } = req.body;

    const slug = categoryname
      ? categoryname.toLowerCase().replace(/\s+/g, '-')
      : undefined;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { categoryname, description, slug },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) return next(new AppError('Category not found', 404));
    res.json({
      status: 'success',
      message: 'Category updated',
      data: updatedCategory
    });


};


exports.deleteCategory = async (req, res, next) => {

    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return next(new AppError('Category not found', 404));
    res.json({ status: 'success', message: 'Category deleted' });

};