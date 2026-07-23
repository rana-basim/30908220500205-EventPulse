const Order = require("../models/orderschema");
const Cart = require("../models/cartschema");
const Product = require("../models/productschema");
const AppError = require('../utils/apperror');
const asyncHandler = require('../utils/asynchandler');
// POST checkout flow at route POST /api/orders
const generateOrderNumber = () => {
  return 'ORD' + Math.floor(100000 + Math.random() * 900000);
};

exports.createOrder = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne().populate('items.product');
  // central error handling
  if (!cart || cart.items.length === 0) {
    return next(new AppError('Cart is empty', 400));
  }

  // Check stock for each product
  for (let item of cart.items) {
    if (item.product.stock < item.quantity) {
      return next(new AppError(`Not enough stock for ${item.product.name}`, 400));
    }
  }

  // Deduct stock
  for (let item of cart.items) {
    await Product.findByIdAndUpdate(item.product._id, { $inc: { stock: -item.quantity } });
  }

  // Create order items
  const orderItems = cart.items.map(item => ({
    product: item.product._id,
    name: item.product.name,
    price: item.price,
    quantity: item.quantity,
  }));

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const orderNumber = generateOrderNumber();

  const newOrder = await Order.create({
    orderNumber,
    items: orderItems,
    totalPrice,
    status: 'pending',
    shippingAddress: req.body.shippingAddress,
  });

  // Clear cart
  cart.items = [];
  cart.totalPrice = 0;
  await cart.save();

  res.status(201).json({ status: 'success', message: 'Order created', data: newOrder });
});

exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find();
  res.json({ status: 'success', message: 'Orders fetched', data: orders });
});

exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError('Order not found', 404));
  res.json({ status: 'success', message: 'Order fetched', data: order });
});

exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const { status } = req.body;
  const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return next(new AppError('Invalid status', 400));
  }
  const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true });
  if (!order) return next(new AppError('Order not found', 404));
  res.json({ status: 'success', message: 'Order status updated', data: order });
});