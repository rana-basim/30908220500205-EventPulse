const express = require('express');
const router = express.Router();

const {
  getProductById,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productcontroller');

// Path: api/products/
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Path: api/products/:id"
router.route('/:id')
  .put(updateProduct)
  .delete(deleteProduct)
  .get(getProductById)

module.exports = router;
