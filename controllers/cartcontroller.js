const Product = require('../models/productschema');
const Cart = require('../models/cartschema'); 
const AppError = require('../utils/apperror');
const asyncHandler = require('../utils/asyncHandler');

// 0. Calculate
const calculateCartTotal = async (cart) => {
  let total = 0;
  // Ensure the product details are populated so we can access their price fields
  await cart.populate('items.product');
  
  cart.items.forEach((item) => {
    if (item.product) {
      total += item.product.price * item.quantity;
    }
    });
  return total;
  };

// 1. GET at route /api/cart
exports.getCart = asyncHandler( async (req,res,next) => {
    // We just grab the only cart in the database.
    let cart = await Cart.findOne();
    
    // If no cart exists in the DB yet, create the initial global cart
    if (!cart) {
      cart = new Cart({ items: [], totalPrice: 0 });
      await cart.save();
    }
    
    // Populate the product details so the frontend can see names/prices
    await cart.populate('items.product');

    res.status(200).json({ success: true, message: "Cart fetched", data: cart });

});

// 2. ADD at route /api/cart/items
exports.addItemToCart = asyncHandler( async (req,res,next) => {
  const { productId, quantity } = req.body;

    const product = await Product.findById(productId);

    if (!product) return next(new AppError('Product not found', 404));

    let cart = await Cart.findOne();

    if (!cart) {
      cart = new Cart({
        items: [],
        totalPrice: 0
      });
    }

    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: productId,
        quantity: Number(quantity),
        price: product.price
      });
    }

    cart.totalPrice = await calculateCartTotal(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      data: cart
    })
});

// 3. UPDATE QUANTITY at route /api/cart/items/:productId
exports.updateItemQuantity = asyncHandler( async (req,res,next) => {
  const { productId } = req.params;
  const { quantity } = req.body;


    // Quantity cannot be negative
    if (quantity < 0) return next(new AppError('Quantity cannot be negative', 400));
    // Check product exists
    const product = await Product.findById(productId);

    if (!product) return next(new AppError('Product not found', 404));



    // Find the cart
    let cart = await Cart.findOne();

    if (!cart) return next(new AppError('Cart not found', 404));



    // Find the item in the cart
    const itemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );

    if (itemIndex === -1) return next(new AppError('Item not found in cart', 404));

    // Remove item if quantity is 0
    if (quantity === 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      // Check stock
      if (product.stock < quantity) return next(new AppError('Not enough stock', 400));

      // Update quantity
      cart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total price
    cart.totalPrice = await calculateCartTotal(cart);

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart updated",
      data: cart
    });
});

// 4. REMOVE at route api/cart/items/:productId
exports.removeItemFromCart = asyncHandler ( async (req,res,next) => {
  res.status(200).json({ success: true, message: "Remove route working!" });

});

// 5. CLEAR at route /api/cart
exports.clearCart = asyncHandler(async (req,res,next) => {
  res.status(200).json({ success: true, message: "Clear route working!" });
})