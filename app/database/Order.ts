import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  ref_id: String,
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  orderer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  quantity: {
    default: 1,
    type: Number,
  },
  total: {
    type: Number,
  },
  paymentStatus: {
    type: String,
    default: "PENDING",
  },
  deliveryStatus: {
    type: String,
    default: "NOT_YET_DELIVERED",
  },
});

export const Order = mongoose.model("Order", orderSchema);
