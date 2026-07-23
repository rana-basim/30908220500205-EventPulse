const Product = require('../models/productschema');
const Category = require('../models/categoryschema');
const asyncHandler = require('../utils/asyncHandler');
const AppError = require('../utils/apperror')
// 1. GET fetch all products at route GET /api/products

exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, minPrice, maxPrice, search } = req.query;

  const filter = {};

  if (category) filter.category = category;
  if (minPrice) filter.price = { ...filter.price, $gte: Number(minPrice) };
  if (maxPrice) filter.price = { ...filter.price, $lte: Number(maxPrice) };
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const products = await Product.find(filter);
  res.status(200).json({ success: true, count: products.length, data: products });
});

// 2. POST create a product at route POST /api/products
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { category } = req.body;

  // 1. Check if the incoming category ID actually exists in the database
  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    return next(new AppError('Category validation failed: The specified category ID does not exist', 400));
  }

  // 2. Create product ONLY after the validation passes
  const product = await Product.create(req.body);
  
  res.status(201).json({ 
    success: true, 
    data: product 
  });
});

// 3. PUT Update product parameters at route PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ success: true, data: product });
});

// 4. DELETE remove a product at route DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(new AppError('Product not found', 404));
  }

  res.status(200).json({ success: true, data: {} });
});

// 4. GET fetch single product by ID at route GET /api/products/:id
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id).populate({
    path: 'category', 
    select: 'name description' 
  });

  if (!product) {
    return next(new AppError('No product found with that ID', 404));
  }

  res.status(200).json({
    success: true,
    data: product
  });
});