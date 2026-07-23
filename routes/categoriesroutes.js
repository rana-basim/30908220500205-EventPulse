const express = require('express');
const router = express.Router();

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoriescontroller');

// Path:  /api/categories
router.route('/')
  .get(getAllCategories)
  .post(createCategory)


// Path: /api/categories/:id
router.route('/:id')
  .get(getCategoryById)
  .patch(updateCategory)
  .delete(deleteCategory)
  .put(updateCategory)


module.exports = router;