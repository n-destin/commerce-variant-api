import mongoose, { Schema } from "mongoose";

export const deliveryOptionSchema = new mongoose.Schema({
  type: String, // e.g., "Standard", "Express"
  price: Number,
  deliveryDays: Number,
});

export const deliveryOption = mongoose.model("deliveryOptions", deliveryOptionSchema);