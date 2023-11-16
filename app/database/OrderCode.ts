import mongoose from "mongoose";

const orderCode = new mongoose.Schema({
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    unique: true,
  },
  code: {
    type: String,
    default: null,
  },
});
export const OrderCode = mongoose.model("orderCode", orderCode);
