/** @format */

const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    products: [
      {
        type: mongoose.ObjectId,
        ref: "Products",
      },
    ],
    payment: {},
    buyer: {
      type: mongoose.ObjectId,
      ref: "users",
    },
    status: {
      type: String,
      default: "Not processed",
      enum: [
        "Not processed",
        "processing",
        "shipping",
        "Delivered",
        "Canceled",
      ],
    },
  },
  { timestamps: true }
);

module.exports = orderModel = mongoose.model("order", orderSchema);
