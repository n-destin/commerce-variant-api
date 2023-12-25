import mongoose from "mongoose";

export const inventoryItemSchema = new mongoose.Schema({
  productId: mongoose.Schema.Types.ObjectId,
  quantity: Number,
  location: String,
});

export const inventoryItem = mongoose.model("inventoryItem", inventoryItemSchema);