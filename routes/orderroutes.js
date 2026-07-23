const express = require('express');
const router = express.Router();
const {
  createOrder,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
} = require('../controllers/ordercontroller');

//Path: /api/order
router.route('/')
  .post(createOrder)
  .get(getAllOrders);

//Path: /api/order/:id
router.route('/:id')
  .get(getOrderById);

//Path: /api/order/:id/status
router.route('/:id/status')
  .patch(updateOrderStatus);

module.exports = router;