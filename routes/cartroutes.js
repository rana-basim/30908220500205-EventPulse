const express = require('express');
const router = express.Router();

// Imported via destructuring
const {
  getCart,
  addItemToCart,
  updateItemQuantity,
  removeItemFromCart,
  clearCart,
} = require('../controllers/cartcontroller'); 

// Path: /api/cart
router.route('/')
  .get(getCart)
  .delete(clearCart);

// Path: /api/cart/items
router.route('/items')
  .post(addItemToCart);

// Path: /api/cart/items/:productId
router.route('/items/:productId')
  .patch(updateItemQuantity)
  .delete(removeItemFromCart);



module.exports = router;