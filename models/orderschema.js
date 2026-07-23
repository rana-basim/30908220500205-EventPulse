const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Must be unique per the rubric requirements
    orderNumber: {
      type: String,
      required: true,
      unique: true,
    },
    // Items snapshot at checkout time (product reference, snapshot name, price, quantity)
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
    ],
    // Must be calculated server-side
    totalPrice: {
      type: Number,
      required: true,
    },
    // Status enum validation
    status: {
      type: String,
      required: true,
      enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
      default: "pending",
    },
    shippingAddress: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Order", orderSchema);