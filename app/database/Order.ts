import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  phone: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  orderer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export const Order = mongoose.model("Order", orderSchema);
